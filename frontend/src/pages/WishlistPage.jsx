import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountLayout from '../components/account/AccountLayout'
import AccountPageHeader from '../components/account/AccountPageHeader'
import EmptyState from '../components/account/EmptyState'
import FavoriteProductCard from '../components/account/FavoriteProductCard'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import api from '../services/api'
import {
  cleanText,
  getProductCategory,
  getProductComparePrice,
  getProductId,
  getProductImage,
  getProductName,
  getProductPrice,
  productHasVariants,
} from '../components/account/accountUtils'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Mới lưu gần đây' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
]

const normalizeWishlist = (res) => res?.items || res?.products || res?.wishlist || []

const WishlistPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { addItem } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [removingId, setRemovingId] = useState(null)
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login')
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (!isAuthenticated) return
    fetchWishlist()
  }, [isAuthenticated])

  const fetchWishlist = async () => {
    setLoading(true)
    try {
      const res = await api.get('/wishlist')
      setWishlist(res.success ? normalizeWishlist(res) : [])
    } catch {
      setWishlist([])
    } finally {
      setLoading(false)
    }
  }

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const filtered = wishlist.filter(item => {
      if (!query) return true
      return (
        getProductName(item).toLowerCase().includes(query) ||
        getProductCategory(item).toLowerCase().includes(query)
      )
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price_asc') return getProductPrice(a) - getProductPrice(b)
      if (sortBy === 'price_desc') return getProductPrice(b) - getProductPrice(a)
      const dateA = new Date(cleanText(a.added_at || a.created_at || a.saved_at)).getTime() || 0
      const dateB = new Date(cleanText(b.added_at || b.created_at || b.saved_at)).getTime() || 0
      return dateB - dateA
    })
  }, [wishlist, searchQuery, sortBy])

  const removeFromWishlist = async (item) => {
    const productId = getProductId(item)
    if (!productId) return

    const previousWishlist = wishlist
    setRemovingId(productId)
    setWishlist(prev => prev.filter(product => getProductId(product) !== productId))

    try {
      const res = await api.delete(`/wishlist/${productId}`)
      if (!res.success) setWishlist(previousWishlist)
    } catch {
      setWishlist(previousWishlist)
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = (item) => {
    const productId = getProductId(item)
    const slug = cleanText(item.slug)

    if (productHasVariants(item)) {
      navigate(slug ? `/product/${slug}` : '/')
      return
    }

    setAddingId(productId)
    try {
      addItem({
        ...item,
        id: productId,
        price: getProductPrice(item),
        compare_price: getProductComparePrice(item) || null,
        image_url: getProductImage(item),
      }, 1)
      if (window.__triggerCartBounce) window.__triggerCartBounce()
      toast.success('Đã thêm sản phẩm vào giỏ hàng')
    } finally {
      setAddingId(null)
    }
  }

  if (authLoading) return <AccountLayout activeId="favorites" loading />
  if (!isAuthenticated) return null

  return (
    <AccountLayout activeId="favorites" loading={loading}>
      <AccountPageHeader
        title="Danh sách yêu thích"
        description="Các sản phẩm bạn đã lưu để xem lại sau"
        meta={`${wishlist.length.toLocaleString('vi-VN')} sản phẩm yêu thích`}
      />

      {wishlist.length === 0 ? (
        <EmptyState
          title="Bạn chưa có sản phẩm yêu thích"
          description="Lưu sản phẩm để dễ dàng xem lại sau."
          actionLabel="Khám phá sản phẩm"
          to="/"
        />
      ) : (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm yêu thích..."
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#d71920]"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#d71920] bg-white"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <EmptyState
              title="Không tìm thấy sản phẩm phù hợp"
              description="Thử thay đổi từ khóa tìm kiếm hoặc cách sắp xếp."
              compact
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleProducts.map(item => {
                const productId = getProductId(item)
                return (
                  <FavoriteProductCard
                    key={productId || item.wishlist_id || getProductName(item)}
                    product={item}
                    onRemove={removeFromWishlist}
                    onAddToCart={handleAddToCart}
                    removing={removingId === productId}
                    adding={addingId === productId}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}
    </AccountLayout>
  )
}

export default WishlistPage

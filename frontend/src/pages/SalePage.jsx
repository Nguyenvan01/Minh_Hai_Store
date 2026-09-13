import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import ProductFilters from '../components/ProductFilters'
import { productAPI } from '../services/api'
import { formatPrice } from '../utils/formatPrice'
import { useToast } from '../contexts/ToastContext'

const StarRating = ({ rating = 0 }) => {
  return (
    <div className="flex text-amber-500">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-sm"
          style={{
            fontVariationSettings: i < Math.floor(rating) ? "'FILL' 1" : "'FILL' 0"
          }}
        >
          star
        </span>
      ))}
    </div>
  )
}

const SalePage = () => {
  const toast = useToast()
  const navigate = useNavigate()
  
  const [allSaleProducts, setAllSaleProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [selectedDiscounts, setSelectedDiscounts] = useState([])
  const [sortBy, setSortBy] = useState('discount')
  const [page, setPage] = useState(1)

  const productsPerPage = 8

  // Danh mục cố định - slugs khớp với database
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'ao-thun', name: 'Áo Thun' },
    { id: 'ao-so-mi', name: 'Áo Sơ Mi' },
    { id: 'quan-jeans', name: 'Quần Jeans' },
    { id: 'tshirt', name: 'T-Shirt' },
    { id: 'vay', name: 'Váy' },
    { id: 'homewear', name: 'Homewear' },
    { id: 'ao-polo', name: 'Áo Polo' }
  ]

  // Slugs cho mỗi danh mục - khớp với database
  const categorySlugs = {
    'ao-thun': ['ao-thun'],
    'ao-so-mi': ['ao-so-mi'],
    'quan-jeans': ['quan-jeans', 'quan-short'],
    'tshirt': ['tshirt'],
    'vay': ['vay'],
    'homewear': ['homewear'],
    'ao-polo': ['ao-polo']
  }

  // Fetch sale products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await productAPI.getProducts({ limit: 200 })
        
        if (response.success && response.data) {
          const saleProducts = (response.data.products || []).filter(
            p => p.compare_price && p.compare_price > p.price
          )
          setAllSaleProducts(saleProducts)
        } else {
          setAllSaleProducts([])
        }
      } catch (error) {
        console.error('Error:', error)
        setAllSaleProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Tính số lượng theo danh mục
  const categoryCounts = useMemo(() => {
    const counts = { all: allSaleProducts.length }
    Object.keys(categorySlugs).forEach(catId => {
      const slugs = categorySlugs[catId] || []
      counts[catId] = allSaleProducts.filter(p => slugs.includes(p.category_slug)).length
    })
    return counts
  }, [allSaleProducts])

  // Filter và sort products
  const filteredProducts = useMemo(() => {
    let result = [...allSaleProducts]
    
    // Filter theo danh mục
    if (selectedCategory !== 'all') {
      const slugs = categorySlugs[selectedCategory] || []
      result = result.filter(p => slugs.includes(p.category_slug))
    }
    
    // Filter theo giá
    result = result.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    if (selectedDiscounts.length > 0) {
      const minDiscount = Math.min(...selectedDiscounts.map(value => Number(value)).filter(Boolean))
      result = result.filter(p => {
        const discountPercent = p.compare_price && p.compare_price > p.price
          ? Math.round((1 - p.price / p.compare_price) * 100)
          : 0
        return discountPercent >= minDiscount
      })
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => {
        const sizes = [
          ...(Array.isArray(p.sizes) ? p.sizes : []),
          ...(Array.isArray(p.variants) ? p.variants.map(v => v.size_name || v.size || v.size_code) : []),
          p.size,
          p.size_name,
        ].filter(Boolean).map(value => String(value).toLowerCase())
        return sizes.length === 0 || selectedSizes.some(size => sizes.includes(String(size).toLowerCase()))
      })
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => {
        const colors = [
          ...(Array.isArray(p.colors) ? p.colors.map(c => c.id ?? c.code ?? c.name ?? c) : []),
          ...(Array.isArray(p.color_variants) ? p.color_variants.map(c => c.id ?? c.code ?? c.name ?? c) : []),
          ...(Array.isArray(p.variants) ? p.variants.map(v => v.color_id ?? v.color_name ?? v.color) : []),
          p.color,
          p.color_name,
        ].filter(Boolean).map(value => String(value).toLowerCase())
        return colors.length === 0 || selectedColors.some(color => colors.includes(String(color).toLowerCase()))
      })
    }
    
    // Sort
    switch (sortBy) {
      case 'discount':
        result.sort((a, b) => {
          const discA = a.compare_price > a.price 
            ? ((a.compare_price - a.price) / a.compare_price) * 100 : 0
          const discB = b.compare_price > b.price 
            ? ((b.compare_price - b.price) / b.compare_price) * 100 : 0
          return discB - discA
        })
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'best-seller':
        result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
        break
      default:
        break
    }
    
    return result
  }, [allSaleProducts, selectedCategory, priceRange, selectedDiscounts, selectedSizes, selectedColors, sortBy])

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage))
  const currentProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  )

  // Reset page khi filter thay đổi
  useEffect(() => {
    setPage(1)
  }, [selectedCategory, priceRange, selectedDiscounts, selectedSizes, selectedColors, sortBy])

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    toast.info('Vui lòng chọn size/màu trước khi thêm vào giỏ hàng.')
    navigate(`/product/${product.slug}`)
  }

  const handleQuickView = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/product/${product.slug}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={0} />
      
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 pb-12">
        {/* Breadcrumbs & Header */}
        <div className="mb-0">
          <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-4 uppercase tracking-widest font-label">
            <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-red-600 font-medium">Khuyến mãi</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tighter text-on-surface headline">GIẢM GIÁ</h1>
          <p className="text-base text-on-surface-variant mt-3 max-w-2xl">
            Ưu đãi lên đến 70% cho tất cả sản phẩm. Nhanh tay chọn ngay những item yêu thích với giá hời nhất!
          </p>
        </div>

        <div className="flex gap-20">
          {/* Sidebar Filter */}
          <ProductFilters
            categoryList={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(id) => { setSelectedCategory(id); setPage(1) }}
            selectedSizes={selectedSizes}
            onSizeChange={(sizes) => { setSelectedSizes(sizes); setPage(1) }}
            selectedColors={selectedColors}
            onColorChange={(colors) => { setSelectedColors(colors); setPage(1) }}
            priceRange={priceRange}
            onPriceChange={(range) => { setPriceRange(range); setPage(1) }}
            selectedDiscounts={selectedDiscounts}
            onDiscountChange={(discounts) => { setSelectedDiscounts(discounts); setPage(1) }}
          />

          {/* Product Display Area */}
          <section className="flex-grow">
            {/* Sorting & Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <p className="text-sm text-on-surface-variant font-label">
                Hiển thị {currentProducts.length} trên {filteredProducts.length} sản phẩm
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Sắp xếp theo:</span>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="flex items-center gap-2 bg-surface-container-low px-4 py-2 text-sm font-medium hover:bg-surface-container transition-colors appearance-none cursor-pointer pr-8"
                  >
                    <option value="discount">Giảm nhiều nhất</option>
                    <option value="price-asc">Giá: Thấp → Cao</option>
                    <option value="price-desc">Giá: Cao → Thấp</option>
                    <option value="best-seller">Bán chạy</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-on-surface-variant text-lg">Không có sản phẩm nào phù hợp</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-12 xl:gap-y-16 gap-x-6 xl:gap-x-8">
                {currentProducts.map((product) => {
                  const discountPercent = product.compare_price && product.compare_price > product.price
                    ? Math.round((1 - product.price / product.compare_price) * 100)
                    : 0

                  return (
                    <div key={product.id} className="product-card group cursor-pointer">
                      {/* Image */}
                      <Link 
                        to={`/product/${product.slug}`}
                        className="relative aspect-[3/4] overflow-hidden bg-surface-container-low mb-6 block"
                      >
                        <img
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:brightness-50 transition-all duration-700"
                          src={product.image_url || product.image || 'https://via.placeholder.com/400x600'}
                          loading="lazy"
                        />
                        
                        {/* Badges */}
                        {discountPercent > 0 && (
                          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                            -{discountPercent}%
                          </div>
                        )}
                        {product.is_featured && (
                          <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                            style={{ top: discountPercent > 0 ? '36px' : '16px' }}>
                            Nổi bật
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="product-action absolute inset-0 bg-black/40 opacity-0 flex flex-col justify-end p-6 transition-all duration-300 group-hover:opacity-100">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full bg-white text-on-surface py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#DA291C] hover:text-white transition-colors mb-2"
                          >
                            Thêm vào giỏ
                          </button>
                          <button
                            onClick={(e) => handleQuickView(e, product)}
                            className="w-full bg-white/80 backdrop-blur-md text-on-surface py-4 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                          >
                            Xem chi tiết
                          </button>
                        </div>

                        {/* Favorite Button */}
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-xl">favorite</span>
                        </button>
                      </Link>

                      {/* Product Info */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-bold text-on-surface mb-1 headline uppercase tracking-tight">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-primary font-bold text-lg">
                              {formatPrice(product.price)}
                            </span>
                            {product.compare_price && product.compare_price > product.price && (
                              <span className="text-on-surface-variant line-through text-sm opacity-50">
                                {formatPrice(product.compare_price)}
                              </span>
                            )}
                          </div>
                          <StarRating rating={product.avg_rating || 5} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex flex-col items-center gap-6">
                <div className="w-full h-px bg-surface-container"></div>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined">navigate_before</span>
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1
                    // Hiển thị max 5 trang, có thêm ...
                    if (totalPages > 5 && pageNum !== 1 && pageNum !== totalPages) {
                      if (pageNum < page - 1 || pageNum > page + 1) return null
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center font-bold border-b-2 transition-colors ${
                          page === pageNum
                            ? 'text-primary border-primary'
                            : 'text-on-surface-variant border-transparent hover:text-primary'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined">navigate_next</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}

export default SalePage

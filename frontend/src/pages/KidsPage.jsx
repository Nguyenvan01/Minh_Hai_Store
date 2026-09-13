import React, { useState, useEffect } from 'react'
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
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.floor(rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

const KidsPage = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [selectedDiscounts, setSelectedDiscounts] = useState([])
  const [sortBy, setSortBy] = useState('newest')

  const productsPerPage = 8

  const getDemoProducts = () => [
    {
      id: 32, name: 'Áo Thun Bé Trai CARS', slug: 'ao-thun-tre-em-be-trai-cars',
      price: 159000, compare_price: 190000,
      image_url: 'https://images.unsplash.com/photo-1617609180892-e5f3b73d3dc4?w=600',
      avg_rating: 5, review_count: 89, is_on_sale: true, category_slug: 'ao-tre-em'
    },
    {
      id: 38, name: 'Váy Xếp Ly Trẻ Em Hoa', slug: 'vay-xep-ly-tre-em',
      price: 229000,
      image_url: 'https://images.unsplash.com/photo-1518831959646-742c15d9fb95?w=600',
      avg_rating: 4, review_count: 156, category_slug: 'vay-tre-em'
    },
    {
      id: 42, name: 'Bộ Đồ Thể Thao Trẻ Em', slug: 'bo-do-the-thao-tre-em',
      price: 299000,
      image_url: 'https://images.unsplash.com/photo-1445796886651-d31a2c15f3c9?w=600',
      avg_rating: 5, review_count: 67, category_slug: 'bo-do-tre-em'
    },
    {
      id: 35, name: 'Quần Jean Trẻ Em Bé Gái', slug: 'quan-jeans-tre-em-be-gai',
      price: 249000,
      image_url: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600',
      avg_rating: 4, review_count: 234, category_slug: 'quan-tre-em'
    },
    {
      id: 39, name: 'Đầm Xòe Trẻ Em Hồng', slug: 'dam-xoe-tre-em',
      price: 299000, compare_price: 350000,
      image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600',
      avg_rating: 5, review_count: 45, is_new: true, is_on_sale: true, category_slug: 'dam-tre-em'
    },
    {
      id: 33, name: 'Áo Thun Bé Gái Hoa', slug: 'ao-thun-tre-em-be-gai-hoa',
      price: 149000, compare_price: 180000,
      image_url: 'https://images.unsplash.com/photo-1518831959646-742c15d9fb95?w=600',
      avg_rating: 4, review_count: 178, is_on_sale: true, category_slug: 'ao-tre-em'
    },
    {
      id: 40, name: 'Quần Soóc Trẻ Em', slug: 'quan-sooc-tre-em',
      price: 179000,
      image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600',
      avg_rating: 5, review_count: 98, category_slug: 'quan-tre-em'
    },
    {
      id: 41, name: 'Đầm Công Chúa Trẻ Em', slug: 'dam-cong-chua-tre-em',
      price: 399000, compare_price: 499000,
      image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600',
      avg_rating: 4, review_count: 67, is_on_sale: true, category_slug: 'dam-tre-em'
    }
  ]

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productAPI.getKidsCategories()
        if (response.success && response.data?.length > 0) {
          setCategories(response.data)
        } else {
          setCategories([
            { id: 'all', name: 'Tất cả', count: 0 },
            { id: 'ao-tre-em', name: 'Áo Trẻ Em', count: 0 },
            { id: 'quan-tre-em', name: 'Quần Trẻ Em', count: 0 },
            { id: 'vay-tre-em', name: 'Váy Trẻ Em', count: 0 },
            { id: 'dam-tre-em', name: 'Đầm Trẻ Em', count: 0 },
            { id: 'bo-do-tre-em', name: 'Bộ Đồ Trẻ Em', count: 0 }
          ])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([
          { id: 'all', name: 'Tất cả', count: 0 },
          { id: 'ao-tre-em', name: 'Áo Trẻ Em', count: 0 },
          { id: 'quan-tre-em', name: 'Quần Trẻ Em', count: 0 },
          { id: 'vay-tre-em', name: 'Váy Trẻ Em', count: 0 },
          { id: 'dam-tre-em', name: 'Đầm Trẻ Em', count: 0 },
          { id: 'bo-do-tre-em', name: 'Bộ Đồ Trẻ Em', count: 0 }
        ])
      }
    }
    fetchCategories()
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const sortMap = {
          newest: 'created_at',
          'price-asc': 'price',
          'price-desc': 'price',
          'best-seller': 'total_sold'
        }
        const params = {
          page,
          limit: productsPerPage,
          sort: sortMap[sortBy] || 'created_at',
          order: sortBy === 'price-asc' ? 'asc' : 'desc'
        }

        if (selectedCategory !== 'all') {
          params.category = selectedCategory
        }
        if (priceRange[0] > 0) {
          params.min_price = priceRange[0]
        }
        if (priceRange[1] < 5000000) {
          params.max_price = priceRange[1]
        }
        if (selectedSizes.length > 0) {
          params.size = selectedSizes.join(',')
        }
        if (selectedColors.length > 0) {
          params.color = selectedColors.join(',')
        }
        if (selectedDiscounts.length > 0) {
          params.discount = selectedDiscounts.join(',')
        }

        const response = await productAPI.getKidsProducts(params)

        if (response.success && response.data) {
          setProducts(response.data.products || [])
          setTotalPages(response.data.pagination?.total_pages || 1)
          setTotalProducts(response.data.pagination?.total || 0)
        } else {
          setProducts([])
          setTotalPages(1)
          setTotalProducts(0)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
        setTotalPages(1)
        setTotalProducts(0)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [page, sortBy, selectedCategory, selectedSizes, selectedColors, priceRange, selectedDiscounts])

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
    setPage(1)
  }

  const toggleColor = (colorId) => {
    setSelectedColors(prev =>
      prev.includes(colorId) ? prev.filter(c => c !== colorId) : [...prev, colorId]
    )
    setPage(1)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    setPage(1)
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
    <div className="min-h-screen bg-white">
      <Header cartCount={0} />

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 pb-12">
        {/* Breadcrumbs & Header */}
        <div className="mb-4">
          <nav className="flex items-center gap-2 text-[#454652] text-sm mb-4 uppercase tracking-widest font-label">
            <Link className="hover:text-[#DA291C] transition-colors" to="/">Trang chủ</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-[#131b2e] font-medium">Trẻ em</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tighter text-[#131b2e] headline">TRẺ EM</h1>
          <p className="text-base text-[#454652] mt-3 max-w-2xl">
            Thời trang đáng yêu cho bé yêu với chất liệu mềm mại, thoáng khí và thiết kế vui nhộn. Giúp bé tự tin thể hiện phong cách riêng từ những năm tháng đầu đời.
          </p>
        </div>

        <div className="flex gap-6 lg:gap-12">
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
          <section className="flex-grow min-w-0">
            {/* Sorting & Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <p className="text-sm text-[#74869B]">
                Hiển thị {products.length} trên {totalProducts} sản phẩm
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#74869B] uppercase tracking-wider">Sắp xếp:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none bg-transparent border-b border-[#ADBCCD] px-2 py-1 pr-7 text-sm font-medium focus:outline-none focus:border-[#333F48] cursor-pointer transition-colors duration-200"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp → Cao</option>
                    <option value="price-desc">Giá: Cao → Thấp</option>
                    <option value="best-seller">Bán chạy</option>
                  </select>
                  <svg className="absolute right-0 top-1/2 -translate-y-1/2 text-[#74869B]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] bg-[#f0f0f0] rounded-xl mb-3 skeleton-shimmer" />
                    <div className="h-4 bg-[#f0f0f0] rounded mb-2 w-3/4 skeleton-shimmer" />
                    <div className="h-4 bg-[#f0f0f0] rounded w-1/2 skeleton-shimmer" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <svg className="mx-auto mb-4 text-[#ADBCCD]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/>
                </svg>
                <p className="text-[#74869B]">Không tìm thấy sản phẩm nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {products.map((product) => {
                  const discountPercent = product.compare_price && product.compare_price > product.price
                    ? Math.round((1 - product.price / product.compare_price) * 100)
                    : 0

                  return (
                    <div key={product.id} className="product-card group">
                      {/* Image */}
                      <Link
                        to={`/product/${product.slug}`}
                        className="relative aspect-[3/4] overflow-hidden bg-[#F4F6F9] rounded-xl mb-3 block"
                      >
                        <img
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-50 transition-all duration-500"
                          src={product.image_url || product.image}
                          loading="lazy"
                        />

                        {/* Badges */}
                        {discountPercent > 0 && (
                          <span className="absolute top-2 left-2 bg-[#DA291C] text-white text-[10px] font-bold px-2 py-0.5 animate-badge-pop">
                            -{discountPercent}%
                          </span>
                        )}
                        {product.is_new && (
                          <span className="absolute top-2 left-2 bg-[#333F48] text-white text-[10px] font-bold px-2 py-0.5">
                            Mới
                          </span>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 flex flex-col justify-end p-4 transition-opacity duration-300 group-hover:opacity-100">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full bg-white text-[#333F48] py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#DA291C] hover:text-white transition-colors duration-200 mb-2"
                          >
                            Thêm vào giỏ
                          </button>
                          <button
                            onClick={(e) => handleQuickView(e, product)}
                            className="w-full bg-white/80 backdrop-blur-sm text-[#333F48] py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors duration-200"
                          >
                            Xem chi tiết
                          </button>
                        </div>

                        {/* Favorite */}
                        <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#333F48] hover:text-[#DA291C] transition-colors duration-200 opacity-0 group-hover:opacity-100">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </button>
                      </Link>

                      {/* Product Info */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xs lg:text-sm font-medium text-[#333F48] mb-1 line-clamp-2 leading-snug group-hover:text-[#DA291C] transition-colors duration-200">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-[#DA291C]">
                              {formatPrice(product.price)}
                            </span>
                            {product.compare_price && product.compare_price > product.price && (
                              <span className="text-xs text-[#74869B] line-through">
                                {formatPrice(product.compare_price)}
                              </span>
                            )}
                          </div>
                          <StarRating rating={product.avg_rating || 0} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full border border-[#E5EAF0] flex items-center justify-center hover:border-[#333F48] hover:text-[#333F48] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-full font-medium transition-all duration-200 ${
                      page === i + 1
                        ? 'bg-[#333F48] text-white'
                        : 'border border-[#E5EAF0] hover:border-[#333F48] hover:text-[#333F48]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full border border-[#E5EAF0] flex items-center justify-center hover:border-[#333F48] hover:text-[#333F48] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
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

export default KidsPage

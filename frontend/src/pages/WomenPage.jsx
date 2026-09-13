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

const WomenPage = () => {
  const toast = useToast()
  const navigate = useNavigate()
  
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [selectedDiscounts, setSelectedDiscounts] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  
  const productsPerPage = 8

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productAPI.getProducts({ gender: 'female', limit: 1000 })
        if (response.success && response.data) {
          const allProducts = response.data.products || []
          
          const categoryCounts = {}
          allProducts.forEach(p => {
            if (p.category_slug) {
              categoryCounts[p.category_slug] = (categoryCounts[p.category_slug] || 0) + 1
            }
          })
          
          const totalFemale = response.data.pagination?.total || allProducts.length
          
          setCategories([
            { id: 'all', name: 'Tất cả', count: totalFemale },
            { id: 'ao-thun', name: 'Áo Thun', count: categoryCounts['ao-thun'] || 0 },
            { id: 'ao-blouse', name: 'Áo Blouse', count: categoryCounts['ao-blouse'] || 0 },
            { id: 'tshirt', name: 'T-Shirt', count: categoryCounts['tshirt'] || 0 },
            { id: 'vay', name: 'Váy', count: categoryCounts['vay'] || 0 },
            { id: 'homewear', name: 'Homewear', count: categoryCounts['homewear'] || 0 },
            { id: 'quan-jeans', name: 'Quần', count: (categoryCounts['quan-jeans'] || 0) + (categoryCounts['quan-short'] || 0) },
            { id: 'do-lot', name: 'Đồ Lót', count: categoryCounts['do-lot'] || 0 }
          ].filter(c => c.count > 0 || c.id === 'all'))
          setSizes(['XS', 'S', 'M', 'L'])
          setColors([
            { id: 1, name: 'Đen', hex: '#1a1a1a' },
            { id: 2, name: 'Trắng', hex: '#ffffff' },
            { id: 7, name: 'Hồng', hex: '#ec4899' },
            { id: 8, name: 'Hồng phấn', hex: '#f472b6' },
            { id: 9, name: 'Kem', hex: '#fef3c7' }
          ])
        }
      } catch (error) {
        console.error('Error:', error)
        setCategories([
          { id: 'all', name: 'Tất cả', count: 0 }
        ])
        setSizes(['XS', 'S', 'M', 'L'])
        setColors([
          { id: 1, name: 'Đen', hex: '#1a1a1a' },
          { id: 2, name: 'Trắng', hex: '#ffffff' },
          { id: 7, name: 'Hồng', hex: '#ec4899' },
          { id: 8, name: 'Hồng phấn', hex: '#f472b6' },
          { id: 9, name: 'Kem', hex: '#fef3c7' }
        ])
      }
    }
    fetchCategories()
  }, [])

  // Demo products
  const getDemoProducts = () => [
    {
      id: 11,
      name: 'Đầm Linen Cao Cấp',
      slug: 'dam-linen-cao-cap',
      price: 1590000,
      compare_price: 1990000,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
      avg_rating: 5,
      review_count: 89,
      is_on_sale: true
    },
    {
      id: 12,
      name: 'Áo Sơ Mi Lụa',
      slug: 'ao-so-mi-lua',
      price: 690000,
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600',
      avg_rating: 4,
      review_count: 156
    },
    {
      id: 13,
      name: 'Chân Váy Midi',
      slug: 'chan-vay-midi',
      price: 850000,
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj8a?w=600',
      avg_rating: 5,
      review_count: 67
    },
    {
      id: 14,
      name: 'Quần Ống Rộng',
      slug: 'quan-ung-rong',
      price: 590000,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
      avg_rating: 4,
      review_count: 234
    },
    {
      id: 15,
      name: 'Áo Khoác Blazer',
      slug: 'ao-khoac-blazer',
      price: 1890000,
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600',
      avg_rating: 5,
      review_count: 45,
      is_new: true
    },
    {
      id: 16,
      name: 'Váy Hoa Nhí',
      slug: 'vay-hoa-nhi',
      price: 750000,
      compare_price: 990000,
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
      avg_rating: 4,
      review_count: 178,
      is_on_sale: true
    }
  ]

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
          gender: 'female',
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
        
        const response = await productAPI.getProducts(params)
        
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
        console.error('Error:', error)
        setProducts([])
        setTotalPages(1)
        setTotalProducts(0)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCategory, selectedSizes, selectedColors, priceRange, selectedDiscounts, sortBy, page])

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
    setPage(1)
  }

  const toggleColor = (colorId) => {
    setSelectedColors(prev => 
      prev.includes(colorId) 
        ? prev.filter(c => c !== colorId)
        : [...prev, colorId]
    )
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
    <div className="min-h-screen bg-background">
      <Header cartCount={0} />
      
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 pb-12">
        {/* Breadcrumbs & Header */}
        <div className="mb-0">
          <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-4 uppercase tracking-widest font-label">
            <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface font-medium">Nữ</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tighter text-on-surface headline">Thời trang Nữ</h1>
          <p className="text-base text-on-surface-variant mt-3 max-w-2xl">
            Bộ sưu tập thời trang nữ với thiết kế tinh tế, phong cách hiện đại và thanh lịch. Từ những bộ đầm sang trọng đến trang phục công sở thanh lịch.
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
            sizeList={sizes}
            colorList={colors}
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
                Hiển thị {products.length} trên {totalProducts} sản phẩm
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Sắp xếp theo:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      setPage(1)
                    }}
                    className="flex items-center gap-2 bg-surface-container-low px-4 py-2 text-sm font-medium hover:bg-surface-container transition-colors appearance-none cursor-pointer pr-8"
                  >
                    <option value="newest">Mới nhất</option>
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
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#e5e7eb]">
                <p className="text-[#6b7280] text-base">Không tìm thấy sản phẩm phù hợp.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-12 xl:gap-y-16 gap-x-6 xl:gap-x-8">
                {products.map((product) => {
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
                          src={product.image_url || product.image}
                          loading="lazy"
                        />
                        
                        {/* Badges */}
                        {discountPercent > 0 && (
                          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                            Giảm {discountPercent}%
                          </div>
                        )}
                        {product.is_new && (
                          <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                            Mới về
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

            {/* Load More Section */}
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="w-full h-px bg-surface-container"></div>
              <button 
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="bg-primary text-white px-12 py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-primary-container transition-all transform hover:-translate-y-1"
              >
                Xem thêm sản phẩm
              </button>
              <div className="flex gap-4">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center font-bold border-b-2 transition-colors ${
                      page === i + 1
                        ? 'text-primary border-primary'
                        : 'text-on-surface-variant border-transparent hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">navigate_next</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}

export default WomenPage

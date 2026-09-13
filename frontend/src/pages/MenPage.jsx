import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
          {i < Math.floor(rating) ? 'star' : 'star'}
        </span>
      ))}
    </div>
  )
}

const MenPage = () => {
  const toast = useToast()
  const [searchParams] = useSearchParams()
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

  // Fetch categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Lấy tất cả sản phẩm nam để đếm theo category
        const response = await productAPI.getProducts({ gender: 'male', limit: 1000 })
        if (response.success && response.data) {
          const allProducts = response.data.products || []
          
          // Đếm số sản phẩm theo category
          const categoryCounts = {}
          allProducts.forEach(p => {
            if (p.category_slug) {
              categoryCounts[p.category_slug] = (categoryCounts[p.category_slug] || 0) + 1
            }
          })
          
          const totalMale = response.data.pagination?.total || allProducts.length
          
          setCategories([
            { id: 'all', name: 'Tất cả', count: totalMale },
            { id: 'ao-thun', name: 'Áo Thun', count: categoryCounts['ao-thun'] || 0 },
            { id: 'ao-so-mi', name: 'Áo Sơ Mi', count: categoryCounts['ao-so-mi'] || 0 },
            { id: 'quan-jeans', name: 'Quần Jeans', count: (categoryCounts['quan-jeans'] || 0) + (categoryCounts['quan-short'] || 0) },
            { id: 'ao-polo', name: 'Áo Polo', count: categoryCounts['ao-polo'] || 0 },
            { id: 'homewear', name: 'Homewear', count: categoryCounts['homewear'] || 0 },
            { id: 'tshirt', name: 'T-Shirt', count: categoryCounts['tshirt'] || 0 }
          ].filter(c => c.count > 0 || c.id === 'all'))
          
          setSizes(['S', 'M', 'L', 'XL', 'XXL'])
          
          setColors([
            { id: 1, name: 'Đen', hex: '#1a1a1a' },
            { id: 2, name: 'Trắng', hex: '#ffffff' },
            { id: 3, name: 'Xám', hex: '#6b7280' },
            { id: 4, name: 'Navy', hex: '#1e3a5f' },
            { id: 5, name: 'Xanh dương', hex: '#3b82f6' }
          ])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([
          { id: 'all', name: 'Tất cả', count: 0 }
        ])
        setSizes(['S', 'M', 'L', 'XL', 'XXL'])
        setColors([
          { id: 1, name: 'Đen', hex: '#1a1a1a' },
          { id: 2, name: 'Trắng', hex: '#ffffff' },
          { id: 3, name: 'Xám', hex: '#6b7280' },
          { id: 4, name: 'Navy', hex: '#1e3a5f' },
          { id: 5, name: 'Xanh dương', hex: '#3b82f6' }
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
          gender: 'male',
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
        console.error('Error fetching products:', error)
        setProducts([])
        setTotalPages(1)
        setTotalProducts(0)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCategory, selectedSizes, selectedColors, priceRange, selectedDiscounts, sortBy, page])

  // Demo products fallback
  const getDemoProducts = () => [
    {
      id: 1,
      name: 'Áo khoác Wool Limited',
      slug: 'ao-khoac-wool-limited',
      price: 1250000,
      compare_price: 1560000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-qA5OYCNBl_SIYLB1Mm2lI2xhrCUXHDLF-mgQz88KsEZfljyUkXyVGfV0sMJ-Xgub6vWjflMqTQlM6cgRE0dcxW7TeSNYzi6765V0zW7gFmW8RwC4XwPTUXvp-OQk9sAOUMV1RVLOQMNyhKM2hPjXHGonAgoZVbvgFVeEHNZbY6PJ__FFy9AAVuAsDvWJeUcech4mF6NtSt805T13aQwFCWZZIXuURjZZsHmZKUuAOHIM0iw-WYZdOHcP5ZPJgzTO8Ptf_CvbwSg',
      avg_rating: 4,
      review_count: 128,
      is_on_sale: true
    },
    {
      id: 2,
      name: 'Sơ mi Linen Signature',
      slug: 'so-mi-linen-signature',
      price: 890000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQjMObzUC029kgy1S3bq2GLaPQ7JvXVld1LwrxbZDsBtocqGTxDJY-Vx5EOS2fLt9PoSBVeP03J8qZrDdCTtdZuMYKSSpslkPyP5OiISF1MHlQmYKeXZWvHOpkBUJRY7s12cyWallUFyr_3Ny2PvTea6c18yzicHIa1i9m_Vpej7YNyzT7ZKZN-sa_SEsxm7eOgJ09A28Uv49IMF12Ft9McjnrpWc53iusBHHCgvBQxpuTb6F7HnafK1Jxh--CK4FcOk1SKGC26GY',
      avg_rating: 5,
      review_count: 89
    },
    {
      id: 3,
      name: 'Quần Denim Nhật Bản',
      slug: 'quan-denim-nhat-ban',
      price: 1150000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwrlpjxfY4mkJD8fCzu3dbJrdFOqgzTEDTsbrYv3v7qRnoMZmSjr6enxAbL8s7u9ZnsBVcz0PlWbaA_miEex6LDBMQeCgzcl4v2s2_Qe5883J1tunpEUvnzeVutPu5gv3RBJQK09lxUmlQlW6TVV6-5kJPVyKC_X8csu9ZOEt8j_S9fACWL2Syo8HkAuK524mLt2ULu0Kjd3XmIxdqqz0o-JmBl3uzqJCKYUbbywFIjvGwXu44jdP4UOlR1jJlVyfHChm8kmXyh5U',
      avg_rating: 5,
      review_count: 156
    },
    {
      id: 4,
      name: 'Blazer Charcoal Slim-fit',
      slug: 'blazer-charcoal-slim-fit',
      price: 2450000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSnCEAZOgeNXIP6iKcqK8rERAY5B0Xe-WZ83A56V3EQfgf0AJhCiHUuxm1cSOnL_mI64XgyaDnIn94D-A1IKsTGsdMlVA3d8AgMGhUGk4O8P2tR9gwxr0Q3znS3ZOjlnQ15OxxhsvwtjCeonTdfRYCcTJjXr3t4N0FwKbkfqUbhZ2HRHs83ydZxZODjfOHfhzBEgANoyi53_q4Y7yG3CldgXOO3jzaP82H8glXnowhBfIfj6qo27l-kYoORLm_Sh6DCLZ5w6Gr8Sc',
      avg_rating: 4,
      review_count: 67
    },
    {
      id: 5,
      name: 'Premium Cotton Tee',
      slug: 'premium-cotton-tee',
      price: 450000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKpu0AtrmfY9Qp1jXawJnFm2MgNAe45gFUWyeAjzUgMkd7xR25rVhax2qp5tb2eKrgM7Tdk_zq0WNtC-b6yBo6mwiiQhPvlkcu6EII432AlvpDpCtsGz0fisgN0MnbP-tGJXaErkP4yvagSjmRXZD94KA1Z5bvddFia8InLutgYr0BSXqIZCJCgxTrWauhsotV5hDh3bxEiqOZ5qfoRBTIkD5a1hn3lwO15RwgNl7_Rq5pY11rbIOouCeSOhaYOATGC8_kjEMhE4c',
      avg_rating: 3,
      review_count: 234,
      is_new: true
    },
    {
      id: 6,
      name: 'Luxury Leather Sneakers',
      slug: 'luxury-leather-sneakers',
      price: 3200000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTRuhuX_6ez3YpuxPXV03eW3A5B3DkTR_5hV0LdVxs6wP2mHtmzcHSkgcDx7xk_gHVZdvViPz6IlO93fCoNnsS-YinwR3NHjVXwj2gsnGQYEqmytg5t4ORJ67bIBPT5NovCb7ASGM6-W0dvg-OMx8Q0i8827Robaz19o7FkzWEvTLNtZlKqtgS1__VnUJqoxLIqY1d0VayZ37WP0LtqlWjRq7jIyMDdDEny5DVRqxWz1nlm81wqrKkEcKxVVunyISdJTS_VY_R7AY',
      avg_rating: 5,
      review_count: 89
    }
  ]

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
    <div className="min-h-screen bg-background">
      <Header cartCount={0} />
      
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 pb-12">
        {/* Breadcrumbs & Header */}
        <div className="mb-0">
          <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-4 uppercase tracking-widest font-label">
            <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface font-medium">Nam</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tighter text-on-surface headline">Thời trang Nam</h1>
          <p className="text-base text-on-surface-variant mt-3 max-w-2xl">
            Khám phá bộ sưu tập thời trang nam cao cấp với chất liệu vải cao cấp, thiết kế hiện đại và phong cách thanh lịch. Phù hợp cho mọi dịp từ công sở đến dạo phố.
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
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
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
                          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
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
              <button className="bg-primary text-white px-12 py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-primary-container transition-all transform hover:-translate-y-1">
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

export default MenPage

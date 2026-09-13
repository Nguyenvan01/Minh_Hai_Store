import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import { productAPI } from '../services/api'
import { formatPrice } from '../utils/formatPrice'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const categorySlug = searchParams.get('category') || ''
  const brandSlug = searchParams.get('brand') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const productsPerPage = 12

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = {
          page,
          limit: productsPerPage,
          ...(categorySlug && { category: categorySlug }),
          ...(brandSlug && { brand: brandSlug }),
          ...(query && { search: query }),
        }

        if (sortBy === 'newest') {
          params.sort = 'created_at'
          params.order = 'desc'
        } else if (sortBy === 'price-asc') {
          params.sort = 'price'
          params.order = 'asc'
        } else if (sortBy === 'price-desc') {
          params.sort = 'price'
          params.order = 'desc'
        } else if (sortBy === 'bestseller') {
          params.sort = 'total_sold'
          params.order = 'desc'
        }

        const response = await productAPI.getProducts(params)
        setProducts(response.data?.products || [])
        setTotalProducts(response.data?.pagination?.total || 0)
        setTotalPages(response.data?.pagination?.total_pages || 1)
      } catch (err) {
        console.error('Search error:', err)
        setError('Đã xảy ra lỗi khi tải sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, categorySlug, brandSlug, sortBy, page])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [query, categorySlug, brandSlug])

  const getPageTitle = () => {
    if (categorySlug) return categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    if (brandSlug) return brandSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    if (query) return `Kết quả tìm kiếm: "${query}"`
    return 'Tất cả sản phẩm'
  }

  const getBreadcrumbs = () => {
    const crumbs = [
      { name: 'Trang chủ', href: '/' }
    ]
    if (categorySlug) {
      crumbs.push({ name: 'Sản phẩm', href: '/search' })
      crumbs.push({ name: getPageTitle(), href: null })
    } else if (brandSlug) {
      crumbs.push({ name: 'Thương hiệu', href: '/search' })
      crumbs.push({ name: getPageTitle(), href: null })
    } else if (query) {
      crumbs.push({ name: 'Tìm kiếm', href: null })
    } else {
      crumbs.push({ name: 'Sản phẩm', href: null })
    }
    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="material-symbols-outlined text-xs text-slate-300">chevron_right</span>
                )}
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-[#DA291C] transition-colors">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-slate-800 font-medium">{crumb.name}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Page Header */}
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-[-0.02em] mb-2">
              {getPageTitle()}
            </h1>
            <p className="text-slate-500">
              {loading ? 'Đang tải...' : `${totalProducts} sản phẩm`}
            </p>
          </div>

          {/* Sort Bar */}
          {!loading && products.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 font-medium">Sắp xếp theo:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      setPage(1)
                    }}
                    className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-slate-700
                      hover:border-[#DA291C] focus:outline-none focus:ring-2 focus:ring-[#DA291C]/20 focus:border-[#DA291C]
                      transition-all duration-200 cursor-pointer"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="bestseller">Bán chạy nhất</option>
                    <option value="price-asc">Giá: Thấp → Cao</option>
                    <option value="price-desc">Giá: Cao → Thấp</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-slate-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Active Filters */}
              {(categorySlug || brandSlug || query) && (
                <div className="flex items-center gap-2 flex-wrap">
                  {categorySlug && (
                    <span className="inline-flex items-center gap-1.5 bg-[#DA291C]/10 text-[#DA291C] text-xs font-semibold px-3 py-1.5 rounded-full">
                      Danh mục: {getPageTitle()}
                      <Link to="/search" className="hover:opacity-70">
                        <span className="material-symbols-outlined text-base">close</span>
                      </Link>
                    </span>
                  )}
                  {brandSlug && (
                    <span className="inline-flex items-center gap-1.5 bg-[#DA291C]/10 text-[#DA291C] text-xs font-semibold px-3 py-1.5 rounded-full">
                      Thương hiệu: {getPageTitle()}
                      <Link to="/search" className="hover:opacity-70">
                        <span className="material-symbols-outlined text-base">close</span>
                      </Link>
                    </span>
                  )}
                  {query && (
                    <span className="inline-flex items-center gap-1.5 bg-[#DA291C]/10 text-[#DA291C] text-xs font-semibold px-3 py-1.5 rounded-full">
                      Tìm: "{query}"
                      <Link to={categorySlug ? `/search?category=${categorySlug}` : '/search'} className="hover:opacity-70">
                        <span className="material-symbols-outlined text-base">close</span>
                      </Link>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin w-10 h-10 border-4 border-[#DA291C] border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error</span>
              <h2 className="text-xl font-semibold mb-2 text-slate-700">Đã xảy ra lỗi</h2>
              <p className="text-slate-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm"
              >
                Thử lại
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">inventory_2</span>
              <h2 className="text-xl font-semibold mb-2 text-slate-700">Không tìm thấy sản phẩm nào</h2>
              <p className="text-slate-500 mb-6">
                {query ? 'Hãy thử tìm kiếm với từ khóa khác' : 'Hiện chưa có sản phẩm nào trong danh mục này'}
              </p>
              <Link to="/search" className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm inline-block">
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500
                        hover:bg-[#DA291C] hover:text-white hover:border-[#DA291C]
                        disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500 disabled:hover:border-slate-200
                        transition-all duration-200"
                    >
                      <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>

                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all duration-200
                            ${page === pageNum
                              ? 'bg-[#DA291C] text-white shadow-[0_4px_14px_rgba(218,41,28,0.25)]'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    {totalPages > 5 && page < totalPages - 2 && (
                      <span className="w-10 h-10 flex items-center justify-center text-slate-400">...</span>
                    )}

                    {totalPages > 5 && page < totalPages - 2 && (
                      <button
                        onClick={() => setPage(totalPages)}
                        className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200 font-semibold text-sm"
                      >
                        {totalPages}
                      </button>
                    )}

                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500
                        hover:bg-[#DA291C] hover:text-white hover:border-[#DA291C]
                        disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500 disabled:hover:border-slate-200
                        transition-all duration-200"
                    >
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}

export default SearchPage

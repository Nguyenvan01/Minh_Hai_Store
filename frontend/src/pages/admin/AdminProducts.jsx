import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import {
  Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight, Filter, MoreHorizontal, Image,
  Star, Package
} from 'lucide-react'

const statusBadge = (active) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
    active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
  }`}>
    {active ? 'Đang bán' : 'Ngừng bán'}
  </span>
)

export default function AdminProducts() {
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selected, setSelected] = useState([])
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const limit = 10

  useEffect(() => {
    fetchProducts()
  }, [page, search, category, brand])

  useEffect(() => {
    fetchFilters()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = { page, limit, search, category, brand }
      const res = await api.get('/admin/products', { params })
      setProducts(res.products)
      setTotalPages(res.totalPages)
    } catch (err) {
      console.error('Fetch products error:', err)
      setProducts([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        api.get('/admin/categories'),
        api.get('/admin/brands'),
      ])
      setCategories(catRes.categories || [])
      setBrands(brandRes.brands || [])
    } catch (err) {
      console.error('Fetch filters error:', err)
      setCategories([])
      setBrands([])
    }
  }

  const toggleStatus = async (product) => {
    try {
      await api.put(`/admin/products/${product.id}/toggle`)
      setProducts(products.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      toast.success(`Đã ${!product.is_active ? 'bật' : 'tắt'} trạng thái sản phẩm`)
    } catch {
      setProducts(products.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      toast.error('Không thể thay đổi trạng thái')
    }
  }

  const toggleFeatured = async (product) => {
    try {
      await api.put(`/admin/products/${product.id}/toggle-featured`)
      setProducts(products.map(p => p.id === product.id ? { ...p, is_featured: !p.is_featured } : p))
      toast.success(`Đã ${!product.is_featured ? 'đánh dấu' : 'bỏ đánh dấu'} nổi bật`)
    } catch {
      setProducts(products.map(p => p.id === product.id ? { ...p, is_featured: !p.is_featured } : p))
      toast.error('Không thể thay đổi trạng thái nổi bật')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/products/${deleteId}`)
      setProducts(products.filter(p => p.id !== deleteId))
      toast.success('Đã xóa sản phẩm thành công')
    } catch {
      toast.error('Xóa sản phẩm thất bại')
    }
    setShowDelete(false)
    setDeleteId(null)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(products.map(p => p.id))
    } else {
      setSelected([])
    }
  }

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ'

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, SKU..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
          {/* Filters */}
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={brand}
            onChange={(e) => { setBrand(e.target.value); setPage(1) }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <Link
            to="/admin/products/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <Plus size={18} />
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {selected.length > 0 && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-100 flex items-center gap-3">
            <span className="text-sm text-red-700 font-medium">{selected.length} sản phẩm được chọn</span>
            <button className="text-sm text-red-600 hover:underline font-medium">Xóa đã chọn</button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" onChange={handleSelectAll} />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tồn kho</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đã bán</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Nổi bật</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selected.includes(product.id)}
                      onChange={() => handleSelect(product.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Package size={18} className="text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                        {product.brand_name && (
                          <p className="text-xs text-gray-400">{product.brand_name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.sku}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.category_name || '-'}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-gray-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.total_sold || 0}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`p-1 rounded transition-colors ${
                        product.is_featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-gray-400'
                      }`}
                      title={product.is_featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                    >
                      <Star size={18} fill={product.is_featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleStatus(product)}
                      className={`p-1 rounded transition-colors ${
                        product.is_active ? 'text-green-500 hover:text-green-600' : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      {product.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        to={`/product/${product.slug}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#d71920] hover:bg-red-50 transition-colors"
                        title="Xem"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        onClick={() => {
                          sessionStorage.setItem('editProduct', JSON.stringify(product))
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => { setDeleteId(product.id); setShowDelete(true) }}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Trang {page} trên {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                const p = start + i
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === p ? 'bg-[#d71920] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center">Xóa sản phẩm?</h3>
            <p className="text-sm text-gray-500 text-center mt-2">
              Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

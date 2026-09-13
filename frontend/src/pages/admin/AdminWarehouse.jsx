import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import { Package, AlertTriangle, TrendingUp, RefreshCw, Warehouse as WarehouseIcon, Search } from 'lucide-react'

const LOW_STOCK_LIMIT = 5

const normalizeSearchText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()

export default function AdminWarehouse() {
  const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, lowStock: 0, outOfStock: 0, totalValue: 0 })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, low, out
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { fetchWarehouse() }, [filter])

  const fetchWarehouse = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/warehouse', { params: { filter } })
      setStats(res.stats)
      setProducts(res.products)
    } catch (err) {
      console.error('Fetch warehouse error:', err)
      setStats({ totalProducts: 0, totalStock: 0, lowStock: 0, outOfStock: 0, totalValue: 0 })
      setProducts([])
    } finally { setLoading(false) }
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ'

  const lowProducts = products.filter(p => p.stock <= LOW_STOCK_LIMIT && p.stock > 0)
  const outProducts = products.filter(p => p.stock === 0)

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = normalizeSearchText(searchQuery.trim())
    return products.filter(p =>
      normalizeSearchText(p.name).includes(q) ||
      normalizeSearchText(p.sku).includes(q) ||
      normalizeSearchText(p.category_name).includes(q)
    )
  }, [products, searchQuery])

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center"><WarehouseIcon size={22} className="text-red-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center"><Package size={22} className="text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Tổng tồn kho</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStock.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center"><AlertTriangle size={22} className="text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Sắp hết hàng</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center"><TrendingUp size={22} className="text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Giá trị tồn kho</p>
              <p className="text-xl font-bold text-gray-900">{formatPrice(stats.totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, SKU, danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400
              focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-100 transition-colors"
          />
        </div>

        {/* Tabs */}
        {[
          { key: 'all', label: 'Tất cả', count: products.length },
          { key: 'low', label: 'Sắp hết', count: lowProducts.length, color: 'yellow' },
          { key: 'out', label: 'Hết hàng', count: outProducts.length, color: 'red' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-red-600 text-white'
                : `bg-white border border-gray-200 text-gray-600 hover:bg-gray-50`
            }`}>
            {f.label} {f.count > 0 && <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
              filter === f.key ? 'bg-red-500 text-white' : f.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>{f.count}</span>}
          </button>
        ))}
        <button onClick={fetchWarehouse} className="ml-auto p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sản phẩm</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Danh mục</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Tồn kho</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ngưỡng</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Giá vốn</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Giá trị</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>)}</tr>
            )) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500">
                  Không tìm thấy sản phẩm phù hợp.
                </td>
              </tr>
            ) : filteredProducts.map(p => {
              const isLow = p.stock <= LOW_STOCK_LIMIT && p.stock > 0
              const isOut = p.stock === 0
              return (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{p.sku}</span></td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{p.category_name}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                      isOut ? 'bg-red-100 text-red-700' : isLow ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {isOut && <AlertTriangle size={14} />}
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{LOW_STOCK_LIMIT}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 text-right">{formatPrice(Number(p.cost_price) || 0)}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 text-right">{formatPrice((Number(p.cost_price) || 0) * p.stock)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

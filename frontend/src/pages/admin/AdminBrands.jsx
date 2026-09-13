import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search, AlertCircle } from 'lucide-react'

const emptyBrand = { name: '', slug: '', description: '', logo: '', is_featured: false, is_active: true }

export default function AdminBrands() {
  const toast = useToast()
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyBrand)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => { fetchBrands() }, [])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/brands')
      setBrands(res.brands)
    } catch (err) {
      console.error('Fetch brands error:', err)
      setBrands([])
    } finally { setLoading(false) }
  }

  const toggle = async (brand, field) => {
    try {
      await api.put(`/admin/brands/${brand.id}`, { [field]: !brand[field] })
      setBrands(brands.map(b => b.id === brand.id ? { ...b, [field]: !brand[field] } : b))
      toast.success('Đã cập nhật trạng thái')
    } catch {
      setBrands(brands.map(b => b.id === brand.id ? { ...b, [field]: !brand[field] } : b))
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        const res = await api.put(`/admin/brands/${editing}`, form)
        setBrands(brands.map(b => b.id === editing ? res.brand : b))
        toast.success('Đã cập nhật thương hiệu')
      } else {
        const res = await api.post('/admin/brands', form)
        setBrands([...brands, res.brand])
        toast.success('Đã thêm thương hiệu mới')
      }
      setShowForm(false)
      setForm(emptyBrand)
      setEditing(null)
    } catch {
      toast.error('Lưu thương hiệu thất bại')
      setShowForm(false)
    }
  }

  const handleEdit = (brand) => {
    setForm(brand)
    setEditing(brand.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/admin/brands/${deleteTarget.id}`)
      setBrands(brands.filter(b => b.id !== deleteTarget.id))
      toast.success('Đã xóa thương hiệu')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xóa thương hiệu thất bại')
    } finally {
      setDeleteTarget(null)
    }
  }

  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.slug.includes(search.toLowerCase()))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Tìm kiếm thương hiệu..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920]" />
        </div>
        <button onClick={() => { setForm(emptyBrand); setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-[#c0161c]">
          <Plus size={18} /> Thêm thương hiệu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 h-32 animate-pulse border border-gray-100 shadow-sm" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">Không tìm thấy thương hiệu</div>
        ) : filtered.map(brand => (
          <div key={brand.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-800">{brand.name}</h3>
                  {brand.is_featured === 1 && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Nổi bật</span>}
                </div>
                <p className="text-xs text-gray-400 font-mono mt-1">/{brand.slug}</p>
                {brand.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{brand.description}</p>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(brand)} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50"><Edit size={16} /></button>
                <button onClick={() => setDeleteTarget(brand)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-100">
              <button onClick={() => toggle(brand, 'is_active')} className={brand.is_active ? 'text-green-500' : 'text-gray-300'}>
                {brand.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-5">{editing ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} required onChange={e => {
                  setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') })
                }}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea value={form.description} rows={2} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo (URL)</label>
                <input type="text" value={form.logo || ''} onChange={e => setForm({ ...form, logo: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920]" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#d71920]" />
                  <span className="text-sm text-gray-700">Nổi bật</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#d71920]" />
                  <span className="text-sm text-gray-700">Hoạt động</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-[#c0161c]">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">Bạn có chắc muốn xóa thương hiệu <strong>"{deleteTarget.name}"</strong>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search, AlertCircle, X } from 'lucide-react'

const emptyCategory = { name: '', slug: '', description: '', icon: '', sort_order: 0, is_featured: false, is_active: true }

export default function AdminCategories() {
  const toast = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyCategory)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/categories')
      setCategories(res.categories)
    } catch (err) {
      console.error('Fetch categories error:', err)
      setCategories([])
    } finally { setLoading(false) }
  }

  const toggle = async (cat, field) => {
    try {
      await api.put(`/admin/categories/${cat.id}`, { [field]: !cat[field] })
      setCategories(categories.map(c => c.id === cat.id ? { ...c, [field]: !cat[field] } : c))
      toast.success('Đã cập nhật trạng thái')
    } catch {
      setCategories(categories.map(c => c.id === cat.id ? { ...c, [field]: !cat[field] } : c))
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        const res = await api.put(`/admin/categories/${editing}`, form)
        setCategories(categories.map(c => c.id === editing ? res.category : c))
        toast.success('Đã cập nhật danh mục')
      } else {
        const res = await api.post('/admin/categories', form)
        setCategories([...categories, res.category])
        toast.success('Đã thêm danh mục mới')
      }
      setShowForm(false)
      setForm(emptyCategory)
      setEditing(null)
    } catch {
      toast.error('Lưu danh mục thất bại')
      setShowForm(false)
    }
  }

  const handleEdit = (cat) => {
    setForm(cat)
    setEditing(cat.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/admin/categories/${deleteTarget.id}`)
      setCategories(categories.filter(c => c.id !== deleteTarget.id))
      toast.success('Đã xóa danh mục')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xóa danh mục thất bại')
    } finally {
      setDeleteTarget(null)
    }
  }

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Tìm kiếm danh mục..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
        </div>
        <button onClick={() => { setForm(emptyCategory); setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 h-32 animate-pulse border border-gray-100 shadow-sm" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">Không tìm thấy danh mục</div>
        ) : filtered.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800 truncate">{cat.name}</h3>
                  {cat.is_featured === 1 && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Nổi bật</span>}
                </div>
                <p className="text-xs text-gray-400 mt-1 font-mono">/{cat.slug}</p>
                {cat.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{cat.description}</p>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(cat)} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50"><Edit size={16} /></button>
                <button onClick={() => setDeleteTarget(cat)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Thứ tự: {cat.sort_order}</span>
              <button onClick={() => toggle(cat, 'is_active')} className={cat.is_active ? 'text-green-500' : 'text-gray-300'}>
                {cat.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-5">{editing ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea value={form.description} rows={2} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                    placeholder="tshirt" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>
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
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-red-700">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
            <p className="text-sm text-gray-600 mb-5">Bạn có chắc muốn xóa danh mục <strong>"{deleteTarget.name}"</strong>?</p>
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

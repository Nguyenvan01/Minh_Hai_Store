import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { Search, Plus, Edit, Trash2, Tag, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react'

const emptyCoupon = {
  code: '', name: '', description: '', coupon_type: 'general',
  discount_type: 'percentage', discount_value: '', max_discount_amount: '',
  min_order_amount: '', max_usage_total: '', max_usage_per_user: '1',
  valid_from: '', valid_until: '', is_active: true, is_public: true,
}

export default function AdminCoupons() {
  const toast = useToast()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyCoupon)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => { fetchCoupons() }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/coupons')
      setCoupons(res.coupons || [])
    } catch (err) {
      console.error('Failed to fetch coupons:', err)
      setCoupons([])
    } finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        const res = await api.put(`/admin/coupons/${editing}`, form)
        setCoupons(coupons.map(c => c.id === editing ? (res.coupon || { ...c, ...form }) : c))
        toast.success('Đã cập nhật mã giảm giá')
      } else {
        const res = await api.post('/admin/coupons', form)
        setCoupons([...coupons, res.coupon || { ...form, id: Date.now() }])
        toast.success('Đã thêm mã giảm giá mới')
      }
      setShowForm(false)
      setEditing(null)
      setForm(emptyCoupon)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Lưu mã giảm giá thất bại')
    }
  }

  const handleEdit = (c) => { setForm({ ...c }); setEditing(c.id); setShowForm(true) }
  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/admin/coupons/${deleteTarget.id}`)
      setCoupons(coupons.filter(c => c.id !== deleteTarget.id))
      toast.success('Đã xóa mã giảm giá')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xóa mã giảm giá thất bại')
    } finally {
      setDeleteTarget(null)
    }
  }

  const toggle = async (c, field) => {
    const newVal = !c[field]
    try {
      await api.put(`/admin/coupons/${c.id}`, { [field]: newVal })
      setCoupons(coupons.map(x => x.id === c.id ? { ...x, [field]: newVal } : x))
      toast.success('Đã cập nhật trạng thái')
    } catch {
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const typeLabels = { general: 'Chung', first_order: 'Khách mới', specific_product: 'Sản phẩm cụ thể', shipping: 'Miễn phí ship' }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Mã giảm giá</h2>
        <button onClick={() => { setEditing(null); setForm(emptyCoupon); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-red-700">
          <Plus size={18} /> Thêm mã
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex gap-4">
                {Array.from({ length: 6 }).map((_, j) => <div key={j} className="h-4 bg-gray-200 rounded animate-pulse flex-1" />)}
              </div>
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">Chưa có mã giảm giá nào</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mã</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Loại</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Giảm</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sử dụng</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hiệu lực</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Công khai</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-bold font-mono text-[#d71920] bg-red-50 px-2 py-1 rounded">{c.code}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-gray-800">{c.name || c.code}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{c.description}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{typeLabels[c.coupon_type] || c.coupon_type}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                    {c.discount_type === 'percentage' ? `${c.discount_value}%` : new Intl.NumberFormat('vi-VN').format(c.discount_value) + 'đ'}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{c.used_count || 0} / {c.max_usage_total || '∞'}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{c.valid_from} - {c.valid_until}</td>
                  <td className="px-5 py-3.5 text-center">
                    <button onClick={() => toggle(c, 'is_public')} className={c.is_public ? 'text-green-500' : 'text-gray-300'}>
                      {c.is_public ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button onClick={() => toggle(c, 'is_active')} className={c.is_active ? 'text-green-500' : 'text-gray-300'}>
                      {c.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleEdit(c)} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50"><Edit size={16} /></button>
                      <button onClick={() => setDeleteTarget(c)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-5">{editing ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã <span className="text-red-500">*</span></label>
                  <input type="text" value={form.code} required onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại mã</label>
                  <select value={form.coupon_type} onChange={e => setForm({ ...form, coupon_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100">
                    <option value="general">Chung</option>
                    <option value="first_order">Khách hàng mới</option>
                    <option value="specific_product">Sản phẩm cụ thể</option>
                    <option value="shipping">Miễn phí ship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giảm theo</label>
                  <select value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100">
                    <option value="percentage">%</option>
                    <option value="fixed_amount">Số tiền</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị <span className="text-red-500">*</span></label>
                  <input type="number" value={form.discount_value} required onChange={e => setForm({ ...form, discount_value: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giảm tối đa</label>
                  <input type="number" value={form.max_discount_amount} onChange={e => setForm({ ...form, max_discount_amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu</label>
                  <input type="number" value={form.min_order_amount} onChange={e => setForm({ ...form, min_order_amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SL sử dụng</label>
                  <input type="number" value={form.max_usage_total} onChange={e => setForm({ ...form, max_usage_total: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                  <input type="date" value={form.valid_from} onChange={e => setForm({ ...form, valid_from: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                  <input type="date" value={form.valid_until} onChange={e => setForm({ ...form, valid_until: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyCoupon) }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-red-700">
                  {editing ? 'Cập nhật' : 'Tạo mới'}
                </button>
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
            <p className="text-sm text-gray-600 mb-5">Bạn có chắc muốn xóa mã giảm giá <strong>"{deleteTarget.code}"</strong>?</p>
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

import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { Plus, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, X, AlertCircle, Loader2, User } from 'lucide-react'

const emptyForm = {
  name: '', email: '', phone: '', password: '', is_active: true,
}

export default function AdminCustomers() {
  const toast = useToast()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailData, setDetailData] = useState(null)

  useEffect(() => { fetchCustomers() }, [page, search])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/customers', { params: { page, search } })
      setCustomers(res.customers || [])
      setTotalPages(res.totalPages || 1)
    } catch (err) {
      console.error('Fetch customers error:', err)
      setCustomers([])
      setTotalPages(1)
    } finally { setLoading(false) }
  }

  // Validate form
  const validateForm = (data, isNew = false) => {
    const errors = {}
    if (!data.name?.trim()) errors.name = 'Họ và tên không được để trống.'
    if (!data.email?.trim()) errors.email = 'Email không được để trống.'
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) errors.email = 'Email không đúng định dạng.'
    }
    if (data.phone && !/^0\d{9,10}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không đúng định dạng.'
    }
    if (isNew && data.password && data.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.'
    }
    return errors
  }

  // Open add modal
  const openAdd = () => {
    setForm(emptyForm)
    setFormErrors({})
    setShowAddModal(true)
  }

  // Open edit modal
  const openEdit = (c) => {
    setSelected(c)
    setForm({ name: c.name, email: c.email, phone: c.phone || '', password: '', is_active: c.is_active })
    setFormErrors({})
    setShowEditModal(true)
  }

  // Open detail modal
  const openDetail = async (c) => {
    setSelected(c)
    setLoadingDetail(true)
    setShowDetailModal(true)
    try {
      const res = await api.get(`/admin/customers/${c.id}`)
      setDetailData(res.customer)
    } catch (err) {
      console.error('Fetch detail error:', err)
      setDetailData(c)
    } finally { setLoadingDetail(false) }
  }

  // Open delete modal
  const openDelete = (c) => {
    setSelected(c)
    setShowDeleteModal(true)
  }

  // Submit add
  const handleAdd = async () => {
    const errors = validateForm(form, true)
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }
    try {
      setSaving(true)
      const res = await api.post('/admin/customers', form)
      setCustomers([res.customer, ...customers])
      setShowAddModal(false)
      toast.success('Thêm khách hàng thành công.')
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể thêm khách hàng. Vui lòng kiểm tra lại thông tin.'
      toast.error(msg)
    } finally { setSaving(false) }
  }

  // Submit edit
  const handleEdit = async () => {
    const errors = validateForm(form, false)
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }
    try {
      setSaving(true)
      const payload = { name: form.name, email: form.email, phone: form.phone || null, is_active: form.is_active }
      if (form.password?.trim()) payload.password = form.password
      const res = await api.put(`/admin/customers/${selected.id}`, payload)
      setCustomers(customers.map(c => c.id === selected.id ? { ...c, ...res.customer } : c))
      setShowEditModal(false)
      toast.success('Cập nhật khách hàng thành công.')
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể cập nhật khách hàng. Vui lòng kiểm tra lại thông tin.'
      toast.error(msg)
    } finally { setSaving(false) }
  }

  // Submit delete
  const handleDelete = async () => {
    if (!selected) return
    try {
      const res = await api.delete(`/admin/customers/${selected.id}`)
      if (res.blocked) {
        setCustomers(customers.map(c => c.id === selected.id ? { ...c, is_active: false } : c))
        toast.success('Khách hàng đã có đơn hàng nên được khóa thay vì xóa.')
      } else {
        setCustomers(customers.filter(c => c.id !== selected.id))
        toast.success('Xóa khách hàng thành công.')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa khách hàng. Vui lòng thử lại.')
    } finally { setShowDeleteModal(false) }
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + 'đ'
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, SĐT..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920]"
          />
        </div>
        <button
          onClick={openAdd}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-[#c0161c] transition-colors whitespace-nowrap"
        >
          <Plus size={18} /> Thêm khách hàng
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Liên hệ</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Đơn hàng</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Tổng chi tiêu</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Điểm</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>)}</tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">Không tìm thấy khách hàng phù hợp.</td>
                </tr>
              ) : customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {c.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400">ID: {c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-gray-600">{c.email}</p>
                    <p className="text-sm text-gray-400">{c.phone || '-'}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-sm font-semibold text-gray-800">{c.order_count || 0}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(c.total_spent)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-sm font-semibold text-yellow-600">{c.reward_points?.toLocaleString() || 0}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      c.is_active
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {c.is_active ? 'Hoạt động' : 'Khóa'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openDetail(c)}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#d71920] hover:bg-red-50 transition-colors"
                        title="Chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEdit(c)}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openDelete(c)}
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
            <p className="text-sm text-gray-500">Trang {page} / {totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${
                    page === p ? 'bg-[#d71920] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Thêm khách hàng</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  type="text" value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }) }}
                  placeholder="Nguyễn Văn A"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.name ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email" value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setFormErrors({ ...formErrors, email: '' }) }}
                  placeholder="email@example.com"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.email ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel" value={form.phone}
                  onChange={e => { setForm({ ...form, phone: e.target.value }); setFormErrors({ ...formErrors, phone: '' }) }}
                  placeholder="0912345678"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.phone ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password" value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setFormErrors({ ...formErrors, password: '' }) }}
                  placeholder="Để trống = mật khẩu mặc định: customer123"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.password ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
                <p className="text-xs text-gray-400 mt-1">Để trống sẽ dùng mật khẩu mặc định: customer123</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox" checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#d71920]"
                  />
                  <span className="text-sm text-gray-700">Tài khoản hoạt động</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Hủy
                </button>
                <button onClick={handleAdd} disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-[#c0161c] disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Cập nhật khách hàng</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  type="text" value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }) }}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.name ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email" value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setFormErrors({ ...formErrors, email: '' }) }}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.email ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel" value={form.phone}
                  onChange={e => { setForm({ ...form, phone: e.target.value }); setFormErrors({ ...formErrors, phone: '' }) }}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.phone ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password" value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setFormErrors({ ...formErrors, password: '' }) }}
                  placeholder="Để trống nếu không đổi mật khẩu"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.password ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
                <p className="text-xs text-gray-400 mt-1">Chỉ nhập nếu muốn đổi mật khẩu.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox" checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#d71920]"
                  />
                  <span className="text-sm text-gray-700">Tài khoản hoạt động</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Hủy
                </button>
                <button onClick={handleEdit} disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-[#c0161c] disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Chi tiết khách hàng</h3>
              <button onClick={() => { setShowDetailModal(false); setDetailData(null) }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              ) : detailData ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xl">
                      {detailData.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{detailData.name}</p>
                      <p className="text-sm text-gray-500">{detailData.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Đơn hàng</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{detailData.order_count || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Tổng chi tiêu</p>
                      <p className="text-xl font-bold text-[#d71920] mt-1">{formatPrice(detailData.total_spent)}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Số điện thoại:</span><span className="text-gray-800 font-medium">{detailData.phone || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Điểm tích lũy:</span><span className="text-yellow-600 font-semibold">{detailData.reward_points?.toLocaleString() || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Ngày tham gia:</span><span className="text-gray-800">{formatDate(detailData.created_at)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-500">Trạng thái:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        detailData.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {detailData.is_active ? 'Hoạt động' : 'Khóa'}
                      </span>
                    </div>
                  </div>

                  {detailData.recent_orders?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Đơn hàng gần đây</p>
                      <div className="space-y-2">
                        {detailData.recent_orders.map(order => (
                          <div key={order.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                            <div>
                              <p className="font-medium text-gray-800">{order.order_number}</p>
                              <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatPrice(order.total_price)}</p>
                              <p className={`text-xs font-medium ${
                                order.status === 'delivered' ? 'text-green-600' :
                                order.status === 'cancelled' ? 'text-red-500' :
                                'text-yellow-600'
                              }`}>{order.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 p-6 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-1">
                Bạn có chắc chắn muốn xóa khách hàng <strong className="text-gray-800">"{selected.name}"</strong> không?
              </p>
              {selected.order_count > 0 && (
                <p className="text-xs text-orange-500 mt-2">
                  Khách hàng đã có {selected.order_count} đơn hàng. Hệ thống sẽ khóa tài khoản thay vì xóa.
                </p>
              )}
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Hủy
                </button>
                <button onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

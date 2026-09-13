import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Mail, Phone, ToggleLeft, ToggleRight, AlertCircle, Plus, X, Loader2 } from 'lucide-react'

const emptyEmp = {
  name: '', email: '', phone: '', password: '', role: 'staff', is_active: true,
}

export default function AdminEmployees() {
  const toast = useToast()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyEmp)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => { fetchEmployees() }, [page, search])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/employees', { params: { page, search } })
      setEmployees(res.employees || [])
      setTotalPages(res.totalPages || 1)
    } catch (err) {
      console.error('Fetch employees error:', err)
      setEmployees([])
      setTotalPages(1)
    } finally { setLoading(false) }
  }

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
    if (isNew) {
      if (!data.password) errors.password = 'Mật khẩu không được để trống.'
      else if (data.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.'
    }
    if (!isNew && data.password && data.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.'
    }
    return errors
  }

  const toggleStatus = async (emp) => {
    try {
      await api.put(`/admin/employees/${emp.id}/toggle`)
      setEmployees(employees.map(e => e.id === emp.id ? { ...e, is_active: !e.is_active } : e))
      toast.success('Đã cập nhật trạng thái')
    } catch {
      setEmployees(employees.map(e => e.id === emp.id ? { ...e, is_active: !e.is_active } : e))
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isNew = !editing
    const errors = validateForm(form, isNew)
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }
    try {
      setSaving(true)
      if (editing) {
        const payload = { name: form.name, email: form.email, phone: form.phone || null, role: form.role, is_active: form.is_active }
        if (form.password?.trim()) payload.password = form.password
        const res = await api.put(`/admin/employees/${editing}`, payload)
        setEmployees(employees.map(emp => emp.id === editing ? res.employee : emp))
        toast.success('Đã cập nhật nhân viên')
      } else {
        const res = await api.post('/admin/employees', form)
        setEmployees([res.employee, ...employees])
        toast.success('Đã thêm nhân viên mới')
      }
      setShowForm(false)
      setForm(emptyEmp)
      setEditing(null)
      setFormErrors({})
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể lưu. Vui lòng kiểm tra lại thông tin.')
    } finally { setSaving(false) }
  }

  const handleEdit = (emp) => {
    setForm({ name: emp.name || '', email: emp.email || '', phone: emp.phone || '', password: '', role: emp.role || 'staff', is_active: emp.is_active !== false })
    setEditing(emp.id)
    setFormErrors({})
    setShowForm(true)
  }

  const handleAdd = () => {
    setForm(emptyEmp)
    setEditing(null)
    setFormErrors({})
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/admin/employees/${deleteTarget.id}`)
      setEmployees(employees.filter(e => e.id !== deleteTarget.id))
      toast.success('Đã vô hiệu hóa tài khoản')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể thực hiện')
    } finally { setDeleteTarget(null) }
  }

  const roleLabel = (r) => {
    if (r === 'admin') return 'Quản trị viên'
    if (r === 'manager') return 'Quản lý'
    if (r === 'staff') return 'Nhân viên'
    if (r === 'warehouse') return 'Nhân viên kho'
    return r
  }

  const roleColor = (r) => {
    if (r === 'admin') return 'bg-red-50 text-red-700 border-red-200'
    if (r === 'manager') return 'bg-amber-50 text-amber-700 border-amber-200'
    if (r === 'warehouse') return 'bg-red-50 text-red-700 border-red-200'
    return 'bg-green-50 text-green-700 border-green-200'
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Tài khoản nhân viên</h2>
        <div className="relative flex-1 max-w-sm ml-auto">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Tìm theo tên, email..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920]" />
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-[#c0161c] transition-colors whitespace-nowrap">
          <Plus size={18} /> Thêm nhân viên
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nhân viên</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Điện thoại</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vai trò</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ngày tạo</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>)}</tr>)
              ) : employees.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">Không có tài khoản nhân viên nào</td></tr>
              ) : employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                        {(emp.name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{emp.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-gray-600 flex items-center gap-1"><Mail size={13} />{emp.email || '-'}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-gray-600 flex items-center gap-1"><Phone size={13} />{emp.phone || '-'}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${roleColor(emp.role)}`}>
                      {roleLabel(emp.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {emp.created_at ? new Date(emp.created_at).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button onClick={() => toggleStatus(emp)} className={emp.is_active ? 'text-green-500' : 'text-gray-300'}>
                      {emp.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleEdit(emp)} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50"><Edit size={16} /></button>
                      <button onClick={() => setDeleteTarget(emp)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={16} /> Trước
            </button>
            <span className="text-sm text-gray-500">Trang {page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
              Sau <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">{editing ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyEmp) }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                <input type="text" value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }) }}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.name ? 'border-red-400' : 'border-gray-200'
                  }`} />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setFormErrors({ ...formErrors, email: '' }) }}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.email ? 'border-red-400' : 'border-gray-200'
                  }`} />
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" value={form.phone}
                  onChange={e => { setForm({ ...form, phone: e.target.value }); setFormErrors({ ...formErrors, phone: '' }) }}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.phone ? 'border-red-400' : 'border-gray-200'
                  }`} />
                {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu {editing ? '' : <span className="text-red-500">*</span>}
                </label>
                <input type="password" value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setFormErrors({ ...formErrors, password: '' }) }}
                  placeholder={editing ? 'Để trống nếu không đổi mật khẩu' : ''}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920] ${
                    formErrors.password ? 'border-red-400' : 'border-gray-200'
                  }`} />
                {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d71920]">
                  <option value="staff">Nhân viên</option>
                  <option value="manager">Quản lý</option>
                  <option value="warehouse">Nhân viên kho</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#d71920]" />
                  <span className="text-sm text-gray-700">Tài khoản hoạt động</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Hủy
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-[#c0161c] disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Xác nhận vô hiệu hóa</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Vô hiệu hóa tài khoản <strong>"{deleteTarget.name}"</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

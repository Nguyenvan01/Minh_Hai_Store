import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const NAV_ITEMS = [
  { id: 'profile',    path: '/profile',    label: 'Hồ sơ cá nhân',      icon: 'person' },
  { id: 'orders',     path: '/orders',      label: 'Đơn hàng của tôi',    icon: 'shopping_bag' },
  { id: 'favorites',  path: '/favorites',   label: 'Danh sách yêu thích', icon: 'favorite' },
  { id: 'addresses',   path: '/addresses',   label: 'Sổ địa chỉ',          icon: 'location_on' },
]

const CITIES = [
  'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
  'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
  'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
  'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
  'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
  'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
  'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
  'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
]

const blankForm = {
  fullName: '', phone: '', address: '', ward: '', district: '', city: '', isDefault: false
}

function Sidebar({ activeId, onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl p-5 mb-3"
        style={{ boxShadow: '0 20px 40px rgba(19, 27, 46, 0.06)' }}>
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#eaedff]" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#4450b7] flex items-center justify-center
              text-white font-bold text-lg font-['Space_Grotesk'] shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-[#131b2e] truncate leading-tight">{user?.name || 'Khách hàng'}</p>
            <p className="text-xs text-[#454652] mt-0.5 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="bg-[#f2f3ff] rounded-2xl p-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map(item => {
          const isActive = activeId === item.id
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => onNavigate(item.id)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white text-[#4450b7] font-semibold'
                  : 'text-[#454652] hover:bg-white/60 hover:text-[#131b2e]'
              }`}
              style={isActive ? { boxShadow: '0 8px 16px rgba(19, 27, 46, 0.05)' } : {}}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#4450b7] rounded-r-full" />
              )}
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
        <div className="my-1 h-px bg-[#dae2fd]/40 mx-3" />
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
            text-[#454652] hover:bg-white/60 hover:text-[#c9392c] w-full text-left group">
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm">Đăng xuất</span>
        </button>
      </nav>
    </aside>
  )
}

function EmptyState({ icon, title, subtitle, cta }) {
  return (
    <div className="bg-[#f2f3ff] rounded-2xl p-14 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#dae2fd] flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-3xl text-[#4450b7]">{icon}</span>
      </div>
      <p className="font-['Space_Grotesk'] text-lg font-bold text-[#131b2e] mb-2">{title}</p>
      <p className="text-sm text-[#454652] mb-7">{subtitle}</p>
      {cta}
    </div>
  )
}

function LoadingState({ message }) {
  return (
    <div className="bg-[#f2f3ff] rounded-2xl p-12 flex flex-col items-center gap-4">
      <span className="material-symbols-outlined text-3xl animate-spin text-[#4450b7]">progress_activity</span>
      <p className="text-sm text-[#454652]">{message}</p>
    </div>
  )
}

function FieldInput({ label, value, onChange, placeholder, type = 'text', error }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-[#454652] uppercase tracking-[0.08em] mb-1.5">{label}</p>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-[#f2f3ff] px-4 py-3 rounded-xl text-sm text-[#131b2e] placeholder:text-[#a5a6aa]
          outline-none transition-all duration-200
          ${error ? 'focus:bg-white focus:ring-2 focus:ring-[#c9392c]/20' : 'focus:bg-white focus:ring-2 focus:ring-[#4450b7]/20'}`}
      />
      {error && <p className="text-xs text-[#c9392c] mt-1">{error}</p>}
    </div>
  )
}

function SelectInput({ label, value, onChange, options, error }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-[#454652] uppercase tracking-[0.08em] mb-1.5">{label}</p>
      <select
        value={value}
        onChange={onChange}
        className={`w-full bg-[#f2f3ff] px-4 py-3 rounded-xl text-sm text-[#131b2e]
          outline-none transition-all duration-200 cursor-pointer appearance-none
          ${error ? 'focus:bg-white focus:ring-2 focus:ring-[#c9392c]/20' : 'focus:bg-white focus:ring-2 focus:ring-[#4450b7]/20'}`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%23454652' d='M7 10l5 5 5-5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <p className="text-xs text-[#c9392c] mt-1">{error}</p>}
    </div>
  )
}

const AddressesPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(blankForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login')
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (isAuthenticated) fetchAddresses()
  }, [isAuthenticated])

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const res = await api.get('/addresses')
      if (res.success) setAddresses(res.addresses || [])
      else setAddresses([])
    } catch { setAddresses([]) } finally { setLoading(false) }
  }

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên'
    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại'
    else if (!/^0\d{9,10}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Số điện thoại không hợp lệ'
    if (!form.address.trim()) errs.address = 'Vui lòng nhập địa chỉ'
    if (!form.city) errs.city = 'Vui lòng chọn tỉnh/thành phố'
    return errs
  }

  const openAdd = () => { setForm(blankForm); setEditingId(null); setShowForm(true); setErrors({}) }
  const openEdit = (addr) => {
    setForm({ fullName: addr.full_name || '', phone: addr.phone || '', address: addr.address || '',
      ward: addr.ward || '', district: addr.district || '', city: addr.city || '', isDefault: !!addr.is_default })
    setEditingId(addr.id); setShowForm(true); setErrors({})
  }
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(blankForm); setErrors({}) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    try {
      let res
      if (editingId) {
        res = await api.put(`/addresses/${editingId}`, form)
        if (res.success) { setAddresses(addresses.map(a => a.id === editingId ? res.address : a)); closeForm() }
      } else {
        res = await api.post('/addresses', form)
        if (res.success) { setAddresses([res.address, ...addresses]); closeForm() }
      }
    } catch {} finally { setSubmitting(false) }
  }

  const handleSetDefault = async (addr) => {
    try {
      const res = await api.put(`/addresses/${addr.id}`, { ...addr, isDefault: true })
      if (res.success) setAddresses(addresses.map(a => ({ ...a, is_default: a.id === addr.id ? 1 : 0 })))
    } catch {}
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await api.delete(`/addresses/${deleteTarget.id}`)
      if (res.success) { setAddresses(addresses.filter(a => a.id !== deleteTarget.id)); setDeleteTarget(null) }
    } catch {} finally { setDeleting(false) }
  }

  if (authLoading) return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center">
      <span className="material-symbols-outlined text-4xl animate-spin text-[#4450b7]">progress_activity</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <Header cartCount={0} />

      <main className="pt-20 max-w-screen-2xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          <Sidebar activeId="addresses" onNavigate={() => {}} />

          <div className="flex-1 min-w-0 space-y-8">
            {/* Page Header */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="font-['Space_Grotesk'] text-[40px] font-bold tracking-tight text-[#131b2e] leading-none">
                  Địa chỉ
                </h1>
                <p className="text-sm text-[#454652] mt-3">
                  {addresses.length > 0 ? `${addresses.length} địa chỉ đã lưu` : 'Quản lý địa chỉ giao hàng của bạn'}
                </p>
              </div>
              {!showForm && (
                <button
                  onClick={openAdd}
                  className="shrink-0 px-5 py-2.5 bg-gradient-to-br from-[#4450b7] to-[#5e6ad2] text-white text-sm font-medium rounded-xl
                    hover:opacity-90 transition-all flex items-center gap-2"
                  style={{ boxShadow: '0 8px 20px rgba(68, 80, 183, 0.25)' }}
                >
                  <span className="material-symbols-outlined text-base">add_location</span>
                  Thêm địa chỉ
                </button>
              )}
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[#454652] text-xs font-medium">
              <Link to="/profile" className="hover:text-[#4450b7] transition-colors">Tài khoản</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#131b2e] font-semibold">Địa chỉ</span>
            </nav>

            {/* Content */}
            {loading ? (
              <LoadingState message="Đang tải địa chỉ..." />
            ) : (
              <>
                {addresses.length === 0 && !showForm && (
                  <EmptyState
                    icon="location_on"
                    title="Bạn chưa có địa chỉ nào"
                    subtitle="Thêm địa chỉ giao hàng để đặt hàng nhanh hơn"
                    cta={
                      <button onClick={openAdd}
                        className="px-7 py-3 bg-gradient-to-br from-[#4450b7] to-[#5e6ad2] text-white text-sm font-medium rounded-xl
                          hover:opacity-90 transition-all"
                        style={{ boxShadow: '0 8px 20px rgba(68, 80, 183, 0.25)' }}>
                        Thêm địa chỉ mới
                      </button>
                    }
                  />
                )}

                {/* Address List */}
                <div className="flex flex-col gap-4">
                  {addresses.map(addr => (
                    <div key={addr.id}
                      className={`bg-white rounded-2xl p-5 transition-all duration-200 ${
                        addr.is_default ? 'ring-2 ring-[#4450b7]' : ''
                      }`}
                      style={{ boxShadow: addr.is_default
                        ? '0 8px 24px rgba(68, 80, 183, 0.15)'
                        : '0 8px 24px rgba(19, 27, 46, 0.05)' }}>

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            addr.is_default ? 'bg-[#4450b7]' : 'bg-[#f2f3ff]'
                          }`}>
                            <span className={`material-symbols-outlined text-xl ${
                              addr.is_default ? 'text-white' : 'text-[#4450b7]'
                            }`}>
                              {addr.is_default ? 'star' : 'location_on'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-[#131b2e]">{addr.full_name}</p>
                              {addr.is_default && (
                                <span className="px-2 py-0.5 bg-[#eaedff] text-[#4450b7] text-xs font-bold rounded-full">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#454652]">{addr.phone}</p>
                            <p className="text-sm text-[#454652] mt-1 leading-snug">
                              {[addr.address, addr.ward, addr.district, addr.city].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {!addr.is_default && (
                            <button
                              onClick={() => handleSetDefault(addr)}
                              className="w-9 h-9 rounded-xl bg-[#f2f3ff] flex items-center justify-center
                                hover:bg-[#dae2fd] transition-all text-[#454652] hover:text-[#4450b7]"
                              title="Đặt làm mặc định">
                              <span className="material-symbols-outlined text-lg">star_outline</span>
                            </button>
                          )}
                          <button
                            onClick={() => openEdit(addr)}
                            className="w-9 h-9 rounded-xl bg-[#f2f3ff] flex items-center justify-center
                              hover:bg-[#dae2fd] transition-all text-[#454652] hover:text-[#4450b7]"
                            title="Sửa">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(addr)}
                            className="w-9 h-9 rounded-xl bg-[#fef0f0] flex items-center justify-center
                              hover:bg-[#fedcdc] transition-all text-[#c9392c]"
                            title="Xóa">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                  <div className="bg-white rounded-2xl p-7"
                    style={{ boxShadow: '0 20px 40px rgba(19, 27, 46, 0.06)' }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-11 h-11 rounded-xl bg-[#eaedff] flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl text-[#4450b7]">
                          {editingId ? 'edit' : 'add_location'}
                        </span>
                      </div>
                      <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#131b2e]">
                        {editingId ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FieldInput label="Họ và tên *" value={form.fullName}
                          onChange={e => setForm({ ...form, fullName: e.target.value })}
                          placeholder="Nguyễn Văn A" error={errors.fullName} />
                        <FieldInput label="Số điện thoại *" value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="0912 345 678" type="tel" error={errors.phone} />
                      </div>

                      <FieldInput label="Địa chỉ *" value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                        placeholder="123 Đường ABC, Phường XYZ" error={errors.address} />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FieldInput label="Phường/Xã" value={form.ward}
                          onChange={e => setForm({ ...form, ward: e.target.value })}
                          placeholder="Phường Bến Nghé" />
                        <FieldInput label="Quận/Huyện" value={form.district}
                          onChange={e => setForm({ ...form, district: e.target.value })}
                          placeholder="Quận 1" />
                        <SelectInput label="Tỉnh/Thành phố *" value={form.city}
                          onChange={e => setForm({ ...form, city: e.target.value })}
                          error={errors.city}
                          options={[{ value: '', label: 'Chọn tỉnh/thành phố' }, ...CITIES.map(c => ({ value: c, label: c }))]} />
                      </div>

                      {!editingId && (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.isDefault}
                            onChange={e => setForm({ ...form, isDefault: e.target.checked })}
                            className="w-5 h-5 accent-[#4450b7] rounded cursor-pointer"
                          />
                          <span className="text-sm text-[#131b2e]">Đặt làm địa chỉ mặc định</span>
                        </label>
                      )}

                      <div className="flex gap-3 justify-end pt-2">
                        <button
                          type="button"
                          onClick={closeForm}
                          className="px-6 py-2.5 bg-[#f2f3ff] text-[#454652] text-sm font-medium rounded-xl
                            hover:bg-[#dae2fd] transition-all">
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-7 py-2.5 bg-gradient-to-br from-[#4450b7] to-[#5e6ad2] text-white text-sm font-medium rounded-xl
                            hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                          style={{ boxShadow: '0 8px 20px rgba(68, 80, 183, 0.25)' }}
                        >
                          {submitting ? (
                            <><span className="material-symbols-outlined text-base animate-spin">progress_activity</span> Đang lưu...</>
                          ) : (
                            <><span className="material-symbols-outlined text-base">save</span>
                              {editingId ? 'Lưu thay đổi' : 'Thêm địa chỉ'}</>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-[#131b2e]/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#faf8ff] rounded-2xl w-full max-w-sm p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#fef0f0] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-[#c9392c]">delete</span>
              </div>
              <div>
                <h3 className="font-['Space_Grotesk'] font-bold text-[#131b2e]">Xóa địa chỉ</h3>
                <p className="text-xs text-[#454652]">Hành động không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-sm text-[#454652] mb-6">
              Bạn có chắc muốn xóa địa chỉ "{deleteTarget.address}"?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 bg-[#f2f3ff] text-[#454652] text-sm font-medium rounded-xl hover:bg-[#dae2fd] transition-all">
                Hủy
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="px-5 py-2.5 bg-[#c9392c] text-white text-sm font-medium rounded-xl
                  hover:opacity-90 transition-all disabled:opacity-50">
                {deleting ? 'Đang xóa...' : 'Xóa địa chỉ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddressesPage

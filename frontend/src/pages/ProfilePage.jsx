import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AccountLayout from '../components/account/AccountLayout'
import AccountPageHeader from '../components/account/AccountPageHeader'
import ProfileSummary from '../components/account/ProfileSummary'
import RecentOrders from '../components/account/RecentOrders'
import RecentFavorites from '../components/account/RecentFavorites'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import {
  cleanText,
  formatDate,
  genderLabel,
  joinClean,
  memberLevelLabel,
  toNumber,
} from '../components/account/accountUtils'

function FieldLabel({ children }) {
  return <p className="text-xs text-[#7d8794] mb-1">{children}</p>
}

function FieldValue({ children }) {
  const value = cleanText(children)
  return (
    <p className="text-sm text-[#2f3840]">
      {value || <span className="text-[#adbccd] italic">Chưa cập nhật</span>}
    </p>
  )
}

function PasswordModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setSaving(true)
    try {
      const res = await api.put('/profile/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      if (res.success) {
        onClose()
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setError(res.message || 'Không thể đổi mật khẩu')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đổi mật khẩu')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Đóng" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
          <h3 className="text-base font-semibold text-[#2f3840]">Đổi mật khẩu</h3>
          <button type="button" onClick={onClose} className="text-[#7d8794] hover:text-[#2f3840]">
            Đóng
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}
          <div>
            <FieldLabel>Mật khẩu hiện tại</FieldLabel>
            <input
              type="password"
              value={form.currentPassword}
              onChange={e => setForm({ ...form, currentPassword: e.target.value })}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#d71920]"
            />
          </div>
          <div>
            <FieldLabel>Mật khẩu mới</FieldLabel>
            <input
              type="password"
              value={form.newPassword}
              onChange={e => setForm({ ...form, newPassword: e.target.value })}
              placeholder="Ít nhất 6 ký tự"
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#d71920]"
            />
          </div>
          <div>
            <FieldLabel>Xác nhận mật khẩu mới</FieldLabel>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#d71920]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-[#7d8794] text-sm font-medium rounded-lg hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-[#d71920] text-white text-sm font-medium rounded-lg hover:bg-[#c6171e] disabled:opacity-50"
            >
              {saving ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const normalizeWishlist = (res) => res?.items || res?.products || res?.wishlist || []

const profileToForm = (profile = {}) => ({
  name: cleanText(profile.name),
  email: cleanText(profile.email),
  phone: cleanText(profile.phone),
  birthDate: cleanText(profile.birthDate || profile.birth_date),
  gender: cleanText(profile.gender),
})

const getDefaultAddress = (addresses) => (
  addresses.find(address => Number(address.is_default) === 1 || address.isDefault) || addresses[0] || null
)

const formatAddress = (address) => {
  if (!address) return ''
  return joinClean(address.address, address.ward, address.district, address.city)
}

const ProfilePage = () => {
  const { user, isAuthenticated, updateUser, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [orders, setOrders] = useState([])
  const [favorites, setFavorites] = useState([])
  const [addresses, setAddresses] = useState([])
  const [editForm, setEditForm] = useState(profileToForm(user))
  const [saving, setSaving] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login')
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (user) setEditForm(profileToForm(user))
  }, [user])

  useEffect(() => {
    if (!isAuthenticated) return

    let mounted = true
    const fetchAccountData = async () => {
      setLoadingData(true)
      const [profileRes, ordersRes, wishlistRes, addressRes] = await Promise.allSettled([
        api.get('/profile'),
        api.get('/orders', { params: { page: 1, limit: 10 } }),
        api.get('/wishlist'),
        api.get('/addresses'),
      ])

      if (!mounted) return

      if (profileRes.status === 'fulfilled' && profileRes.value?.success && profileRes.value.user) {
        updateUser(profileRes.value.user)
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.success) {
        setOrders(ordersRes.value.orders || [])
      } else {
        setOrders([])
      }
      if (wishlistRes.status === 'fulfilled' && wishlistRes.value?.success) {
        setFavorites(normalizeWishlist(wishlistRes.value))
      } else {
        setFavorites([])
      }
      if (addressRes.status === 'fulfilled' && addressRes.value?.success) {
        setAddresses(addressRes.value.addresses || [])
      } else {
        setAddresses([])
      }
      setLoadingData(false)
    }

    fetchAccountData()
    return () => { mounted = false }
  }, [isAuthenticated])

  const defaultAddress = useMemo(() => getDefaultAddress(addresses), [addresses])
  const rewardPoints = user?.rewardPoints ?? user?.reward_points ?? user?.loyaltyPoints
  const hasRewardPoints = rewardPoints !== undefined && rewardPoints !== null
  const memberLevel = memberLevelLabel(user?.memberLevel || user?.member_level)

  const accountFields = [
    { label: 'Họ và tên', value: user?.name },
    { label: 'Email', value: user?.email },
    { label: 'Số điện thoại', value: user?.phone },
    { label: 'Ngày sinh', value: formatDate(user?.birthDate || user?.birth_date) },
    { label: 'Giới tính', value: genderLabel(user?.gender) },
    { label: 'Ngày tham gia', value: formatDate(user?.created_at) },
    ...(memberLevel ? [{ label: 'Hạng thành viên', value: memberLevel }] : []),
    ...(hasRewardPoints ? [{ label: 'Điểm tích lũy', value: toNumber(rewardPoints).toLocaleString('vi-VN') }] : []),
  ]

  const handleEdit = () => {
    setEditForm(profileToForm(user))
    setIsEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await api.put('/profile', {
        name: editForm.name,
        phone: editForm.phone,
        birthDate: editForm.birthDate,
        gender: editForm.gender,
      })
      if (res.success && res.user) {
        updateUser(res.user)
        setEditForm(profileToForm(res.user))
        setIsEditing(false)
      }
    } catch {
      setEditForm(profileToForm(user))
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) return <AccountLayout activeId="profile" loading />
  if (!isAuthenticated || !user) return null

  return (
    <AccountLayout activeId="profile" loading={loadingData}>
      <AccountPageHeader
        title="Hồ sơ cá nhân"
        description="Quản lý thông tin tài khoản và theo dõi hoạt động mua sắm"
        action={!isEditing && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 text-sm text-[#7d8794] hover:text-[#2f3840] transition-colors"
            >
              Đổi mật khẩu
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="px-5 py-2.5 bg-[#d71920] text-white text-sm font-medium rounded-lg hover:bg-[#c6171e] transition-colors"
            >
              Chỉnh sửa
            </button>
          </div>
        )}
      />

      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-base font-semibold text-[#2f3840]">Thông tin tài khoản</h2>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <FieldLabel>Họ và tên *</FieldLabel>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#d71920]"
                />
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm bg-[#f7f7f7] text-[#7d8794]"
                />
              </div>
              <div>
                <FieldLabel>Số điện thoại</FieldLabel>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#d71920]"
                />
              </div>
              <div>
                <FieldLabel>Ngày sinh</FieldLabel>
                <input
                  type="text"
                  value={editForm.birthDate}
                  onChange={e => setEditForm({ ...editForm, birthDate: e.target.value })}
                  placeholder="1995-05-15"
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#d71920]"
                />
              </div>
              <div>
                <FieldLabel>Giới tính</FieldLabel>
                <select
                  value={editForm.gender}
                  onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#d71920]"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="flex items-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-100 text-[#7d8794] text-sm font-medium rounded-lg hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-[#d71920] text-white text-sm font-medium rounded-lg hover:bg-[#c6171e] disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
              {accountFields.map(field => (
                <div key={field.label}>
                  <FieldLabel>{field.label}</FieldLabel>
                  <FieldValue>{field.value}</FieldValue>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-[#2f3840]">Địa chỉ giao hàng mặc định</h2>
              {defaultAddress ? (
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium text-[#2f3840]">
                    {cleanText(defaultAddress.full_name) || cleanText(user.name) || 'Người nhận'}
                    {cleanText(defaultAddress.phone) && (
                      <span className="font-normal text-[#7d8794]"> · {cleanText(defaultAddress.phone)}</span>
                    )}
                  </p>
                  <p className="text-sm text-[#7d8794] leading-relaxed">{formatAddress(defaultAddress)}</p>
                </div>
              ) : (
                <p className="text-sm text-[#7d8794] mt-3">Bạn chưa cập nhật địa chỉ giao hàng</p>
              )}
            </div>
            <Link
              to="/addresses"
              className="inline-flex items-center justify-center px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#2f3840] hover:border-[#d71920] hover:text-[#d71920]"
            >
              Cập nhật địa chỉ
            </Link>
          </div>
        </section>

        <ProfileSummary
          orders={orders}
          favoriteCount={favorites.length}
          points={hasRewardPoints ? rewardPoints : undefined}
        />

        <div className="grid grid-cols-1 gap-6">
          <RecentOrders orders={orders} limit={3} />
          <RecentFavorites products={favorites} limit={4} />
        </div>
      </div>

      <PasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </AccountLayout>
  )
}

export default ProfilePage

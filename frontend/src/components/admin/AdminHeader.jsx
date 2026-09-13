import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useNotifications } from '../../contexts/NotificationContext'
import * as Icons from 'lucide-react'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút`
  if (hours < 24) return `${hours} giờ`
  return `${days} ngày`
}

export default function AdminHeader({ title, sidebarCollapsed }) {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const { notifications, counts, loading, showPanel, setShowPanel, fetchNotifications, markAllRead, ICON_MAP, COLOR_MAP } = useNotifications()
  const [showUser, setShowUser] = useState(false)
  const userRef = useRef()

  useEffect(() => {
    const handleClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const totalNotif = Object.values(counts).reduce((a, b) => typeof b === 'number' ? a + b : a, 0)
  const newCount = notifications.filter(n => n.isNew).length

  const handleBellClick = () => {
    setShowPanel(!showPanel)
    if (!showPanel) fetchNotifications(true)
  }

  const handleNotifClick = (notif) => {
    if (notif.link) navigate(notif.link)
    setShowPanel(false)
  }

  return (
    <>
      <header
        className={`fixed top-0 right-0 h-16 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 z-30 transition-all duration-300 ${
          sidebarCollapsed ? 'left-[72px]' : 'left-[260px]'
        }`}
      >
        {/* Title */}
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-[#2f3840]">{title}</h1>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={handleBellClick}
              className="relative p-2 rounded-lg text-gray-600 hover:bg-[#fff1f2] hover:text-[#d71920] transition-colors"
            >
              <Icons.Bell size={20} />
              {totalNotif > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {totalNotif > 99 ? '99+' : totalNotif}
                </span>
              )}
            </button>
          </div>

          {/* User */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUser(!showUser)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#fff1f2] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#d71920] flex items-center justify-center text-white text-sm font-semibold">
                {(admin?.name || 'Quản trị viên').charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-[#2f3840] leading-tight">{admin?.name || 'Quản trị viên'}</p>
                <p className="text-xs text-gray-500 capitalize">{admin?.role || 'admin'}</p>
              </div>
            </button>
            {showUser && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-sm">{admin?.name}</p>
                  <p className="text-xs text-gray-500">{admin?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setShowUser(false); navigate('/admin') }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fff1f2] hover:text-[#d71920]"
                  >
                    Tổng quan
                  </button>
                  <button
                    onClick={() => { setShowUser(false); navigate('/admin/settings') }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#fff1f2] hover:text-[#d71920]"
                  >
                    Cài đặt
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Panel (Portal-like, outside header) */}
      {showPanel && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
          <div className="fixed top-16 right-6 w-[400px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-gray-800">Thông báo</p>
                {newCount > 0 && (
                  <span className="bg-red-100 text-red-600 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {newCount} mới
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {loading && (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                )}
                {newCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="text-xs text-[#d71920] font-medium hover:underline"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
                <button
                  onClick={() => fetchNotifications(true)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                  title="Làm mới"
                >
                  <Icons.RefreshCw size={14} />
                </button>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icons.X size={16} />
                </button>
              </div>
            </div>

            {/* Stats bar */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-3 text-xs overflow-x-auto whitespace-nowrap">
              {counts.newOrders > 0 && (
                <span className="flex items-center gap-1 text-[#d71920] font-medium">
                  <Icons.ShoppingBag size={12} /> {counts.newOrders} đơn mới
                </span>
              )}
              {counts.pendingOld > 0 && (
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <Icons.Clock size={12} /> {counts.pendingOld} chờ lâu
                </span>
              )}
              {counts.lowStock + counts.outStock > 0 && (
                <span className="flex items-center gap-1 text-orange-600 font-medium">
                  <Icons.AlertTriangle size={12} /> {counts.lowStock + counts.outStock} kho
                </span>
              )}
              {counts.pendingReviews > 0 && (
                <span className="flex items-center gap-1 text-yellow-600 font-medium">
                  <Icons.Star size={12} /> {counts.pendingReviews} đánh giá
                </span>
              )}
              {counts.pendingContacts > 0 && (
                <span className="flex items-center gap-1 text-purple-600 font-medium">
                  <Icons.Mail size={12} /> {counts.pendingContacts} liên hệ
                </span>
              )}
              {counts.returns > 0 && (
                <span className="flex items-center gap-1 text-red-600 font-medium">
                  <Icons.RotateCcw size={12} /> {counts.returns} đổi trả
                </span>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Icons.Bell size={36} className="mb-2 opacity-30" />
                  <p className="text-sm">Không có thông báo nào</p>
                </div>
              ) : (
                notifications.map(notif => {
                  const colors = COLOR_MAP[notif.color] || COLOR_MAP.info
                  const IconName = ICON_MAP[notif.icon] || 'Bell'
                  const IconComp = Icons[IconName] || Icons.Bell
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-[#fff1f2] cursor-pointer transition-colors ${
                        notif.isNew ? 'bg-red-50/40' : ''
                      } ${notif.urgent ? 'bg-red-50/50' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colors.bg}`}>
                        <IconComp size={15} className={colors.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-semibold ${notif.urgent ? 'text-red-700' : 'text-gray-800'}`}>
                            {notif.title}
                          </p>
                          {notif.time && (
                            <span className="text-[11px] text-gray-400 whitespace-nowrap">{timeAgo(notif.time)}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
                      </div>
                      {notif.urgent && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                      )}
                      {notif.isNew && !notif.urgent && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{notifications.length} thông báo</span>
              <div className="flex gap-3">
                <Link
                  to="/admin/orders"
                  onClick={() => setShowPanel(false)}
                  className="text-xs text-[#d71920] font-medium hover:underline"
                >
                  Xem tất cả đơn hàng
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

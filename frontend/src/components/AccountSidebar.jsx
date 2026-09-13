import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Icons - SVG line icons, minimal
const Icons = {
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  ShoppingBag: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
}

const NAV_ITEMS = [
  { id: 'profile', path: '/profile', label: 'Hồ sơ cá nhân', icon: Icons.User },
  { id: 'orders', path: '/orders', label: 'Đơn hàng của tôi', icon: Icons.ShoppingBag },
  { id: 'favorites', path: '/favorites', label: 'Yêu thích', icon: Icons.Heart },
]

function AccountSidebar({ activeId }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="lg:w-52 shrink-0">
      {/* User info */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#d71920] flex items-center justify-center text-white font-semibold text-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#2f3840] truncate">{user?.name || 'Khách hàng'}</p>
          <p className="text-xs text-[#7d8794] truncate">{user?.email || 'Chưa cập nhật email'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(item => {
          const isActive = activeId === item.id
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-[#fff1f2] text-[#d71920] font-medium'
                  : 'text-[#7d8794] hover:text-[#2f3840] hover:bg-gray-50'
              }`}
            >
              <span className={isActive ? 'text-[#d71920]' : 'text-[#7d8794]'}>{item.icon()}</span>
              {item.label}
            </Link>
          )
        })}

        <div className="h-px bg-[#e5e7eb] my-2" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#7d8794] hover:text-[#d71920] hover:bg-[#fff1f2] transition-all w-full text-left"
        >
          <Icons.Logout />
          Đăng xuất
        </button>
      </nav>
    </aside>
  )
}

export default AccountSidebar

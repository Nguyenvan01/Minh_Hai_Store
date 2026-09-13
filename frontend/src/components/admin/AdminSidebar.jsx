import { Link, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingCart,
  Users,
  UserCog,
  Percent,
  Warehouse,
  Truck,
  CreditCard,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react'

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Tổng quan', badge: null },
  { path: '/admin/products', icon: Package, label: 'Sản phẩm', badge: null },
  { path: '/admin/categories', icon: Layers, label: 'Danh mục', badge: null },
  { path: '/admin/brands', icon: Tag, label: 'Thương hiệu', badge: null },
  { path: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng', badge: null },
  { path: '/admin/customers', icon: Users, label: 'Khách hàng', badge: null },
  { path: '/admin/employees', icon: UserCog, label: 'Nhân viên', badge: null },
  { path: '/admin/promotions', icon: Percent, label: 'Khuyến mãi', badge: null },
  { path: '/admin/coupons', icon: Tag, label: 'Mã giảm giá', badge: null },
  { path: '/admin/warehouse', icon: Warehouse, label: 'Kho hàng', badge: null },
  { path: '/admin/import', icon: Truck, label: 'Nhập hàng', badge: null },
  { path: '/admin/reviews', icon: MessageSquare, label: 'Đánh giá', badge: null },
  { path: '/admin/blog', icon: FileText, label: 'Bài viết', badge: null },
  { path: '/admin/reports', icon: BarChart3, label: 'Báo cáo', badge: null },
  { path: '/admin/contacts', icon: MessageSquare, label: 'Liên hệ', badge: null },
  { path: '/admin/settings', icon: Settings, label: 'Cài đặt', badge: null },
]

export default function AdminSidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const { admin, logout } = useAdminAuth()

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white text-[#2f3840] border-r border-[#e5e7eb] flex flex-col z-40 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#e5e7eb] bg-white">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#d71920] text-white rounded-lg flex items-center justify-center font-bold text-sm">
              C
            </div>
            <span className="font-bold text-lg tracking-tight text-[#2f3840]">Đạt Hoàng Admin</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg transition-colors text-gray-500 hover:bg-[#fff1f2] hover:text-[#d71920]"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                active
                  ? 'bg-[#d71920] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-[#fff1f2] hover:text-[#d71920]'
              }`}
            >
              <Icon size={20} className={active ? 'text-white' : 'text-gray-500 group-hover:text-[#d71920]'} />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-[#e5e7eb] p-3 space-y-2 bg-white">
        {!collapsed && admin && (
          <div className="px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-sm font-semibold truncate text-[#2f3840]">{admin.name}</p>
            <p className="text-xs text-gray-500 truncate">{admin.role}</p>
          </div>
        )}
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-[#fff1f2] hover:text-[#d71920] transition-colors"
        >
          <Menu size={20} />
          {!collapsed && <span className="text-sm">Xem cửa hàng</span>}
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-[#fff1f2] hover:text-[#d71920] transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  )
}

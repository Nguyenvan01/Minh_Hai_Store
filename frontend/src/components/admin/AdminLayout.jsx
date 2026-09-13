import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { NotificationProvider } from '../../contexts/NotificationContext'

const pageTitles = {
  '/admin': 'Tổng quan',
  '/admin/products': 'Sản phẩm',
  '/admin/products/create': 'Thêm sản phẩm mới',
  '/admin/products/edit': 'Chỉnh sửa sản phẩm',
  '/admin/categories': 'Danh mục',
  '/admin/brands': 'Thương hiệu',
  '/admin/orders': 'Đơn hàng',
  '/admin/customers': 'Khách hàng',
  '/admin/employees': 'Nhân viên',
  '/admin/promotions': 'Khuyến mãi',
  '/admin/coupons': 'Mã giảm giá',
  '/admin/warehouse': 'Kho hàng',
  '/admin/import': 'Nhập hàng',
  '/admin/reviews': 'Đánh giá',
  '/admin/blog': 'Bài viết',
  '/admin/reports': 'Báo cáo',
  '/admin/contacts': 'Liên hệ',
  '/admin/settings': 'Cài đặt',
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Admin'

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-[#f7f7f7]">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <AdminHeader title={title} sidebarCollapsed={collapsed} />
        <main
          className={`pt-16 min-h-screen transition-all duration-300 ${
            collapsed ? 'ml-[72px]' : 'ml-[260px]'
          }`}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </NotificationProvider>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountLayout from '../components/account/AccountLayout'
import AccountPageHeader from '../components/account/AccountPageHeader'
import EmptyState from '../components/account/EmptyState'
import OrderListItem from '../components/account/OrderListItem'
import { useAuth } from '../contexts/AuthContext'
import { orderAPI } from '../services/api'
import { cleanText, getOrderCode } from '../components/account/accountUtils'

const STAT_ITEMS = [
  { key: 'all', label: 'Tất cả đơn' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'shipped', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
]

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'shipped', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
]

const OrdersPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login')
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (!isAuthenticated) return
    fetchOrders()
  }, [isAuthenticated])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await orderAPI.getOrders({ page: 1, limit: 50 })
      setOrders(res.success ? (res.orders || []) : [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const countStatus = (status) => orders.filter(order => order.status === status).length
    return STAT_ITEMS.map(item => ({
      ...item,
      count: item.key === 'all' ? orders.length : countStatus(item.key),
    }))
  }, [orders])

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return orders.filter(order => {
      const matchesStatus = activeStatus === 'all' || order.status === activeStatus
      const orderCode = getOrderCode(order).toLowerCase()
      const matchesSearch = !query || orderCode.includes(query) || cleanText(order.id).toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [orders, activeStatus, searchQuery])

  const handleCancelOrder = async (order) => {
    if (!order?.id) return
    setCancellingId(order.id)
    try {
      const res = await orderAPI.cancelOrder(order.id, 'Khách hàng hủy đơn')
      if (res.success) {
        setOrders(prev => prev.map(item => item.id === order.id ? { ...item, status: 'cancelled' } : item))
      }
    } catch {
      fetchOrders()
    } finally {
      setCancellingId(null)
    }
  }

  if (authLoading) return <AccountLayout activeId="orders" loading />

  return (
    <AccountLayout activeId="orders" loading={loading}>
      <AccountPageHeader
        title="Đơn hàng của tôi"
        description="Theo dõi trạng thái thanh toán, vận chuyển và lịch sử mua hàng"
      />

      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-x-0 sm:divide-x divide-y sm:divide-y-0 divide-[#e5e7eb]">
            {stats.map(item => (
              <button
                type="button"
                key={item.key}
                onClick={() => setActiveStatus(item.key)}
                className="px-4 py-3 text-left hover:bg-[#fafafa] transition-colors"
              >
                <p className="text-xs text-[#7d8794]">{item.label}</p>
                <p className="text-lg font-semibold text-[#2f3840] mt-1">{item.count.toLocaleString('vi-VN')}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map(tab => {
                const isActive = activeStatus === tab.key
                return (
                  <button
                    type="button"
                    key={tab.key}
                    onClick={() => setActiveStatus(tab.key)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-[#d71920] text-white'
                        : 'text-[#7d8794] bg-[#f7f7f7] hover:text-[#2f3840] hover:bg-[#f0f0f0]'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo mã đơn hàng..."
                className="w-full bg-white pl-4 pr-4 py-3 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:border-[#d71920]"
              />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          searchQuery || activeStatus !== 'all' ? (
            <EmptyState
              title="Không tìm thấy đơn hàng phù hợp"
              description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
              compact
            />
          ) : (
            <EmptyState
              title="Bạn chưa có đơn hàng nào"
              description="Hãy bắt đầu mua sắm để có đơn hàng đầu tiên."
              actionLabel="Khám phá sản phẩm"
              to="/"
            />
          )
        ) : (
          <div className="bg-white rounded-xl border border-[#e5e7eb] divide-y divide-[#e5e7eb]">
            {filteredOrders.map(order => (
              <OrderListItem
                key={order.id || getOrderCode(order)}
                order={order}
                onCancel={handleCancelOrder}
                cancelling={cancellingId === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  )
}

export default OrdersPage

import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice } from '../utils/formatPrice'
import { orderAPI } from '../services/api'

const NAV_ITEMS = [
  { id: 'profile',    path: '/profile',    label: 'Hồ sơ cá nhân',      icon: 'person' },
  { id: 'orders',     path: '/orders',      label: 'Đơn hàng của tôi',    icon: 'shopping_bag' },
  { id: 'favorites',  path: '/favorites',   label: 'Danh sách yêu thích', icon: 'favorite' },
]

const STATUS_BADGE = {
  pending:    { label: 'Chờ xác nhận',   bg: 'bg-[#FBE9E8]', text: 'text-[#DA291C]' },
  confirmed:  { label: 'Đã xác nhận',     bg: 'bg-[#FBE9E8]', text: 'text-[#DA291C]' },
  processing: { label: 'Đang xử lý',      bg: 'bg-[#FBE9E8]', text: 'text-[#c9392c]' },
  shipped:    { label: 'Đang giao',        bg: 'bg-[#F4F6F9]', text: 'text-[#333F48]' },
  delivered:  { label: 'Đã giao',          bg: 'bg-[#F4F6F9]', text: 'text-[#16A34A]' },
  cancelled:  { label: 'Đã hủy',            bg: 'bg-[#F4F6F9]', text: 'text-[#74869B]' },
  returned:   { label: 'Trả hàng',          bg: 'bg-[#F4F6F9]', text: 'text-[#74869B]' },
}

const PAYMENT_LABEL = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  partially_paid: 'Thanh toán 1 phần',
  refunded: 'Đã hoàn tiền',
}

const PAYMENT_METHOD_LABEL = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank_transfer: 'Chuyển khoản ngân hàng',
  vnpay: 'Thanh toán qua VNPay',
  momo: 'Thanh toán qua MoMo',
  zalopay: 'Thanh toán qua ZaloPay',
  cash: 'Tiền mặt',
}

const SHIPPING_METHOD_LABEL = {
  standard: 'Giao hàng tiêu chuẩn (3-5 ngày)',
  express: 'Giao hàng nhanh (1-2 ngày)',
}

function Sidebar({ activeId }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="lg:w-60 shrink-0 lg:sticky lg:top-[88px] lg:self-start">
      <div className="bg-white rounded-lg border border-[#E5EAF0] p-5 mb-3">
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#E5EAF0]" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#DA291C] flex items-center justify-center
              text-white font-bold text-lg shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-[#333F48] truncate leading-tight">{user?.name || 'Khách hàng'}</p>
            <p className="text-xs text-[#74869B] mt-0.5 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="bg-white rounded-lg border border-[#E5EAF0] p-1.5 flex flex-col gap-0.5">
        {NAV_ITEMS.map(item => {
          const isActive = activeId === item.id
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-[#FBE9E8] text-[#DA291C] font-semibold'
                  : 'text-[#74869B] hover:bg-[#F4F6F9] hover:text-[#333F48]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}

        <div className="h-px bg-[#E5EAF0] my-1" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200
            text-[#74869B] hover:bg-[#FBE9E8] hover:text-[#DA291C] w-full text-left"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm">Đăng xuất</span>
        </button>
      </nav>
    </aside>
  )
}

const OrderDetailPage = () => {
  const { id } = useParams()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login')
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (isAuthenticated && id) fetchOrderDetail()
  }, [isAuthenticated, id])

  const fetchOrderDetail = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await orderAPI.getOrderDetail(id)
      if (res.success) {
        setOrder(res.order)
      } else {
        setError('Không tìm thấy đơn hàng')
      }
    } catch (err) {
      setError('Không thể tải thông tin đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      const res = await orderAPI.cancelOrder(cancelTarget.id, cancelReason)
      if (res.success) {
        setOrder(prev => prev ? { ...prev, status: 'cancelled' } : prev)
        setCancelTarget(null)
        setCancelReason('')
      }
    } catch {} finally {
      setCancelling(false)
    }
  }

  const formatDate = (d) => {
    if (!d) return ''
    try {
      return new Date(d).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    } catch { return d }
  }

  const cleanText = (value) => {
    const text = String(value ?? '').trim()
    if (!text || ['null', 'undefined'].includes(text.toLowerCase())) return ''
    return text
  }

  const joinText = (...parts) => parts.map(cleanText).filter(Boolean).join(', ')

  const formatShippingAddress = (orderData = {}) => {
    const shipping = orderData.shipping_info || {}
    const directAddress = cleanText(shipping.address) || cleanText(orderData.shipping_full_address)
    if (directAddress) return directAddress

    const detail = cleanText(shipping.address_detail) || cleanText(orderData.address_detail)
    if (detail) {
      return joinText(
        detail,
        shipping.ward_name || orderData.shipping_ward_name || orderData.shipping_ward,
        shipping.district_name || orderData.shipping_district_name || orderData.shipping_district,
        shipping.city_name || orderData.shipping_city_name || orderData.shipping_city
      )
    }

    return cleanText(orderData.shipping_address) || 'Không có thông tin'
  }

  const getShippingMethodLabel = (orderData = {}) => {
    const method = cleanText(orderData.shipping_info?.method) || cleanText(orderData.shipping_method)
    return SHIPPING_METHOD_LABEL[method] || method
  }

  const isCancellable = (s) => ['pending', 'confirmed'].includes(s)

  if (authLoading) return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f7]">
      <Header cartCount={0} />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#E5EAF0] border-t-[#DA291C] animate-spin" />
      </div>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f7]">
      <Header cartCount={0} />

      <main className="pt-20 max-w-screen-2xl mx-auto px-6 md:px-12 py-12 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">

          <Sidebar activeId="orders" />

          <div className="flex-1 min-w-0 space-y-8">

            {/* Page Header */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#333F48] leading-none mt-6">
                  {order ? `Chi tiết đơn hàng #${order.order_number || order.id}` : 'Chi tiết đơn hàng'}
                </h1>
                <p className="text-sm text-[#74869B] mt-3">
                  {order ? `Ngày đặt: ${formatDate(order.created_at)}` : ''}
                </p>
              </div>
              <Link
                to="/orders"
                className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#E5EAF0] rounded-lg
                  text-sm font-medium text-[#74869B] hover:text-[#333F48] hover:border-[#ADBCCD]
                  transition-all duration-200"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Quay lại
              </Link>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[#74869B] text-xs font-medium">
              <Link to="/profile" className="hover:text-[#DA291C] transition-colors">Tài khoản</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link to="/orders" className="hover:text-[#DA291C] transition-colors">Đơn hàng của tôi</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#333F48] font-semibold">{order ? order.order_number : 'Chi tiết'}</span>
            </nav>

            {/* Content */}
            {loading ? (
              <div className="bg-white rounded-lg border border-[#E5EAF0] p-12 flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-[#E5EAF0] border-t-[#DA291C] animate-spin" />
                <p className="text-sm text-[#74869B]">Đang tải thông tin đơn hàng...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg border border-[#E5EAF0] p-14 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl text-[#ADBCCD]">error</span>
                </div>
                <p className="text-lg font-bold text-[#333F48] mb-2">{error}</p>
                <p className="text-sm text-[#74869B] mb-6">Vui lòng thử lại sau.</p>
                <Link to="/orders"
                  className="px-7 py-3 bg-[#DA291C] text-white text-sm font-semibold rounded-lg hover:bg-[#b8151b] transition-all">
                  Quay lại đơn hàng
                </Link>
              </div>
            ) : (
              <div className="space-y-6">

                {/* Status Badges */}
                <div className="flex flex-wrap gap-3">
                  {(() => {
                    const sc = STATUS_BADGE[order.status] || {}
                    return (
                      <div className={`px-5 py-3 rounded-lg ${sc.bg || 'bg-[#F4F6F9]'} ${sc.text || 'text-[#74869B]'}`}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Trạng thái đơn hàng</p>
                        <p className="font-bold text-base mt-0.5">{sc.label || order.status}</p>
                      </div>
                    )
                  })()}
                  <div className="px-5 py-3 rounded-lg bg-[#F4F6F9]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#74869B] opacity-60">Thanh toán</p>
                    <p className="font-bold text-base text-[#333F48] mt-0.5">
                      {PAYMENT_LABEL[order.payment_status] || order.payment_status}
                    </p>
                  </div>
                </div>

                {/* Order Info + Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Info */}
                  <div className="bg-white rounded-lg border border-[#E5EAF0] p-6">
                    <h2 className="text-base font-bold text-[#333F48] mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#DA291C]">receipt_long</span>
                      Thông tin đơn hàng
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-sm text-[#74869B] shrink-0">Mã đơn hàng</span>
                        <span className="text-sm font-semibold text-[#333F48] text-right">#{order.order_number}</span>
                      </div>
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-sm text-[#74869B] shrink-0">Ngày đặt</span>
                        <span className="text-sm font-medium text-[#333F48] text-right">{formatDate(order.created_at)}</span>
                      </div>
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-sm text-[#74869B] shrink-0">Phương thức</span>
                        <span className="text-sm font-medium text-[#333F48] text-right">
                          {PAYMENT_METHOD_LABEL[order.payment_method] || order.payment_method}
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-sm text-[#74869B] shrink-0">Vận chuyển</span>
                        <span className="text-sm font-medium text-[#333F48] text-right">
                          {order.shipping_method ? SHIPPING_METHOD_LABEL[order.shipping_method] : 'Tiêu chuẩn (3-5 ngày)'}
                        </span>
                      </div>
                      {order.tracking_number && (
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-sm text-[#74869B] shrink-0">Mã vận đơn</span>
                          <span className="text-sm font-semibold text-[#DA291C] text-right">{order.tracking_number}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recipient Info */}
                  <div className="bg-white rounded-lg border border-[#E5EAF0] p-6">
                    <h2 className="text-base font-bold text-[#333F48] mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#DA291C]">local_shipping</span>
                      Thông tin giao hàng
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-sm text-[#74869B] shrink-0">Người nhận</span>
                        <span className="text-sm font-medium text-[#333F48] text-right">
                          {order.recipient_name || order.customer_name || 'Không có thông tin'}
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-sm text-[#74869B] shrink-0">Điện thoại</span>
                        <span className="text-sm font-medium text-[#333F48] text-right">
                          {order.recipient_phone || order.customer_phone || 'Không có thông tin'}
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-sm text-[#74869B] shrink-0">Địa chỉ</span>
                        <span className="text-sm font-medium text-[#333F48] text-right max-w-[220px]">
                          {formatShippingAddress(order)}
                        </span>
                      </div>
                      {getShippingMethodLabel(order) && (
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-sm text-[#74869B] shrink-0">Vận chuyển</span>
                          <span className="text-sm font-medium text-[#333F48] text-right">
                            {getShippingMethodLabel(order)}
                          </span>
                        </div>
                      )}
                      {order.shipping_note && (
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-sm text-[#74869B] shrink-0">Ghi chú</span>
                          <span className="text-sm font-medium text-[#333F48] text-right max-w-[220px]">{order.shipping_note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg border border-[#E5EAF0] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#DA291C]">inventory_2</span>
                    <h2 className="font-bold text-[#333F48]">Sản phẩm đã đặt ({(order.items || []).length})</h2>
                  </div>
                  <div className="divide-y divide-[#F0F2F5]">
                    {(order.items || []).map(item => (
                      <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#F4F6F9] flex items-center justify-center shrink-0">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-2xl text-[#ADBCCD]">inventory_2</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#333F48] line-clamp-2 leading-snug">
                            {item.product_name}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            {item.color_name && (
                              <span className="text-xs text-[#74869B]">{item.color_name}</span>
                            )}
                            {item.color_name && item.size_name && (
                              <span className="text-[#E5E7EB]">|</span>
                            )}
                            {item.size_name && (
                              <span className="text-xs text-[#74869B]">Size: {item.size_name}</span>
                            )}
                          </div>
                          {item.product_sku && (
                            <p className="text-xs text-[#ADBCCD] mt-1">SKU: {item.product_sku}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-[#333F48]">{formatPrice(item.unit_price)}</p>
                          <p className="text-xs text-[#74869B] mt-0.5">x{item.quantity}</p>
                        </div>
                        <div className="text-right shrink-0 min-w-[80px]">
                          <p className="text-sm font-bold text-[#DA291C]">{formatPrice(item.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg border border-[#E5EAF0] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#DA291C]">payments</span>
                    <h2 className="font-bold text-[#333F48]">Chi tiết thanh toán</h2>
                  </div>
                  <div className="px-6 py-5 space-y-3">
                    <div className="flex justify-between items-center text-sm text-[#74869B]">
                      <span>Tạm tính</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-[#74869B]">
                      <span>Phí vận chuyển</span>
                      <span>
                        {order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : 'Miễn phí'}
                      </span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between items-center text-sm text-[#DA291C]">
                        <span>Giảm giá{order.discount_code ? ` (${order.discount_code})` : ''}</span>
                        <span>-{formatPrice(order.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-[#E5EAF0]">
                      <span className="font-bold text-base text-[#333F48]">Tổng tiền</span>
                      <span className="text-xl font-black text-[#DA291C]">{formatPrice(order.total_price)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {isCancellable(order.status) && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => { setCancelTarget(order); setCancelReason('') }}
                      className="px-6 py-3 bg-[#FBE9E8] text-[#DA291C] text-sm font-semibold rounded-lg
                        hover:bg-[#f8d0ce] transition-all"
                    >
                      Hủy đơn hàng
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Cancel Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-[#333F48]/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-md p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[#FBE9E8] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#DA291C]">warning</span>
              </div>
              <div>
                <h3 className="font-bold text-[#333F48]">Hủy đơn hàng</h3>
                <p className="text-xs text-[#74869B]">#{cancelTarget.order_number}</p>
              </div>
            </div>
            <p className="text-sm text-[#74869B] mb-4">
              Bạn có chắc muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
            </p>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Lý do hủy (tùy chọn)"
              rows={3}
              className="w-full bg-[#f5f6f7] rounded-lg px-4 py-3 text-sm text-[#333F48] placeholder:text-[#ADBCCD]
                border border-[#E5EAF0] focus:outline-none focus:border-[#333F48] focus:ring-1 focus:ring-[#333F48]/10
                transition-all resize-none mb-5"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setCancelTarget(null); setCancelReason('') }}
                className="px-5 py-2.5 bg-[#F4F6F9] text-[#74869B] text-sm font-semibold rounded-lg
                  hover:bg-[#E5EAF0] hover:text-[#333F48] transition-all">
                Đóng
              </button>
              <button onClick={handleCancel} disabled={cancelling}
                className="px-5 py-2.5 bg-[#DA291C] text-white text-sm font-semibold rounded-lg
                  hover:bg-[#b8151b] transition-all disabled:opacity-50">
                {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetailPage

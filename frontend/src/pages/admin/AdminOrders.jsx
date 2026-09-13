import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { useNotifications } from '../../contexts/NotificationContext'
import {
  Search, Eye, Package, Truck, CheckCircle, XCircle, RotateCcw,
  ChevronLeft, ChevronRight, Filter, Phone, MapPin, Clock,
  DollarSign, X, ShoppingBag, CreditCard, AlertCircle, Loader2,
  RotateCcw as ReturnIcon, PackageCheck, Printer
} from 'lucide-react'

const STATUS_CONFIG = {
  pending: {
    label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock, next: ['confirmed', 'cancelled']
  },
  confirmed: {
    label: 'Đã xác nhận', color: 'bg-red-50 text-red-700 border-red-200',
    icon: CheckCircle, next: ['processing', 'cancelled']
  },
  processing: {
    label: 'Đang xử lý', color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Package, next: ['shipped', 'cancelled']
  },
  shipped: {
    label: 'Đang giao', color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Truck, next: ['delivered', 'returned']
  },
  delivered: {
    label: 'Đã giao', color: 'bg-green-50 text-green-700 border-green-200',
    icon: PackageCheck, next: ['returned']
  },
  cancelled: {
    label: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircle, next: []
  },
  returned: {
    label: 'Trả hàng', color: 'bg-gray-100 text-gray-600 border-gray-300',
    icon: ReturnIcon, next: []
  },
}

const PAYMENT_CONFIG = {
  unpaid: { label: 'Chưa thanh toán', color: 'bg-red-50 text-red-600' },
  paid: { label: 'Đã thanh toán', color: 'bg-green-50 text-green-600' },
  partially_paid: { label: 'Thanh toán 1 phần', color: 'bg-red-50 text-[#d71920]' },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-600' },
}

const PAYMENT_METHODS = {
  cod: 'COD', vnpay: 'VNPay', momo: 'MoMo',
  bank_transfer: 'Chuyển khoản', credit_card: 'Thẻ',
}

const SHIPPING_METHODS = {
  standard: 'Giao hàng tiêu chuẩn',
  express: 'Giao hàng nhanh',
}

const NEXT_STATUS_LABELS = {
  pending: { confirmed: 'Xác nhận', cancelled: 'Hủy đơn' },
  confirmed: { processing: 'Xử lý tiếp', cancelled: 'Hủy đơn' },
  processing: { shipped: 'Giao hàng', cancelled: 'Hủy đơn' },
  shipped: { delivered: 'Đã nhận hàng', returned: 'Yêu cầu trả' },
  delivered: { returned: 'Yêu cầu trả' },
}

export default function AdminOrders() {
  const toast = useToast()
  const { pushNotification, fetchNotifications } = useNotifications()

  // List state
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Filters
  const [filters, setFilters] = useState({
    search: '', status: '', payment_status: '',
    date_from: '', date_to: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // Stats
  const [stats, setStats] = useState(null)

  // Detail modal
  const [detailOrder, setDetailOrder] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Cancel modal
  const [showCancel, setShowCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  // Status update
  const [updating, setUpdating] = useState(null)

  // Fetch stats
  useEffect(() => {
    api.get('/admin/orders/stats').then(res => setStats(res.stats)).catch(() => {})
  }, [])

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, ...filters }
      Object.keys(params).forEach(k => !params[k] && delete params[k])
      const res = await api.get('/admin/orders', { params })
      setOrders(res.orders || [])
      setTotalPages(res.totalPages || 1)
      setTotal(res.total || 0)
    } catch (err) {
      console.error('[AdminOrders] Fetch error:', err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  // Auto-fetch when filters change (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders()
    }, 300)
    return () => clearTimeout(timer)
  }, [filters])

  const openDetail = async (order) => {
    setDetailLoading(true)
    setDetailOrder(order)
    try {
      const res = await api.get('/admin/orders/' + order.id)
      setDetailOrder(res.order)
    } catch (err) {
      console.error('Fetch detail error:', err)
    } finally {
      setDetailLoading(false)
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(newStatus)
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus })
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      if (detailOrder?.id === orderId) setDetailOrder({ ...detailOrder, status: newStatus })
      toast.success(`Đã cập nhật trạng thái: ${STATUS_CONFIG[newStatus]?.label}`)
      const order = orders.find(o => o.id === orderId)
      const statusMessages = {
        confirmed: { title: 'Đơn xác nhận', msg: `Đơn #${order?.order_number} đã được xác nhận` },
        processing: { title: 'Đơn đang xử lý', msg: `Đơn #${order?.order_number} đang được xử lý đóng gói` },
        shipped: { title: 'Đơn đang giao', msg: `Đơn #${order?.order_number} đang được giao cho khách` },
        delivered: { title: 'Đơn giao thành công', msg: `Đơn #${order?.order_number} đã giao thành công` },
      }
      if (statusMessages[newStatus]) {
        pushNotification({
          type: `order_${newStatus}`,
          title: statusMessages[newStatus].title,
          message: statusMessages[newStatus].msg,
          link: '/admin/orders',
          icon: newStatus === 'delivered' ? 'package_check' : newStatus === 'shipped' ? 'truck' : 'check_circle',
          color: newStatus === 'delivered' ? 'green' : newStatus === 'cancelled' ? 'red' : 'info',
        })
        fetchNotifications(true)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setUpdating(null)
    }
  }

  const handleCancel = async () => {
    if (!cancellingId) return
    try {
      await api.post(`/admin/orders/${cancellingId}/cancel`, { reason: cancelReason })
      setOrders(orders.map(o => o.id === cancellingId ? { ...o, status: 'cancelled' } : o))
      if (detailOrder?.id === cancellingId) setDetailOrder({ ...detailOrder, status: 'cancelled' })
      toast.success('Đã hủy đơn hàng')
      const order = orders.find(o => o.id === cancellingId)
      pushNotification({
        type: 'order_cancelled',
        title: 'Đơn bị hủy',
        message: `Đơn #${order?.order_number} đã bị hủy${cancelReason ? ': ' + cancelReason : ''}`,
        link: '/admin/orders',
        icon: 'x_circle',
        color: 'red',
        urgent: false,
      })
      fetchNotifications(true)
      setShowCancel(false)
      setCancelReason('')
      setCancellingId(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Hủy đơn thất bại')
    }
  }

  const updatePayment = async (orderId, payment_status) => {
    try {
      await api.put(`/admin/orders/${orderId}/payment`, { payment_status })
      setOrders(orders.map(o => o.id === orderId ? { ...o, payment_status } : o))
      if (detailOrder?.id === orderId) setDetailOrder({ ...detailOrder, payment_status })
      toast.success('Đã cập nhật thanh toán')
      pushNotification({
        type: 'payment_update',
        title: 'Cập nhật thanh toán',
        message: `Đơn #${orders.find(o => o.id === orderId)?.order_number} - Thanh toán: ${PAYMENT_CONFIG[payment_status]?.label}`,
        link: '/admin/orders',
        icon: 'credit_card',
        color: payment_status === 'paid' ? 'green' : 'amber',
      })
      fetchNotifications(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại')
    }
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + 'đ'
  const formatDate = (d) => new Date(d).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const cleanText = (value) => {
    const text = String(value ?? '').trim()
    if (!text || ['null', 'undefined'].includes(text.toLowerCase())) return ''
    return text
  }

  const joinText = (...parts) => parts.map(cleanText).filter(Boolean).join(', ')

  const getOrderCode = (order) => cleanText(order?.order_number) || cleanText(order?.id)

  const formatAddress = (order = {}) => {
    const shipping = order.shipping_info || {}
    const directAddress = cleanText(shipping.address) || cleanText(order.shipping_full_address)
    if (directAddress) return directAddress

    const detail = cleanText(shipping.address_detail) || cleanText(order.address_detail)
    if (detail) {
      return joinText(
        detail,
        shipping.ward_name || order.shipping_ward_name || order.ward_name || order.shipping_ward || order.ward,
        shipping.district_name || order.shipping_district_name || order.district_name || order.shipping_district || order.district,
        shipping.city_name || order.shipping_city_name || order.city_name || order.shipping_city || order.city
      )
    }

    return cleanText(order.shipping_address) || joinText(
      shipping.ward_name || order.shipping_ward_name || order.ward_name || order.shipping_ward || order.ward,
      shipping.district_name || order.shipping_district_name || order.district_name || order.shipping_district || order.district,
      shipping.city_name || order.shipping_city_name || order.city_name || order.shipping_city || order.city
    ) || 'Chưa có địa chỉ giao hàng'
  }

  const getRecipientName = (order = {}) => {
    return cleanText(order.shipping_info?.recipient_name) || cleanText(order.recipient_name) || cleanText(order.customer_name) || 'Khách vãng lai'
  }

  const getRecipientPhone = (order = {}) => {
    return cleanText(order.shipping_info?.recipient_phone) || cleanText(order.recipient_phone) || cleanText(order.customer_phone) || 'Chưa có số điện thoại'
  }

  const getShippingMethod = (order = {}) => {
    const method = cleanText(order.shipping_info?.method) || cleanText(order.shipping_method)
    return SHIPPING_METHODS[method] || method || 'Chưa xác định'
  }

  const statusCount = (s) => stats?.[s] || orders.filter(o => o.status === s).length

  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(STATUS_CONFIG).map(([k, v]) => {
          const Icon = v.icon
          const count = statusCount(k)
          const isActive = filters.status === k
          return (
            <button key={k} onClick={() => {
              setFilters(f => ({ ...f, status: isActive ? '' : k }))
              setPage(1)
            }}
              className={`bg-white rounded-xl p-3.5 text-left border shadow-sm transition-all hover:shadow-md cursor-pointer
                ${isActive ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={14} className={isActive ? 'text-[#d71920]' : 'text-gray-400'} />
                <span className="text-xs text-gray-500 font-medium">{v.label}</span>
              </div>
              <p className={`text-xl font-bold ${isActive ? 'text-[#d71920]' : 'text-gray-900'}`}>{count}</p>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Tìm mã đơn, tên, SĐT, email..."
              value={filters.search}
              onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1) }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
          </div>
          <select value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1) }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-100">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filters.payment_status} onChange={e => { setFilters(f => ({ ...f, payment_status: e.target.value })); setPage(1) }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-100">
            <option value="">Tất cả TT thanh toán</option>
            {Object.entries(PAYMENT_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={16} /> Bộ lọc
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
              <input type="date" value={filters.date_from}
                onChange={e => { setFilters(f => ({ ...f, date_from: e.target.value })); setPage(1) }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
              <input type="date" value={filters.date_to}
                onChange={e => { setFilters(f => ({ ...f, date_to: e.target.value })); setPage(1) }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
            </div>
            <button onClick={() => { setFilters({ search: '', status: '', payment_status: '', date_from: '', date_to: '' }); setPage(1) }}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">{total} đơn hàng</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mã đơn</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ngày đặt</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sản phẩm</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Tổng tiền</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Thanh toán</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>)}</tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-gray-400">
                    <Package size={40} className="mx-auto mb-2 opacity-30" />
                    <p>Không có đơn hàng nào</p>
                  </td>
                </tr>
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-bold text-[#d71920]">{order.order_number}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-800">{order.customer_name || 'Khách vãng lai'}</p>
                    <p className="text-xs text-gray-400">{order.customer_phone}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-gray-600">{order.item_count || 0} sản phẩm</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-900 text-right whitespace-nowrap">{formatPrice(order.total_price)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_CONFIG[order.payment_status]?.color || 'bg-gray-100 text-gray-600'}`}>
                      {PAYMENT_CONFIG[order.payment_status]?.label || order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_CONFIG[order.status]?.color || ''}`}>
                      {STATUS_CONFIG[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openDetail(order)}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#d71920] hover:bg-red-50 transition-colors" title="Xem chi tiết">
                        <Eye size={16} />
                      </button>
                      {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'returned' && (
                        <button onClick={() => { setCancellingId(order.id); setShowCancel(true) }}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Hủy đơn">
                          <XCircle size={16} />
                        </button>
                      )}
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
            <p className="text-sm text-gray-500">Trang {page} / {totalPages} — {total} đơn hàng</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"><ChevronLeft size={16} /></button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                const p = start + i
                return p <= totalPages && (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${page === p ? 'bg-[#d71920] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {p}
                  </button>
                )
              })}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setDetailOrder(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chi tiết đơn hàng #{getOrderCode(detailOrder)}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Ngày đặt: {formatDate(detailOrder.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${STATUS_CONFIG[detailOrder.status]?.color}`}>
                  {STATUS_CONFIG[detailOrder.status]?.label}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PAYMENT_CONFIG[detailOrder.payment_status]?.color}`}>
                  {PAYMENT_CONFIG[detailOrder.payment_status]?.label}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {detailLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 size={32} className="animate-spin text-[#d71920]" /></div>
              ) : (
                <>
                  {/* Customer + Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Người nhận</h4>
                      <p className="font-semibold text-gray-800">{getRecipientName(detailOrder)}</p>
                      {detailOrder.customer_email && <p className="text-sm text-gray-500 mt-1">{detailOrder.customer_email}</p>}
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone size={13} /> {getRecipientPhone(detailOrder)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Địa chỉ giao hàng</h4>
                      <p className="text-sm text-gray-700 flex items-start gap-1">
                        <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                        <span>{formatAddress(detailOrder)}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">Vận chuyển: {getShippingMethod(detailOrder)}</p>
                    </div>
                  </div>

                  {/* Payment + Shipping info */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3.5">
                      <p className="text-xs text-gray-500">Mã đơn</p>
                      <p className="font-semibold text-gray-800 mt-0.5">#{getOrderCode(detailOrder)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3.5">
                      <p className="text-xs text-gray-500">Phương thức thanh toán</p>
                      <p className="font-semibold text-gray-800 mt-0.5">{PAYMENT_METHODS[detailOrder.payment_method] || detailOrder.payment_method}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3.5">
                      <p className="text-xs text-gray-500">Trạng thái thanh toán</p>
                      <p className="font-semibold text-gray-800 mt-0.5">{PAYMENT_CONFIG[detailOrder.payment_status]?.label || detailOrder.payment_status}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3.5">
                      <p className="text-xs text-gray-500">Phương thức vận chuyển</p>
                      <p className="font-semibold text-gray-800 mt-0.5">{getShippingMethod(detailOrder)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3.5">
                      <p className="text-xs text-gray-500">Mã giảm giá</p>
                      <p className="font-semibold text-gray-800 mt-0.5">{detailOrder.discount_code || detailOrder.coupon_code || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3.5">
                      <p className="text-xs text-gray-500">Cập nhật lần cuối</p>
                      <p className="font-semibold text-gray-800 mt-0.5">{formatDate(detailOrder.updated_at)}</p>
                    </div>
                  </div>

                  {/* Payment Status Update */}
                  {detailOrder.payment_status !== 'paid' && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Cập nhật thanh toán</h4>
                      <div className="flex items-center gap-3">
                        <select
                          value={detailOrder.payment_status}
                          onChange={e => updatePayment(detailOrder.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100">
                          <option value="">Chọn trạng thái</option>
                          <option value="paid">Đã thanh toán</option>
                          <option value="unpaid">Chưa thanh toán</option>
                          <option value="partially_paid">Thanh toán 1 phần</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Status Workflow */}
                  {STATUS_CONFIG[detailOrder.status]?.next?.length > 0 && (
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <h4 className="text-sm font-semibold text-red-800 mb-3">Cập nhật trạng thái đơn hàng</h4>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_CONFIG[detailOrder.status]?.next?.map(nextStatus => (
                          <button key={nextStatus} onClick={() => updateStatus(detailOrder.id, nextStatus)}
                            disabled={updating === nextStatus}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2
                              ${nextStatus === 'cancelled'
                                ? 'border-red-200 text-red-600 hover:bg-red-50 bg-white'
                                : 'border-red-200 text-[#d71920] hover:bg-red-100 bg-white'}
                              disabled:opacity-50`}>
                            {updating === nextStatus ? <Loader2 size={14} className="animate-spin" /> : null}
                            {NEXT_STATUS_LABELS[detailOrder.status]?.[nextStatus] || nextStatus}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cancel warning */}
                  {(detailOrder.status === 'shipped' || detailOrder.status === 'delivered') && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
                      <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Lưu ý khi xử lý</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Đơn hàng đang giao hoặc đã giao. Nếu khách hàng chưa nhận được hàng hoặc muốn trả, vui lòng liên hệ trực tiếp với khách trước khi cập nhật trạng thái.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Sản phẩm ({detailOrder.items?.length || 0})</h4>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Sản phẩm</th>
                            <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-500">SL</th>
                            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500">Đơn giá</th>
                            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500">Giảm</th>
                            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500">Tổng</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {detailOrder.items?.map(item => (
                            <tr key={item.id}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  {item.product_image ? (
                                    <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                                  ) : item.primary_image ? (
                                    <img src={item.primary_image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                      <Package size={16} className="text-gray-400" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
                                    <p className="text-xs text-gray-400">
                                      {item.size_name && `Size: ${item.size_name}`}
                                      {item.size_name && item.color_name && ' / '}
                                      {item.color_name && `Màu: ${item.color_name}`}
                                    </p>
                                    {item.product_sku && <p className="text-xs text-gray-400 font-mono">{item.product_sku}</p>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-center text-gray-600">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm text-right text-gray-800">{formatPrice(item.unit_price)}</td>
                              <td className="px-4 py-3 text-sm text-right text-green-600">{item.discount_amount > 0 ? `-${formatPrice(item.discount_amount)}` : '—'}</td>
                              <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatPrice(item.total_price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tạm tính</span>
                      <span>{formatPrice(detailOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Phí vận chuyển</span>
                      <span>{formatPrice(detailOrder.shipping_fee)}</span>
                    </div>
                    {detailOrder.discount_amount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá{detailOrder.discount_code ? ` (${detailOrder.discount_code})` : ''}</span>
                        <span>-{formatPrice(detailOrder.discount_amount)}</span>
                      </div>
                    )}
                    {detailOrder.points_discount > 0 && (
                      <div className="flex justify-between text-sm text-purple-600">
                        <span>Điểm quy đổi</span>
                        <span>-{formatPrice(detailOrder.points_discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Tổng thanh toán</span>
                      <span className="text-[#d71920] text-lg">{formatPrice(detailOrder.total_price)}</span>
                    </div>
                  </div>

                  {/* Activity Log */}
                  {detailOrder.logs?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Lịch sử đơn hàng</h4>
                      <div className="space-y-2">
                        {detailOrder.logs.map((log, idx) => (
                          <div key={log.id || idx} className="flex items-start gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-gray-700">{log.description}</p>
                              <p className="text-xs text-gray-400">{formatDate(log.created_at)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Hủy đơn hàng</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lý do hủy (tùy chọn)</label>
              <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={3}
                placeholder="Nhập lý do hủy đơn hàng..."
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="bg-amber-50 rounded-lg p-3 mb-4 text-xs text-amber-700">
              {orders.find(o => o.id === cancellingId)?.payment_status === 'paid' && (
                <p>Số tiền đã thanh toán sẽ được hoàn lại cho khách hàng.</p>
              )}
              {orders.find(o => o.id === cancellingId)?.points_used > 0 && (
                <p className="mt-1">Điểm tích lũy đã sử dụng sẽ được hoàn lại.</p>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowCancel(false); setCancelReason(''); setCancellingId(null) }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Đóng
              </button>
              <button onClick={handleCancel}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/formatPrice'
import Header from '../components/Header'
import Footer from '../components/Footer'

const OrderSuccessPage = () => {
  const { clearCart, getItemCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  const orderData = location.state || {}
  const {
    order_number: orderNumber = null,
    payment_method: paymentMethod = 'cod',
    recipient_name: recipientName = null,
    recipient_phone: recipientPhone = null,
    shipping_address: shippingAddress = null,
    shipping_method: shippingMethod = 'standard',
    shipping_fee: shippingFee = 0,
    subtotal = 0,
    total = 0,
    items = [],
  } = orderData

  const PAYMENT_LABELS = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    bank: 'Chuyển khoản ngân hàng',
    vnpay: 'Thanh toán qua VNPay',
    momo: 'Thanh toán qua MoMo',
  }

  const SHIPPING_LABELS = {
    standard: 'Giao hàng tiêu chuẩn (3-5 ngày)',
    express: 'Giao hàng nhanh (1-2 ngày)',
  }

  const isPendingPayment = ['bank', 'vnpay', 'momo'].includes(paymentMethod)
  const hasFullData = !!orderNumber

  useEffect(() => {
    setMounted(true)
    if (getItemCount() > 0) {
      clearCart()
    }
  }, [])

  if (!hasFullData) {
    return (
      <div className="min-h-screen bg-[#F4F6F9]">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy thông tin đơn hàng</h2>
            <p className="text-gray-500 mb-6">Vui lòng kiểm tra lại đơn hàng của bạn.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#DA291C] text-white font-semibold rounded-lg hover:bg-[#bf2419] transition-colors">
              Về trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
        {/* Back to shop link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#74869B] hover:text-[#DA291C] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Success Banner */}
        <div className={`text-center mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Icon */}
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-700 delay-100 ${isPendingPayment ? 'bg-yellow-50' : 'bg-green-50'} ${mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            {isPendingPayment ? (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
              </svg>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-[#333F48] mb-3">
            {isPendingPayment ? 'Đang chờ thanh toán' : 'Đặt hàng thành công'}
          </h1>
          <p className="text-[#74869B] text-base lg:text-lg max-w-md mx-auto leading-relaxed">
            {isPendingPayment
              ? `Cảm ơn bạn đã đặt hàng tại Minh Hải. Vui lòng hoàn tất thanh toán để chúng tôi xử lý đơn hàng.`
              : `Cảm ơn bạn đã mua hàng tại Minh Hải. Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.`
            }
          </p>

          {orderNumber && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-5 py-2.5 shadow-sm">
              <span className="text-sm text-[#74869B]">Mã đơn hàng:</span>
              <span className="text-base font-black text-[#333F48] tracking-wide">{orderNumber}</span>
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DA291C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.72 7.96a4 4 0 0 1-8 0M3.36 7.36l-.7 8.4c-.15 1.8-.23 2.71.08 3.4.27.62.73 1.12 1.32 1.44.67.36 1.57.36 3.38.36h8.57c1.81 0 2.72 0 3.38-.36a3 3 0 0 0 1.32-1.44c.31-.69.23-1.6.08-3.4l-.7-8.4c-.13-1.55-.19-2.33-.54-2.92a3 3 0 0 0-1.29-1.19c-.61-.29-1.39-.29-2.95-.29H8.14c-1.56 0-2.34 0-2.95.29a3 3 0 0 0-1.29 1.19c-.35.59-.41 1.37-.54 2.92Z"/>
                </svg>
                <h2 className="font-bold text-[#333F48]">Sản phẩm đã đặt ({items.length})</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((item, idx) => (
                  <div key={idx} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image || 'https://via.placeholder.com/64x80?text=Minh+Hai'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#333F48] line-clamp-2 leading-snug">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {item.color && (
                          <span className="text-xs text-[#74869B]">{item.color}</span>
                        )}
                        {item.color && item.size && (
                          <span className="text-[#E5E7EB]">|</span>
                        )}
                        {item.size && (
                          <span className="text-xs text-[#74869B]">Size: {item.size}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#74869B]">x{item.quantity}</span>
                        <span className="text-sm font-bold text-[#333F48]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            {/* Payment & Delivery */}
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-[#333F48]">Thông tin thanh toán</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm text-[#74869B] flex-shrink-0">Phương thức</span>
                  <span className="text-sm font-medium text-[#333F48] text-right">{PAYMENT_LABELS[paymentMethod] || paymentMethod}</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm text-[#74869B] flex-shrink-0">Vận chuyển</span>
                  <span className="text-sm font-medium text-[#333F48] text-right">{SHIPPING_LABELS[shippingMethod] || shippingMethod}</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm text-[#74869B] flex-shrink-0">Trạng thái</span>
                  <span className={`text-sm font-semibold text-right ${isPendingPayment ? 'text-yellow-600' : 'text-green-600'}`}>
                    {isPendingPayment ? 'Chờ thanh toán' : 'Đã xác nhận'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipient */}
            {(recipientName || shippingAddress) && (
              <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DA291C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <h2 className="font-bold text-[#333F48]">Người nhận</h2>
                </div>
                <div className="px-5 py-4 space-y-2">
                  {recipientName && (
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm text-[#74869B] flex-shrink-0">Họ tên</span>
                      <span className="text-sm font-medium text-[#333F48] text-right">{recipientName}</span>
                    </div>
                  )}
                  {recipientPhone && (
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm text-[#74869B] flex-shrink-0">Điện thoại</span>
                      <span className="text-sm font-medium text-[#333F48] text-right">{recipientPhone}</span>
                    </div>
                  )}
                  {shippingAddress && (
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm text-[#74869B] flex-shrink-0">Địa chỉ</span>
                      <span className="text-sm font-medium text-[#333F48] text-right max-w-[180px]">{shippingAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Total */}
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-[#333F48]">Chi tiết thanh toán</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#74869B]">Giá trị đơn hàng</span>
                  <span className="text-sm font-medium text-[#333F48]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#74869B]">Phí vận chuyển</span>
                  <span className="text-sm font-medium text-[#333F48]">
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-[#333F48]">Tổng tiền</span>
                  <span className="text-lg font-black text-[#DA291C]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`mt-8 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#DA291C] text-white font-bold text-sm rounded-xl hover:bg-[#bf2419] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Tiếp tục mua sắm
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#333F48] font-bold text-sm rounded-xl border-2 border-[#E5E7EB] hover:border-[#333F48] transition-all hover:-translate-y-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.72 7.96a4 4 0 0 1-8 0M3.36 7.36l-.7 8.4c-.15 1.8-.23 2.71.08 3.4.27.62.73 1.12 1.32 1.44.67.36 1.57.36 3.38.36h8.57c1.81 0 2.72 0 3.38-.36a3 3 0 0 0 1.32-1.44c.31-.69.23-1.6.08-3.4l-.7-8.4c-.13-1.55-.19-2.33-.54-2.92a3 3 0 0 0-1.29-1.19c-.61-.29-1.39-.29-2.95-.29H8.14c-1.56 0-2.34 0-2.95.29a3 3 0 0 0-1.29 1.19c-.35.59-.41 1.37-.54 2.92Z"/>
            </svg>
            Xem đơn hàng
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default OrderSuccessPage

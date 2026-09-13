import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'
import {
  formatDate,
  getOrderCode,
  getOrderImage,
  getOrderProductNames,
  getOrderQuantity,
  getOrderTotal,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  getShippingMethodLabel,
  getStatusInfo,
} from './accountUtils'

function OrderListItem({ order, onCancel, onReorder, onRequestReturn, cancelling = false }) {
  const status = getStatusInfo(order.status)
  const code = getOrderCode(order)
  const quantity = getOrderQuantity(order)
  const productNames = getOrderProductNames(order).slice(0, 2)
  const image = getOrderImage(order)
  const detailPath = order.id ? `/orders/${order.id}` : '/orders'
  const shippingMethod = getShippingMethodLabel(order.shipping_method || order.shipping_info?.method)
  const canCancel = order.status === 'pending' && typeof onCancel === 'function'
  const canReorder = order.status === 'delivered' && typeof onReorder === 'function'
  const canRequestReturn = order.status === 'delivered' && typeof onRequestReturn === 'function'

  return (
    <article className="p-4 sm:p-5 hover:bg-[#fcfcfc] transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex gap-4 min-w-0 flex-1">
          <Link to={detailPath} className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg bg-[#f7f7f7] overflow-hidden shrink-0">
            {image ? (
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-[#adbccd]">
                Đạt Hoàng
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link to={detailPath} className="text-sm font-semibold text-[#2f3840] hover:text-[#d71920]">
                {code}
              </Link>
              <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${status.badge}`}>
                {status.label}
              </span>
            </div>

            <p className="text-sm text-[#7d8794] mt-1">
              Ngày đặt: {formatDate(order.created_at) || 'Đang cập nhật'}
            </p>

            <div className="mt-3 space-y-1.5 text-sm">
              <p className="text-[#2f3840] line-clamp-2">
                {productNames.length > 0 ? productNames.join(', ') : 'Sản phẩm trong đơn hàng'}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#7d8794]">
                {quantity > 0 && <span>{quantity} sản phẩm</span>}
                <span>Thanh toán: {getPaymentStatusLabel(order.payment_status)}</span>
                <span>Phương thức: {getPaymentMethodLabel(order.payment_method)}</span>
                {shippingMethod && <span>Vận chuyển: {shippingMethod}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-48 flex lg:flex-col items-center lg:items-end justify-between gap-3">
          <div className="lg:text-right">
            <p className="text-xs text-[#7d8794]">Tổng tiền</p>
            <p className="text-base font-semibold text-[#2f3840] mt-1">
              {formatPrice(getOrderTotal(order)) || '0đ'}
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {canCancel && (
              <button
                type="button"
                onClick={() => onCancel(order)}
                disabled={cancelling}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-[#e5e7eb] text-[#7d8794] hover:border-[#d71920] hover:text-[#d71920] disabled:opacity-50"
              >
                {cancelling ? 'Đang hủy...' : 'Hủy đơn'}
              </button>
            )}
            {canReorder && (
              <button
                type="button"
                onClick={() => onReorder(order)}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-[#e5e7eb] text-[#7d8794] hover:border-[#d71920] hover:text-[#d71920]"
              >
                Mua lại
              </button>
            )}
            {canRequestReturn && (
              <button
                type="button"
                onClick={() => onRequestReturn(order)}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-[#e5e7eb] text-[#7d8794] hover:border-[#d71920] hover:text-[#d71920]"
              >
                Yêu cầu trả hàng
              </button>
            )}
            <Link
              to={detailPath}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-[#d71920] text-white hover:bg-[#c6171e]"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default OrderListItem

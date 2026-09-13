import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'
import EmptyState from './EmptyState'
import {
  formatDate,
  getOrderCode,
  getOrderProductNames,
  getOrderQuantity,
  getOrderTotal,
  getStatusInfo,
} from './accountUtils'

function RecentOrders({ orders = [], limit = 3 }) {
  const recentOrders = orders.slice(0, limit)

  if (recentOrders.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#2f3840]">Đơn hàng gần đây</h2>
        </div>
        <EmptyState
          compact
          title="Bạn chưa có đơn hàng nào"
          description="Hãy bắt đầu mua sắm để có đơn hàng đầu tiên."
          actionLabel="Khám phá sản phẩm"
          to="/"
        />
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[#2f3840]">Đơn hàng gần đây</h2>
        <Link to="/orders" className="text-sm font-medium text-[#d71920] hover:text-[#b9151b]">
          Xem tất cả
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] divide-y divide-[#e5e7eb]">
        {recentOrders.map(order => {
          const status = getStatusInfo(order.status)
          const productNames = getOrderProductNames(order).slice(0, 2)
          const detailPath = order.id ? `/orders/${order.id}` : '/orders'

          return (
            <div key={order.id || getOrderCode(order)} className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#2f3840]">{getOrderCode(order)}</p>
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${status.badge}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#7d8794] mt-1">
                    {formatDate(order.created_at) || 'Chưa cập nhật ngày đặt'}
                    {getOrderQuantity(order) > 0 && (
                      <span className="ml-2">· {getOrderQuantity(order)} sản phẩm</span>
                    )}
                  </p>
                  {productNames.length > 0 && (
                    <p className="text-sm text-[#2f3840] mt-2 line-clamp-1">
                      {productNames.join(', ')}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between sm:justify-start gap-3">
                  <p className="text-base font-semibold text-[#2f3840]">{formatPrice(getOrderTotal(order)) || '0đ'}</p>
                  <Link
                    to={detailPath}
                    className="text-sm font-medium text-[#d71920] hover:text-[#b9151b]"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default RecentOrders

import React from 'react'
import { formatPrice } from '../../utils/formatPrice'
import { getOrderTotal, toNumber } from './accountUtils'

function ProfileSummary({ orders = [], favoriteCount = 0, points }) {
  const processingCount = orders.filter(order =>
    ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)
  ).length

  const totalSpent = orders.reduce((sum, order) => {
    if (order.status === 'delivered' || order.payment_status === 'paid') {
      return sum + getOrderTotal(order)
    }
    return sum
  }, 0)

  const hasPoints = points !== undefined && points !== null && Number.isFinite(Number(points))
  const fourthValue = hasPoints ? toNumber(points).toLocaleString('vi-VN') : formatPrice(totalSpent)
  const fourthLabel = hasPoints ? 'Điểm tích lũy' : 'Tổng chi tiêu'

  const items = [
    { label: 'Tổng đơn hàng', value: orders.length.toLocaleString('vi-VN') },
    { label: 'Đơn đang xử lý', value: processingCount.toLocaleString('vi-VN') },
    { label: 'Sản phẩm yêu thích', value: favoriteCount.toLocaleString('vi-VN') },
    { label: fourthLabel, value: fourthValue || '0đ' },
  ]

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 sm:p-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-[#e5e7eb]">
        {items.map((item, index) => (
          <div key={item.label} className={`py-3 sm:py-2 ${index % 2 === 0 ? 'pr-4' : 'pl-4 lg:pr-4'} lg:px-5 first:lg:pl-0 last:lg:pr-0`}>
            <p className="text-xs text-[#7d8794]">{item.label}</p>
            <p className="text-lg font-semibold text-[#2f3840] mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfileSummary

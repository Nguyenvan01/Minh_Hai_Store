export const cleanText = (value, fallback = '') => {
  const text = String(value ?? '').trim()
  if (!text || ['undefined', 'null', 'nan'].includes(text.toLowerCase())) return fallback
  return text
}

export const toNumber = (value, fallback = 0) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export const joinClean = (...parts) => parts.map(part => cleanText(part)).filter(Boolean).join(', ')

export const formatDate = (value, withTime = false) => {
  const text = cleanText(value)
  if (!text) return ''

  const date = new Date(text)
  if (Number.isNaN(date.getTime())) return text

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
  })
}

export const ORDER_STATUS = {
  pending: { label: 'Chờ xác nhận', badge: 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]' },
  confirmed: { label: 'Đã xác nhận', badge: 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]' },
  processing: { label: 'Đang xử lý', badge: 'bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]' },
  shipped: { label: 'Đang giao', badge: 'bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]' },
  delivered: { label: 'Đã giao', badge: 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' },
  cancelled: { label: 'Đã hủy', badge: 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]' },
  returned: { label: 'Đã trả hàng', badge: 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]' },
}

export const PAYMENT_STATUS = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  partially_paid: 'Thanh toán một phần',
  refunded: 'Đã hoàn tiền',
}

export const PAYMENT_METHOD = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
  vnpay: 'VNPay',
  momo: 'MoMo',
  zalopay: 'ZaloPay',
  cash: 'Tiền mặt',
}

export const SHIPPING_METHOD = {
  standard: 'Giao hàng tiêu chuẩn',
  express: 'Giao hàng nhanh',
}

export const getOrderCode = (order = {}) => cleanText(order.order_number) || cleanText(order.order_code) || cleanText(order.code) || (order.id ? `#${order.id}` : '')

export const getOrderTotal = (order = {}) => toNumber(order.total_price ?? order.total_amount ?? order.total, 0)

export const getOrderQuantity = (order = {}) => toNumber(order.total_items ?? order.total_quantity ?? order.item_count, 0)

export const getOrderProductNames = (order = {}) => {
  if (Array.isArray(order.items)) {
    return order.items.map(item => cleanText(item.product_name || item.name)).filter(Boolean)
  }

  if (Array.isArray(order.products)) {
    return order.products.map(item => cleanText(item.product_name || item.name)).filter(Boolean)
  }

  const namesText = cleanText(order.product_names || order.first_product_names || order.product_name)
  if (!namesText) return []

  return namesText.split('|||').map(name => cleanText(name)).filter(Boolean)
}

export const getOrderImage = (order = {}) => {
  const firstItem = Array.isArray(order.items) ? order.items[0] : null
  return cleanText(order.first_image || order.product_image || firstItem?.product_image || firstItem?.image)
}

export const getStatusInfo = (status) => ORDER_STATUS[cleanText(status)] || {
  label: cleanText(status, 'Đang cập nhật'),
  badge: 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]',
}

export const getPaymentStatusLabel = (status) => PAYMENT_STATUS[cleanText(status)] || cleanText(status, 'Đang cập nhật')

export const getPaymentMethodLabel = (method) => PAYMENT_METHOD[cleanText(method)] || cleanText(method, 'Đang cập nhật')

export const getShippingMethodLabel = (method) => SHIPPING_METHOD[cleanText(method)] || cleanText(method, '')

export const getProductId = (product = {}) => product.product_id || product.id || product.wishlist_id

export const getProductImage = (product = {}) => cleanText(product.image_url || product.image || product.thumbnail || product.product_image)

export const getProductPrice = (product = {}) => toNumber(product.price ?? product.sale_price ?? product.unit_price, 0)

export const getProductComparePrice = (product = {}) => toNumber(product.compare_price ?? product.original_price, 0)

export const getProductName = (product = {}) => cleanText(product.name || product.product_name, 'Sản phẩm')

export const getProductCategory = (product = {}) => cleanText(product.category_name || product.category || product.category_title)

export const getProductSavedDate = (product = {}) => formatDate(product.added_at || product.created_at || product.saved_at)

export const productHasVariants = (product = {}) => {
  if (Array.isArray(product.variants) && product.variants.length > 0) return true
  return toNumber(product.variant_count, 0) > 0 || Boolean(product.has_variants)
}

export const isProductOutOfStock = (product = {}) => {
  if (product.in_stock !== undefined) return !product.in_stock
  if (product.is_active !== undefined && Number(product.is_active) !== 1 && product.is_active !== true) return true
  if (product.stock !== undefined) return toNumber(product.stock, 0) <= 0
  if (product.stock_quantity !== undefined) return toNumber(product.stock_quantity, 0) <= 0
  return false
}

export const genderLabel = (value) => {
  const text = cleanText(value)
  const map = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác',
    nam: 'Nam',
    nu: 'Nữ',
    'nữ': 'Nữ',
  }
  return map[text.toLowerCase()] || text
}

export const memberLevelLabel = (value) => {
  const text = cleanText(value)
  const map = {
    bronze: 'Đồng',
    silver: 'Bạc',
    gold: 'Vàng',
    platinum: 'Bạch kim',
    diamond: 'Kim cương',
  }
  return map[text.toLowerCase()] || text
}

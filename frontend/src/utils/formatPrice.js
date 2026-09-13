export const formatPrice = (price) => {
  if (!price && price !== 0) return ''
  return new Intl.NumberFormat('vi-VN').format(Number(price)) + 'đ'
}

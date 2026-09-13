import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { formatPrice } from '../utils/formatPrice'

const CartPage = () => {
  const { items, updateQuantity, removeItem, getCartTotal, getOriginalTotal, getItemCount } = useCart()
  const toast = useToast()

  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')

  const updateItemQuantity = (id, delta) => {
    const item = items.find(i => i.id === id)
    if (item) {
      const newQuantity = item.quantity + delta
      if (newQuantity >= 1) {
        updateQuantity(id, newQuantity)
      }
    }
  }

  const handleRemoveItem = (id) => {
    removeItem(id)
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
  }

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Vui lòng nhập mã giảm giá')
      return
    }
    // Demo coupon validation
    if (couponCode.toUpperCase() === 'SAVE10') {
      setCouponApplied(true)
      setCouponError('')
    } else {
      setCouponError('Mã giảm giá không hợp lệ')
      setCouponApplied(false)
    }
  }

  const subtotal = getCartTotal()
  const originalTotal = getOriginalTotal()
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const savings = originalTotal - subtotal + discount
  const shipping = subtotal >= 500000 ? 0 : 25000
  const total = subtotal - discount + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartCount={0} />
        <main className="pt-20 min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-8xl text-outline mb-6">shopping_cart</span>
            <h1 className="text-4xl font-headline font-bold tracking-tighter text-on-surface mb-4">Giỏ hàng trống</h1>
            <p className="text-on-surface-variant mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-headline font-semibold rounded-lg hover:bg-primary/90 transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
              Tiếp tục mua sắm
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={getItemCount()} />
      
      <main className="pt-20 w-full px-12 md:px-24 lg:px-40 xl:px-56 2xl:px-72 py-16">
        {/* Page Title */}
        <header className="mb-20">
          <h1 className="text-5xl xl:text-6xl font-headline font-bold tracking-tight text-on-surface mb-5">Giỏ hàng của bạn</h1>
          <p className="text-on-surface-variant font-label uppercase tracking-widest text-sm">
            {getItemCount()} SẢN PHẨM TRONG TÚI
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 xl:gap-48 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="space-y-20">
              {items.map((item) => (
                <div key={item.id} className="group flex flex-col md:flex-row gap-20 pb-20 border-b border-outline-variant/20">
                  {/* Image */}
                  <Link to={`/product/${item.slug}`} className="w-full md:w-[32rem] xl:w-[42rem] aspect-[3/4] overflow-hidden bg-surface-container-low rounded-lg flex-shrink-0">
                    <img 
                      src={item.image || 'https://via.placeholder.com/200x300?text=No+Image'} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </Link>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/product/${item.slug}`}>
                          <h3 className="text-2xl xl:text-3xl font-headline font-semibold text-on-surface mb-2 hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-on-surface-variant text-sm">
                          {item.color && `Màu: ${item.color}`} {item.color && item.size && '|'} {item.size && `Size: ${item.size}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl xl:text-3xl font-headline font-medium text-on-surface block">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {item.compare_price && item.compare_price > item.price && (
                          <span className="text-base xl:text-lg text-on-surface-variant line-through block">
                            {formatPrice(item.compare_price * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-14">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-surface-container-low rounded-full px-8 py-4 gap-10">
                        <button 
                          onClick={() => updateItemQuantity(item.id, -1)}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-3xl"
                        >
                          remove
                        </button>
                        <span className="font-headline font-medium w-8 text-2xl text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateItemQuantity(item.id, 1)}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-3xl"
                        >
                          add
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-3 text-base font-label uppercase tracking-wider"
                      >
                        <span className="material-symbols-outlined text-2xl">delete</span>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-32">
              <Link to="/" className="inline-flex items-center gap-3 text-primary font-headline font-semibold group">
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 bg-surface-container-low rounded-xl p-12 lg:p-16 xl:p-20 sticky top-32">
            <h2 className="text-4xl xl:text-5xl font-headline font-bold text-on-surface mb-10">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-8">
              {/* Subtotal */}
              <div className="flex justify-between text-on-surface-variant">
                <span>Tạm tính</span>
                <span className="text-on-surface font-medium">{formatPrice(originalTotal)}</span>
              </div>

              {/* Savings */}
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Tiết kiệm</span>
                  <span>-{formatPrice(savings)}</span>
                </div>
              )}

              {/* Shipping */}
              <div className="flex justify-between text-on-surface-variant">
                <span>Phí vận chuyển</span>
                <span className="text-on-surface font-medium">
                  {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                </span>
              </div>

              {/* Coupon Input */}
              <div className="pt-8 border-t border-outline-variant/40">
                <label className="block text-sm font-label uppercase tracking-widest text-on-surface-variant mb-4">
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value)
                      setCouponError('')
                    }}
                    placeholder="Nhập mã..."
                    className="flex-1 bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="bg-surface-container-high px-4 py-3 rounded-lg font-headline font-medium text-on-surface hover:bg-surface-container-highest transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-error mt-2">{couponError}</p>
                )}
                {couponApplied && (
                  <p className="text-xs text-green-600 mt-2">Đã áp dụng mã giảm giá SAVE10 - Giảm 10%</p>
                )}
              </div>

              {/* Total */}
              <div className="pt-8 border-t border-outline-variant/40 flex justify-between items-end mb-12">
                <span className="text-2xl font-headline font-medium text-on-surface">Tổng cộng</span>
                <div className="text-right">
                  <p className="text-4xl xl:text-5xl font-headline font-bold text-on-surface">{formatPrice(total)}</p>
                  <p className="text-xs text-on-surface-variant mt-1">Đã bao gồm thuế GTGT</p>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full py-7 rounded-lg text-on-primary font-headline font-bold text-2xl tracking-tight hover:shadow-xl hover:shadow-primary/20 transition-all text-center bg-gradient-to-r from-primary to-primary-container"
              >
                Tiến hành thanh toán
              </Link>

              {/* Free Shipping Notice */}
              {shipping > 0 && (
                <div className="mt-6 p-5 bg-primary-fixed/20 rounded-lg">
                  <p className="text-sm text-on-surface text-center">
                    <span className="material-symbols-outlined text-primary align-middle mr-1">local_shipping</span>
                    Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí vận chuyển
                  </p>
                </div>
              )}

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
                <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Thanh toán an toàn 100%</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CartPage

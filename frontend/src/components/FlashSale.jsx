import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'

const DEMO_END_TIME = (() => {
  const now = new Date()
  now.setHours(now.getHours() + 8)
  now.setMinutes(now.getMinutes() + 30)
  now.setSeconds(now.getSeconds() + 15)
  return now.getTime()
})()

const FlashSale = ({ flashSaleData, saleProductsData }) => {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })
  const [addingId, setAddingId] = useState(null)

  const hasFlashSaleData = flashSaleData?.products && flashSaleData.products.length > 0
  const hasSaleProducts = saleProductsData && saleProductsData.length > 0

  const sampleProducts = [
    {
      id: -1,
      name: 'Heavyweight Tech Tee',
      slug: null,
      price: 199000,
      compare_price: 350000,
      stock: 12,
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
      discount_percent: 43
    },
    {
      id: -2,
      name: 'Architectural Trousers Slim',
      slug: null,
      price: 299000,
      compare_price: 450000,
      stock: 3,
      image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80',
      discount_percent: 33
    },
    {
      id: -3,
      name: 'Cloud-Walk Runner X',
      slug: null,
      price: 399000,
      compare_price: 699000,
      stock: 8,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      discount_percent: 43
    }
  ]

  // Ưu tiên: flash_sale promo > sale_products (sản phẩm giảm giá) > demo
  const products = hasFlashSaleData
    ? flashSaleData.products
    : hasSaleProducts
      ? saleProductsData
      : sampleProducts

  const targetTime = useMemo(() => {
    if (flashSaleData?.timer && (flashSaleData.timer.hours > 0 || flashSaleData.timer.minutes > 0 || flashSaleData.timer.seconds > 0)) {
      const now = new Date()
      return new Date(now.getTime() +
        flashSaleData.timer.hours * 3600000 +
        flashSaleData.timer.minutes * 60000 +
        flashSaleData.timer.seconds * 1000
      ).getTime()
    }
    if (products[0]?.sale_end_time) return products[0].sale_end_time
    return DEMO_END_TIME
  }, [flashSaleData, products])

  useEffect(() => {
    if (!targetTime) return
    const updateTimer = () => {
      const now = new Date().getTime()
      const diff = targetTime - now
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000)
        })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [targetTime])

  const fmt = (n) => n.toString().padStart(2, '0')

  const displayProducts = products.slice(0, 3)

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500)
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    if (addingId === product.id) return
    if (!product.slug) return

    setAddingId(product.id)
    try {
      showToast('Vui lòng chọn size/màu trước khi thêm vào giỏ hàng.', 'success')
      navigate(`/product/${product.slug}`)
    } catch {
      showToast('Không thể thêm vào giỏ hàng', 'error')
    } finally {
      setTimeout(() => setAddingId(null), 500)
    }
  }

  return (
    <section className="py-24 bg-[#0F172A] overflow-hidden relative">
      <div
        className={`fixed top-24 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
          toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border ${
          toast.type === 'success'
            ? 'bg-green-500/90 text-white border-green-400/30'
            : 'bg-red-500/90 text-white border-red-400/30'
        }`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="font-semibold text-sm whitespace-nowrap">{toast.message}</span>
        </div>
      </div>

      {/* Dot pattern */}
      <div className="absolute inset-0 dot-pattern pointer-events-none" />

      {/* Atmospheric blur orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

          {/* Left Column - Title & Timer */}
          <div className="lg:w-[35%] flex flex-col lg:sticky lg:top-24">

            {/* Main Heading */}
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-4 tracking-[-0.02em] leading-[0.88]">
              FLASH
            </h2>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-[-0.02em] leading-[0.88]">
              <span className="gradient-text">SALE</span>
            </h2>

            <p className="text-slate-400 text-sm mt-6 mb-10 max-w-[300px] leading-relaxed">
              Ưu đãi chỉ trong thời gian giới hạn. Nhanh tay kẻo hết!
            </p>

            {/* Countdown Timer */}
            <div className="flex gap-3">
              <TimeBox value={fmt(timeLeft.hours)} label="Giờ" />
              <Sep />
              <TimeBox value={fmt(timeLeft.minutes)} label="Phút" />
              <Sep />
              <TimeBox value={fmt(timeLeft.seconds)} label="Giây" isHighlight />
            </div>
          </div>

          {/* Right Column - Product Grid */}
          <div className="lg:w-[65%]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayProducts.map((product) => {
                const discount = product.discount_percent ||
                  (product.compare_price > product.price
                    ? Math.round((1 - product.price / product.compare_price) * 100)
                    : 0)
                const hasValidSlug = product.slug && product.slug.trim() !== ''

                return (
                  <div
                    key={product.id}
                    className={`${hasValidSlug ? 'group cursor-pointer' : 'cursor-default'}`}
                  >
                    <div
                      className={`bg-[#1e293b] rounded-2xl overflow-hidden border border-slate-700/30 ${hasValidSlug ? 'hover:border-[#4F46E5]/30 hover:shadow-[0_8px_32px_rgba(79,70,229,0.2)] transition-all duration-300 hover:-translate-y-1' : ''}`}
                    >
                      {/* Image */}
                      <div className="relative h-[260px] overflow-hidden bg-slate-800">
                        {hasValidSlug ? (
                          <Link to={`/product/${product.slug}`}>
                            <img
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              src={product.image_url}
                              loading="lazy"
                            />
                          </Link>
                        ) : (
                          <img
                            alt={product.name}
                            className="w-full h-full object-cover"
                            src={product.image_url}
                            loading="lazy"
                          />
                        )}

                        {/* Sale Badge - Gradient with glow */}
                        {discount > 0 && (
                          <div className="absolute top-3 left-3 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-[0_4px_14px_rgba(79,70,229,0.4)]">
                            -{discount}%
                          </div>
                        )}

                        {/* Low Stock */}
                        {product.stock > 0 && product.stock <= 5 && (
                          <div className="absolute top-3 right-3 bg-[#0F172A]/80 backdrop-blur-sm text-white/90 text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                            Chỉ còn {product.stock}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <h4 className={`font-semibold text-white text-sm mb-3 leading-tight line-clamp-2 ${hasValidSlug ? 'group-hover:text-[#7C3AED]' : ''} transition-colors duration-300`}>
                          {product.name}
                        </h4>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xl font-bold gradient-text">
                            {formatPrice(product.price)}
                          </span>
                          {product.compare_price > product.price && (
                            <span className="text-sm text-slate-500 line-through">
                              {formatPrice(product.compare_price)}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart / Demo Badge */}
                        {!hasValidSlug ? (
                          <div className="text-center text-slate-500 text-sm py-2.5 rounded-xl bg-slate-800/50 font-medium">
                            Sắp ra mắt
                          </div>
                        ) : product.stock === 0 ? (
                          <div className="text-center text-slate-500 text-sm py-2.5 rounded-xl bg-slate-800/50">
                            Hết hàng
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={addingId === product.id}
                            className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:shadow-[0_8px_24px_rgba(79,70,229,0.35)] text-white py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70"
                          >
                            {addingId === product.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Đang thêm...
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-base">shopping_cart</span>
                                Thêm vào giỏ
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const TimeBox = ({ value, label, isHighlight = false }) => (
  <div className="flex flex-col items-center">
    <div className={`rounded-xl p-3 w-[70px] h-[75px] flex flex-col items-center justify-center transition-all ${
      isHighlight
        ? 'bg-[#4F46E5]/15 border border-[#4F46E5]/30 shadow-[0_4px_14px_rgba(79,70,229,0.2)]'
        : 'bg-[#1e293b]/80 border border-[#334155]/50'
    }`}>
      <span className={`text-2xl md:text-3xl font-bold font-mono ${isHighlight ? 'gradient-text' : 'text-white'}`}>
        {value}
      </span>
    </div>
    <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mt-2 font-semibold">
      {label}
    </span>
  </div>
)

const Sep = () => (
  <div className="flex flex-col items-center justify-center pt-1">
    <span className="text-xl font-bold text-[#4F46E5]">:</span>
  </div>
)

export default FlashSale

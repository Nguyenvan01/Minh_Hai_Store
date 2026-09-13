import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/formatPrice'

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const { addItem } = useCart()

  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : 0

  const hasDiscount = discount > 0 || product.is_online_exclusive === true

  const images = product.images?.length > 0
    ? product.images
    : product.image_url
      ? [product.image_url]
      : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600']

  const secondImage = images[1] || images[0]

  const colors = product.colors?.length > 0
    ? product.colors
    : product.color_variants?.length > 0
      ? product.color_variants
      : []

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1, null, null)
    if (window.__triggerCartBounce) {
      window.__triggerCartBounce()
    }
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`)
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="bg-white rounded overflow-hidden flex flex-col group transition-shadow duration-300 hover:shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Area */}
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F4F6F9]">
          <img
            src={hovered && images.length > 1 ? secondImage : images[0]}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${!imgLoaded ? 'opacity-0' : 'opacity-100'}`}
          />
          {!imgLoaded && (
            <div className="absolute inset-0 bg-[#f0f0f0] skeleton-shimmer" />
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-[#DA291C] text-white text-[10px] font-bold px-2 py-0.5 animate-badge-pop">
              -{discount}%
            </span>
          )}
        </div>

        {/* Thumbnail + Colors Row */}
        <div className="px-2 pb-2 bg-white">
          {/* Thumbnails */}
          <div className="flex gap-1 mt-2">
            {images.slice(0, 3).map((img, idx) => (
              <button
                key={idx}
                className="w-9 h-12 rounded overflow-hidden border border-[#E5E7EB] hover:border-[#DA291C] transition-colors duration-200 flex-shrink-0"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Color Swatches */}
          {colors.length > 0 && (
            <div className="flex gap-1.5 mt-2 items-center">
              {colors.slice(0, 5).map((color, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border border-[#E5E7EB] overflow-hidden"
                  style={{ backgroundColor: color.color || color.hex || color }}
                  title={color.name || color}
                />
              ))}
              {colors.length > 5 && (
                <span className="text-[10px] text-[#74869B]">+{colors.length - 5}</span>
              )}
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <button
          onClick={handleAddToCart}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DA291C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.002 21H7.72c-1.81 0-2.716 0-3.384-.362a3 3 0 0 1-1.302-1.434C2.71 18.508 2.786 17.606 2.936 15.801L3.636 7.4c.13-1.552.195-2.329.539-2.916a3 3 0 0 1 1.294-.79C6.082 3 6.861 3 8.419 3h7.167c1.558 0 2.337 0 2.951.294a3 3 0 0 1 1.294.79c.344.587.409 1.364.538 2.916L20.821 11.75"/>
            <path d="M16.002 8a4 4 0 0 1-8 0"/>
            <path d="M19.5 16v7M16 19.5h7"/>
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 group-hover:-translate-y-1 transition-transform duration-300">
        <h3 className="font-medium text-xs lg:text-sm text-[#333F48] line-clamp-2 leading-tight mb-auto group-hover:text-[#DA291C] transition-colors duration-200">
          {product.name}
        </h3>
        <div className="mt-2">
          <div className="flex items-center gap-1.5">
            {discount > 0 ? (
              <>
                <span className="font-medium text-[11px] lg:text-sm text-[#74869B] line-through">
                  {formatPrice(product.compare_price)}
                </span>
                <span className="font-bold text-[11px] lg:text-sm text-[#DA291C]">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-bold text-[11px] lg:text-sm text-[#333F48]">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {hasDiscount && (
            <p className="text-[10px] text-[#DA291C] font-semibold mt-0.5">
              Giá độc quyền Online
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

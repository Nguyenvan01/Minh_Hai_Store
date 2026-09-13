import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { formatPrice } from '../utils/formatPrice'

const BestSellerCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : 0

  const images = product.images?.length > 0
    ? product.images
    : [product.image_url || product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400']

  const handleAddToCart = (e) => {
    e.preventDefault()
    toast.info('Vui lòng chọn size/màu trước khi thêm vào giỏ hàng.')
    navigate(`/product/${product.slug}`)
  }

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded bg-[#f3f4f6]" style={{ aspectRatio: '3/4' }}>
          <img
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            src={images[currentImageIndex]}
            loading="lazy"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-[#DA291C] text-white text-[11px] font-bold px-2 py-0.5 rounded">
              -{discount}%
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center transition-colors shadow"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DA291C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.002 21H7.72c-1.81 0-2.716 0-3.384-.362a3 3 0 0 1-1.302-1.434C2.71 18.508 2.786 17.606 2.936 15.801L3.636 7.4c.13-1.552.195-2.329.539-2.916a3 3 0 0 1 1.294-.79C6.082 3 6.861 3 8.419 3h7.167c1.558 0 2.337 0 2.951.294a3 3 0 0 1 1.294.79c.344.587.409 1.364.538 2.916L20.821 11.75"/>
              <path d="M16.002 8a4 4 0 0 1-8 0"/>
              <path d="M19.5 16v7M16 19.5h7"/>
            </svg>
          </button>
        </div>
      </Link>

      {/* Swatches */}
      {images.length > 1 && (
        <div className="flex items-center gap-1 mt-2">
          {images.slice(0, 4).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-8 h-8 overflow-hidden rounded border-2 transition-colors ${
                idx === currentImageIndex ? 'border-[#333F48]' : 'border-transparent'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Product Info */}
      <Link to={`/product/${product.slug}`} className="block">
        <h4 className="font-medium text-sm text-[#333F48] mt-2 line-clamp-2 leading-snug">
          {product.name}
        </h4>
      </Link>
      <div className="flex flex-wrap items-center gap-1 mt-1">
        {discount > 0 ? (
          <>
            <span className="font-medium text-sm text-[#74869B] line-through">
              {formatPrice(product.compare_price)}
            </span>
            <span className="font-bold text-sm text-[#DA291C]">
              {formatPrice(product.price)}
            </span>
            <span className="font-bold text-xs text-[#DA291C]">-{discount}%</span>
          </>
        ) : (
          <span className="font-bold text-sm text-[#333F48]">{formatPrice(product.price)}</span>
        )}
      </div>

      {/* Online Badge */}
      {product.is_online_exclusive && (
        <div className="inline-flex items-center bg-[#FBE9E8] rounded px-1.5 py-0.5 mt-1.5">
          <span className="text-[11px] font-medium text-[#DA291C]">Giá độc quyền Online</span>
        </div>
      )}
    </div>
  )
}

export default BestSellerCard

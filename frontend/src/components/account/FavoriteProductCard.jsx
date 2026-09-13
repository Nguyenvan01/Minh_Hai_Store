import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'
import {
  cleanText,
  getProductCategory,
  getProductComparePrice,
  getProductImage,
  getProductName,
  getProductPrice,
  getProductSavedDate,
  isProductOutOfStock,
} from './accountUtils'

function FavoriteProductCard({ product, onRemove, onAddToCart, removing = false, adding = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const name = getProductName(product)
  const image = getProductImage(product)
  const price = getProductPrice(product)
  const hasPrice = cleanText(product.price ?? product.sale_price ?? product.unit_price) !== ''
  const comparePrice = getProductComparePrice(product)
  const category = getProductCategory(product)
  const savedDate = getProductSavedDate(product)
  const outOfStock = isProductOutOfStock(product)
  const hasDiscount = hasPrice && comparePrice > price && price > 0
  const discountPercent = hasDiscount ? Math.round((1 - price / comparePrice) * 100) : 0
  const slug = cleanText(product.slug)
  const detailPath = slug ? `/product/${slug}` : '/'

  return (
    <article className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden group flex flex-col min-w-0">
      <div className="relative aspect-[3/4] bg-[#f7f7f7] overflow-hidden">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={name}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-semibold tracking-[0.18em] text-[#adbccd]">
            Đạt Hoàng
          </div>
        )}

        {hasDiscount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#d71920] text-white text-xs font-semibold rounded">
            -{discountPercent}%
          </span>
        )}

        <button
          type="button"
          onClick={() => onRemove(product)}
          disabled={removing}
          aria-label="Bỏ yêu thích"
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/95 border border-[#e5e7eb] flex items-center justify-center text-[#d71920] hover:bg-[#fff1f2] disabled:opacity-50"
        >
          {removing ? (
            <span className="w-4 h-4 rounded-full border-2 border-[#e5e7eb] border-t-[#d71920] animate-spin" />
          ) : (
            <Heart size={16} fill="currentColor" strokeWidth={1.8} />
          )}
        </button>

        {outOfStock && (
          <div className="absolute inset-x-0 bottom-0 bg-white/95 px-3 py-2 text-center text-xs font-medium text-[#7d8794]">
            Hết hàng
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="min-h-[92px]">
          {category && (
            <p className="text-xs text-[#7d8794] mb-1 line-clamp-1">{category}</p>
          )}
          <Link to={detailPath} className="block">
            <h3 className="text-sm font-medium text-[#2f3840] line-clamp-2 leading-snug hover:text-[#d71920] transition-colors">
              {name}
            </h3>
          </Link>

          <div className="flex flex-wrap items-baseline gap-2 mt-2">
            <span className="font-semibold text-[#d71920]">{hasPrice ? formatPrice(price) : 'Đang cập nhật'}</span>
            {hasDiscount && (
              <span className="text-xs text-[#adbccd] line-through">{formatPrice(comparePrice)}</span>
            )}
          </div>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7d8794] mb-3">
            <span>{outOfStock ? 'Tạm hết hàng' : 'Còn hàng'}</span>
            {savedDate && <span>Đã lưu {savedDate}</span>}
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Link
              to={detailPath}
              className="w-full py-2.5 text-center text-xs font-medium rounded-lg border border-[#e5e7eb] text-[#2f3840] hover:border-[#d71920] hover:text-[#d71920] transition-colors"
            >
              Xem chi tiết
            </Link>
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={outOfStock || adding}
              className="w-full py-2.5 bg-[#2f3840] text-white text-xs font-medium rounded-lg hover:bg-[#d71920] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default FavoriteProductCard

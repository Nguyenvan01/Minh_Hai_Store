import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'
import {
  getProductId,
  getProductImage,
  getProductName,
  getProductPrice,
  cleanText,
} from './accountUtils'

function RecentFavorites({ products = [], limit = 4 }) {
  const recentProducts = products.slice(0, limit)

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[#2f3840]">Sản phẩm yêu thích gần đây</h2>
        {products.length > 0 && (
          <Link to="/favorites" className="text-sm font-medium text-[#d71920] hover:text-[#b9151b]">
            Xem tất cả
          </Link>
        )}
      </div>

      {recentProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <p className="text-sm text-[#7d8794]">Bạn chưa lưu sản phẩm yêu thích nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {recentProducts.map(product => {
              const id = getProductId(product)
              const image = getProductImage(product)
              const slug = cleanText(product.slug)
              const detailPath = slug ? `/product/${slug}` : '/'
              const hasPrice = cleanText(product.price ?? product.sale_price ?? product.unit_price) !== ''

              return (
                <div key={id || product.wishlist_id || getProductName(product)} className="flex gap-3 min-w-0">
                  <Link to={detailPath} className="w-16 h-20 rounded-lg bg-[#f7f7f7] overflow-hidden shrink-0">
                    {image ? (
                      <img src={image} alt={getProductName(product)} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold text-[#adbccd]">
                        Đạt Hoàng
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={detailPath} className="block">
                      <p className="text-sm font-medium text-[#2f3840] line-clamp-2 hover:text-[#d71920]">
                        {getProductName(product)}
                      </p>
                    </Link>
                    <p className="text-sm font-semibold text-[#d71920] mt-1">
                      {hasPrice ? formatPrice(getProductPrice(product)) : 'Đang cập nhật'}
                    </p>
                    <Link to={detailPath} className="inline-block text-xs font-medium text-[#7d8794] hover:text-[#d71920] mt-2">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export default RecentFavorites

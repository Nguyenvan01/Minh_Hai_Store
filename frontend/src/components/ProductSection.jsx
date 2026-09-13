import React, { useState } from 'react'
import BestSellerCard from './BestSellerCard'

const ProductSection = ({ products, title = "SẢN PHẨM MỚI", seeMoreHref = "/products", tabs, maxProducts }) => {
  const [activeTab, setActiveTab] = useState(0)

  const defaultTabs = ['TẤT CẢ', 'NỮ', 'NAM', 'BÉ GÁI', 'BÉ TRAI']

  const displayTabs = tabs?.length > 0 ? tabs : defaultTabs

  const defaultProducts = [
    {
      id: 1,
      name: 'Quần soóc bé trai',
      slug: 'quan-sooc-be-trai',
      price: 499000,
      image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
      is_online_exclusive: false,
    },
    {
      id: 2,
      name: 'Quần soóc active nam',
      slug: 'quan-sooc-active-nam',
      price: 599000,
      image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
      is_online_exclusive: false,
    },
    {
      id: 3,
      name: 'Áo phông nữ cotton basic dáng suông',
      slug: 'ao-phong-nu-cotton-basic',
      price: 209300,
      compare_price: 299000,
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      is_online_exclusive: true,
    },
    {
      id: 4,
      name: 'Quần soóc nam',
      slug: 'quan-sooc-nam',
      price: 599000,
      image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
      is_online_exclusive: false,
    },
    {
      id: 5,
      name: 'Áo polo nam dáng regular',
      slug: 'ao-polo-nam',
      price: 399000,
      image_url: 'https://images.unsplash.com/photo-1625910513413-5fc4e5e40687?w=400',
      is_online_exclusive: false,
    },
    {
      id: 6,
      name: 'Váy nữ maxi cotton',
      slug: 'vay-nu-maxi',
      price: 699000,
      compare_price: 899000,
      image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',
      is_online_exclusive: true,
    }
  ]

  const displayProducts = (products?.length > 0 ? products : defaultProducts).slice(0, maxProducts)

  return (
    <section className="py-8 lg:py-12">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl lg:text-3xl font-black text-[#333F48]">{title}</h2>
          <a
            href={seeMoreHref}
            className="hidden sm:flex items-center gap-1 font-bold text-sm text-[#333F48] hover:text-[#DA291C] transition-colors"
          >
            Xem thêm
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {displayTabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`h-11 px-4 font-bold text-sm border rounded transition-colors ${
                idx === activeTab
                  ? 'bg-[#333F48] text-white border-[#333F48]'
                  : 'bg-white text-[#333F48] border-[#333F48] hover:bg-[#F4F6F9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="relative">
          <div
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ maxWidth: 'calc(100% - 16px)' }}
          >
            {displayProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[265px]">
                <BestSellerCard product={product} />
              </div>
            ))}
          </div>
          {/* Fade overlay hint to scroll */}
          <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* Mobile See More */}
        <div className="mt-4 sm:hidden">
          <a
            href={seeMoreHref}
            className="flex items-center justify-center gap-1 font-bold text-sm text-[#333F48] hover:text-[#DA291C] transition-colors py-2"
          >
            Xem thêm
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default ProductSection

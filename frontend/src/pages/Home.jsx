import React, { useState, useEffect, useRef } from 'react'
import { homeAPI } from '../services/api'

import Header from '../components/Header'
import Banner from '../components/Banner'
import VoucherSection from '../components/VoucherSection'
import ProductCard from '../components/ProductCard'
import CollectionSection from '../components/CollectionSection'
import CLiveSection from '../components/CLiveSection'
import BlogSection from '../components/BlogSection'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import SkeletonLoader from '../components/SkeletonLoader'
import { useCart } from '../contexts/CartContext'

const Home = () => {
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getItemCount } = useCart()

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await homeAPI.getHomeData()
      if (response && response.success) {
        setHomeData(response.data)
      } else {
        setHomeData({})
      }
    } catch (err) {
      console.error('Error fetching home data:', err)
      setHomeData({})
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartCount={getItemCount()} />
        <SkeletonLoader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={getItemCount()} />

      <main>
        {/* Banner Slider */}
        <Banner banners={homeData?.banners} />

        {/* Vouchers */}
        <VoucherSection vouchers={homeData?.vouchers} />

        {/* Sản phẩm mới */}
        <div className="bg-white">
          <div className="container py-6 lg:py-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl lg:text-3xl font-black text-[#333F48]">SẢN PHẨM MỚI</h2>
              <a href="/products" className="text-xs lg:text-sm text-[#74869B] hover:text-[#DA291C] transition-colors">
                Xem tất cả &rarr;
              </a>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 lg:gap-6 border-b border-[#E5E7EB] mb-6">
              {['TẤT CẢ', 'NỮ', 'NAM', 'BÉ GÁI', 'BÉ TRAI'].map((tab, idx) => (
                <button
                  key={tab}
                  className={`text-xs lg:text-sm font-semibold pb-2 border-b-2 transition-colors ${
                    idx === 0
                      ? 'border-[#DA291C] text-[#DA291C]'
                      : 'border-transparent text-[#74869B] hover:text-[#333F48]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Products Carousel - 4 visible + 1 peek half */}
            <div className="relative group/carousel">
              {/* Prev Button */}
              <button
                onClick={() => {
                  const container = document.getElementById('new-products-scroll')
                  if (container) container.scrollBy({ left: -(container.offsetWidth * 0.5), behavior: 'smooth' })
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center shadow hover:bg-[#F4F6F9] hover:border-[#DA291C] transition-all opacity-0 group-hover/carousel:opacity-100 -translate-x-2 group-hover/carousel:-translate-x-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333F48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>

              {/* Scroll Container */}
              <div
                id="new-products-scroll"
                className="flex gap-3 lg:gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x"
              >
                {(homeData?.featuredProducts || []).map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 snap-start w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(100%/4.5+3.5px)] lg:min-w-[calc(100%/4.5+3.5px)]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Fade overlay */}
              <div className="absolute right-0 top-0 bottom-3 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

              {/* Next Button */}
              <button
                onClick={() => {
                  const container = document.getElementById('new-products-scroll')
                  if (container) container.scrollBy({ left: container.offsetWidth * 0.5, behavior: 'smooth' })
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center shadow hover:bg-[#F4F6F9] hover:border-[#DA291C] transition-all opacity-0 group-hover/carousel:opacity-100 translate-x-2 group-hover/carousel:translate-x-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333F48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* HOMEWEAR Banner + Products */}
        <section className="relative mb-8 lg:mb-12">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '48/17' }}>
            <img
              src="https://2885371169.e.cdneverest.net/Simiconnector/homepage_collection_desktop-140426.webp"
              alt="HOMEWEAR"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            <div className="absolute inset-0 flex flex-col justify-center pb-6 lg:pb-10 pl-8 lg:pl-16 xl:pl-24">
              <h2 className="text-2xl lg:text-4xl xl:text-5xl font-black text-white mb-2 pt-8 lg:pt-16 xl:pt-24">HOMEWEAR</h2>
              <p className="hidden sm:block text-sm font-medium text-white max-w-2xl xl:max-w-3xl leading-relaxed">
                Được kiểm định theo QUY CHUẨN QUỐC TẾ, an toàn tuyệt đối với mọi thành phần trong sản phẩm, trang phục mặc nhà giúp những phút giây ở nhà thêm trọn vẹn.
              </p>
              <a
                href="/homewear"
                className="hidden sm:inline-flex items-center gap-1 bg-white text-[#333F48] font-bold text-sm px-5 py-2.5 rounded mt-3 hover:bg-[#F4F6F9] transition-colors w-fit"
              >
                Khám phá ngay
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Products overlapping the banner */}
          <div className="container">
            <div className="relative -mt-16 lg:-mt-24">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                {(homeData?.homewearProducts || []).slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} showSecondImage />
                ))}
              </div>
              <div className="pt-4 flex justify-center">
                <a href="/products?category=homewear" className="inline-flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#DA291C] hover:underline">
                  Xem tất cả
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* T-SHIRT Banner + Products */}
        <section className="relative mb-8 lg:mb-12">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '48/17' }}>
            <img
              src="https://2885371169.e.cdneverest.net/Simiconnector/T-SHIRT_collection_DESKTOP-310326a.webp"
              alt="T-SHIRT"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            <div className="absolute inset-0 flex flex-col justify-center pb-6 lg:pb-10 pl-8 lg:pl-16 xl:pl-24">
              <h2 className="text-2xl lg:text-4xl xl:text-5xl font-black text-white mb-2">T-SHIRT</h2>
              <p className="hidden sm:block text-sm font-medium text-white max-w-2xl xl:max-w-3xl leading-relaxed">
                Áo thun cho cả gia đình với chất liệu mềm mại, thoáng khí, mang lại cảm giác dễ chịu suốt ngày dài.
              </p>
              <a
                href="/products?category=tshirt"
                className="hidden sm:inline-flex items-center gap-1 bg-white text-[#333F48] font-bold text-sm px-5 py-2.5 rounded mt-3 hover:bg-[#F4F6F9] transition-colors w-fit"
              >
                Khám phá ngay
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="container">
            <div className="relative -mt-16 lg:-mt-24">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                {(homeData?.tshirtProducts || []).slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} showSecondImage />
                ))}
              </div>
              <div className="pt-4 flex justify-center">
                <a href="/products?category=tshirt" className="inline-flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#DA291C] hover:underline">
                  Xem tất cả
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* VÁY Banner + Products */}
        <section className="relative mb-8 lg:mb-12">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '48/17' }}>
            <img
              src="https://2885371169.e.cdneverest.net/Simiconnector/VAY_collection_DESKTOP-310326a.webp"
              alt="VÁY"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            <div className="absolute inset-0 flex flex-col justify-center pb-6 lg:pb-10 pl-8 lg:pl-16 xl:pl-24">
              <h2 className="text-2xl lg:text-4xl xl:text-5xl font-black text-white mb-2">VÁY</h2>
              <p className="hidden sm:block text-sm font-medium text-white max-w-2xl xl:max-w-3xl leading-relaxed">
                Đón mùa mới đầy cảm hứng cùng BST váy đầm trẻ trung. Chất liệu nhẹ mát cùng họa tiết tinh tế tôn lên vẻ ngọt ngào và nữ tính.
              </p>
              <a
                href="/products?category=vay"
                className="hidden sm:inline-flex items-center gap-1 bg-white text-[#333F48] font-bold text-sm px-5 py-2.5 rounded mt-3 hover:bg-[#F4F6F9] transition-colors w-fit"
              >
                Khám phá ngay
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="container">
            <div className="relative -mt-16 lg:-mt-24">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                {(homeData?.vayProducts || []).slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} showSecondImage />
                ))}
              </div>
              <div className="pt-4 flex justify-center">
                <a href="/products?category=vay" className="inline-flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#DA291C] hover:underline">
                  Xem tất cả
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Bộ sưu tập (Collections) */}
        <div className="mb-16 md:mb-20 lg:mb-24">
          <CollectionSection collections={homeData?.collections} />
        </div>

        {/* C-LIVE */}
        <CLiveSection />

        {/* Blog */}
        <div className="bg-white">
          <BlogSection news={homeData?.news} />
        </div>

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}

export default Home

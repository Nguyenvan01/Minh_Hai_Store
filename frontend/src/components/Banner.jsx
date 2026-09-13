import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const Banner = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const timerRef = useRef(null)

  const defaultBanners = [
    {
      id: 1,
      title: 'T-SHIRT',
      subtitle: 'Thoải mái cả ngày dài',
      description: 'Áo thun cho cả gia đình với chất liệu mềm mại, thoáng khí',
      image: 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/2/8/2880x960007052026.webp',
      cta: '/nam',
      alt: 'Banner T-SHIRT'
    },
    {
      id: 2,
      title: 'HOMEWEAR',
      subtitle: 'Thư giãn tại nhà',
      description: 'Trang phục mặc nhà giúp những phút giây ở nhà thêm trọn vẹn',
      image: 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/a/o/aophong-desk-210326.webp',
      cta: '/homewear',
      alt: 'Banner HOMEWEAR'
    },
    {
      id: 3,
      title: 'Banner SS',
      image: 'http://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/s/s/ssnd_topbanner_desktop-020526.webp',
      cta: '/nu',
      alt: 'Banner SS'
    }
  ]

  const bannerList = banners?.length > 0 ? banners : defaultBanners
  const isSsBanner = (banner = {}) => {
    const slug = String(banner.slug || '').toLowerCase()
    const title = String(banner.title || '').toLowerCase()
    const image = String(banner.image || '').toLowerCase()
    return slug === 'banner-ss' || title === 'banner ss' || image.includes('ssnd_topbanner')
  }

  const hasOverlayContent = (banner = {}) => Boolean(banner.title || banner.subtitle || banner.description)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerList.length)
      setAnimKey(k => k + 1)
    }, 4000)
    return () => clearInterval(timerRef.current)
  }, [bannerList.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setAnimKey(k => k + 1)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerList.length)
      setAnimKey(k => k + 1)
    }, 4000)
  }

  const slidePrev = () => {
    setCurrentSlide(prev => (prev - 1 + bannerList.length) % bannerList.length)
    setAnimKey(k => k + 1)
  }

  const slideNext = () => {
    setCurrentSlide(prev => (prev + 1) % bannerList.length)
    setAnimKey(k => k + 1)
  }

  const currentBanner = bannerList[currentSlide] || bannerList[0]

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '21/9', minHeight: '400px', maxHeight: '680px' }}>
      {/* Slides */}
      {bannerList.map((banner, index) => (
        <Link
          key={banner.id || index}
          to={banner.link_url || banner.cta || '/nam'}
          className={`absolute inset-0 block transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-[1]' : 'opacity-0 z-0'}`}
        >
          <img
            src={banner.image}
            alt={banner.alt || `Banner ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Text Overlay - không hiển thị chữ trên banner SS */}
          {index >= 2 && hasOverlayContent(banner) && !isSsBanner(banner) && (
            <div className="absolute inset-0 flex flex-col justify-center pb-10 lg:pb-16 pl-8 lg:pl-16 xl:pl-24">
              <div className="max-w-xl">
                <h2 className="text-2xl lg:text-4xl xl:text-5xl font-black text-white mb-1 drop-shadow-lg">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-base lg:text-xl font-semibold text-white/90 mb-2 drop-shadow">
                    {banner.subtitle}
                  </p>
                )}
                {banner.description && (
                  <p className="hidden sm:block text-sm lg:text-base font-medium text-white/80 max-w-md leading-relaxed drop-shadow">
                    {banner.description}
                  </p>
                )}
                <Link
                  to={banner.cta || '/nam'}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 bg-white text-[#333F48] font-bold text-sm lg:text-base px-5 lg:px-6 py-2.5 lg:py-3 rounded mt-4 lg:mt-5 hover:bg-[#F4F6F9] transition-colors w-fit"
                >
                  Khám phá ngay
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </Link>
      ))}

      {/* Fade overlay bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* Prev Button */}
      <button
        onClick={slidePrev}
        className="absolute top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/50 backdrop-blur-sm transition-all duration-300 z-10 hover:scale-110 active:scale-95"
        style={{ left: '16px' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333F48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={slideNext}
        className="absolute top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/50 backdrop-blur-sm transition-all duration-300 z-10 hover:scale-110 active:scale-95"
        style={{ right: '16px' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333F48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {bannerList.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-400 ${
              index === currentSlide
                ? 'w-8 bg-[#DA291C]'
                : 'w-2 bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Banner

import React from 'react'

const BannerSection = ({ banners }) => {
  const defaultBanners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&q=80',
      title: 'HOMEWEAR',
      description: 'Được kiểm định theo QUY CHUẨN QUỐC TẾ, an toàn tuyệt đối với mọi thành phần trong sản phẩm, trang phục mặc nhà giúp những phút giây ở nhà thêm trọn vẹn.',
      cta: '/homewear',
      ctaText: 'Khám phá ngay'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&q=80',
      title: 'T-SHIRT',
      description: 'Áo thun cho cả gia đình với chất liệu mềm mại, thoáng khí, mang lại cảm giác dễ chịu suốt ngày dài.',
      cta: '/nam',
      ctaText: 'Khám phá ngay'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1600&q=80',
      title: 'VÁY',
      description: 'Đón mùa mới đầy cảm hứng cùng BST váy đầm trẻ trung. Chất liệu nhẹ mát cùng họa tiết tinh tế tôn lên vẻ ngọt ngào và nữ tính.',
      cta: '/nu',
      ctaText: 'Khám phá ngay'
    }
  ]

  const displayBanners = banners?.length > 0 ? banners : defaultBanners

  return (
    <>
      {displayBanners.map(banner => (
        <div key={banner.id} className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', minHeight: '320px', maxHeight: '540px' }}>
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          <div className="absolute inset-0 flex flex-col justify-end pb-12 lg:pb-16" style={{ paddingLeft: '16px' }}>
            <h2 className="text-2xl lg:text-4xl xl:text-5xl font-black text-white mb-2">{banner.title}</h2>
            <p className="hidden sm:block text-sm font-medium text-white max-w-lg">{banner.description}</p>
            <a
              href={banner.cta}
              className="hidden sm:inline-flex items-center gap-1 bg-white text-[#333F48] font-bold text-sm px-5 py-2.5 rounded mt-3 hover:bg-[#F4F6F9] transition-colors w-fit"
            >
              {banner.ctaText}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      ))}
    </>
  )
}

export default BannerSection

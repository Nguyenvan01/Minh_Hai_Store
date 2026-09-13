import React from 'react'
import { Link } from 'react-router-dom'

const CollectionSection = ({ collections }) => {
  const defaultCollections = [
    {
      id: 1,
      title: 'DORAEMON',
      image: 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/d/o/doraemon_bst_homepage-140426.webp',
      cta: '/collections/doraemon',
      ctaText: 'Khám phá'
    },
    {
      id: 2,
      title: 'CANIFA S - TỰ HÀO VIỆT NAM',
      image: 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/c/a/canifas_bst_homepage-140426.webp',
      cta: '/collections/canifa-s',
      ctaText: 'Khám phá'
    },
    {
      id: 3,
      title: 'DISNEY',
      image: 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/d/i/disney_bst_homepage-140426.webp',
      cta: '/collections/disney',
      ctaText: 'Khám phá'
    }
  ]

  const displayCollections = collections?.length > 0 ? collections : defaultCollections

  return (
    <section>
      <div className="grid grid-cols-3 gap-1">
        {displayCollections.map(collection => (
          <div
            key={collection.id}
            className="relative overflow-hidden cursor-pointer group"
            style={{ aspectRatio: '96/127' }}
          >
            <img
              src={collection.image}
              alt={collection.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
            <div className="absolute bottom-0 left-0 p-6 lg:p-10">
              <h3 className="text-lg lg:text-2xl xl:text-3xl font-black text-white mb-4 leading-tight">
                {collection.title}
              </h3>
              <a
                href={collection.cta}
                className="inline-flex items-center gap-2 bg-white text-[#333F48] font-bold text-sm px-5 py-2.5 rounded hover:bg-[#F4F6F9] transition-colors"
              >
                {collection.ctaText}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CollectionSection

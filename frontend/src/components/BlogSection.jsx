import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const cleanText = (value, fallback = '') => {
  const text = String(value ?? '').trim()
  if (!text || ['undefined', 'null', 'nan'].includes(text.toLowerCase())) return fallback
  return text
}

const getArticleImage = (article) => (
  cleanText(article?.thumbnail)
  || cleanText(article?.image_url)
  || cleanText(article?.thumbnail_url)
  || cleanText(article?.cover_image)
  || cleanText(article?.image)
)

function ArticleImage({ article, className }) {
  const [hasError, setHasError] = useState(false)
  const imageSrc = getArticleImage(article)

  if (!imageSrc || hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#f4f6f9] text-xs font-semibold text-[#74869B]`}>
        Không có ảnh
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={cleanText(article?.title, 'Tin tức thời trang')}
      onError={() => setHasError(true)}
      className={className}
    />
  )
}

const formatDate = (dateStr) => {
  const text = cleanText(dateStr)
  if (!text) return ''

  const date = new Date(text)
  if (Number.isNaN(date.getTime())) return ''

  const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  const datePart = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return `${time} ${datePart}`
}

const getArticlePath = (article) => {
  const slug = cleanText(article?.slug)
  return slug ? `/blog/${slug}` : '/blog'
}

const BlogSection = ({ news = [], seeMoreHref = '/blog' }) => {
  const displayNews = Array.isArray(news) ? news.filter(article => cleanText(article?.title)) : []
  const featured = displayNews[0]
  const secondary = displayNews.slice(1, 5)

  return (
    <section className="py-8 lg:py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl lg:text-3xl font-black text-[#333F48]">Tin tức thời trang</h2>
          {displayNews.length > 0 && (
            <Link
              to={seeMoreHref}
              className="hidden sm:flex items-center gap-1 font-bold text-sm text-[#333F48] hover:text-[#DA291C] transition-colors"
            >
              Xem thêm
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>

        {displayNews.length === 0 ? (
          <div className="rounded-xl border border-[#E5EAF0] bg-[#F7F8FA] px-5 py-10 text-center">
            <p className="text-sm font-medium text-[#74869B]">Chưa có tin tức thời trang nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="cursor-pointer group">
              <Link to={getArticlePath(featured)}>
                <div className="overflow-hidden rounded" style={{ aspectRatio: '4/3' }}>
                  <ArticleImage
                    article={featured}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                  />
                </div>
              </Link>
              {cleanText(featured.category) && (
                <p className="font-medium text-sm text-[#DA291C] mt-3">{cleanText(featured.category)}</p>
              )}
              <Link to={getArticlePath(featured)}>
                <h3 className="font-bold text-xl lg:text-2xl text-[#333F48] mt-1 leading-snug line-clamp-2 group-hover:text-[#DA291C] transition-colors">
                  {cleanText(featured.title)}
                </h3>
              </Link>
              {cleanText(featured.summary) && (
                <p className="font-medium text-sm text-[#333F48] mt-2 line-clamp-2">{cleanText(featured.summary)}</p>
              )}
              {formatDate(featured.published_at || featured.created_at) && (
                <p className="font-medium text-sm text-[#74869B] mt-2">{formatDate(featured.published_at || featured.created_at)}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              {secondary.map(article => (
                <div key={article.id || cleanText(article.slug) || cleanText(article.title)} className="cursor-pointer group">
                  <Link to={getArticlePath(article)}>
                    <div className="overflow-hidden rounded" style={{ aspectRatio: '4/3' }}>
                      <ArticleImage
                        article={article}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  {cleanText(article.category) && (
                    <p className="font-medium text-xs text-[#DA291C] mt-2">{cleanText(article.category)}</p>
                  )}
                  <Link to={getArticlePath(article)}>
                    <h4 className="font-bold text-sm text-[#333F48] mt-1 leading-snug line-clamp-2 group-hover:text-[#DA291C] transition-colors">
                      {cleanText(article.title)}
                    </h4>
                  </Link>
                  {formatDate(article.published_at || article.created_at) && (
                    <p className="font-medium text-xs text-[#74869B] mt-1">{formatDate(article.published_at || article.created_at)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogSection

import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import api from '../services/api'

const getArticleImage = (article, fallback = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200') => (
  article?.thumbnail
  || article?.image_url
  || article?.thumbnail_url
  || article?.cover_image
  || article?.image
  || fallback
)

const BlogDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [relatedNews, setRelatedNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [detailRes, newsRes] = await Promise.all([
          api.get(`/news/${slug}`),
          api.get('/news?limit=3')
        ])
        if (detailRes.success) {
          setArticle(detailRes.article)
          const related = (newsRes.news || []).filter(n => n.slug !== slug).slice(0, 3)
          setRelatedNews(related)
        } else {
          navigate('/blog')
        }
      } catch (err) {
        navigate('/blog')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug, navigate])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartCount={0} />
        <main className="pt-20 min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500">Đang tải bài viết...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!article) return null

  const tags = Array.isArray(article.tags)
    ? article.tags
    : typeof article.tags === 'string' && article.tags
      ? article.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={0} />

      <main className="pt-20">
        {/* Back link */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Quay lại Blog
          </Link>
        </div>

        {/* Hero image */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 mt-8">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={getArticleImage(article)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article header */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 mt-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1 bg-[#eaedff] text-[#4450b7] text-xs font-semibold rounded-full uppercase tracking-wider">
                {article.category || 'Tin tức'}
              </span>
              {tags.length > 0 && tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#131b2e] leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 pb-8 border-b border-slate-200">
              <div className="w-10 h-10 rounded-full bg-[#4450b7] flex items-center justify-center text-white font-bold">
                {article.author_name ? article.author_name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div>
                <p className="font-semibold text-sm text-[#131b2e]">{article.author_name || 'Đạt Hoàng Editorial'}</p>
                <p className="text-xs text-slate-500">{formatDate(article.published_at)}</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-slate-400 text-sm">
                <span className="material-symbols-outlined text-base">visibility</span>
                {article.view_count || 0} lượt xem
              </div>
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 mt-10 pb-20">
          <div className="max-w-3xl">
            {/* Summary */}
            {article.summary && (
              <p className="text-lg text-slate-600 leading-relaxed mb-8 italic border-l-4 border-primary pl-5">
                {article.summary}
              </p>
            )}

            {/* Content */}
            <div
              style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#454652',
              }}
            >
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <p className="text-slate-500 italic">
                  Nội dung đang được cập nhật. Vui lòng quay lại sau.
                </p>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-slate-200">
                <span className="text-sm text-slate-500 mr-2">Tags:</span>
                {tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-slate-200">
              <span className="text-sm font-semibold text-[#131b2e]">Chia sẻ:</span>
              <button
                onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                title="Chia sẻ"
              >
                <span className="material-symbols-outlined text-lg text-slate-600">share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related articles */}
        {relatedNews.length > 0 && (
          <section className="py-16 bg-slate-50">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
              <h2 className="text-2xl font-bold text-[#131b2e] mb-8">Bài viết liên quan</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedNews.map(item => (
                  <Link
                    key={item.id}
                    to={`/blog/${item.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={getArticleImage(item, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400')}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#4450b7] block mb-2">
                        {item.category}
                      </span>
                      <h3 className="font-bold text-[#131b2e] line-clamp-2 group-hover:text-[#4450b7] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{item.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}

export default BlogDetailPage

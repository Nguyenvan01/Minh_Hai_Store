import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import api from '../services/api'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getArticleImage = (article) => (
  article?.thumbnail
  || article?.image_url
  || article?.thumbnail_url
  || article?.cover_image
  || article?.image
  || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
)

const BlogPage = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/news?limit=20').then(res => {
      if (res.success) setArticles(res.news || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const categories = ['Tất cả', ...new Set(articles.map(a => a.category).filter(Boolean))]
  const [activeCategory, setActiveCategory] = useState('Tất cả')

  const filteredArticles = activeCategory === 'Tất cả'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={0} />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-slate-900 text-white py-20">
          <div className="max-w-screen-2xl mx-auto px-8 text-center">
            <span className="material-symbols-outlined text-6xl mb-4 text-primary">article</span>
            <h1 className="text-5xl font-bold mb-4">Blog Thời Trang</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Cập nhật xu hướng, chia sẻ phong cách và câu chuyện từ Minh Hải
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-slate-200 sticky top-20 bg-white z-40">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 max-w-screen-2xl mx-auto px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-slate-200 rounded-2xl mb-6" />
                  <div className="h-3 bg-slate-200 rounded w-1/4 mb-3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link key={article.id} to={`/blog/${article.slug}`} className="group block">
                {/* Thumbnail */}
                <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6 bg-slate-100">
                  <img
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getArticleImage(article)}
                    loading="lazy"
                  />
                </div>

                {/* Category */}
                <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-3">
                  {article.category}
                </span>

                {/* Title */}
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h2>

                {/* Summary */}
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {article.summary}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{article.author_name}</span>
                  <span>{formatDate(article.published_at)}</span>
                </div>
              </Link>
            ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
              <p className="text-slate-500">Không có bài viết nào trong danh mục này</p>
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-screen-2xl mx-auto px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Đăng ký nhận tin mới nhất</h2>
            <p className="text-slate-400 mb-8">Theo dõi blog Minh Hải để cập nhật xu hướng và ưu đãi hấp dẫn</p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-primary"
              />
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors">
                Đăng ký
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default BlogPage

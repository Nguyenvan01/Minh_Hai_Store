import { useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import {
  AlertCircle,
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from 'lucide-react'

const emptyPost = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  thumbnail: '',
  is_published: true,
  is_featured: false,
}

const toBool = (value) => value === true || value === 1 || value === '1' || value === 'true'

const getPostImage = (post) => (
  post?.thumbnail
  || post?.image_url
  || post?.thumbnail_url
  || post?.cover_image
  || post?.image
  || ''
)

const normalizePost = (post) => ({
  ...post,
  title: post?.title || '',
  slug: post?.slug || '',
  summary: post?.summary || post?.short_description || '',
  content: post?.content || '',
  thumbnail: getPostImage(post),
  is_published: toBool(post?.is_published ?? post?.is_active ?? post?.status === 'visible'),
  is_featured: toBool(post?.is_featured),
})

const slugify = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function BlogImage({ src, alt, className }) {
  const [hasError, setHasError] = useState(false)
  const imageSrc = String(src || '').trim()

  useEffect(() => {
    setHasError(false)
  }, [imageSrc])

  if (!imageSrc || hasError) {
    return (
      <div className={`${className} flex items-center justify-center border border-gray-200 bg-gray-50 text-xs font-medium text-gray-400`}>
        Không có ảnh
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt || 'Ảnh bài viết'}
      onError={() => setHasError(true)}
      className={className}
    />
  )
}

export default function AdminBlog() {
  const toast = useToast()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [viewPost, setViewPost] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyPost)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/blogs')
      const list = res.blogs || res.posts || res.data?.blogs || res.data?.posts || []
      setPosts(list.map(normalizePost))
    } catch (err) {
      console.error('fetch blogs error:', err)
      setPosts([])
      toast.error('Không thể tải danh sách bài viết.')
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return posts
    return posts.filter((post) => (
      post.title.toLowerCase().includes(keyword)
      || post.slug.toLowerCase().includes(keyword)
      || post.summary.toLowerCase().includes(keyword)
    ))
  }, [posts, search])

  const openCreateForm = () => {
    setEditingPost(null)
    setForm(emptyPost)
    setImageError(false)
    setShowForm(true)
  }

  const openEditForm = (post) => {
    setEditingPost(post)
    setForm(normalizePost(post))
    setImageError(false)
    setShowForm(true)
  }

  const handleTitleChange = (title) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug && editingPost ? prev.slug : slugify(title),
    }))
  }

  const buildPayload = () => ({
    title: form.title.trim(),
    slug: form.slug.trim() || slugify(form.title),
    summary: form.summary.trim(),
    content: form.content,
    thumbnail: form.thumbnail.trim(),
    is_published: form.is_published,
    is_featured: form.is_featured,
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      toast.warning('Tiêu đề bài viết không được để trống.')
      return
    }

    try {
      const payload = buildPayload()
      if (editingPost) {
        const res = await api.put(`/admin/blogs/${editingPost.id}`, payload)
        const updated = normalizePost(res.blog || res.post || payload)
        setPosts((prev) => prev.map((post) => (post.id === editingPost.id ? { ...post, ...updated, id: editingPost.id } : post)))
        toast.success('Cập nhật bài viết thành công.')
      } else {
        const res = await api.post('/admin/blogs', payload)
        const created = normalizePost(res.blog || res.post)
        setPosts((prev) => [created, ...prev])
        toast.success('Thêm bài viết thành công.')
      }
      setShowForm(false)
      setEditingPost(null)
      setForm(emptyPost)
      setImageError(false)
    } catch (err) {
      toast.error('Không thể lưu bài viết. Vui lòng thử lại.')
    }
  }

  const togglePost = async (post, field) => {
    const nextValue = !post[field]
    try {
      const res = await api.put(`/admin/blogs/${post.id}`, { [field]: nextValue })
      const updated = normalizePost(res.blog || res.post || { ...post, [field]: nextValue })
      setPosts((prev) => prev.map((item) => (item.id === post.id ? { ...item, ...updated } : item)))
      toast.success('Cập nhật bài viết thành công.')
    } catch {
      toast.error('Không thể cập nhật bài viết.')
    }
  }

  const deletePost = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/admin/blogs/${deleteTarget.id}`)
      setPosts((prev) => prev.filter((post) => post.id !== deleteTarget.id))
      toast.success('Xóa bài viết thành công.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa bài viết.')
    } finally {
      setDeleteTarget(null)
    }
  }

  const statusBadge = (post) => post.is_published ? (
    <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">Hiển thị</span>
  ) : (
    <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600">Ẩn</span>
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2f3840]">Bài viết</h1>
          <p className="text-sm text-[#7d8794]">Quản lý tin tức và nội dung hiển thị trên website</p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d71920] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <Plus size={18} /> Thêm bài viết
        </button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tiêu đề, slug, mô tả..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#d71920] focus:ring-2 focus:ring-red-50"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Ảnh</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Bài viết</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Slug</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">Trạng thái</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">Nổi bật</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Ngày tạo</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 7 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              )) : filteredPosts.length ? filteredPosts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-red-50/30">
                  <td className="px-5 py-4">
                    <BlogImage src={post.thumbnail} alt={post.title} className="h-14 w-20 rounded-lg object-cover" />
                  </td>
                  <td className="max-w-sm px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#2f3840]">{post.title}</p>
                      {post.is_featured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                          <Star size={12} className="fill-amber-500 text-amber-500" /> Nổi bật
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">{post.summary || 'Chưa có mô tả ngắn'}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{post.slug || '-'}</td>
                  <td className="px-5 py-4 text-center">{statusBadge(post)}</td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => togglePost(post, 'is_featured')} className={post.is_featured ? 'text-amber-500' : 'text-gray-300'} title="Bật/tắt nổi bật">
                      {post.is_featured ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{formatDate(post.created_at || post.published_at)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewPost(post)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-[#d71920]" title="Xem"><Eye size={16} /></button>
                      <button onClick={() => openEditForm(post)} className="rounded-lg p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-700" title="Sửa"><Pencil size={16} /></button>
                      <button onClick={() => togglePost(post, 'is_published')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" title={post.is_published ? 'Ẩn bài viết' : 'Hiển thị bài viết'}>
                        {post.is_published ? <ToggleRight size={17} className="text-green-600" /> : <ToggleLeft size={17} />}
                      </button>
                      <button onClick={() => setDeleteTarget(post)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Xóa"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <FileText size={42} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-semibold text-[#2f3840]">{search ? 'Không tìm thấy bài viết phù hợp.' : 'Chưa có bài viết nào'}</p>
                    <p className="mt-1 text-sm text-gray-500">{search ? 'Hãy thử từ khóa khác.' : 'Nhấn Thêm bài viết để tạo nội dung mới.'}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-[#2f3840]">{editingPost ? 'Sửa bài viết' : 'Thêm bài viết'}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Tiêu đề *</label>
                <input value={form.title} onChange={(event) => handleTitleChange(event.target.value)} className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Slug</label>
                <input value={form.slug} onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })} className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mô tả ngắn</label>
                <textarea rows={3} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Nội dung</label>
                <textarea rows={7} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Ảnh bài viết hoặc URL ảnh</label>
                <input
                  type="text"
                  value={form.thumbnail}
                  onChange={(event) => {
                    setForm({ ...form, thumbnail: event.target.value })
                    setImageError(false)
                  }}
                  placeholder="Dán URL ảnh..."
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50"
                />
                {form.thumbnail && !imageError && (
                  <img
                    src={form.thumbnail}
                    alt="Xem trước ảnh bài viết"
                    onError={() => setImageError(true)}
                    className="mt-3 h-28 w-44 rounded-lg border border-gray-200 object-cover"
                  />
                )}
                {form.thumbnail && imageError && (
                  <p className="mt-2 text-sm text-red-600">Không thể tải ảnh. Vui lòng kiểm tra lại URL.</p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Trạng thái</label>
                  <select value={form.is_published ? 'visible' : 'hidden'} onChange={(event) => setForm({ ...form, is_published: event.target.value === 'visible' })} className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50">
                    <option value="visible">Hiển thị</option>
                    <option value="hidden">Ẩn</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={form.is_featured} onChange={(event) => setForm({ ...form, is_featured: event.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#d71920] focus:ring-red-100" />
                  Bài viết nổi bật
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Hủy</button>
                <button type="submit" className="rounded-lg bg-[#d71920] px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Lưu bài viết</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-[#2f3840]">Chi tiết bài viết</h2>
              <button onClick={() => setViewPost(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4 p-6">
              <BlogImage src={viewPost.thumbnail} alt={viewPost.title} className="h-56 w-full rounded-xl object-cover" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-[#2f3840]">{viewPost.title}</h3>
                  {viewPost.is_featured && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Nổi bật</span>}
                  {statusBadge(viewPost)}
                </div>
                <p className="mt-1 text-sm text-gray-500">Slug: {viewPost.slug || '-'}</p>
              </div>
              <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">{viewPost.summary || 'Chưa có mô tả ngắn'}</p>
              <div className="whitespace-pre-wrap text-sm leading-6 text-gray-700">{viewPost.content || 'Chưa có nội dung'}</div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#2f3840]">Xóa bài viết</h3>
                <p className="text-sm text-gray-500">Bạn có chắc chắn muốn xóa bài viết này không?</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={deletePost} className="rounded-lg bg-[#d71920] px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

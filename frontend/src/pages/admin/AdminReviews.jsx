import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { AlertCircle, CheckCircle, Eye, EyeOff, Search, Star, Trash2, X } from 'lucide-react'

const toBool = (value) => value === true || value === 1 || value === '1' || value === 'true'

const normalizeReview = (review) => {
  const status = review?.status || (toBool(review?.is_active) === false ? 'hidden' : toBool(review?.is_approved) ? 'approved' : 'pending')
  return {
    ...review,
    status,
    rating: Number(review?.rating) || 0,
    user_name: review?.user_name || review?.customer_name || 'Khách hàng',
    product_name: review?.product_name || 'Sản phẩm',
    content: review?.content || '',
  }
}

const statusConfig = {
  pending: { label: 'Chờ duyệt', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  approved: { label: 'Đã duyệt', className: 'border-green-200 bg-green-50 text-green-700' },
  hidden: { label: 'Đã ẩn', className: 'border-gray-200 bg-gray-50 text-gray-600' },
}

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star key={index} size={15} className={index <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
      ))}
      <span className="ml-1 text-xs font-medium text-gray-600">{rating} sao</span>
    </div>
  )
}

export default function AdminReviews() {
  const toast = useToast()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [detail, setDetail] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    fetchReviews()
  }, [statusFilter, ratingFilter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = {
        status: statusFilter === 'all' ? undefined : statusFilter,
        rating: ratingFilter === 'all' ? undefined : ratingFilter,
        limit: 100,
      }
      const res = await api.get('/admin/reviews', { params })
      const list = res.reviews || res.data?.reviews || []
      setReviews(list.map(normalizeReview))
    } catch (err) {
      console.error('fetch reviews error:', err)
      setReviews([])
      toast.error('Không thể tải danh sách đánh giá.')
    } finally {
      setLoading(false)
    }
  }

  const filteredReviews = reviews.filter((review) => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return true
    return (
      review.user_name.toLowerCase().includes(keyword)
      || review.product_name.toLowerCase().includes(keyword)
      || review.content.toLowerCase().includes(keyword)
    )
  })

  const updateStatus = async (review, status) => {
    try {
      const res = await api.put(`/admin/reviews/${review.id}/status`, { status })
      const updated = normalizeReview(res.review || { ...review, status })
      setReviews((prev) => prev.map((item) => (item.id === review.id ? updated : item)))
      if (detail?.id === review.id) setDetail(updated)
      toast.success(status === 'approved' ? 'Duyệt đánh giá thành công.' : 'Ẩn đánh giá thành công.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật trạng thái đánh giá.')
    }
  }

  const deleteReview = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/admin/reviews/${deleteTarget.id}`)
      setReviews((prev) => prev.filter((review) => review.id !== deleteTarget.id))
      if (detail?.id === deleteTarget.id) setDetail(null)
      toast.success('Xóa đánh giá thành công.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa đánh giá.')
    } finally {
      setDeleteTarget(null)
    }
  }

  const renderStatus = (status) => {
    const config = statusConfig[status] || statusConfig.pending
    return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}>{config.label}</span>
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#2f3840]">Đánh giá</h1>
        <p className="text-sm text-[#7d8794]">Duyệt, ẩn và quản lý đánh giá sản phẩm của khách hàng</p>
      </div>

      <div className="grid gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm khách hàng, sản phẩm, nội dung..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="hidden">Đã ẩn</option>
        </select>
        <select
          value={ratingFilter}
          onChange={(event) => setRatingFilter(event.target.value)}
          className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50"
        >
          <option value="all">Tất cả số sao</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Khách hàng</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Sản phẩm</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Số sao</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Nội dung</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Ngày đánh giá</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">Trạng thái</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 7 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              )) : filteredReviews.length ? filteredReviews.map((review) => (
                <tr key={review.id} className="transition-colors hover:bg-red-50/30">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#2f3840]">{review.user_name}</p>
                    <p className="text-xs text-gray-500">{review.user_email || '-'}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{review.product_name}</p>
                    <p className="text-xs text-gray-500">{review.product_sku || '-'}</p>
                  </td>
                  <td className="px-5 py-4"><RatingStars rating={review.rating} /></td>
                  <td className="max-w-xs px-5 py-4 text-sm text-gray-600">
                    <p className="line-clamp-2">{review.content || 'Không có nội dung'}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{formatDate(review.created_at)}</td>
                  <td className="px-5 py-4 text-center">{renderStatus(review.status)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setDetail(review)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-[#d71920]" title="Xem"><Eye size={16} /></button>
                      {review.status !== 'approved' && (
                        <button onClick={() => updateStatus(review, 'approved')} className="rounded-lg p-2 text-gray-500 hover:bg-green-50 hover:text-green-700" title="Duyệt"><CheckCircle size={16} /></button>
                      )}
                      {review.status !== 'hidden' && (
                        <button onClick={() => updateStatus(review, 'hidden')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Ẩn"><EyeOff size={16} /></button>
                      )}
                      <button onClick={() => setDeleteTarget(review)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Xóa"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Star size={42} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-semibold text-[#2f3840]">{search ? 'Không tìm thấy đánh giá phù hợp.' : 'Chưa có đánh giá nào'}</p>
                    <p className="mt-1 text-sm text-gray-500">{search ? 'Hãy thử từ khóa khác hoặc đổi bộ lọc.' : 'Đánh giá mới của khách hàng sẽ hiển thị tại đây.'}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-[#2f3840]">Chi tiết đánh giá</h2>
              <button onClick={() => setDetail(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#2f3840]">{detail.user_name}</p>
                  <p className="text-sm text-gray-500">{detail.user_email || '-'}</p>
                </div>
                {renderStatus(detail.status)}
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Sản phẩm</p>
                <p className="mt-1 font-semibold text-gray-800">{detail.product_name}</p>
                <div className="mt-2"><RatingStars rating={detail.rating} /></div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Nội dung đánh giá</p>
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">{detail.content || 'Không có nội dung'}</p>
              </div>
              <p className="text-sm text-gray-500">Ngày đánh giá: {formatDate(detail.created_at)}</p>
              <div className="flex justify-end gap-2">
                {detail.status !== 'approved' && <button onClick={() => updateStatus(detail, 'approved')} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">Duyệt đánh giá</button>}
                {detail.status !== 'hidden' && <button onClick={() => updateStatus(detail, 'hidden')} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Ẩn đánh giá</button>}
              </div>
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
                <h3 className="font-bold text-[#2f3840]">Xóa đánh giá</h3>
                <p className="text-sm text-gray-500">Bạn có chắc chắn muốn xóa đánh giá này không?</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={deleteReview} className="rounded-lg bg-[#d71920] px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

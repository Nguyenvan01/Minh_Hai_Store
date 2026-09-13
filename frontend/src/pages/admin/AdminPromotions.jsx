import { useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import {
  AlertCircle,
  Calendar,
  Edit,
  Eye,
  Image as ImageIcon,
  Plus,
  RefreshCcw,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react'

const emptyPromotion = {
  title: '',
  slug: '',
  description: '',
  image_url: '',
  discount_type: 'percentage',
  discount_value: '',
  start_date: '',
  end_date: '',
  is_active: true,
  is_featured: false,
}

const discountTypeLabels = {
  percentage: 'Giảm theo phần trăm',
  fixed_amount: 'Giảm theo số tiền',
}

const inputClass = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100'
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()

const slugify = (value) =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toBoolean = (value) => value === true || value === 1 || value === '1' || value === 'true'

const toDateInput = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value.split('T')[0].split(' ')[0]
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

const toLocalDate = (value, endOfDay = false) => {
  const dateValue = toDateInput(value)
  if (!dateValue) return null
  const [year, month, day] = dateValue.split('-').map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  if (endOfDay) date.setHours(23, 59, 59, 999)
  return date
}

const formatDate = (value) => {
  const date = toLocalDate(value)
  if (!date) return 'Chưa đặt'
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

const formatDiscount = (promotion) => {
  const value = Number(promotion.discount_value) || 0
  if (promotion.discount_type === 'percentage') return `${value.toLocaleString('vi-VN')}%`
  return `${value.toLocaleString('vi-VN')}đ`
}

const normalizePromotion = (promotion) => ({
  ...promotion,
  title: promotion.title || promotion.name || '',
  description: promotion.description || '',
  image_url: promotion.image_url || promotion.image || '',
  start_date: promotion.start_date || promotion.valid_from || '',
  end_date: promotion.end_date || promotion.valid_until || '',
  is_active: toBoolean(promotion.is_active),
  is_featured: toBoolean(promotion.is_featured),
})

const getPromotionStatus = (promotion) => {
  if (!toBoolean(promotion.is_active)) {
    return { label: 'Tạm ẩn', className: 'border-gray-200 bg-gray-100 text-gray-700' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = toLocalDate(promotion.start_date)
  const endDate = toLocalDate(promotion.end_date, true)

  if (startDate && today < startDate) {
    return { label: 'Sắp diễn ra', className: 'border-amber-200 bg-amber-50 text-amber-700' }
  }
  if (endDate && today > endDate) {
    return { label: 'Hết hạn', className: 'border-gray-200 bg-gray-50 text-gray-500' }
  }
  return { label: 'Đang hoạt động', className: 'border-red-200 bg-red-50 text-red-700' }
}

const validateForm = (form) => {
  const title = form.title.trim()
  const discountValue = Number(form.discount_value)
  const startDate = toLocalDate(form.start_date)
  const endDate = toLocalDate(form.end_date)

  if (!title) return 'Tên khuyến mãi không được để trống.'
  if (!Number.isFinite(discountValue) || discountValue <= 0) return 'Giá trị giảm phải lớn hơn 0.'
  if (form.discount_type === 'percentage' && discountValue > 100) return 'Giá trị giảm theo phần trăm không được vượt quá 100.'
  if (!startDate) return 'Ngày bắt đầu không được để trống.'
  if (!endDate) return 'Ngày kết thúc không được để trống.'
  if (endDate < startDate) return 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu.'
  return ''
}

export default function AdminPromotions() {
  const toast = useToast()
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyPromotion)
  const [saving, setSaving] = useState(false)
  const [viewTarget, setViewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      setLoadError('')
      const res = await api.get('/admin/promotions')
      const list = Array.isArray(res.promotions) ? res.promotions : []
      setPromotions(list.map(normalizePromotion))
    } catch (err) {
      console.error('Fetch promotions error:', err)
      setPromotions([])
      setLoadError('Không thể tải danh sách khuyến mãi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  const filteredPromotions = useMemo(() => {
    const keyword = normalizeText(searchTerm.trim())
    if (!keyword) return promotions

    return promotions.filter((promotion) => {
      const status = getPromotionStatus(promotion).label
      return normalizeText([
        promotion.title,
        promotion.description,
        status,
        promotion.is_active ? 'Đang hoạt động' : 'Tạm ẩn',
      ].join(' ')).includes(keyword)
    })
  }, [promotions, searchTerm])

  const resetForm = () => {
    setForm(emptyPromotion)
    setEditingId(null)
  }

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (promotion) => {
    setForm({
      title: promotion.title || '',
      slug: promotion.slug || '',
      description: promotion.description || '',
      image_url: promotion.image_url || '',
      discount_type: promotion.discount_type || 'percentage',
      discount_value: promotion.discount_value || '',
      start_date: toDateInput(promotion.start_date),
      end_date: toDateInput(promotion.end_date),
      is_active: toBoolean(promotion.is_active),
      is_featured: toBoolean(promotion.is_featured),
    })
    setEditingId(promotion.id)
    setShowForm(true)
  }

  const handleTitleChange = (value) => {
    setForm((prev) => {
      const previousAutoSlug = slugify(prev.title)
      return {
        ...prev,
        title: value,
        slug: !prev.slug || prev.slug === previousAutoSlug ? slugify(value) : prev.slug,
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validateForm(form)
    if (validationError) {
      toast.error(validationError)
      return
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      slug: slugify(form.slug || form.title) || null,
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      discount_value: Number(form.discount_value),
    }

    try {
      setSaving(true)
      if (editingId) {
        await api.put(`/admin/promotions/${editingId}`, payload)
        toast.success('Cập nhật khuyến mãi thành công.')
      } else {
        await api.post('/admin/promotions', payload)
        toast.success('Thêm khuyến mãi thành công.')
      }
      setShowForm(false)
      resetForm()
      await fetchPromotions()
    } catch (err) {
      console.error('Save promotion error:', err)
      toast.error('Không thể lưu khuyến mãi. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setSaving(false)
    }
  }

  const handleView = async (promotion) => {
    try {
      const res = await api.get(`/admin/promotions/${promotion.id}`)
      setViewTarget(normalizePromotion(res.promotion || promotion))
    } catch (err) {
      console.error('View promotion error:', err)
      toast.error('Không thể tải khuyến mãi.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await api.delete(`/admin/promotions/${deleteTarget.id}`)
      toast.success('Xóa khuyến mãi thành công.')
      setDeleteTarget(null)
      await fetchPromotions()
    } catch (err) {
      console.error('Delete promotion error:', err)
      toast.error('Không thể xóa khuyến mãi.')
    } finally {
      setDeleting(false)
    }
  }

  const renderStatusBadge = (promotion) => {
    const status = getPromotionStatus(promotion)
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}>
        {status.label}
      </span>
    )
  }

  const renderActions = (promotion) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => handleView(promotion)}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        title="Xem"
        aria-label="Xem khuyến mãi"
      >
        <Eye size={16} />
      </button>
      <button
        type="button"
        onClick={() => openEditForm(promotion)}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        title="Sửa"
        aria-label="Sửa khuyến mãi"
      >
        <Edit size={16} />
      </button>
      <button
        type="button"
        onClick={() => setDeleteTarget(promotion)}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        title="Xóa"
        aria-label="Xóa khuyến mãi"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )

  const hasPromotions = promotions.length > 0

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Danh sách khuyến mãi</h2>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <Plus size={18} /> Thêm khuyến mãi
        </button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, mô tả hoặc trạng thái"
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>
          <button
            type="button"
            onClick={fetchPromotions}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCcw size={16} /> Tải lại
          </button>
        </div>

        {loadError && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle size={17} className="mt-0.5 flex-shrink-0" />
            <span>{loadError}</span>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-4 px-5 py-4">
                <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-lg bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/5 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-3/5 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="hidden h-8 w-32 animate-pulse rounded-full bg-gray-100 sm:block" />
              </div>
            ))}
          </div>
        ) : !hasPromotions ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Star size={24} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">Chưa có khuyến mãi nào</h3>
            <p className="mt-1 text-sm text-gray-500">Nhấn “Thêm khuyến mãi” để tạo chương trình khuyến mãi mới.</p>
            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <Plus size={18} /> Thêm khuyến mãi
            </button>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <Search size={24} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">Không tìm thấy khuyến mãi phù hợp.</h3>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Tên khuyến mãi</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Loại giảm</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Giá trị</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Ngày bắt đầu</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Ngày kết thúc</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Trạng thái</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">Nổi bật</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPromotions.map((promotion) => (
                    <tr key={promotion.id} className="transition hover:bg-gray-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400">
                            {promotion.image_url ? (
                              <img src={promotion.image_url} alt={promotion.title} className="h-full w-full object-cover" />
                            ) : (
                              <ImageIcon size={18} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">{promotion.title}</p>
                            <p className="mt-1 line-clamp-2 max-w-md text-sm text-gray-500">{promotion.description || 'Chưa có mô tả'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{discountTypeLabels[promotion.discount_type] || promotion.discount_type}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-red-600">{formatDiscount(promotion)}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{formatDate(promotion.start_date)}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{formatDate(promotion.end_date)}</td>
                      <td className="px-5 py-4">{renderStatusBadge(promotion)}</td>
                      <td className="px-5 py-4 text-center">
                        {promotion.is_featured ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                            <Star size={13} fill="currentColor" /> Có
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Không</span>
                        )}
                      </td>
                      <td className="px-5 py-4">{renderActions(promotion)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-gray-100 lg:hidden">
              {filteredPromotions.map((promotion) => (
                <div key={promotion.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400">
                      {promotion.image_url ? (
                        <img src={promotion.image_url} alt={promotion.title} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon size={20} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900">{promotion.title}</h3>
                        {promotion.is_featured && <Star size={16} className="flex-shrink-0 text-red-600" fill="currentColor" />}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{promotion.description || 'Chưa có mô tả'}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Loại giảm</p>
                      <p className="font-medium text-gray-800">{discountTypeLabels[promotion.discount_type] || promotion.discount_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Giá trị</p>
                      <p className="font-semibold text-red-600">{formatDiscount(promotion)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Bắt đầu</p>
                      <p className="font-medium text-gray-800">{formatDate(promotion.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Kết thúc</p>
                      <p className="font-medium text-gray-800">{formatDate(promotion.end_date)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    {renderStatusBadge(promotion)}
                    {renderActions(promotion)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Sửa khuyến mãi' : 'Thêm khuyến mãi'}</h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm() }}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Tên khuyến mãi <span className="text-red-600">*</span></label>
                  <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Mô tả</label>
                <textarea value={form.description} rows={3} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Ảnh khuyến mãi hoặc URL ảnh</label>
                <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} placeholder="https://..." />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Loại giảm giá</label>
                  <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className={inputClass}>
                    <option value="percentage">Giảm theo phần trăm</option>
                    <option value="fixed_amount">Giảm theo số tiền</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Giá trị giảm <span className="text-red-600">*</span></label>
                  <input type="number" min="0" step="0.01" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Ngày bắt đầu <span className="text-red-600">*</span></label>
                  <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Ngày kết thúc <span className="text-red-600">*</span></label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Trạng thái</label>
                  <select value={form.is_active ? 'active' : 'hidden'} onChange={(e) => setForm({ ...form, is_active: e.target.value === 'active' })} className={inputClass}>
                    <option value="active">Đang hoạt động</option>
                    <option value="hidden">Tạm ẩn</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  Khuyến mãi nổi bật
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm() }}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{viewTarget.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{viewTarget.slug || 'Chưa có slug'}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 px-6 py-5">
              {viewTarget.image_url && (
                <img src={viewTarget.image_url} alt={viewTarget.title} className="h-44 w-full rounded-lg object-cover" />
              )}
              <p className="text-sm leading-6 text-gray-600">{viewTarget.description || 'Chưa có mô tả'}</p>
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">Loại giảm giá</p>
                  <p className="mt-1 font-semibold text-gray-900">{discountTypeLabels[viewTarget.discount_type] || viewTarget.discount_type}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">Giá trị giảm</p>
                  <p className="mt-1 font-semibold text-red-600">{formatDiscount(viewTarget)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={13} /> Ngày bắt đầu</p>
                  <p className="mt-1 font-semibold text-gray-900">{formatDate(viewTarget.start_date)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={13} /> Ngày kết thúc</p>
                  <p className="mt-1 font-semibold text-gray-900">{formatDate(viewTarget.end_date)}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {renderStatusBadge(viewTarget)}
                {viewTarget.is_featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                    <Star size={13} fill="currentColor" /> Nổi bật
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button type="button" onClick={() => setViewTarget(null)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Đóng
              </button>
              <button
                type="button"
                onClick={() => { setViewTarget(null); openEditForm(viewTarget) }}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa</h3>
                <p className="mt-1 text-sm text-gray-500">Bạn có chắc chắn muốn xóa khuyến mãi này không?</p>
              </div>
            </div>
            <p className="mb-5 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">{deleteTarget.title}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                disabled={deleting}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={deleting}
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

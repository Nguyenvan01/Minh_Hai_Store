import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { AlertCircle, CheckCircle, Eye, Mail, RotateCcw, Search, Trash2, X } from 'lucide-react'

const normalizeStatus = (contact) => {
  if (contact?.status === 'processed' || contact?.raw_status === 'closed' || contact?.raw_status === 'replied' || contact?.is_replied) return 'processed'
  return 'pending'
}

const normalizeContact = (contact) => ({
  ...contact,
  status: normalizeStatus(contact),
  name: contact?.name || 'Khách hàng',
  email: contact?.email || '',
  phone: contact?.phone || '',
  subject: contact?.subject || '',
  message: contact?.message || '',
})

const statusConfig = {
  pending: { label: 'Chưa xử lý', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  processed: { label: 'Đã xử lý', className: 'border-green-200 bg-green-50 text-green-700' },
}

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminContacts() {
  const toast = useToast()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detail, setDetail] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    fetchContacts()
  }, [statusFilter])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/contacts', { params: { status: statusFilter === 'all' ? undefined : statusFilter } })
      const list = res.contacts || res.data?.contacts || []
      setContacts(list.map(normalizeContact))
    } catch (err) {
      console.error('fetch contacts error:', err)
      setContacts([])
      toast.error('Không thể tải danh sách liên hệ.')
    } finally {
      setLoading(false)
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return true
    return (
      contact.name.toLowerCase().includes(keyword)
      || contact.email.toLowerCase().includes(keyword)
      || contact.phone.toLowerCase().includes(keyword)
      || contact.message.toLowerCase().includes(keyword)
      || contact.subject.toLowerCase().includes(keyword)
    )
  })

  const updateStatus = async (contact, status) => {
    try {
      const res = await api.put(`/admin/contacts/${contact.id}/status`, { status })
      const updated = normalizeContact(res.contact || { ...contact, status })
      setContacts((prev) => prev.map((item) => (item.id === contact.id ? updated : item)))
      if (detail?.id === contact.id) setDetail(updated)
      toast.success('Cập nhật trạng thái liên hệ thành công.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật trạng thái liên hệ.')
    }
  }

  const deleteContact = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/admin/contacts/${deleteTarget.id}`)
      setContacts((prev) => prev.filter((contact) => contact.id !== deleteTarget.id))
      if (detail?.id === deleteTarget.id) setDetail(null)
      toast.success('Xóa liên hệ thành công.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa liên hệ.')
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
        <h1 className="text-xl font-bold text-[#2f3840]">Liên hệ</h1>
        <p className="text-sm text-[#7d8794]">Quản lý liên hệ và góp ý từ khách hàng</p>
      </div>

      <div className="grid gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_190px]">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên, email, số điện thoại, nội dung..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chưa xử lý</option>
          <option value="processed">Đã xử lý</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Họ tên</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Email</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Số điện thoại</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Chủ đề</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Nội dung</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">Ngày gửi</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">Trạng thái</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 8 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-100" /></td>
                  ))}
                </tr>
              )) : filteredContacts.length ? filteredContacts.map((contact) => (
                <tr key={contact.id} className="transition-colors hover:bg-red-50/30">
                  <td className="px-5 py-4 font-semibold text-[#2f3840]">{contact.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{contact.email || '-'}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{contact.phone || '-'}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-800">{contact.subject || 'Không có chủ đề'}</td>
                  <td className="max-w-xs px-5 py-4 text-sm text-gray-600"><p className="line-clamp-2">{contact.message}</p></td>
                  <td className="px-5 py-4 text-sm text-gray-500">{formatDate(contact.created_at)}</td>
                  <td className="px-5 py-4 text-center">{renderStatus(contact.status)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setDetail(contact)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-[#d71920]" title="Xem"><Eye size={16} /></button>
                      {contact.status === 'pending' ? (
                        <button onClick={() => updateStatus(contact, 'processed')} className="rounded-lg p-2 text-gray-500 hover:bg-green-50 hover:text-green-700" title="Đánh dấu đã xử lý"><CheckCircle size={16} /></button>
                      ) : (
                        <button onClick={() => updateStatus(contact, 'pending')} className="rounded-lg p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-700" title="Đánh dấu chưa xử lý"><RotateCcw size={16} /></button>
                      )}
                      <button onClick={() => setDeleteTarget(contact)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Xóa"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <Mail size={42} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-semibold text-[#2f3840]">{search ? 'Không tìm thấy liên hệ phù hợp.' : 'Chưa có liên hệ nào'}</p>
                    <p className="mt-1 text-sm text-gray-500">{search ? 'Hãy thử từ khóa khác hoặc đổi bộ lọc.' : 'Liên hệ mới từ khách hàng sẽ hiển thị tại đây.'}</p>
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
              <h2 className="text-lg font-bold text-[#2f3840]">Chi tiết liên hệ</h2>
              <button onClick={() => setDetail(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#2f3840]">{detail.name}</p>
                  <p className="text-sm text-gray-500">{detail.email || '-'} • {detail.phone || '-'}</p>
                </div>
                {renderStatus(detail.status)}
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Chủ đề</p>
                <p className="mt-1 font-semibold text-gray-800">{detail.subject || 'Không có chủ đề'}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">{detail.message}</p>
              </div>
              <p className="text-sm text-gray-500">Ngày gửi: {formatDate(detail.created_at)}</p>
              <div className="flex justify-end gap-2">
                {detail.status === 'pending' ? (
                  <button onClick={() => updateStatus(detail, 'processed')} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">Đánh dấu đã xử lý</button>
                ) : (
                  <button onClick={() => updateStatus(detail, 'pending')} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Đánh dấu chưa xử lý</button>
                )}
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
                <h3 className="font-bold text-[#2f3840]">Xóa liên hệ</h3>
                <p className="text-sm text-gray-500">Bạn có chắc chắn muốn xóa liên hệ này không?</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={deleteContact} className="rounded-lg bg-[#d71920] px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

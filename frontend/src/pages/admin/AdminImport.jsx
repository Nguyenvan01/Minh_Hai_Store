import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Package,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  Truck,
  X,
  XCircle,
} from 'lucide-react'

const STATUS_CONFIG = {
  draft: { label: 'Nháp', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: Clock },
  processing: { label: 'Đang xử lý', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: Truck },
  partial_received: { label: 'Đã nhận một phần', className: 'bg-purple-50 text-purple-700 border-purple-200', icon: Package },
  received: { label: 'Đã nhận đủ', className: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', className: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
}

const PAYMENT_CONFIG = {
  unpaid: { label: 'Chưa thanh toán', className: 'text-red-600' },
  partial: { label: 'Thanh toán một phần', className: 'text-amber-600' },
  paid: { label: 'Đã thanh toán', className: 'text-green-600' },
}

const PAYMENT_METHOD_LABELS = {
  cash: 'Tiền mặt',
  bank_transfer: 'Chuyển khoản',
}

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = () => ({
  supplier_id: '',
  warehouse_id: '',
  order_date: today(),
  expected_date: '',
  note: '',
  discount_amount: '',
  shipping_fee: '',
  paid_amount: '',
  payment_status: 'unpaid',
  payment_method: 'cash',
})

const emptyItem = () => ({
  product_id: '',
  variant_id: '',
  sku: '',
  product_name: '',
  variant_name: '',
  quantity_ordered: 1,
  unit_cost: 0,
  note: '',
})

const formatCurrency = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)}đ`

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()

const inputClass = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-[#2f3840] outline-none transition focus:border-[#d71920] focus:ring-2 focus:ring-red-100'
const labelClass = 'mb-1.5 block text-sm font-medium text-[#2f3840]'

export default function AdminImport() {
  const toast = useToast()
  const [imports, setImports] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [metaLoading, setMetaLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')

  const [selectedImport, setSelectedImport] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [formData, setFormData] = useState(emptyForm())
  const [items, setItems] = useState([emptyItem()])
  const [receiveItems, setReceiveItems] = useState([])
  const [saving, setSaving] = useState(false)
  const [receiving, setReceiving] = useState(false)
  const [cancellingId, setCancellingId] = useState(null)

  const productMap = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[String(product.id)] = product
      return acc
    }, {})
  }, [products])

  const fetchImports = useCallback(async () => {
    try {
      setLoading(true)
      const params = {}
      if (searchTerm.trim()) params.search = searchTerm.trim()
      if (statusFilter) params.status = statusFilter
      if (supplierFilter) params.supplier_id = supplierFilter
      const res = await api.get('/admin/imports', { params })
      setImports(res.imports || res.orders || [])
    } catch (err) {
      console.error('Fetch imports error:', err)
      toast.error('Không thể tải danh sách đơn nhập hàng.')
      setImports([])
    } finally {
      setLoading(false)
    }
  }, [searchTerm, statusFilter, supplierFilter, toast])

  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await api.get('/admin/suppliers')
      setSuppliers(res.suppliers || [])
    } catch (err) {
      console.error('Fetch suppliers error:', err)
      setSuppliers([])
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      setMetaLoading(true)
      const [productsRes, warehousesRes] = await Promise.all([
        api.get('/admin/products/options'),
        api.get('/admin/warehouses'),
      ])
      setProducts(productsRes.products || [])
      setWarehouses(warehousesRes.warehouses || [])
    } catch (err) {
      console.error('Fetch import meta error:', err)
      toast.error('Không thể tải dữ liệu tạo đơn nhập hàng.')
    } finally {
      setMetaLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSuppliers()
    fetchProducts()
  }, [fetchSuppliers, fetchProducts])

  useEffect(() => {
    fetchImports()
  }, [fetchImports])

  const stats = useMemo(() => {
    return {
      total: imports.length,
      received: imports.filter((item) => item.status === 'received').length,
      processing: imports.filter((item) => ['draft', 'processing', 'partial_received'].includes(item.status)).length,
      totalValue: imports.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0),
    }
  }, [imports])

  const calculateTotal = useCallback(() => {
    const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity_ordered) || 0), 0)
    const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity_ordered) || 0) * (Number(item.unit_cost) || 0), 0)
    const discount = Math.max(0, Number(formData.discount_amount) || 0)
    const shipping = Math.max(0, Number(formData.shipping_fee) || 0)
    const total = Math.max(0, subtotal - discount + shipping)
    return { totalQuantity, subtotal, discount, shipping, total }
  }, [formData.discount_amount, formData.shipping_fee, items])

  const totals = calculateTotal()

  const handleSearch = () => {
    fetchImports()
  }

  const openCreateModal = () => {
    setFormData(emptyForm())
    setItems([emptyItem()])
    setShowCreateModal(true)
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    setFormData(emptyForm())
    setItems([emptyItem()])
  }

  const updateItem = (index, patch) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)))
  }

  const handleProductChange = (index, productId) => {
    const product = productMap[String(productId)]
    if (!product) {
      updateItem(index, emptyItem())
      return
    }
    updateItem(index, {
      product_id: String(product.id),
      product_name: product.name,
      variant_id: '',
      variant_name: '',
      sku: product.sku || '',
      unit_cost: Number(product.cost_price) || 0,
    })
  }

  const handleVariantChange = (index, variantId) => {
    const item = items[index]
    const product = productMap[String(item.product_id)]
    const variant = product?.variants?.find((variantItem) => String(variantItem.id) === String(variantId))
    updateItem(index, {
      variant_id: variantId,
      variant_name: variant?.name || '',
      sku: variant?.sku || product?.sku || '',
    })
  }

  const validateForm = () => {
    if (!formData.supplier_id) return 'Vui lòng chọn nhà cung cấp.'
    if (!formData.warehouse_id) return 'Vui lòng chọn kho nhận.'

    const validItems = items.filter((item) => item.product_id)
    if (validItems.length === 0) return 'Vui lòng thêm ít nhất một sản phẩm nhập.'

    const seen = new Set()
    for (const item of validItems) {
      const product = productMap[String(item.product_id)]
      if (product?.variants?.length && !item.variant_id) return 'Vui lòng chọn biến thể cho sản phẩm có biến thể.'
      if ((Number(item.quantity_ordered) || 0) <= 0) return 'Số lượng nhập phải lớn hơn 0.'
      if ((Number(item.unit_cost) || 0) < 0) return 'Đơn giá nhập không hợp lệ.'
      const key = `${item.product_id}:${item.variant_id || 'base'}`
      if (seen.has(key)) return 'Sản phẩm không được bị trùng dòng nếu cùng sản phẩm và biến thể.'
      seen.add(key)
    }

    if ((Number(formData.paid_amount) || 0) > totals.total) return 'Số tiền đã thanh toán không được lớn hơn tổng tiền.'
    return ''
  }

  const buildPayload = (status) => ({
    ...formData,
    status,
    discount_amount: Number(formData.discount_amount) || 0,
    shipping_fee: Number(formData.shipping_fee) || 0,
    paid_amount: Number(formData.paid_amount) || 0,
    items: items
      .filter((item) => item.product_id)
      .map((item) => ({
        product_id: Number(item.product_id),
        variant_id: item.variant_id ? Number(item.variant_id) : null,
        sku: item.sku,
        product_name: item.product_name,
        variant_name: item.variant_name,
        quantity_ordered: Number(item.quantity_ordered),
        unit_cost: Number(item.unit_cost),
        note: item.note,
      })),
  })

  const handleCreateImport = async (status = 'processing') => {
    const validationError = validateForm()
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      setSaving(true)
      await api.post('/admin/imports', buildPayload(status))
      toast.success('Tạo đơn nhập hàng thành công.')
      closeCreateModal()
      fetchImports()
    } catch (err) {
      console.error('Create import error:', err)
      toast.error(err.response?.data?.message || 'Không thể tạo đơn nhập hàng. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setSaving(false)
    }
  }

  const handleViewDetail = async (importOrder) => {
    try {
      const res = await api.get(`/admin/imports/${importOrder.id}`)
      setSelectedImport(res.import || res.order)
      setShowDetailModal(true)
    } catch (err) {
      console.error('Import detail error:', err)
      toast.error('Không thể tải chi tiết đơn nhập hàng.')
    }
  }

  const handleReceiveImport = async (importOrder) => {
    try {
      const res = await api.get(`/admin/imports/${importOrder.id}`)
      const detail = res.import || res.order
      setSelectedImport(detail)
      setReceiveItems((detail.items || []).map((item) => {
        const remaining = Math.max(0, Number(item.quantity_ordered) - Number(item.quantity_received || 0))
        return { ...item, remaining, receive_quantity: remaining }
      }))
      setShowReceiveModal(true)
    } catch (err) {
      console.error('Open receive error:', err)
      toast.error('Không thể tải chi tiết đơn nhập hàng.')
    }
  }

  const submitReceive = async () => {
    const payloadItems = receiveItems
      .filter((item) => Number(item.receive_quantity) > 0)
      .map((item) => ({ item_id: item.id, quantity_received: Number(item.receive_quantity) }))

    if (!payloadItems.length) {
      toast.error('Vui lòng nhập số lượng nhận.')
      return
    }

    for (const item of receiveItems) {
      if (Number(item.receive_quantity) > Number(item.remaining)) {
        toast.error('Tổng số lượng đã nhận không được vượt quá số lượng đặt.')
        return
      }
    }

    try {
      setReceiving(true)
      await api.post(`/admin/imports/${selectedImport.id}/receive`, { items: payloadItems })
      toast.success('Nhận hàng thành công.')
      setShowReceiveModal(false)
      setReceiveItems([])
      setSelectedImport(null)
      fetchImports()
    } catch (err) {
      console.error('Receive import error:', err)
      toast.error(err.response?.data?.message || 'Không thể nhận hàng. Vui lòng thử lại.')
    } finally {
      setReceiving(false)
    }
  }

  const handleCancelImport = async (importOrder) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn nhập hàng ${importOrder.code || importOrder.order_code}?`)) return
    try {
      setCancellingId(importOrder.id)
      await api.delete(`/admin/imports/${importOrder.id}`)
      toast.success('Hủy đơn nhập hàng thành công.')
      if (selectedImport?.id === importOrder.id) {
        setShowDetailModal(false)
        setSelectedImport(null)
      }
      fetchImports()
    } catch (err) {
      console.error('Cancel import error:', err)
      toast.error(err.response?.data?.message || 'Không thể hủy đơn nhập hàng.')
    } finally {
      setCancellingId(null)
    }
  }

  const updateStatusToProcessing = async (importOrder) => {
    try {
      await api.put(`/admin/imports/${importOrder.id}`, { status: 'processing' })
      toast.success('Cập nhật đơn nhập hàng thành công.')
      fetchImports()
      if (showDetailModal) handleViewDetail(importOrder)
    } catch (err) {
      console.error('Update import status error:', err)
      toast.error(err.response?.data?.message || 'Không thể cập nhật đơn nhập hàng.')
    }
  }

  const renderStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}>
        <Icon size={13} /> {config.label}
      </span>
    )
  }

  const renderPayment = (importOrder) => {
    const config = PAYMENT_CONFIG[importOrder.payment_status] || PAYMENT_CONFIG.unpaid
    return (
      <div className="text-sm">
        <p className={`font-semibold ${config.className}`}>{config.label}</p>
        <p className="text-xs text-[#7d8794]">{formatCurrency(importOrder.paid_amount)} / {formatCurrency(importOrder.total_amount)}</p>
      </div>
    )
  }

  const canReceive = (importOrder) => ['processing', 'partial_received'].includes(importOrder.status)
  const canCancel = (importOrder) => ['draft', 'processing'].includes(importOrder.status)

  const filteredProducts = useMemo(() => {
    const q = normalizeText('')
    return q ? products.filter((product) => normalizeText(product.name).includes(q)) : products
  }, [products])

  return (
    <div className="space-y-5 bg-[#fafafa]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2f3840]">Nhập hàng</h2>
          <p className="mt-1 text-sm text-[#7d8794]">Quản lý đơn nhập hàng từ nhà cung cấp</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d71920] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b9151b]"
        >
          <Plus size={18} /> Tạo đơn nhập hàng
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: 'Tổng đơn', value: stats.total, icon: Package, tone: 'bg-red-50 text-[#d71920]' },
          { label: 'Đã nhận đủ', value: stats.received, icon: CheckCircle, tone: 'bg-green-50 text-green-600' },
          { label: 'Đang xử lý', value: stats.processing, icon: Clock, tone: 'bg-amber-50 text-amber-600' },
          { label: 'Tổng giá trị', value: formatCurrency(stats.totalValue), icon: Truck, tone: 'bg-purple-50 text-purple-600' },
        ].map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}>
                  <Icon size={21} />
                </div>
                <div>
                  <p className="text-sm text-[#7d8794]">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-[#2f3840]">{card.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8794]" />
            <input
              type="text"
              placeholder="Tìm mã đơn, nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
              className="w-full rounded-lg border border-[#e5e7eb] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#d71920] focus:ring-2 focus:ring-red-100"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} lg:w-56`}>
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="processing">Đang xử lý</option>
            <option value="partial_received">Đã nhận một phần</option>
            <option value="received">Đã nhận đủ</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)} className={`${inputClass} lg:w-56`}>
            <option value="">Tất cả NCC</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={fetchImports}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3.5 py-2.5 text-sm font-medium text-[#2f3840] transition hover:bg-[#fff1f2] hover:text-[#d71920]"
          >
            <RefreshCcw size={16} /> Làm mới
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Mã đơn</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Nhà cung cấp</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Kho nhận</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Ngày đặt</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-[#7d8794]">Tổng tiền</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Thanh toán</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Trạng thái</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-[#7d8794]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? Array.from({ length: 4 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 8 }).map((_, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              )) : imports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center text-sm text-[#7d8794]">Không có đơn nhập hàng nào</td>
                </tr>
              ) : imports.map((importOrder) => (
                <tr key={importOrder.id} className="transition hover:bg-gray-50/70">
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-bold text-[#d71920]">{importOrder.code || importOrder.order_code}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-[#2f3840]">{importOrder.supplier_name || '—'}</td>
                  <td className="px-5 py-4 text-sm text-[#7d8794]">{importOrder.warehouse_name || '—'}</td>
                  <td className="px-5 py-4 text-sm text-[#7d8794]">{formatDate(importOrder.order_date)}</td>
                  <td className="px-5 py-4 text-right text-sm font-bold text-[#2f3840]">{formatCurrency(importOrder.total_amount)}</td>
                  <td className="px-5 py-4">{renderPayment(importOrder)}</td>
                  <td className="px-5 py-4">{renderStatusBadge(importOrder.status)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(importOrder)}
                        className="rounded-lg p-2 text-[#7d8794] transition hover:bg-[#fff1f2] hover:text-[#d71920]"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      {canReceive(importOrder) && (
                        <button
                          type="button"
                          onClick={() => handleReceiveImport(importOrder)}
                          className="rounded-lg p-2 text-[#7d8794] transition hover:bg-green-50 hover:text-green-600"
                          title="Nhận hàng"
                        >
                          <Package size={16} />
                        </button>
                      )}
                      {canCancel(importOrder) && (
                        <button
                          type="button"
                          onClick={() => handleCancelImport(importOrder)}
                          disabled={cancellingId === importOrder.id}
                          className="rounded-lg p-2 text-[#7d8794] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                          title="Hủy đơn"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-[#2f3840]">Tạo đơn nhập hàng</h3>
                <p className="mt-1 text-sm text-[#7d8794]">Chọn nhà cung cấp, kho nhận và danh sách sản phẩm nhập.</p>
              </div>
              <button type="button" onClick={closeCreateModal} className="rounded-lg p-2 text-[#7d8794] transition hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 px-6 py-5">
              <section>
                <h4 className="mb-3 text-sm font-bold uppercase text-[#7d8794]">Thông tin chung</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className={labelClass}>Nhà cung cấp <span className="text-[#d71920]">*</span></label>
                    <select value={formData.supplier_id} onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })} className={inputClass}>
                      <option value="">Chọn nhà cung cấp</option>
                      {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Kho nhận <span className="text-[#d71920]">*</span></label>
                    <select value={formData.warehouse_id} onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })} className={inputClass}>
                      <option value="">Chọn kho</option>
                      {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Ngày đặt <span className="text-[#d71920]">*</span></label>
                    <input type="date" value={formData.order_date} onChange={(e) => setFormData({ ...formData, order_date: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Ngày dự kiến nhận</label>
                    <input type="date" value={formData.expected_date} onChange={(e) => setFormData({ ...formData, expected_date: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Ghi chú</label>
                  <textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows={2} className={inputClass} />
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-sm font-bold uppercase text-[#7d8794]">Danh sách sản phẩm nhập</h4>
                  <button
                    type="button"
                    onClick={() => setItems([...items, emptyItem()])}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-semibold text-[#2f3840] transition hover:bg-[#fff1f2] hover:text-[#d71920]"
                  >
                    <Plus size={16} /> Thêm sản phẩm
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
                  <table className="w-full min-w-[1100px] text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Sản phẩm *</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Biến thể</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">SKU</th>
                        <th className="px-3 py-3 text-center text-xs font-semibold uppercase text-[#7d8794]">Số lượng *</th>
                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-[#7d8794]">Đơn giá *</th>
                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-[#7d8794]">Thành tiền</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Ghi chú</th>
                        <th className="px-3 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((item, index) => {
                        const product = productMap[String(item.product_id)]
                        return (
                          <tr key={index}>
                            <td className="px-3 py-3">
                              <select value={item.product_id} onChange={(e) => handleProductChange(index, e.target.value)} className={inputClass}>
                                <option value="">Chọn sản phẩm</option>
                                {filteredProducts.map((productOption) => (
                                  <option key={productOption.id} value={productOption.id}>
                                    {productOption.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-3">
                              <select
                                value={item.variant_id}
                                onChange={(e) => handleVariantChange(index, e.target.value)}
                                className={inputClass}
                                disabled={!product?.variants?.length}
                              >
                                <option value="">{product?.variants?.length ? 'Chọn biến thể' : 'Không có'}</option>
                                {product?.variants?.map((variant) => (
                                  <option key={variant.id} value={variant.id}>{variant.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-3">
                              <input value={item.sku} onChange={(e) => updateItem(index, { sku: e.target.value })} className={inputClass} />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity_ordered}
                                onChange={(e) => updateItem(index, { quantity_ordered: e.target.value })}
                                className={`${inputClass} text-center`}
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="number"
                                min="0"
                                step="1000"
                                value={item.unit_cost}
                                onChange={(e) => updateItem(index, { unit_cost: e.target.value })}
                                className={`${inputClass} text-right`}
                              />
                            </td>
                            <td className="px-3 py-3 text-right font-semibold text-[#2f3840]">
                              {formatCurrency((Number(item.quantity_ordered) || 0) * (Number(item.unit_cost) || 0))}
                            </td>
                            <td className="px-3 py-3">
                              <input value={item.note} onChange={(e) => updateItem(index, { note: e.target.value })} className={inputClass} />
                            </td>
                            <td className="px-3 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => setItems(items.length === 1 ? [emptyItem()] : items.filter((_, itemIndex) => itemIndex !== index))}
                                className="rounded-lg p-2 text-[#7d8794] transition hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-xl border border-[#e5e7eb] bg-gray-50 p-4">
                  <h4 className="mb-3 text-sm font-bold uppercase text-[#7d8794]">Thanh toán</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className={labelClass}>Trạng thái thanh toán</label>
                      <select
                        value={formData.payment_status}
                        onChange={(e) => {
                          const status = e.target.value
                          setFormData({
                            ...formData,
                            payment_status: status,
                            paid_amount: status === 'paid' ? totals.total : status === 'unpaid' ? '' : formData.paid_amount,
                          })
                        }}
                        className={inputClass}
                      >
                        <option value="unpaid">Chưa thanh toán</option>
                        <option value="partial">Thanh toán một phần</option>
                        <option value="paid">Đã thanh toán</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Số tiền đã thanh toán</label>
                      <input type="number" min="0" value={formData.paid_amount} onChange={(e) => setFormData({ ...formData, paid_amount: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phương thức</label>
                      <select value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} className={inputClass}>
                        <option value="cash">Tiền mặt</option>
                        <option value="bank_transfer">Chuyển khoản</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">
                  <h4 className="mb-3 text-sm font-bold uppercase text-[#7d8794]">Tổng tiền</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-[#7d8794]">Tổng số lượng</span><span className="font-semibold text-[#2f3840]">{totals.totalQuantity}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#7d8794]">Tạm tính</span><span className="font-semibold text-[#2f3840]">{formatCurrency(totals.subtotal)}</span></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Chiết khấu</label>
                        <input type="number" min="0" value={formData.discount_amount} onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Chi phí nhập hàng</label>
                        <input type="number" min="0" value={formData.shipping_fee} onChange={(e) => setFormData({ ...formData, shipping_fee: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                    <div className="flex justify-between border-t border-[#e5e7eb] pt-3 text-base font-bold">
                      <span className="text-[#2f3840]">Tổng tiền nhập</span>
                      <span className="text-[#d71920]">{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </div>
              </section>

              {metaLoading && (
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-[#7d8794]">Đang tải dữ liệu sản phẩm...</div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeCreateModal} className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#2f3840] hover:bg-gray-50" disabled={saving}>Hủy</button>
                <button type="button" onClick={() => handleCreateImport('draft')} className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#2f3840] hover:bg-[#fff1f2] hover:text-[#d71920]" disabled={saving}>Lưu nháp</button>
                <button type="button" onClick={() => handleCreateImport('processing')} className="rounded-lg bg-[#d71920] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b9151b] disabled:opacity-70" disabled={saving}>
                  {saving ? 'Đang tạo...' : 'Tạo đơn nhập hàng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-[#2f3840]">Chi tiết đơn nhập hàng</h3>
                <p className="mt-1 font-mono text-sm font-semibold text-[#d71920]">{selectedImport.code || selectedImport.order_code}</p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {selectedImport.status === 'draft' && (
                  <button type="button" onClick={() => updateStatusToProcessing(selectedImport)} className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm font-semibold text-[#2f3840] hover:bg-[#fff1f2] hover:text-[#d71920]">Chuyển xử lý</button>
                )}
                {canReceive(selectedImport) && (
                  <button type="button" onClick={() => { setShowDetailModal(false); handleReceiveImport(selectedImport) }} className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700">Nhận hàng</button>
                )}
                {canCancel(selectedImport) && (
                  <button type="button" onClick={() => handleCancelImport(selectedImport)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Hủy đơn</button>
                )}
                <button type="button" onClick={() => { setShowDetailModal(false); setSelectedImport(null) }} className="rounded-lg p-2 text-[#7d8794] hover:bg-gray-100">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <InfoBlock label="Nhà cung cấp" value={selectedImport.supplier_name} />
                <InfoBlock label="Kho nhận" value={selectedImport.warehouse_name} />
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-[#7d8794]">Trạng thái</p>
                  <div className="mt-1">{renderStatusBadge(selectedImport.status)}</div>
                </div>
                <InfoBlock label="Ngày đặt" value={formatDate(selectedImport.order_date)} />
                <InfoBlock label="Ngày dự kiến nhận" value={formatDate(selectedImport.expected_date)} />
                <InfoBlock label="Thanh toán" value={PAYMENT_CONFIG[selectedImport.payment_status]?.label || 'Chưa thanh toán'} />
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
                <table className="w-full min-w-[820px] text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Sản phẩm nhập</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">SKU</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-[#7d8794]">SL đặt</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-[#7d8794]">SL đã nhận</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#7d8794]">Đơn giá</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#7d8794]">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(selectedImport.items || []).map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#2f3840]">{item.product_name}</p>
                          {item.variant_name && <p className="text-xs text-[#7d8794]">{item.variant_name}</p>}
                          {item.note && <p className="mt-1 text-xs text-[#7d8794]">{item.note}</p>}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-[#7d8794]">{item.sku || '—'}</td>
                        <td className="px-4 py-3 text-center font-semibold text-[#2f3840]">{item.quantity_ordered}</td>
                        <td className="px-4 py-3 text-center font-semibold text-[#2f3840]">{item.quantity_received}</td>
                        <td className="px-4 py-3 text-right text-[#2f3840]">{formatCurrency(item.unit_cost)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-[#2f3840]">{formatCurrency(item.total_cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2 rounded-xl bg-gray-50 p-4 text-sm">
                  <SummaryRow label="Tạm tính" value={formatCurrency(selectedImport.subtotal)} />
                  <SummaryRow label="Chiết khấu" value={`-${formatCurrency(selectedImport.discount_amount)}`} />
                  <SummaryRow label="Chi phí nhập hàng" value={formatCurrency(selectedImport.shipping_fee)} />
                  <SummaryRow label="Đã thanh toán" value={formatCurrency(selectedImport.paid_amount)} />
                  <div className="flex justify-between border-t border-[#e5e7eb] pt-2 text-base font-bold">
                    <span>Tổng tiền</span>
                    <span className="text-[#d71920]">{formatCurrency(selectedImport.total_amount)}</span>
                  </div>
                </div>
              </div>

              {selectedImport.note && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-[#7d8794]">Ghi chú</p>
                  <p className="mt-1 text-sm text-[#2f3840]">{selectedImport.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showReceiveModal && selectedImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-[#2f3840]">Nhận hàng</h3>
                <p className="mt-1 font-mono text-sm font-semibold text-[#d71920]">{selectedImport.code || selectedImport.order_code}</p>
              </div>
              <button type="button" onClick={() => { setShowReceiveModal(false); setReceiveItems([]); setSelectedImport(null) }} className="rounded-lg p-2 text-[#7d8794] hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#7d8794]">Sản phẩm</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-[#7d8794]">SL đặt</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-[#7d8794]">Đã nhận</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-[#7d8794]">Còn lại</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-[#7d8794]">SL thực nhận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {receiveItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#2f3840]">{item.product_name}</p>
                          <p className="text-xs text-[#7d8794]">{[item.sku, item.variant_name].filter(Boolean).join(' · ') || '—'}</p>
                        </td>
                        <td className="px-4 py-3 text-center font-semibold">{item.quantity_ordered}</td>
                        <td className="px-4 py-3 text-center font-semibold">{item.quantity_received}</td>
                        <td className="px-4 py-3 text-center font-semibold">{item.remaining}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max={item.remaining}
                            value={item.receive_quantity}
                            onChange={(e) => setReceiveItems((prev) => prev.map((row, rowIndex) => rowIndex === index ? { ...row, receive_quantity: e.target.value } : row))}
                            className={`${inputClass} text-center`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => { setShowReceiveModal(false); setReceiveItems([]); setSelectedImport(null) }} className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#2f3840] hover:bg-gray-50" disabled={receiving}>Hủy</button>
                <button type="button" onClick={submitReceive} className="rounded-lg bg-[#d71920] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b9151b] disabled:opacity-70" disabled={receiving}>
                  {receiving ? 'Đang nhận hàng...' : 'Xác nhận nhận hàng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-[#7d8794]">{label}</p>
      <p className="mt-1 font-semibold text-[#2f3840]">{value || '—'}</p>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#7d8794]">{label}</span>
      <span className="font-semibold text-[#2f3840]">{value}</span>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Download,
  Package,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Users,
  Warehouse,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const primaryColor = '#d71920'
const textColor = '#2f3840'
const mutedColor = '#6b7280'

const periodOptions = [
  { value: 'today', apiValue: 'today', label: 'Hôm nay' },
  { value: 'last7days', apiValue: '7days', label: '7 ngày qua' },
  { value: 'last30days', apiValue: '30days', label: '30 ngày qua' },
  { value: 'thisMonth', apiValue: 'month', label: 'Tháng này' },
  { value: 'custom', apiValue: 'custom', label: 'Tùy chọn' },
]

const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const statusMeta = {
  pending: { label: 'Chờ xác nhận', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: '#f59e0b' },
  confirmed: { label: 'Đã xác nhận', badge: 'bg-gray-100 text-gray-700 border-gray-200', dot: '#6b7280' },
  processing: { label: 'Đang xử lý', badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: '#f97316' },
  shipped: { label: 'Đang giao', badge: 'bg-purple-50 text-purple-700 border-purple-200', dot: '#7c3aed' },
  delivered: { label: 'Đã giao', badge: 'bg-green-50 text-green-700 border-green-200', dot: '#16a34a' },
  cancelled: { label: 'Đã hủy', badge: 'bg-red-50 text-red-700 border-red-200', dot: '#d71920' },
}

const dateOnly = (date) => date.toISOString().slice(0, 10)

const formatCurrency = (value) => {
  const amount = Number(value) || 0
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`
}

const formatShortCurrency = (value) => {
  const amount = Number(value) || 0
  if (Math.abs(amount) >= 1000000000) return `${(amount / 1000000000).toFixed(1)} tỷ`
  if (Math.abs(amount) >= 1000000) return `${(amount / 1000000).toFixed(1)} triệu`
  if (Math.abs(amount) >= 1000) return `${Math.round(amount / 1000)} nghìn`
  return `${amount}`
}

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatChartDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return ''
  const number = Number(value)
  return `${number > 0 ? '+' : ''}${number.toFixed(number % 1 === 0 ? 0 : 1)}%`
}

function SummaryCard({ icon: Icon, title, value, comparison, loading }) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      {loading ? (
        <div className="space-y-4">
          <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
          <div className="h-7 w-32 animate-pulse rounded bg-gray-100" />
        </div>
      ) : (
        <>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#d71920]">
            <Icon size={22} />
          </div>
          <p className="text-sm font-medium text-[#6b7280]">{title}</p>
          <p className="mt-1 text-2xl font-bold text-[#2f3840]">{value}</p>
          <p className="mt-2 text-xs text-[#6b7280]">{comparison || 'Theo kỳ đã chọn'}</p>
        </>
      )}
    </div>
  )
}

function EmptyBlock({ message }) {
  return (
    <div className="flex min-h-[230px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafafa] px-4 py-6 text-center">
      <Receipt size={32} className="mb-2 text-gray-300" />
      <p className="text-sm font-semibold text-[#2f3840]">{message}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const meta = statusMeta[status] || statusMeta.pending
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>{meta.label}</span>
}

export default function AdminReports() {
  const toast = useToast()
  const today = useMemo(() => new Date(), [])
  const [dateRange, setDateRange] = useState('last30days')
  const [startDate, setStartDate] = useState(dateOnly(new Date(today.getFullYear(), today.getMonth(), 1)))
  const [endDate, setEndDate] = useState(dateOnly(today))
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState(null)

  useEffect(() => {
    if (dateRange !== 'custom') fetchReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange])

  const currentPeriod = periodOptions.find((item) => item.value === dateRange) || periodOptions[2]

  const requestParams = () => ({
    period: currentPeriod.apiValue,
    start_date: dateRange === 'custom' ? startDate : undefined,
    end_date: dateRange === 'custom' ? endDate : undefined,
  })

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/reports/overview', { params: requestParams() })
      setOverview(res.overview || res.data?.overview || null)
    } catch (err) {
      console.error('fetch reports error:', err)
      setOverview(null)
      toast.error('Không thể tải dữ liệu báo cáo.')
    } finally {
      setLoading(false)
    }
  }

  const revenue = overview?.revenue || {}
  const orders = overview?.orders || {}
  const products = overview?.products || {}
  const customers = overview?.customers || {}

  const topProducts = products.topProducts || []
  const topCustomers = customers.topCustomers || []
  const totalSoldQuantity = Number(products.totalSoldQuantity) || topProducts.reduce((sum, item) => sum + (Number(item.sold_quantity) || 0), 0)
  const lowStockCount = products.lowStockProducts?.length || 0
  const pendingOrders = Number(orders.pending) || 0

  const revenueChart = (revenue.dailyRevenue || []).map((item) => ({
    ...item,
    label: formatChartDate(item.date),
    revenue: Number(item.revenue) || 0,
  }))

  const statusData = statusOrder.map((status) => {
    const apiItem = orders.byStatus?.find((item) => item.status === status)
    return {
      status,
      label: statusMeta[status].label,
      count: Number(apiItem?.count ?? orders[status]) || 0,
    }
  })
  const statusTotal = statusData.reduce((sum, item) => sum + item.count, 0)

  const summaryCards = [
    {
      title: 'Doanh thu',
      value: formatCurrency(revenue.rangeRevenue),
      icon: TrendingUp,
      comparison: formatPercent(revenue.growth) ? `${formatPercent(revenue.growth)} so với kỳ trước` : 'Doanh thu đơn đã giao',
    },
    {
      title: 'Đơn hàng',
      value: (orders.total || 0).toLocaleString('vi-VN'),
      icon: ShoppingCart,
      comparison: 'Tổng đơn trong kỳ',
    },
    {
      title: 'Sản phẩm đã bán',
      value: totalSoldQuantity.toLocaleString('vi-VN'),
      icon: Package,
      comparison: 'Tính theo đơn đã giao',
    },
    {
      title: 'Khách hàng mới',
      value: (customers.newCustomers || 0).toLocaleString('vi-VN'),
      icon: Users,
      comparison: 'Tài khoản mới trong kỳ',
    },
  ]

  const exportReport = () => {
    const rows = [
      ['Báo cáo', currentPeriod.label],
      ['Từ ngày', dateRange === 'custom' ? formatDate(startDate) : revenue.range?.start ? formatDate(revenue.range.start) : ''],
      ['Đến ngày', dateRange === 'custom' ? formatDate(endDate) : revenue.range?.end ? formatDate(revenue.range.end) : ''],
      [],
      ['Nhóm', 'Chỉ số', 'Giá trị'],
      ['Tổng quan', 'Doanh thu', Number(revenue.rangeRevenue) || 0],
      ['Tổng quan', 'Đơn hàng', Number(orders.total) || 0],
      ['Tổng quan', 'Sản phẩm đã bán', totalSoldQuantity],
      ['Tổng quan', 'Khách hàng mới', Number(customers.newCustomers) || 0],
      [],
      ['Sản phẩm bán chạy', 'Sản phẩm', 'Danh mục', 'Đã bán', 'Doanh thu'],
      ...topProducts.map((item) => ['', item.name || '', item.category_name || '', Number(item.sold_quantity) || 0, Number(item.revenue) || 0]),
      [],
      ['Khách hàng mua nhiều', 'Khách hàng', 'Email/SĐT', 'Số đơn', 'Tổng chi tiêu'],
      ...topCustomers.map((item) => ['', item.name || '', item.email || item.phone || '', Number(item.order_count) || 0, Number(item.total_spent) || 0]),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bao-cao-${currentPeriod.value}-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const RevenueTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-3 text-sm shadow-lg">
        <p className="mb-1 font-semibold text-[#2f3840]">{label}</p>
        <p className="text-[#6b7280]">Doanh thu: <span className="font-semibold text-[#d71920]">{formatCurrency(payload[0].value)}</span></p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2f3840]">Báo cáo</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Theo dõi doanh thu, đơn hàng và hiệu quả kinh doanh</p>
        </div>

        <div className="rounded-xl border border-[#e5e7eb] bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              className="min-w-[180px] rounded-lg border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#2f3840] outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50"
            >
              {periodOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>

            {dateRange === 'custom' && (
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="rounded-lg border border-[#e5e7eb] px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="rounded-lg border border-[#e5e7eb] px-3.5 py-2.5 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-50"
                />
                <button onClick={fetchReports} className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#2f3840] hover:bg-[#fff1f2] hover:text-[#d71920]">
                  Lọc
                </button>
              </div>
            )}

            <button
              onClick={exportReport}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d71920] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b91c1c]"
            >
              <Download size={17} /> Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} loading={loading} />
        ))}
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="min-w-0 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#2f3840]">Doanh thu theo thời gian</h2>
              <p className="mt-1 text-xs text-[#6b7280]">Dữ liệu tính theo đơn hàng đã giao</p>
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#d71920]">{currentPeriod.label}</span>
          </div>

          {loading ? (
            <div className="h-[260px] w-full animate-pulse rounded-xl bg-gray-100" />
          ) : revenueChart.length ? (
            <div className="relative h-[260px] w-full min-w-0 overflow-hidden rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reportRevenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primaryColor} stopOpacity={0.22} />
                      <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: mutedColor }} />
                  <YAxis tick={{ fontSize: 12, fill: mutedColor }} tickFormatter={formatShortCurrency} />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke={primaryColor} strokeWidth={2.5} fill="url(#reportRevenueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyBlock message="Không có dữ liệu doanh thu trong khoảng thời gian này" />
          )}
        </section>

        <section className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-[#2f3840]">Trạng thái đơn hàng</h2>
          <p className="mt-1 text-xs text-[#6b7280]">Phân bổ đơn theo trạng thái xử lý</p>

          {loading ? (
            <div className="mt-5 h-[260px] animate-pulse rounded-xl bg-gray-100" />
          ) : statusTotal ? (
            <>
              <div className="mt-4 h-[190px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData.filter((item) => item.count > 0)} dataKey="count" nameKey="label" innerRadius={48} outerRadius={78} paddingAngle={2}>
                      {statusData.filter((item) => item.count > 0).map((item) => (
                        <Cell key={item.status} fill={statusMeta[item.status].dot} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {statusData.map((item) => (
                  <div key={item.status} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[#6b7280]">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusMeta[item.status].dot }} />
                      {item.label}
                    </span>
                    <span className="font-semibold text-[#2f3840]">{item.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-5">
              <EmptyBlock message="Chưa có dữ liệu trạng thái đơn hàng" />
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
          <div className="border-b border-[#e5e7eb] px-5 py-4">
            <h2 className="text-base font-bold text-[#2f3840]">Sản phẩm bán chạy</h2>
            <p className="mt-1 text-xs text-[#6b7280]">Top sản phẩm có số lượng bán cao nhất</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-[#f7f7f7] text-left text-xs font-semibold uppercase text-[#6b7280]">
                  <th className="px-5 py-3">STT</th>
                  <th className="px-5 py-3">Sản phẩm</th>
                  <th className="px-5 py-3">Danh mục</th>
                  <th className="px-5 py-3 text-right">Đã bán</th>
                  <th className="px-5 py-3 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 5 }).map((__, cell) => <td key={cell} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-gray-100" /></td>)}
                  </tr>
                )) : topProducts.length ? topProducts.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-[#fafafa]">
                    <td className="px-5 py-4 text-sm font-semibold text-[#6b7280]">{index + 1}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#2f3840]">{item.name || '-'}</p>
                      <p className="mt-0.5 text-xs text-[#6b7280]">{item.sku || '-'}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6b7280]">{item.category_name || 'Chưa phân loại'}</td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-[#2f3840]">{(Number(item.sold_quantity) || 0).toLocaleString('vi-VN')}</td>
                    <td className="px-5 py-4 text-right text-sm font-bold text-[#d71920]">{formatCurrency(item.revenue)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#6b7280]">Chưa có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
          <div className="border-b border-[#e5e7eb] px-5 py-4">
            <h2 className="text-base font-bold text-[#2f3840]">Khách hàng mua nhiều</h2>
            <p className="mt-1 text-xs text-[#6b7280]">Khách hàng có tổng chi tiêu cao nhất</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-[#f7f7f7] text-left text-xs font-semibold uppercase text-[#6b7280]">
                  <th className="px-5 py-3">STT</th>
                  <th className="px-5 py-3">Khách hàng</th>
                  <th className="px-5 py-3">Email/SĐT</th>
                  <th className="px-5 py-3 text-right">Số đơn</th>
                  <th className="px-5 py-3 text-right">Tổng chi tiêu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 5 }).map((__, cell) => <td key={cell} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-gray-100" /></td>)}
                  </tr>
                )) : topCustomers.length ? topCustomers.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-[#fafafa]">
                    <td className="px-5 py-4 text-sm font-semibold text-[#6b7280]">{index + 1}</td>
                    <td className="px-5 py-4 font-semibold text-[#2f3840]">{item.name || 'Khách hàng'}</td>
                    <td className="px-5 py-4 text-sm text-[#6b7280]">{item.email || item.phone || '-'}</td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-[#2f3840]">{Number(item.order_count) || 0}</td>
                    <td className="px-5 py-4 text-right text-sm font-bold text-[#d71920]">{formatCurrency(item.total_spent)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#6b7280]">Chưa có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <AlertCard
          icon={Warehouse}
          title="Sản phẩm sắp hết hàng"
          value={`${lowStockCount} sản phẩm`}
          description="Cần kiểm tra tồn kho và tạo kế hoạch nhập hàng."
          to="/admin/warehouse"
          actionLabel="Xem kho hàng"
        />
        <AlertCard
          icon={Clock}
          title="Đơn hàng chờ xử lý"
          value={`${pendingOrders} đơn hàng`}
          description="Các đơn cần xác nhận để tiếp tục quy trình."
          to="/admin/orders?status=pending"
          actionLabel="Xử lý đơn hàng"
        />
        <AlertCard
          icon={TrendingUp}
          title="Doanh thu hôm nay"
          value={formatCurrency(revenue.todayRevenue)}
          description="Theo dõi nhanh kết quả kinh doanh trong ngày."
          to="/admin/reports"
          actionLabel="Xem chi tiết"
        />
      </section>
    </div>
  )
}

function AlertCard({ icon: Icon, title, value, description, to, actionLabel }) {
  return (
    <div className="group rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-colors hover:border-red-100 hover:bg-[#fffdfd]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#2f3840]">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#2f3840]">{value}</p>
          <p className="mt-1 text-sm text-[#6b7280]">{description}</p>
        </div>
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-red-100 bg-[#fff1f2]">
          <Icon size={22} style={{ color: '#d71920' }} strokeWidth={1.8} />
        </div>
      </div>
      <Link to={to} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#d71920] hover:text-[#b91c1c]">
        {actionLabel}
        <ArrowRight size={15} strokeWidth={1.8} />
      </Link>
    </div>
  )
}

import { useState, useEffect } from 'react'
import api from '../../services/api'
import {
  ClipboardList,
  Package,
  Users,
  Wallet,
  TrendingUp,
  Clock,
  Warehouse,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  AreaChart,
  Area
} from 'recharts'

const StatCard = ({ icon: Icon, label, value, change, changeType, sub }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: '#fff1f2' }}
      >
        <Icon size={22} style={{ color: '#d71920' }} strokeWidth={1.8} />
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          changeType === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {changeType === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {change}
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
)

const SectionTitle = ({ icon: Icon, title, action }) => (
  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fff1f2' }}>
        <Icon size={19} style={{ color: '#d71920' }} strokeWidth={1.8} />
      </div>
      <h3 className="font-semibold text-gray-800 truncate">{title}</h3>
    </div>
    {action}
  </div>
)

const QuickActionCard = ({ icon: Icon, title, value, description, to, actionLabel }) => (
  <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-red-100 hover:bg-[#fffdfd]">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-red-100 bg-[#fff1f2]">
        <Icon size={22} style={{ color: '#d71920' }} strokeWidth={1.8} />
      </div>
    </div>
    <Link
      to={to}
      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#d71920] hover:text-[#b91c1c]"
    >
      {actionLabel}
      <ArrowRight size={15} strokeWidth={1.8} />
    </Link>
  </div>
)

const OrderStatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-red-50 text-red-700 border-red-200',
    processing: 'bg-purple-50 text-purple-700 border-purple-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    returned: 'bg-gray-50 text-gray-700 border-gray-200',
  }
  const labels = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
    returned: 'Trả hàng',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    returnedOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/dashboard')
      setStats(res.stats)
      setRecentOrders(res.recentOrders)
      setTopProducts(res.topProducts)
      setChartData(res.chartData)
    } catch (err) {
      console.error('Fetch dashboard error:', err)
      setStats({
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        monthlyRevenue: 0,
        revenueGrowth: 0,
        confirmedOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        returnedOrders: 0,
      })
      setRecentOrders([])
      setTopProducts([])
      setChartData([])
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={ClipboardList}
          label="Tổng đơn hàng"
          value={stats.totalOrders.toLocaleString()}
          change="+12%"
          changeType="up"
        />
        <StatCard
          icon={Package}
          label="Sản phẩm"
          value={stats.totalProducts.toLocaleString()}
          sub={`${stats.lowStockProducts} sản phẩm sắp hết hàng`}
        />
        <StatCard
          icon={Users}
          label="Khách hàng"
          value={stats.totalCustomers.toLocaleString()}
          change="+8%"
          changeType="up"
        />
        <StatCard
          icon={Wallet}
          label="Doanh thu tháng"
          value={formatPrice(stats.monthlyRevenue)}
          change={`${Math.abs(stats.revenueGrowth)}%`}
          changeType={stats.revenueGrowth >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">Doanh thu & Đơn hàng</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-100">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
              <option>3 tháng</option>
              <option selected>12 tháng</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d71920" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#d71920" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(value, name) => [
                  name === 'revenue' ? formatPrice(value * 1000000) : value,
                  name === 'revenue' ? 'Doanh thu' : 'Đơn hàng',
                ]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#d71920" strokeWidth={2.5} fill="url(#colorRevenue)" />
              <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-5">Đơn hàng theo trạng thái</h3>
          <div className="space-y-4">
            {[
              { label: 'Chờ xác nhận', value: stats.pendingOrders || 0, color: 'bg-yellow-400' },
              { label: 'Đã xác nhận', value: stats.confirmedOrders || 0, color: 'bg-red-400' },
              { label: 'Đang xử lý', value: stats.processingOrders || 0, color: 'bg-purple-400' },
              { label: 'Đang giao', value: stats.shippedOrders || 0, color: 'bg-purple-400' },
              { label: 'Đã giao', value: stats.deliveredOrders || 0, color: 'bg-green-400' },
              { label: 'Đã hủy', value: stats.cancelledOrders || 0, color: 'bg-red-400' },
            ].map((item) => {
              const total = stats.totalOrders || 1
              const pct = Math.round((item.value / total) * 100)
              return (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate">{item.label}</span>
                    <span className="font-medium text-gray-800 ml-2">{item.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <SectionTitle
            icon={ClipboardList}
            title="Đơn hàng gần đây"
            action={(
              <Link to="/admin/orders" className="text-sm text-[#d71920] hover:underline font-medium">
                Xem tất cả
              </Link>
            )}
          />
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50/60 transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{order.order_number}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{order.customer_name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{formatPrice(order.total_price)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <SectionTitle
            icon={TrendingUp}
            title="Sản phẩm bán chạy"
            action={(
              <Link to="/admin/products" className="text-sm text-[#d71920] hover:underline font-medium">
                Xem tất cả
              </Link>
            )}
          />
          <div className="divide-y divide-gray-50">
            {topProducts.map((product, idx) => (
              <div key={idx} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50/60 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#d71920] flex items-center justify-center text-sm font-semibold flex-shrink-0 border border-red-100">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-full max-w-[200px]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${topProducts[0]?.total_sold > 0 ? (product.total_sold / topProducts[0].total_sold) * 100 : 0}%`,
                        backgroundColor: '#d71920',
                      }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{product.total_sold} đã bán</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <QuickActionCard
          icon={Warehouse}
          title="Sản phẩm sắp hết hàng"
          value={`${stats.lowStockProducts} sản phẩm`}
          description="Cần kiểm tra và bổ sung tồn kho kịp thời."
          to="/admin/warehouse"
          actionLabel="Xem kho hàng"
        />
        <QuickActionCard
          icon={Clock}
          title="Đơn hàng chờ xử lý"
          value={`${stats.pendingOrders} đơn hàng`}
          description="Các đơn cần xác nhận hoặc tiếp tục xử lý."
          to="/admin/orders?status=pending"
          actionLabel="Xử lý đơn hàng"
        />
        <QuickActionCard
          icon={TrendingUp}
          title="Doanh thu tháng này"
          value={formatPrice(stats.monthlyRevenue)}
          description="Theo dõi hiệu quả kinh doanh hiện tại."
          to="/admin/reports"
          actionLabel="Xem báo cáo"
        />
      </div>
    </div>
  )
}

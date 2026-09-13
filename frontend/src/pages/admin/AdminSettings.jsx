import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { Palette, Save, Settings, Share2, ShieldCheck, ShoppingBag, Store } from 'lucide-react'

const defaultSettings = {
  site_name: '',
  site_email: '',
  contact_phone: '',
  contact_address: '',
  site_description: '',
  logo_url: '',
  favicon_url: '',
  primary_color: '#d71920',
  home_banner_url: '',
  background_url: '',
  free_shipping_threshold: '500000',
  default_shipping_fee: '30000',
  allow_cod: '1',
  allow_vnpay: '1',
  allow_momo: '0',
  allow_bank_transfer: '1',
  facebook_url: '',
  instagram_url: '',
  tiktok_url: '',
  youtube_url: '',
  return_policy: '',
  shipping_policy: '',
  privacy_policy: '',
  terms_of_service: '',
}

const tabs = [
  { key: 'store', label: 'Thông tin cửa hàng', icon: Store },
  { key: 'appearance', label: 'Giao diện', icon: Palette },
  { key: 'sales', label: 'Bán hàng', icon: ShoppingBag },
  { key: 'social', label: 'Mạng xã hội', icon: Share2 },
  { key: 'policies', label: 'Chính sách', icon: ShieldCheck },
]

const isEnabled = (value) => value === true || value === 1 || value === '1' || value === 'true'

export default function AdminSettings() {
  const toast = useToast()
  const [settings, setSettings] = useState(defaultSettings)
  const [activeTab, setActiveTab] = useState('store')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/settings')
      setSettings({ ...defaultSettings, ...(res.settings || res.data?.settings || {}) })
    } catch (err) {
      console.error('fetch settings error:', err)
      toast.error('Không thể tải cấu hình website.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const validate = () => {
    if (!String(settings.site_name || '').trim()) {
      toast.warning('Tên cửa hàng không được để trống.')
      return false
    }
    if (!String(settings.site_email || '').trim()) {
      toast.warning('Email liên hệ không được để trống.')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validate()) return
    try {
      setSaving(true)
      const res = await api.put('/admin/settings', settings)
      setSettings({ ...defaultSettings, ...(res.settings || settings) })
      toast.success('Lưu cài đặt thành công.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể lưu cài đặt. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#d71920] focus:ring-2 focus:ring-red-50'
  const labelClass = 'mb-1.5 block text-sm font-semibold text-gray-700'

  const renderInput = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={settings[key] || ''}
        onChange={(event) => handleChange(key, event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )

  const renderTextarea = (key, label, rows = 4, placeholder = '') => (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        rows={rows}
        value={settings[key] || ''}
        onChange={(event) => handleChange(key, event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )

  const renderToggle = (key, label) => (
    <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <input
        type="checkbox"
        checked={isEnabled(settings[key])}
        onChange={(event) => handleChange(key, event.target.checked ? '1' : '0')}
        className="h-4 w-4 rounded border-gray-300 text-[#d71920] focus:ring-red-100"
      />
    </label>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-lg bg-gray-100" />)}
        </div>
      )
    }

    if (activeTab === 'store') {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          {renderInput('site_name', 'Tên cửa hàng *', 'text', 'Ví dụ: CANIFA')}
          {renderInput('site_email', 'Email liên hệ *', 'email', 'contact@example.com')}
          {renderInput('contact_phone', 'Số điện thoại')}
          {renderInput('contact_address', 'Địa chỉ')}
          <div className="lg:col-span-2">{renderTextarea('site_description', 'Mô tả ngắn', 3)}</div>
          {renderInput('logo_url', 'Logo URL')}
          {renderInput('favicon_url', 'Favicon URL')}
        </div>
      )
    }

    if (activeTab === 'appearance') {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className={labelClass}>Màu chủ đạo</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={settings.primary_color || '#d71920'}
                onChange={(event) => handleChange('primary_color', event.target.value)}
                className="h-11 w-14 rounded-lg border border-gray-200 bg-white p-1"
              />
              <input
                value={settings.primary_color || ''}
                onChange={(event) => handleChange('primary_color', event.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          {renderInput('home_banner_url', 'Banner trang chủ')}
          {renderInput('background_url', 'Ảnh nền')}
        </div>
      )
    }

    if (activeTab === 'sales') {
      return (
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {renderInput('free_shipping_threshold', 'Miễn phí vận chuyển từ', 'number')}
            {renderInput('default_shipping_fee', 'Phí vận chuyển mặc định', 'number')}
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {renderToggle('allow_cod', 'Cho phép COD')}
            {renderToggle('allow_vnpay', 'Cho phép VNPay')}
            {renderToggle('allow_momo', 'Cho phép MoMo')}
            {renderToggle('allow_bank_transfer', 'Cho phép chuyển khoản')}
          </div>
        </div>
      )
    }

    if (activeTab === 'social') {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          {renderInput('facebook_url', 'Facebook')}
          {renderInput('instagram_url', 'Instagram')}
          {renderInput('tiktok_url', 'TikTok')}
          {renderInput('youtube_url', 'YouTube')}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {renderTextarea('return_policy', 'Chính sách đổi trả', 5)}
        {renderTextarea('shipping_policy', 'Chính sách vận chuyển', 5)}
        {renderTextarea('privacy_policy', 'Chính sách bảo mật', 5)}
        {renderTextarea('terms_of_service', 'Điều khoản sử dụng', 5)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2f3840]">Cài đặt</h1>
          <p className="text-sm text-[#7d8794]">Quản lý thông tin website và cấu hình bán hàng</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d71920] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          <Save size={18} />
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-4 text-sm font-semibold transition-colors ${
                    activeTab === tab.key
                      ? 'border-[#d71920] text-[#d71920]'
                      : 'border-transparent text-gray-500 hover:bg-red-50/50 hover:text-[#d71920]'
                  }`}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              )
            })}
          </div>
        </div>
        <div className="p-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#2f3840]">
            <Settings size={16} className="text-[#d71920]" />
            {tabs.find((tab) => tab.key === activeTab)?.label}
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

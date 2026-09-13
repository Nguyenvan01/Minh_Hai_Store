import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { orderAPI } from '../services/api'
import { formatPrice } from '../utils/formatPrice'

const CITY_OPTIONS = [
  { value: 'hanoi', label: 'Hà Nội' },
  { value: 'hcm', label: 'TP. Hồ Chí Minh' },
  { value: 'danang', label: 'Đà Nẵng' },
  { value: 'cantho', label: 'Cần Thơ' },
  { value: 'haiphong', label: 'Hải Phòng' },
  { value: 'dongnai', label: 'Đồng Nai' },
  { value: 'binhduong', label: 'Bình Dương' },
]

const DISTRICT_OPTIONS = [
  { value: 'quan-1', label: 'Quận 1' },
  { value: 'quan-3', label: 'Quận 3' },
  { value: 'quan-5', label: 'Quận 5' },
  { value: 'quan-7', label: 'Quận 7' },
  { value: 'go-vap', label: 'Gò Vấp' },
  { value: 'tan-binh', label: 'Tân Bình' },
  { value: 'cau-giay', label: 'Cầu Giấy' },
  { value: 'thanh-xuan', label: 'Thanh Xuân' },
  { value: 'hai-chau', label: 'Hải Châu' },
  { value: 'lien-chieu', label: 'Liên Chiểu' },
]

const WARD_OPTIONS = [
  { value: 'phuong-1', label: 'Phường 1' },
  { value: 'phuong-2', label: 'Phường 2' },
  { value: 'phuong-3', label: 'Phường 3' },
  { value: 'xa-1', label: 'Xã 1' },
]

const getOptionLabel = (options, value) => {
  if (!value) return ''
  return options.find(option => option.value === value)?.label || value
}

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, getCartTotal, clearCart } = useCart()
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [showGuestForm, setShowGuestForm] = useState(!isAuthenticated)
  const [selectedShipping, setSelectedShipping] = useState('standard')

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod'
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const subtotal = getCartTotal()
  const shippingFee = selectedShipping === 'express' ? 30000 : 0
  const total = subtotal + shippingFee

  useEffect(() => {
    if (!authLoading && !isAuthenticated) setShowGuestForm(true)
  }, [authLoading, isAuthenticated])

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').trim().split(' ')
      const lastName = nameParts.pop() || ''
      const firstName = nameParts.join(' ')
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        phone: user.phone || '',
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || lastName,
      }))
    }
  }, [user])

  const getAddressNameParts = () => ({
    cityName: getOptionLabel(CITY_OPTIONS, formData.city),
    districtName: getOptionLabel(DISTRICT_OPTIONS, formData.district),
    wardName: getOptionLabel(WARD_OPTIONS, formData.ward),
  })

  const buildAddressDetail = () => {
    return [formData.address, formData.apartment]
      .filter(Boolean)
      .join(', ')
  }

  const buildShippingAddress = () => {
    const { cityName, districtName, wardName } = getAddressNameParts()
    return [buildAddressDetail(), wardName, districtName, cityName]
      .filter(Boolean)
      .join(', ')
  }

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.city &&
      formData.district
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }
    setLoading(true)

    try {
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: item.name,
        product_image: item.image,
        unit_price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }))
      const addressParts = getAddressNameParts()
      const addressDetail = buildAddressDetail()
      const shippingAddress = buildShippingAddress()

      const payload = {
        items: orderItems,
        shipping_address: shippingAddress,
        address_detail: addressDetail,
        recipient_name: `${formData.firstName} ${formData.lastName}`.trim(),
        recipient_phone: formData.phone,
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
        customer_email: formData.email,
        customer_phone: formData.phone,
        ward: formData.ward,
        district: formData.district,
        city: formData.city,
        ward_name: addressParts.wardName,
        district_name: addressParts.districtName,
        city_name: addressParts.cityName,
        shipping_ward_name: addressParts.wardName,
        shipping_district_name: addressParts.districtName,
        shipping_city_name: addressParts.cityName,
        shipping_fee: shippingFee,
        shipping_method: selectedShipping,
        discount_amount: 0,
        payment_method: formData.paymentMethod,
        payment_status: formData.paymentMethod === 'cod' ? 'unpaid' : 'paid',
        note: formData.note,
      }

      const res = await orderAPI.createOrder(payload)

      if (res.success) {
        const orderResult = {
          order_number: res.order.order_number,
          order_id: res.order.id,
          payment_method: formData.paymentMethod,
          recipient_name: `${formData.firstName} ${formData.lastName}`.trim(),
          recipient_phone: formData.phone,
          shipping_address: shippingAddress,
          shipping_method: selectedShipping,
          shipping_fee: shippingFee,
          subtotal,
          total,
          items: items.map(item => ({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        }
        clearCart()
        toast.success('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.')
        navigate('/order-success', { state: orderResult })
      } else {
        toast.error(res.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
        setLoading(false)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  const StepIndicator = () => (
    <nav className="checkout-steps" aria-label="Tiến trình thanh toán">
      <span className="checkout-step is-done">
        <span className="checkout-step-number">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
        Giỏ hàng
      </span>
      <span className="checkout-step is-current" aria-current="step">
        <span className="checkout-step-number">2</span>
        Thanh toán
      </span>
      <span className="checkout-step">
        <span className="checkout-step-number">3</span>
        Hoàn tất
      </span>
    </nav>
  )

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <header className="checkout-header">
          <div className="checkout-header-inner">
            <Link to="/" className="checkout-logo">Đạt Hoàng</Link>
            <StepIndicator />
            <Link to="/" className="checkout-continue-link">
              Tiếp tục mua sắm
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="m9 12 6 6m0-6-6 6"/>
              </svg>
            </Link>
          </div>
        </header>

        <div className="checkout-page-inner">
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="ck-card" style={{ textAlign: 'center', padding: '60px 28px' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ADBCCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <h2 className="ck-section-heading" style={{ marginTop: '20px', marginBottom: '8px' }}>Giỏ hàng trống</h2>
              <p style={{ color: 'var(--brand-muted)', fontSize: '14px', marginBottom: '24px' }}>Bạn chưa có sản phẩm nào để thanh toán.</p>
              <Link to="/" className="ck-btn ck-btn-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      {/* ---- Header ---- */}
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <Link to="/" className="checkout-logo">Đạt Hoàng</Link>
          <StepIndicator />
          <Link to="/" className="checkout-continue-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Tiếp tục mua sắm
          </Link>
        </div>
      </header>

      {/* ---- Main ---- */}
      <div className="checkout-page-inner">
        {/* ---- Left column: Form ---- */}
        <div className="checkout-main">

          {/* Alert */}
          <div className="ck-alert" role="alert">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px', flexShrink: 0 }}>
              <path d="M22 8v4M10.25 5.5H6.8C5.12 5.5 4.28 5.5 3.64 5.83A3 3 0 0 0 2.33 7.14C2 7.78 2 8.62 2 10.3v1.2c0 .93 0 1.4.15 1.77.1.24.25.46.44.65.18.18.4.33.64.43.37.15.84.15 1.77.15v4.25c0 .23 0 .35.01.45.05.46.25.89.58 1.22.32.32.75.53 1.21.57.1.01.22.01.45.01s.35 0 .45-.01c.46-.04.89-.25 1.21-.57.33-.33.53-.76.58-1.22.01-.1.01-.22.01-.45V14.5h.75c1.77 0 3.93.95 5.59 1.86.98.53 1.46.79 1.78.75.14-.01.27-.06.39-.13.12-.07.22-.17.3-.28.19-.26.19-.78.19-1.83V5.13c0-1.05 0-1.57-.19-1.83a1 1 0 0 0-.69-.41c-.32-.04-.8.23-1.78.76-1.66.9-3.82 1.85-5.59 1.85Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <strong>Cảnh báo mạo danh Đạt Hoàng:</strong>
              <span> Gần đây xuất hiện mạo danh thương hiệu khi giao hàng. Quý khách cảnh giác với đơn hàng/cuộc gọi lạ. Đồng kiểm khi nhận. Không chuyển khoản trước, không trả thêm phí với các đơn đã thanh toán. Liên hệ Đạt Hoàng để xác minh khi có nghi ngờ.</span>
            </div>
          </div>

          {/* Login / Guest */}
          <section className="ck-card" aria-labelledby="login-title">
            <h2 id="login-title" className="ck-card-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12.34 15.46h-4.5c-1.4 0-2.1 0-2.66.17a5 5 0 0 0-3.67 4.83M16.34 17.96l2 2 4-4M14.84 7.46a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Đăng nhập / Đăng ký
            </h2>

            {isAuthenticated ? (
              <div className="ck-auth-user">
                <div className="ck-auth-user-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="ck-auth-user-info">
                  <div className="ck-auth-user-name">{user.name}</div>
                  <div className="ck-auth-user-email">{user.email}</div>
                </div>
                <button className="ck-auth-user-logout" onClick={logout}>Đăng xuất</button>
              </div>
            ) : showGuestForm ? (
              <>
                <p className="ck-card-description">Đăng nhập / Đăng ký để nhận ưu đãi giảm giá thành viên đến 20%</p>
                <div className="ck-login-row">
                  <div className="ck-coupon-note">
                    <span style={{ fontWeight: '800', fontSize: '16px' }}>%</span>
                    <span>Giảm 80K cho lần mua sắm đầu tiên</span>
                  </div>
                  <button
                    type="button"
                    className="ck-btn ck-btn-dark"
                    onClick={() => navigate('/login', { state: { from: '/checkout' } })}
                  >
                    Đăng nhập / Đăng ký
                  </button>
                </div>
                <div className="ck-divider"><span>Hoặc</span></div>
                <h3 className="ck-section-heading">Mua hàng không đăng nhập</h3>
              </>
            ) : (
              <div className="ck-auth-toggle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="ck-auth-toggle-text">Tiếp tục mua hàng không cần đăng nhập</span>
                <button type="button" className="ck-auth-toggle-btn" onClick={() => setShowGuestForm(true)}>Tiếp tục</button>
              </div>
            )}

            <form id="checkoutForm" onSubmit={handleSubmit}>
              <div className="ck-form-grid">
                <div className="ck-field ck-field-full">
                  <label htmlFor="firstName">Họ</label>
                  <input id="firstName" name="firstName" type="text" placeholder="Nhập họ" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="ck-field ck-field-full">
                  <label htmlFor="lastName">Tên</label>
                  <input id="lastName" name="lastName" type="text" placeholder="Nhập tên" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="ck-field ck-field-full">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input id="phone" name="phone" type="tel" placeholder="Nhập số điện thoại nhận hàng" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="ck-field">
                  <label htmlFor="city">Tỉnh / Thành phố</label>
                  <select id="city" name="city" value={formData.city} onChange={handleChange} required>
                    <option value="">Tỉnh / Thành phố</option>
                    {CITY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="ck-field">
                  <label htmlFor="district">Quận / Huyện</label>
                  <select id="district" name="district" value={formData.district} onChange={handleChange} required>
                    <option value="">Quận / Huyện</option>
                    {DISTRICT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="ck-field">
                  <label htmlFor="ward">Phường / Xã</label>
                  <select id="ward" name="ward" value={formData.ward} onChange={handleChange}>
                    <option value="">Phường / Xã</option>
                    {WARD_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="ck-field ck-field-full">
                  <label htmlFor="address">Địa chỉ chi tiết</label>
                  <input id="address" name="address" type="text" placeholder="Số nhà, đường, phường" value={formData.address} onChange={handleChange} required />
                </div>
              </div>
            </form>
          </section>

          {/* Shipping Method */}
          <section className="ck-card" aria-labelledby="shipping-title">
            <h2 id="shipping-title" className="ck-card-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M14.34 6.96h2.34c.24 0 .36 0 .48.03.1.02.2.06.29.12.1.06.19.15.36.32l4.06 4.06c.17.17.26.26.32.36.05.09.1.19.12.29.03.12.03.24.03.48v2.84c0 .47 0 .7-.08.88a1 1 0 0 1-.54.54c-.18.08-.42.08-.88.08M15.84 16.96h-1.5m0 0V7.16c0-1.12 0-1.68-.22-2.11a2 2 0 0 0-.87-.87c-.43-.22-.99-.22-2.11-.22h-5.6c-1.12 0-1.68 0-2.11.22a2 2 0 0 0-.87.87c-.22.43-.22.99-.22 2.11v7.8a2 2 0 0 0 2 2m10 0h-4m-6 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm16.5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Phương thức vận chuyển
            </h2>
            <div className="ck-hint-box">
              <span className="ck-hint-dot" aria-hidden="true"/>
              <span>Cập nhật thông tin giao hàng để xem chi phí và thời gian giao hàng.</span>
            </div>
            <div className="ck-shipping-options">
              <label className={`ck-shipping-option ${selectedShipping === 'standard' ? 'is-selected' : ''}`}>
                <input type="radio" name="shippingMethod" value="standard" checked={selectedShipping === 'standard'} onChange={() => setSelectedShipping('standard')} />
                <div className="ck-shipping-option-info">
                  <div className="ck-shipping-option-name">Giao hàng tiêu chuẩn</div>
                  <div className="ck-shipping-option-desc">Nhận hàng trong 3-5 ngày làm việc</div>
                </div>
                <div className="ck-shipping-option-price free">Miễn phí</div>
              </label>
              <label className={`ck-shipping-option ${selectedShipping === 'express' ? 'is-selected' : ''}`}>
                <input type="radio" name="shippingMethod" value="express" checked={selectedShipping === 'express'} onChange={() => setSelectedShipping('express')} />
                <div className="ck-shipping-option-info">
                  <div className="ck-shipping-option-name">Giao hàng nhanh</div>
                  <div className="ck-shipping-option-desc">Nhận hàng trong 1-2 ngày làm việc</div>
                </div>
                <div className="ck-shipping-option-price">{formatPrice(30000)}</div>
              </label>
            </div>
          </section>

          {/* Electronic Invoice */}
          <section className="ck-card" aria-labelledby="invoice-title">
            <h2 id="invoice-title" className="ck-card-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M14 2.27V6.4c0 .56 0 .84.11 1.05.1.19.25.34.44.44.21.11.49.11 1.05.11h4.13M16 13H8m8 4H8m2-8H8m6-7H8.8c-1.68 0-2.52 0-3.16.33a3 3 0 0 0-1.31 1.31C4 4.28 4 5.12 4 6.8v10.4c0 1.68 0 2.52.33 3.16a3 3 0 0 0 1.31 1.31c.64.33 1.48.33 3.16.33h6.4c1.68 0 2.52 0 3.16-.33a3 3 0 0 0 1.31-1.31c.33-.64.33-1.48.33-3.16V8l-6-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Xuất hóa đơn điện tử
            </h2>
            <div className="ck-hint-box">
              <span className="ck-hint-dot" aria-hidden="true"/>
              <span>Bạn muốn xuất hóa đơn điện tử? <span className="ck-invoice-link">Nhập thông tin tại đây</span></span>
            </div>
          </section>

          {/* Product List */}
          <section className="ck-card" aria-labelledby="product-title">
            <h2 id="product-title" className="ck-card-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M15.72 7.96a4 4 0 0 1-8 0M3.36 7.36l-.7 8.4c-.15 1.8-.23 2.71.08 3.4.27.62.73 1.12 1.32 1.44.67.36 1.57.36 3.38.36h8.57c1.81 0 2.72 0 3.38-.36a3 3 0 0 0 1.32-1.44c.31-.69.23-1.6.08-3.4l-.7-8.4c-.13-1.55-.19-2.33-.54-2.92a3 3 0 0 0-1.29-1.19c-.61-.29-1.39-.29-2.95-.29H8.14c-1.56 0-2.34 0-2.95.29a3 3 0 0 0-1.29 1.19c-.35.59-.41 1.37-.54 2.92Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sản phẩm ({items.length})
            </h2>

            {items.map((item) => (
              <article className="ck-product-item" key={item.id}>
                <Link to={`/product/${item.slug}`}>
                  <img
                    className="ck-product-image"
                    src={item.image || 'https://via.placeholder.com/94x124'}
                    alt={item.name}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </Link>
                <div>
                  <Link to={`/product/${item.slug}`} style={{ textDecoration: 'none' }}>
                    <p className="ck-product-name">{item.name}</p>
                  </Link>
                  <p className="ck-product-code">SKU: {item.product_id || 'N/A'}</p>
                  <div className="ck-product-meta">
                    {item.color && (
                      <>
                        <span className="ck-color-swatch" title={item.color}/>
                        <span>{item.color}</span>
                      </>
                    )}
                    {item.size && (
                      <>
                        <span className="ck-meta-divider"/>
                        <span>{item.size}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="ck-product-quantity">x {item.quantity}</div>
                <div className="ck-product-price">{formatPrice(item.price * item.quantity)}</div>
              </article>
            ))}
          </section>
        </div>

        {/* ---- Right column: Sidebar ---- */}
        <aside className="checkout-side">
          {/* Voucher link */}
          <Link to="/" className="ck-side-card-link">
            <span className="left">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              Mã ưu đãi
            </span>
            <span className="right">Chọn hoặc nhập mã <span aria-hidden="true">›</span></span>
          </Link>

          {/* Order summary */}
          <section className="ck-card" aria-labelledby="summary-title">
            <h2 id="summary-title" className="ck-card-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M16.34 3.96c.93 0 1.4 0 1.78.1a3 3 0 0 1 2.12 2.12c.1.38.1.85.1 1.78v9.2c0 1.68 0 2.52-.33 3.16a3 3 0 0 1-1.31 1.31c-.64.33-1.48.33-3.16.33h-6.4c-1.68 0-2.52 0-3.16-.33a3 3 0 0 1-1.31-1.31c-.33-.64-.33-1.48-.33-3.16v-9.2c0-.93 0-1.4.1-1.78a3 3 0 0 1 2.12-2.12c.38-.1.85-.1 1.78-.1m1 11 2 2 4.5-4.5M9.94 5.96h4.8c.56 0 .84 0 1.05-.11.19-.1.34-.25.44-.44.11-.21.11-.49.11-1.05v-.8c0-.56 0-.84-.11-1.05a1 1 0 0 0-.44-.44c-.21-.11-.49-.11-1.05-.11h-4.8c-.56 0-.84 0-1.05.11-.19.1-.34.25-.44.44-.11.21-.11.49-.11 1.05v.8c0 .56 0 .84.11 1.05.1.19.25.34.44.44.21.11.49.11 1.05.11Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Chi tiết đơn hàng
            </h2>

            <div className="ck-summary-list">
              <div className="ck-summary-row">
                <span>Giá trị đơn hàng</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="ck-summary-row">
                <span>Phí vận chuyển</span>
                <span style={{ color: shippingFee === 0 ? '#27ae60' : 'inherit' }}>
                  {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                </span>
              </div>
            </div>

            <div className="ck-summary-total">
              <div>
                <strong>Tổng tiền thanh toán</strong>
                <small>(Đã bao gồm thuế VAT)</small>
              </div>
              <div className="ck-summary-price">
                <strong>{formatPrice(total)}</strong>
                <small>Tiết kiệm 0 đ</small>
              </div>
            </div>

            {/* Payment methods */}
            <div className="ck-payment-area">
              <p style={{ fontWeight: '700', fontSize: '13px', marginBottom: '12px', color: 'var(--brand-dark)' }}>Phương thức thanh toán</p>
              <div className="ck-payment-options">
                {[
                  { value: 'cod', name: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi nhận được hàng' },
                  { value: 'bank', name: 'Chuyển khoản ngân hàng', desc: 'Thanh toán qua tài khoản ngân hàng' },
                  { value: 'vnpay', name: 'Thanh toán VNPay', desc: 'QR code qua ứng dụng ngân hàng' },
                  { value: 'momo', name: 'Thanh toán MoMo', desc: 'Thanh toán nhanh qua ví MoMo' },
                ].map(opt => (
                  <label key={opt.value} className={`ck-payment-option ${formData.paymentMethod === opt.value ? 'is-selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value={opt.value} checked={formData.paymentMethod === opt.value} onChange={handleChange} form="checkoutForm" />
                    <div className="ck-payment-option-info">
                      <div className="ck-payment-option-name">{opt.name}</div>
                      <div className="ck-payment-option-desc">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                form="checkoutForm"
                disabled={!isFormValid() || loading}
                className="ck-btn ck-btn-primary"
                style={{ marginTop: '20px' }}
              >
                {loading ? 'Đang xử lý...' : 'Thanh toán'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--brand-muted)', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Thanh toán an toàn &amp; bảo mật
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default CheckoutPage

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, register, isAuthenticated, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    rememberMe: false
  })

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (isRegister && !formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên'
    }

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Vui lòng nhập email hoặc số điện thoại'
    } else if (!isRegister) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const phoneRegex = /^0\d{9,10}$/
      const isEmail = emailRegex.test(formData.identifier)
      const isPhone = phoneRegex.test(formData.identifier.replace(/\s/g, ''))
      if (!isEmail && !isPhone) {
        newErrors.identifier = 'Email hoặc số điện thoại không hợp lệ'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      let result
      if (isRegister) {
        result = await register({
          name: formData.name,
          email: formData.identifier,
          phone: formData.phone,
          password: formData.password
        })
      } else {
        result = await login(formData.identifier, formData.password)
      }

      if (result.success) {
        navigate('/profile')
      } else {
        setErrors({ general: result.error || 'Có lỗi xảy ra. Vui lòng thử lại.' })
      }
    } catch {
      setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại.' })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f5f6f7] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#e5eaf0] border-t-[#333F48] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] flex flex-col">
      <Header cartCount={0} />

      <main className="login-main flex-1 flex items-center justify-center px-4 py-12">
        {/* Login Card */}
        <div className="login-card w-full max-w-[460px] bg-white rounded-lg border border-[#e5eaf0] shadow-sm p-8 md:p-10 animate-fade-up">

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#333F48] tracking-tight mb-2">
              {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
            </h1>
            <p className="text-[#6b7785] text-sm leading-relaxed">
              {isRegister
                ? 'Đăng ký tài khoản để hưởng nhiều ưu đãi dành cho thành viên.'
                : 'Đăng nhập để theo dõi đơn hàng, nhận ưu đãi và mua sắm nhanh hơn.'}
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d71920" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span className="text-red-600 text-sm font-medium">{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form space-y-5">
            {/* Name (Register only) */}
            {isRegister && (
              <div className="form-group">
                <label className="block text-sm font-semibold text-[#2f3a45] mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className={`login-input ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
            )}

            {/* Email or Phone */}
            <div className="form-group">
              <label className="block text-sm font-semibold text-[#2f3a45] mb-2">
                Email hoặc số điện thoại
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Nhập email hoặc số điện thoại"
                className={`login-input ${errors.identifier ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
              />
              {errors.identifier && <p className="form-error">{errors.identifier}</p>}
            </div>

            {/* Phone (Register only) */}
            {isRegister && (
              <div className="form-group">
                <label className="block text-sm font-semibold text-[#2f3a45] mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912 345 678"
                  className={`login-input ${errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <label className="block text-sm font-semibold text-[#2f3a45] mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className={`login-input password-field pr-12 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            {/* Confirm Password (Register only) */}
            {isRegister && (
              <div className="form-group">
                <label className="block text-sm font-semibold text-[#2f3a45] mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  className={`login-input ${errors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Form options */}
            {!isRegister && (
              <div className="form-options">
                <label className="remember-me cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#d71920] cursor-pointer"
                  />
                  <span className="text-sm text-[#6b7785] ml-2 select-none">Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  ĐANG ĐĂNG NHẬP...
                </span>
              ) : (
                isRegister ? 'TẠO TÀI KHOẢN' : 'ĐĂNG NHẬP'
              )}
            </button>
          </form>

          {/* Google Login */}
          <button
            type="button"
            className="w-full h-12 flex items-center justify-center gap-3 bg-white border-[3px] border-[#708090] rounded-lg text-[#2f3a45] font-semibold text-sm hover:bg-[#eff2f5] hover:border-[#4a5568] active:scale-[0.99] transition-all duration-200 cursor-pointer mt-5"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Đăng nhập với Google
          </button>

          {/* Register Link */}
          <div className="register-link">
            <span className="text-[#6b7785] text-sm">
              {isRegister ? 'Đã có tài khoản?' : 'Bạn chưa có tài khoản?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setErrors({})
                setFormData({ identifier: '', password: '', confirmPassword: '', name: '', phone: '', rememberMe: false })
              }}
            >
              {isRegister ? 'Đăng nhập' : 'Đăng ký ngay'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default LoginPage

import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AdminAuthContext = createContext(null)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const res = await api.get('/admin/profile')
        setAdmin(res.user)
      }
    } catch (err) {
      localStorage.removeItem('admin_token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const res = await api.post('/admin/login', { email, password })
      const { token, user } = res
      localStorage.setItem('admin_token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setAdmin(user)
      return { success: true }
    } catch (err) {
      const status = err.response?.status
      let message = 'Đăng nhập thất bại'
      if (status === 401) {
        message = 'Email hoặc mật khẩu không đúng'
      } else if (status === 403) {
        message = err.response?.data?.message || 'Tài khoản không có quyền truy cập trang quản trị'
      } else {
        message = err.response?.data?.message || 'Đăng nhập thất bại'
      }
      setError(message)
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await api.post('/admin/logout')
    } catch (err) {
      // ignore
    }
    localStorage.removeItem('admin_token')
    delete api.defaults.headers.common['Authorization']
    setAdmin(null)
  }

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/admin/profile', data)
      setAdmin(res.user)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Cập nhật thất bại' }
    }
  }

  const value = {
    admin,
    loading,
    error,
    isAuthenticated: !!admin,
    isAdmin: admin?.role === 'admin' || admin?.role === 'manager',
    login,
    logout,
    updateProfile,
    clearError: () => setError(null)
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
})

// Log all requests
api.interceptors.request.use(
  (config) => {
    const requestUrl = config.url || ''
    const isAdminRequest = requestUrl.startsWith('/admin')
    const adminToken = localStorage.getItem('admin_token')
    const customerToken = localStorage.getItem('clothing_store_token')
    const token = isAdminRequest ? adminToken : customerToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (config.headers.Authorization) {
      delete config.headers.Authorization
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRequest = error.config?.url?.startsWith('/admin')
      if (isAdminRequest) {
        localStorage.removeItem('admin_token')
        window.location.href = '/admin/login'
      } else {
        localStorage.removeItem('clothing_store_token')
        localStorage.removeItem('clothing_store_auth')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        sessionStorage.removeItem('clothing_store_token')
        sessionStorage.removeItem('clothing_store_auth')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const homeAPI = {
  getHomeData: () => api.get('/home'),
}

export const searchAPI = {
  search: (query) => api.get(`/products/search?q=${encodeURIComponent(query)}`),
}

export const productAPI = {
  getProduct: (slug) => api.get(`/products/${slug}`),
  getProducts: (params) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/products${queryParams ? `?${queryParams}` : ''}`)
  },
  getKidsProducts: (params) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/products/kids${queryParams ? `?${queryParams}` : ''}`)
  },
  getKidsCategories: () => api.get('/products/kids-categories'),
  search: (query) => api.get(`/products/search?q=${encodeURIComponent(query)}`),
  getSuggested: (params) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/products/suggested${queryParams ? `?${queryParams}` : ''}`)
  },
}

export const saleAPI = {
  getSaleProducts: (params) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/products/sale${queryParams ? `?${queryParams}` : ''}`)
  },
}

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: (params) => api.get('/orders', { params }),
  getOrderDetail: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
}

export const customerAPI = {
  createReview: (data) => api.post('/reviews', data),
}

export default api

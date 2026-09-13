import React, { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

const AUTH_STORAGE_KEY = 'clothing_store_auth'
const TOKEN_KEY = 'clothing_store_token'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false }
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } }
    case 'INIT_AUTH':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false }
    default:
      return state
  }
}

function loadAuthFromStorage() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    return { user: saved ? JSON.parse(saved) : null, token }
  } catch {
    return { user: null, token: null }
  }
}

function saveAuthToStorage(user, token) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      if (token) localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
    }
  } catch (error) {
    console.error('Error saving auth:', error)
  }
}

const DEFAULT_AVATAR = null

function buildUserObject(userData, id) {
  return {
    id,
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    birthDate: '',
    gender: '',
    avatar: userData.avatar !== undefined ? userData.avatar : DEFAULT_AVATAR,
    memberLevel: 'Bronze'
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const { user } = loadAuthFromStorage()
    dispatch({ type: 'INIT_AUTH', payload: user })
  }, [])

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await api.post('/auth/login', { email, password })
      if (res.success) {
        saveAuthToStorage(res.user, res.token)
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.user })
        return { success: true }
      }
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: false, error: res.message || 'Đăng nhập thất bại' }
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false })
      const message = err.response?.data?.message || 'Đăng nhập thất bại'
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await api.post('/auth/register', userData)
      if (res.success) {
        saveAuthToStorage(res.user, res.token)
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.user })
        return { success: true }
      }
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: false, error: res.message || 'Đăng ký thất bại' }
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false })
      const message = err.response?.data?.message || 'Đăng ký thất bại'
      return { success: false, error: message }
    }
  }

  const logout = () => {
    saveAuthToStorage(null, null)
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (data) => {
    const updatedUser = { ...state.user, ...data }
    saveAuthToStorage(updatedUser, null)
    dispatch({ type: 'UPDATE_USER', payload: data })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

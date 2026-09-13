import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import api from '../services/api'

const NotificationContext = createContext()

const ICON_MAP = {
  shopping_bag: 'ShoppingBag',
  clock: 'Clock',
  package_check: 'PackageCheck',
  x_circle: 'XCircle',
  alert_triangle: 'AlertTriangle',
  package_x: 'PackageX',
  credit_card: 'CreditCard',
  rotate_ccw: 'RotateCcw',
  star: 'Star',
  mail: 'Mail',
  check_circle: 'CheckCircle',
  dollar_sign: 'DollarSign',
}

const COLOR_MAP = {
  info: { bg: 'bg-red-50', text: 'text-[#d71920]' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
}

let notifIdCounter = 10000

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const lastFetchRef = useRef(0)
  const intervalRef = useRef(null)

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async (force = false) => {
    if (!force && Date.now() - lastFetchRef.current < 15000) return
    setLoading(true)
    try {
      const res = await api.get('/admin/notifications')
      // res is already response.data due to interceptor
      let notifs = [], cts = {}
      if (Array.isArray(res)) {
        notifs = res
      } else if (res && typeof res === 'object') {
        notifs = Array.isArray(res.notifications) ? res.notifications : res
        cts = res.counts || {}
      }
      setNotifications(notifs)
      setCounts(cts)
      lastFetchRef.current = Date.now()
    } catch (err) {
      // Silently fail — notifications are non-critical
    } finally {
      setLoading(false)
    }
  }, [])

  // Push a new notification (e.g. after order status change)
  const pushNotification = useCallback((data) => {
    const id = `push_${++notifIdCounter}_${Date.now()}`
    const notif = {
      id,
      type: data.type || 'info',
      title: data.title || 'Thông báo',
      message: data.message || '',
      time: new Date().toISOString(),
      link: data.link || '/admin/orders',
      icon: data.icon || 'check_circle',
      color: data.color || 'info',
      isNew: true,
    }
    setNotifications(prev => [notif, ...prev].slice(0, 50))
    setCounts(prev => ({ ...prev, all: (prev.all || 0) + 1 }))
    return id
  }, [])

  // Mark a notification as read
  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isNew: false } : n))
  }, [])

  // Mark all as read
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })))
  }, [])

  // Dismiss a notification
  const dismiss = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Clear all
  const clearAll = useCallback(() => {
    setNotifications([])
    setCounts({})
  }, [])

  // Auto-fetch on mount + interval
  useEffect(() => {
    fetchNotifications(true)
    intervalRef.current = setInterval(() => fetchNotifications(false), 60000)
    return () => clearInterval(intervalRef.current)
  }, [fetchNotifications])

  // When panel opens, refresh
  useEffect(() => {
    if (showPanel) fetchNotifications(true)
  }, [showPanel, fetchNotifications])

  const totalUnread = notifications.filter(n => n.isNew).length
  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <NotificationContext.Provider value={{
      notifications,
      counts,
      loading,
      showPanel,
      setShowPanel,
      fetchNotifications,
      pushNotification,
      markRead,
      markAllRead,
      dismiss,
      clearAll,
      totalUnread,
      totalAll,
      ICON_MAP,
      COLOR_MAP,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider')
  return ctx
}

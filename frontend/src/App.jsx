import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Home from './pages/Home'
import ProductDetailPage from './pages/ProductDetailPage'
import SearchPage from './pages/SearchPage'
import MenPage from './pages/MenPage'
import WomenPage from './pages/WomenPage'
import KidsPage from './pages/KidsPage'
import SalePage from './pages/SalePage'
import AboutPage from './pages/AboutPage'
import ShippingPage from './pages/ShippingPage'
import ReturnsPage from './pages/ReturnsPage'
import PrivacyPage from './pages/PrivacyPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import LoginPage from './pages/LoginPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import WishlistPage from './pages/WishlistPage'
import AddressesPage from './pages/AddressesPage'

import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminCategories from './pages/admin/AdminCategories'
import AdminBrands from './pages/admin/AdminBrands'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminEmployees from './pages/admin/AdminEmployees'
import AdminPromotions from './pages/admin/AdminPromotions'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminWarehouse from './pages/admin/AdminWarehouse'
import AdminImport from './pages/admin/AdminImport'
import AdminReviews from './pages/admin/AdminReviews'
import AdminBlog from './pages/admin/AdminBlog'
import AdminReports from './pages/admin/AdminReports'
import AdminContacts from './pages/admin/AdminContacts'
import AdminSettings from './pages/admin/AdminSettings'
import AdminLogin from './pages/admin/AdminLogin'

function AdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Đang tải...</p>
        </div>
      </div>
    )
  }
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <ToastProvider>
              <Router>
              <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/nam" element={<MenPage />} />
                <Route path="/nu" element={<WomenPage />} />
                <Route path="/tre-em" element={<KidsPage />} />
                <Route path="/giam-gia" element={<SalePage />} />
                <Route path="/category/:slug" element={<Home />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route path="/favorites" element={<WishlistPage />} />
                <Route path="/addresses" element={<AddressesPage />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/create" element={<AdminProductForm />} />
                  <Route path="products/edit/:id" element={<AdminProductForm isEdit />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="brands" element={<AdminBrands />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="employees" element={<AdminEmployees />} />
                  <Route path="promotions" element={<AdminPromotions />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="warehouse" element={<AdminWarehouse />} />
                  <Route path="import" element={<AdminImport />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="contacts" element={<AdminContacts />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Router>
            </ToastProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </CartProvider>
    </ErrorBoundary>
  )
}

export default App

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { searchAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice } from '../utils/formatPrice'
import CartDrawer from './CartDrawer'

const Header = () => {
  const { getItemCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  const userMenuRef = useRef(null)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  const cartCount = getItemCount()

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Expose cart bounce trigger
  useEffect(() => {
    window.__triggerCartBounce = () => {
      setCartBounce(true)
      setTimeout(() => setCartBounce(false), 600)
    }
    return () => { delete window.__triggerCartBounce }
  }, [])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const delaySearch = setTimeout(async () => {
      try {
        const response = await searchAPI.search(searchQuery)
        const products = response.data?.products || response.data || []
        setSearchResults(products)
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [searchQuery])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowResults(false)
      setSearchQuery('')
    }
  }

  const handleResultClick = (productSlug) => {
    navigate(`/product/${productSlug}`)
    setShowResults(false)
    setSearchQuery('')
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_8px_rgba(0,0,0,0.1)]' : 'shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
        }`}
      >
        <div className="container">
          <div className="flex items-center h-16 lg:h-[72px] gap-4">
            <Link to="/" className="text-xl lg:text-2xl font-black tracking-[0.1em] text-[#333F48] flex-shrink-0 transition-opacity duration-200 hover:opacity-80">
              Minh Hải
            </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 ml-8 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="nav-link font-bold text-sm text-[#333F48] whitespace-nowrap hover:text-[#DA291C] transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3 ml-auto">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74869B] transition-colors duration-200" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/>
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim() && setShowResults(true)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="input-animate w-48 lg:w-64 h-9 pl-9 pr-3 border border-[#ADBCCD] rounded text-sm text-[#333F48] bg-white placeholder:text-[#74869B]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); setSearchResults([]); setShowResults(false); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#74869B] hover:text-[#333F48] transition-colors duration-200"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                      </svg>
                    </button>
                  )}
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="animate-fade-down absolute top-full right-0 mt-1 bg-white rounded shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#E5EAF0] overflow-hidden max-h-[400px] overflow-y-auto w-80 z-50">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.slice(0, 6).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleResultClick(product.slug)}
                          className="flex items-center gap-3 p-3 hover:bg-[#F4F6F9] cursor-pointer transition-colors duration-150"
                        >
                          <img
                            src={product.image_url || product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-[#333F48] truncate">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold text-sm text-[#DA291C]">
                                {formatPrice(product.price)}
                              </span>
                              {product.compare_price && product.compare_price > product.price && (
                                <span className="text-[#74869B] text-xs line-through">
                                  {formatPrice(product.compare_price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div
                        onClick={handleSearchSubmit}
                        className="p-3 text-center text-[#DA291C] font-bold text-sm cursor-pointer border-t border-[#E5EAF0] hover:bg-[#F4F6F9] transition-colors duration-150"
                      >
                        Xem thêm kết quả cho "{searchQuery}"
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-[#74869B]">
                      <p>Không tìm thấy sản phẩm nào</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 text-[#333F48] hover:text-[#DA291C] transition-colors duration-200"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="animate-fade-down absolute top-full right-0 mt-2 w-56 bg-white rounded shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#E5EAF0] overflow-hidden z-50">
                      <div className="p-4 border-b border-[#E5EAF0]">
                        <p className="font-semibold text-[#333F48] truncate">{user?.name}</p>
                        <p className="text-sm text-[#74869B] truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-[#333F48] hover:bg-[#F4F6F9] hover:text-[#DA291C] transition-colors duration-150 text-sm"
                        >
                          Hồ sơ cá nhân
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-[#333F48] hover:bg-[#F4F6F9] hover:text-[#DA291C] transition-colors duration-150 text-sm"
                        >
                          Đơn hàng của tôi
                        </Link>
                        <Link
                          to="/favorites"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-[#333F48] hover:bg-[#F4F6F9] hover:text-[#DA291C] transition-colors duration-150 text-sm"
                        >
                          Yêu thích
                        </Link>
                      </div>
                      <div className="border-t border-[#E5EAF0] py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors duration-150 w-full text-sm"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-[#333F48] hover:text-[#DA291C] transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </Link>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setShowCartDrawer(true)}
              className="p-2 text-[#333F48] hover:text-[#DA291C] relative transition-colors duration-200 btn-press"
            >
              <span
                className={`transition-transform duration-300 ${cartBounce ? 'cart-bounce' : ''}`}
                style={{ display: 'inline-block' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
              </span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[#DA291C] text-white text-[10px] font-bold rounded-full flex items-center justify-center transition-transform duration-200"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="p-2 text-[#333F48] lg:hidden transition-colors duration-200"
            >
              {showMobileNav ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`border-t border-[#ADBCCD] lg:hidden overflow-hidden transition-all duration-300 ${
            showMobileNav ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setShowMobileNav(false)}
                className="block py-2.5 font-bold text-sm text-[#333F48] hover:text-[#DA291C] transition-colors duration-150"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
    </header>
    </>
  )
}

const navLinks = [
  { name: 'NỮ', href: '/nu' },
  { name: 'NAM', href: '/nam' },
  { name: 'TRẺ EM', href: '/tre-em' },
  { name: 'GIẢM GIÁ', href: '/giam-gia' }
]

export default Header

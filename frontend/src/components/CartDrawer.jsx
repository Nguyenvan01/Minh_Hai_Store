import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { productAPI } from '../services/api'
import { formatPrice } from '../utils/formatPrice'

const FREESHIP_THRESHOLD = 300000

// ===== Header =====
const CartDrawerHeader = ({ itemCount, onClose }) => (
  <div className="cart-drawer-header">
    <div className="flex items-center justify-between">
      <h2 className="text-base font-bold text-[#2f3a45]">
        Giỏ hàng ({itemCount})
      </h2>
      <button
        onClick={onClose}
        className="cart-drawer-close btn-press"
        aria-label="Đóng giỏ hàng"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
    <div className="cart-free-ship-alert">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span>Mua thêm <strong>300.000 đ</strong> để được miễn phí vận chuyển</span>
    </div>
  </div>
)

// ===== Select All Row =====
const SelectAllRow = ({ allSelected, partialSelected, onToggleAll, selectedCount }) => (
  <div className="cart-select-all">
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={allSelected}
        ref={(el) => { if (el) el.indeterminate = partialSelected }}
        onChange={onToggleAll}
        className="cart-checkbox"
      />
      <span className="text-sm font-medium text-[#2f3a45]">Chọn tất cả</span>
    </label>
    <span className="text-xs text-[#6b7785]">
      Đã chọn {selectedCount} sản phẩm
    </span>
  </div>
)

// ===== Cart Item =====
const CartItemRow = ({ item, isSelected, onToggle, onIncrease, onDecrease, onRemove, onNavigate }) => {
  const [showMenu, setShowMenu] = useState(false)

  const handleNavigate = (e) => {
    e.stopPropagation()
    onNavigate(item.slug)
  }

  return (
    <div className={`cart-item ${isSelected ? 'cart-item--selected' : ''}`}>
      <label className="flex items-start gap-4 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(item.id)}
          className="cart-checkbox mt-2 flex-shrink-0"
        />
        <Link
          to={`/product/${item.slug}`}
          onClick={handleNavigate}
          className="cart-item-image-link flex-shrink-0"
        >
          <img
            src={item.image || 'https://via.placeholder.com/90'}
            alt={item.name}
            className="cart-item-image"
          />
        </Link>
        <div className="cart-item-info flex-1 min-w-0">
          <Link
            to={`/product/${item.slug}`}
            onClick={handleNavigate}
            className="cart-item-title-link line-clamp-2"
          >
            <h4 className="cart-item-title line-clamp-2">{item.name}</h4>
          </Link>
          <p className="cart-item-variant">
            {item.color} {item.size ? `| ${item.size}` : ''}
          </p>
          <p className="cart-item-price">
            {item.compare_price && item.compare_price > item.price && (
              <span className="cart-item-price-compare">
                {formatPrice(item.compare_price)}
              </span>
            )}
            <span className={item.compare_price > item.price ? 'text-[#d71920]' : ''}>
              {formatPrice(item.price)}
            </span>
          </p>
        </div>
      </label>

      {/* Action menu */}
      <div className="cart-item-menu">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="cart-item-menu-btn btn-press"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
          </svg>
        </button>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-[1]" onClick={() => setShowMenu(false)} />
            <div className="cart-item-dropdown animate-scale-in">
              <button onClick={() => { onRemove(item.id); setShowMenu(false); }}>
                Xóa
              </button>
            </div>
          </>
        )}
      </div>

      {/* Quantity controls */}
      <div className="cart-item-quantity">
        <button
          onClick={() => onDecrease(item.id)}
          disabled={item.quantity <= 1}
          className="cart-qty-btn btn-press"
          aria-label="Giảm số lượng"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <span className="cart-qty-value">{item.quantity}</span>
        <button
          onClick={() => onIncrease(item.id)}
          className="cart-qty-btn btn-press"
          aria-label="Tăng số lượng"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ===== Suggested Product Card =====
const SuggestedProductCard = ({ product, onAddToCart }) => {
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : 0

  return (
    <div className="suggested-card hover-lift">
      <div className="suggested-card-image">
        <img
          src={product.image_url || product.image || 'https://via.placeholder.com/160'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {discount > 0 && (
          <span className="suggested-badge-sale">-{discount}%</span>
        )}
        <button
          onClick={() => onAddToCart(product)}
          className="suggested-card-add btn-press"
          aria-label="Thêm vào giỏ hàng"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
      <div className="suggested-card-body">
  <h5 className="suggested-card-title line-clamp-2">
    {product.name}
  </h5>

  {discount > 0 && (
    <p className="suggested-price-old">
      {formatPrice(product.compare_price)}
    </p>
  )}

  <div className="flex items-center gap-1.5 flex-wrap">
    <p className="suggested-price-new">
      {formatPrice(product.price)}
    </p>

    {product.is_online_exclusive === true && (
      <span className="suggested-badge-exclusive">
        Giá độc quyền Online
      </span>
    )}
  </div>

  {product.colors && product.colors.length > 0 && (
    <div className="suggested-card-colors">
      {product.colors.slice(0, 4).map((c, i) => (
        <span
          key={i}
          className="suggested-color-dot"
          style={{ backgroundColor: c.hex || c.code || '#ccc' }}
          title={c.name}
        />
      ))}
    </div>
  )}
</div>
    </div>
  )
}

// ===== Coupon Row =====
const CouponRow = ({ onOpen }) => (
  <button onClick={onOpen} className="coupon-row btn-press">
    <div className="flex items-center gap-2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
      <span className="text-sm font-medium text-[#2f3a45]">Mã ưu đãi</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="text-xs text-[#6b7785]">Chọn hoặc nhập mã</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7785" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </div>
  </button>
)

// ===== Subtotal Row =====
const CartSummary = ({ subtotal }) => (
  <div className="cart-subtotal">
    <span className="text-sm text-[#6b7785]">Tạm tính</span>
    <span className="text-base font-bold text-[#2f3a45]">{formatPrice(subtotal)}</span>
  </div>
)

// ===== Footer =====
const CartFooter = ({ disabled, onCheckout }) => (
  <div className="cart-footer">
    <button
      onClick={onCheckout}
      disabled={disabled}
      className="checkout-button btn-press"
    >
      THANH TOÁN
    </button>
  </div>
)

// ===== Main CartDrawer =====
const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem } = useCart()
  const [selectedItems, setSelectedItems] = useState({})
  const [suggestedProducts, setSuggestedProducts] = useState([])

  // Fetch suggested products from API
  useEffect(() => {
    if (!isOpen) return
    const cartProductIds = items.map(i => i.product_id).join(',')
    productAPI.getSuggested({ exclude: cartProductIds, limit: 6 })
      .then(res => {
        if (res.success && res.data) {
          setSuggestedProducts(res.data)
        }
      })
      .catch(err => console.error('Error fetching suggested products:', err))
  }, [isOpen, items])

  // Select all by default when items change
  useEffect(() => {
    if (items.length > 0) {
      setSelectedItems(items.reduce((acc, item) => ({ ...acc, [item.id]: true }), {}))
    } else {
      setSelectedItems({})
    }
  }, [items])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleToggleItem = useCallback((id) => {
    setSelectedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const handleToggleAll = useCallback(() => {
    const allSelected = items.length > 0 && items.every(item => selectedItems[item.id])
    if (allSelected) {
      setSelectedItems({})
    } else {
      setSelectedItems(items.reduce((acc, item) => ({ ...acc, [item.id]: true }), {}))
    }
  }, [items, selectedItems])

  const handleIncrease = useCallback((id) => {
    const item = items.find(i => i.id === id)
    if (item) updateQuantity(id, item.quantity + 1)
  }, [items, updateQuantity])

  const handleDecrease = useCallback((id) => {
    const item = items.find(i => i.id === id)
    if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1)
  }, [items, updateQuantity])

  const handleAddSuggested = useCallback((product) => {
    onClose()
    navigate(`/product/${product.slug}`)
  }, [navigate, onClose])

  const handleNavigateToProduct = useCallback((slug) => {
    onClose()
    navigate(`/product/${slug}`)
  }, [onClose, navigate])

  const handleCheckout = useCallback(() => {
    onClose()
    navigate('/checkout')
  }, [onClose, navigate])

  const allSelected = items.length > 0 && items.every(item => selectedItems[item.id])
  const partialSelected = items.some(item => selectedItems[item.id]) && !allSelected
  const selectedCount = Object.values(selectedItems).filter(Boolean).length
  const subtotal = items
    .filter(item => selectedItems[item.id])
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-drawer-overlay ${isOpen ? 'cart-drawer-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng"
      >
        <CartDrawerHeader itemCount={items.length} onClose={onClose} />

        {items.length === 0 ? (
          <div className="cart-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ADBCCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <p className="text-[#6b7785] font-medium mt-4">Giỏ hàng trống</p>
            <p className="text-[#ADBCCD] text-sm mt-1">Hãy thêm sản phẩm vào giỏ hàng</p>
            <button
              onClick={onClose}
              className="mt-5 px-6 py-2.5 border border-[#ADBCCD] text-[#2f3a45] text-sm font-semibold rounded hover:bg-[#F4F6F9] transition-colors duration-200"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            {/* Select all + content */}
            <div className="cart-body">
              <SelectAllRow
                allSelected={allSelected}
                partialSelected={partialSelected}
                onToggleAll={handleToggleAll}
                selectedCount={selectedCount}
              />

              <div className="cart-items-list">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    isSelected={!!selectedItems[item.id]}
                    onToggle={handleToggleItem}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={removeItem}
                    onNavigate={handleNavigateToProduct}
                  />
                ))}
              </div>

              {/* Suggested Products */}
              <div className="suggested-section">
                <h3 className="suggested-section-title">GỢI Ý CHO BẠN</h3>
                <div className="suggested-grid">
                  {suggestedProducts.map((product) => (
                    <SuggestedProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddSuggested}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="cart-footer-wrapper">
              <CouponRow onOpen={() => {}} />
              <CartSummary subtotal={subtotal} />
              <CartFooter
                disabled={selectedCount === 0}
                onCheckout={handleCheckout}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CartDrawer

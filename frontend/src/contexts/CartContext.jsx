import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const CART_STORAGE_KEY = 'clothing_store_cart'

const initialState = {
  items: [],
  loading: false,
  error: null
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_CART':
      return { ...state, items: action.payload, loading: false, error: null }
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.product_id === action.payload.product_id && 
                item.size === action.payload.size && 
                item.color === action.payload.color
      )
      if (existingIndex >= 0) {
        const newItems = [...state.items]
        newItems[existingIndex].quantity += action.payload.quantity
        return { ...state, items: newItems }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      )
      return { ...state, items: newItems }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

// Load cart from localStorage
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Save cart to localStorage
function saveCartToStorage(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => ({
    ...initial,
    items: loadCartFromStorage()
  }))

  // Save to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(state.items)
  }, [state.items])

  const addItem = (product, quantity = 1, size = null, color = null) => {
    const cartItem = {
      id: `${product.id}-${size || 'default'}-${color || 'default'}-${Date.now()}`,
      product_id: product.id,
      variant_id: product.variant_id || product.selected_variant_id || null,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
      image: product.image_url || product.images?.[0]?.url,
      quantity,
      size,
      color
    }
    dispatch({ type: 'ADD_ITEM', payload: cartItem })
    return true
  }

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartTotal = () => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getOriginalTotal = () => {
    return state.items.reduce((sum, item) => {
      return sum + (item.compare_price || item.price) * item.quantity
    }, 0)
  }

  const getItemCount = () => {
    return state.items.length
  }

  const value = {
    ...state,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
    getOriginalTotal,
    getItemCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

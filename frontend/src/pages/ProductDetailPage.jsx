import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import { productAPI, customerAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const getHighResUrl = (url) => {
  if (!url) return url
  if (url.includes('unsplash.com')) {
    return url.replace(/w=\d+/, 'w=1600').replace(/q=\d+/, 'q=90')
  }
  return url
}

const ProductDetailPage = () => {
  const { slug } = useParams()
  const { addItem } = useCart()
  const toast = useToast()
  const { user, isAuthenticated } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [openAccordion, setOpenAccordion] = useState('description')
  const [copied, setCopied] = useState(false)
  const [reviews, setReviews] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewErrors, setReviewErrors] = useState({})
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  // Mock data fallback
  const mockProduct = {
    title: 'Áo phông người lớn regular Trên đỉnh gió',
    sku: '5TS26S027-SK010',
    price: 299000,
    comparePrice: null,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
      'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'
    ],
    colors: [
      { id: 'black', name: 'Đen SK010', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80' },
      { id: 'white', name: 'Trắng SK011', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80' },
      { id: 'gray', name: 'Xám SK012', hex: '#6b7280', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
      { id: 'navy', name: 'Navy SK013', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80' }
    ],
    sizes: [
      { label: 'XS', disabled: false },
      { label: 'S', disabled: false },
      { label: 'M', disabled: false },
      { label: 'L', disabled: false },
      { label: 'XL', disabled: false },
      { label: 'XXL', disabled: true }
    ],
    description: [
      'Sản phẩm thuộc Limited Edition "Trên Đỉnh Gió"',
      'Lấy cảm hứng từ ca khúc cùng tên của Ban nhạc Bức Tường, như một bản tuyên ngôn của Rock Việt về tình yêu di sản văn hoá và khát vọng vươn tới đỉnh cao.',
      'Chất liệu cotton 100% thoáng mát, mềm mại, thấm hút mồ hôi tốt. Phù hợp cho mọi hoàn cảnh từ đi chơi, đi làm đến các buổi biểu diễn âm nhạc.',
      'Thiết kế regular fit vừa vặn, dễ phối hợp với nhiều loại trang phục khác nhau. In họa tiết độc đáo mang đậm dấu ấn của "Trên Đỉnh Gió".'
    ],
    materials: [
      'Cotton 100%',
      'Thoáng mát, thoải mái khi mặc',
      'Bền màu sau nhiều lần giặt',
      'Không phai màu, không bám dính'
    ],
    care: [
      'Giặt máy ở nhiệt độ thường',
      'Không tẩy trắng',
      'Ủi ở nhiệt độ trung bình',
      'Phơi trong bóng râm'
    ],
    services: [
      {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        ),
        title: 'Thanh toán khi nhận hàng (COD)',
        desc: 'Giao hàng toàn quốc.'
      },
      {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        ),
        title: 'Miễn phí giao hàng',
        desc: 'Với đơn hàng trên 599.000 đ.'
      },
      {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        ),
        title: 'Đổi hàng miễn phí',
        desc: 'Trong 30 ngày kể từ ngày mua.'
      }
    ]
  }

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setProduct(null)
      try {
        const response = await productAPI.getProduct(slug)
        if (response && response.success && response.data) {
          const p = response.data
          // Build images array: prefer p.images (array of objects), then single image fields, then placeholder
          let images = []
          if (Array.isArray(p.images) && p.images.length > 0) {
            images = p.images
              .map(i => i.url || i.src || i.image_url || i.image)
              .filter(Boolean)
          }
          if (images.length === 0) {
            if (p.image_url) images = [p.image_url]
            else if (p.image) images = [p.image]
          }
          // Deduplicate while preserving order
          images = [...new Set(images)]
          if (images.length === 0) {
            images = ['https://via.placeholder.com/800x1067/f3f4f6/9ca3af?text=No+Image']
          }
          setProduct({
            id: p.id,
            slug: p.slug,
            title: p.name,
            sku: p.sku || 'N/A',
            price: p.price,
            comparePrice: p.compare_price,
            images,
            colors: p.colors?.length ? p.colors.map(c => ({
              id: c.id, code: c.code, name: c.name, hex: c.hex || c.hex_code || '#ccc', image: c.image
            })) : [{ id: 'default', name: 'Mặc định', hex: '#ccc' }],
            sizes: p.sizes?.length ? p.sizes.map(s => ({
              id: s.id, code: s.code, label: s.code || s.name, disabled: false
            })) : [
              { label: 'XS', disabled: false }, { label: 'S', disabled: false },
              { label: 'M', disabled: false }, { label: 'L', disabled: false },
              { label: 'XL', disabled: false }, { label: 'XXL', disabled: false }
            ],
            variants: Array.isArray(p.variants) ? p.variants : [],
            description: p.description?.split('\n') || [p.short_description || 'Sản phẩm thời trang cao cấp.'],
            materials: ['Cotton 100%'],
            care: ['Giặt tay hoặc giặt máy ở nhiệt độ thường'],
            services: mockProduct.services,
            avg_rating: p.avg_rating,
            review_count: p.review_count
          })
          setReviews(p.reviews || [])
          setRelatedProducts(p.related_products || [])
        } else {
          setProduct(mockProduct)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(mockProduct)
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      fetchProduct()
    } else {
      setProduct(mockProduct)
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    setSelectedImage(0)
    setSelectedSize(null)
    const validColors = product?.colors?.filter(c => c.image || c.hex) || []
    if (validColors.length > 0) {
      setSelectedColor(validColors[0])
    } else {
      setSelectedColor(null)
    }
  }, [product?.id])

  const handleCopySku = () => {
    if (!product) return
    navigator.clipboard.writeText(product.sku)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast?.error('Vui lòng chọn kích cỡ')
      return
    }
    const selectedVariant = product.variants?.find(variant => {
      const variantSizeValues = [variant.size_id, variant.size_code, variant.size_name].filter(Boolean).map(String)
      const variantColorValues = [variant.color_id, variant.color_code, variant.color_name].filter(Boolean).map(String)
      const sizeValues = [selectedSize.id, selectedSize.code, selectedSize.label].filter(Boolean).map(String)
      const colorValues = selectedColor?.id === 'default'
        ? []
        : [selectedColor?.id, selectedColor?.code, selectedColor?.name].filter(Boolean).map(String)
      const sizeMatches = sizeValues.some(value => variantSizeValues.includes(value))
      const colorMatches = !colorValues.length || colorValues.some(value => variantColorValues.includes(value))
      return sizeMatches && colorMatches
    })

    if (product.variants?.length > 0 && !selectedVariant) {
      toast?.error('Biến thể sản phẩm đã chọn không khả dụng.')
      return
    }

    addItem({
      id: product.id,
      variant_id: selectedVariant?.id || null,
      name: product.name || product.title,
      slug: product.slug,
      price: selectedVariant?.price || product.price,
      image_url: product.images?.[selectedImage] || product.images?.[0] || null,
    }, 1, selectedSize?.label, selectedColor?.name)
    const productName = product.name || product.title || product.product_name || 'sản phẩm'
    toast?.success(`Đã thêm "${productName}" vào giỏ hàng!`)
    if (window.__triggerCartBounce) window.__triggerCartBounce()
  }

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  const validateReview = () => {
    const content = reviewComment.trim()
    const errors = {}
    if (reviewRating < 1) errors.rating = 'Vui lòng chọn số sao đánh giá.'
    if (!content) errors.comment = 'Vui lòng nhập nội dung đánh giá.'
    else if (content.length < 5) errors.comment = 'Nội dung đánh giá tối thiểu 5 ký tự.'
    return errors
  }

  const handleSubmitReview = async () => {
    const errors = validateReview()
    if (Object.keys(errors).length > 0) {
      setReviewErrors(errors)
      return
    }
    setReviewErrors({})
    setReviewSubmitting(true)
    try {
      const res = await customerAPI.createReview({
        product_id: product.id,
        rating: reviewRating,
        content: reviewComment.trim()
      })
      if (res.success || res.review) {
        toast?.success(res.message || 'Gửi đánh giá thành công! Đánh giá đang chờ duyệt.')
        setReviewRating(0)
        setReviewComment('')
        setShowReviewForm(false)
        if (res.review?.is_approved || res.review?.status === 'approved') {
          setReviews([res.review, ...reviews])
        }
      }
    } catch (err) {
      toast?.error('Không thể gửi đánh giá. Vui lòng thử lại.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const goToNextImage = () => {
    if (!product?.images) return
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#DA291C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[#6b7785]">Không tìm thấy sản phẩm.</p>
      </div>
    )
  }

  const discountPercent = product.comparePrice && product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0

  return (
    <div className="product-detail-page min-h-screen bg-white">
      <Header cartCount={0} />

      <main className="max-w-[1920px] mx-auto px-6 lg:px-8 xl:px-12 py-4">
        {/* Breadcrumb */}
        <nav className="breadcrumb flex items-center gap-2 text-sm text-[#6b7785] mb-6 flex-wrap">
          <Link to="/" className="hover:text-[#2f3a45] transition-colors">Trang chủ</Link>
          <span className="select-none">|</span>
          <span className="text-[#2f3a45] font-medium">{product.title || product.name || 'Sản phẩm'}</span>
        </nav>

        {/* Main Layout */}
        <div className="product-detail-layout flex gap-12 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="product-gallery flex gap-4 flex-[1_1_58%]">
            {/* Thumbnails — only show when more than 1 image */}
            {product.images.length > 1 && (
              <div className="thumbnail-list flex flex-col gap-3 w-[110px] flex-shrink-0">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail-item w-[110px] h-[140px] overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-[#2f3a45]'
                        : 'border-transparent hover:border-[#adbccd]'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image with in-place zoom */}
            <div
              className="main-image-wrapper relative flex-1 min-h-[340px] lg:min-h-[470px] bg-[#f9fafb] overflow-hidden cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                const y = ((e.clientY - rect.top) / rect.height) * 100
                setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => { setIsHovering(false); setZoomPos({ x: 50, y: 50 }) }}
            >
              {/* Main Image — zoom only on hover */}
              <img
                src={getHighResUrl(product.images[selectedImage] || product.images[0])}
                alt={product.title || product.name || 'Sản phẩm'}
                className="main-product-image absolute inset-0 w-full h-full object-contain transition-transform duration-75"
                style={{
                  transform: isHovering ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
                loading="eager"
              />

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="image-counter absolute bottom-4 right-4 bg-[#2f3a45]/80 text-white text-xs px-3 py-1.5 font-medium">
                  {selectedImage + 1}/{product.images.length}
                </div>
              )}

              {/* Zoom hint */}
              <div className="zoom-hint absolute bottom-4 left-4 bg-white/70 backdrop-blur-sm px-3 py-1.5 flex items-center gap-1.5 text-xs text-[#6b7785]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <span>Rê chuột để phóng to</span>
              </div>

              {/* Next Image Button */}
              {product.images.length > 1 && selectedImage < product.images.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); goToNextImage() }}
                  className="next-image-button absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="product-info flex-[1_1_42%]">
            {/* Title */}
            <h1 className="product-title text-[22px] font-bold text-[#2f3a45] leading-snug mb-3">
              {product.title || product.name || 'Sản phẩm'}
            </h1>

            {/* SKU */}
            <div className="flex items-center gap-3 mb-4">
              <span className="product-sku text-sm text-[#6b7785]">SKU: {product.sku}</span>
              <button
                onClick={handleCopySku}
                className="copy-sku flex items-center gap-1 text-xs text-[#6b7785] hover:text-[#2f3a45] transition-colors"
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="text-green-600">Đã copy</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button className="ml-auto p-2 text-[#6b7785] hover:text-[#2f3a45] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="product-price text-2xl font-bold text-[#2f3a45]">
                {formatPrice(product.price)} đ
              </span>
              {discountPercent > 0 && (
                <span className="text-base text-[#6b7785] line-through">
                  {formatPrice(product.comparePrice)} đ
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-[#d71920] text-white text-[10px] font-bold px-2 py-1">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Promotion Banner */}
            <div className="promotion-banner bg-[#1a1a1a] text-white p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[60px]">
                  <div className="text-[10px] uppercase tracking-widest opacity-70">Limited</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Edition</div>
                </div>
                <div className="w-px h-10 bg-white/30"></div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest opacity-70 mb-0.5">Trên Đỉnh Gió</div>
                  <div className="text-lg font-black tracking-tight">Tặng 20%</div>
                  <div className="text-[11px] opacity-70">Khi mua từ 2 sản phẩm</div>
                </div>
              </div>
            </div>

            {/* Color Selector */}
            {product.colors.filter(c => c.image || c.hex).length > 0 && (
              <div className="color-selector mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-[#2f3a45]">Màu sắc:</span>
                  <span className="text-sm text-[#6b7785]">{selectedColor?.name}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.filter(c => c.image || c.hex).map((color) => {
                    const hex = color.hex || '#ccc'
                    const isLight = /^#(fff|ffffff|f{3,})$/i.test(hex) ||
                      /^#[0-9a-f]{6}$/i.test(hex) &&
                      parseInt(hex.slice(1), 16) > 0xCCCCCC
                    const isSelected = selectedColor?.id === color.id
                    return (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        title={color.name}
                        className={`color-thumb w-[48px] h-[60px] overflow-hidden transition-all ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-[#d71920]'
                            : 'hover:ring-2 hover:ring-offset-2 hover:ring-[#adbccd]'
                        }`}
                      >
                        {color.image ? (
                          <img
                            src={color.image}
                            alt={color.name}
                            className="w-full h-full object-cover border border-[#d1d5db]"
                          />
                        ) : (
                          <div
                            className="w-full h-full border-2"
                            style={{
                              backgroundColor: hex,
                              borderColor: isLight ? '#d1d5db' : hex,
                            }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="size-selector mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#2f3a45]">Kích cỡ:</span>
                  {!selectedSize && (
                    <span className="text-xs text-red-500">Vui lòng chọn kích cỡ</span>
                  )}
                  {selectedSize && (
                    <span className="text-sm text-[#6b7785]">{selectedSize.label}</span>
                  )}
                </div>
                <button className="size-guide flex items-center gap-1.5 text-xs text-[#1565C0] hover:text-[#0d47a1] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 3H3v18h18V3z"/><path d="M21 12H3"/><path d="M3 6h18"/><path d="M3 18h18"/>
                  </svg>
                  Gợi ý tìm kích cỡ
                </button>
              </div>
              <div className="size-options flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => !size.disabled && setSelectedSize(size)}
                    disabled={size.disabled}
                    className={`size-button w-[48px] h-[42px] border text-xs font-bold uppercase tracking-wide transition-all ${
                      size.disabled
                        ? 'border-[#e5eaf0] text-[#adbccd] cursor-not-allowed bg-[#f9f9f9]'
                        : selectedSize?.label === size.label
                        ? 'border-[#2f3a45] bg-[#2f3a45] text-white'
                        : 'border-[#e5eaf0] text-[#2f3a45] hover:border-[#2f3a45] bg-white'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="add-to-cart-button btn-press flex-1 h-[52px] bg-[#d71920] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c0161c] transition-colors duration-200 hover:-translate-y-0.5"
              >
                Thêm vào giỏ hàng
              </button>
              <button className="find-store-button btn-press flex-1 h-[52px] border border-[#2f3a45] text-[#2f3a45] text-xs font-bold uppercase tracking-widest hover:bg-[#f5f5f5] transition-colors duration-200">
                Tìm tại cửa hàng
              </button>
            </div>

            {/* Accordion Sections */}
            <div className="product-accordion border-t border-[#e5eaf0]">
              {/* Description */}
              <div className="accordion-item border-b border-[#e5eaf0]">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="accordion-header flex items-center justify-between w-full py-4 text-left transition-colors duration-150"
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-[#2f3a45]">Mô tả</span>
                  <span className="text-[#9e9e9e] text-lg font-light transition-transform duration-300">
                    {openAccordion === 'description' ? '—' : '+'}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === 'description' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pb-5">
                    {product.description.map((para, index) => (
                      <p key={index} className="text-sm text-[#2f3a45] leading-relaxed mb-3 last:mb-0">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="accordion-item border-b border-[#e5eaf0]">
                <button
                  onClick={() => toggleAccordion('materials')}
                  className="accordion-header flex items-center justify-between w-full py-4 text-left transition-colors duration-150"
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-[#2f3a45]">Chất liệu</span>
                  <span className="text-[#9e9e9e] text-lg font-light transition-transform duration-300">
                    {openAccordion === 'materials' ? '—' : '+'}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === 'materials' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pb-5">
                    <ul className="space-y-2">
                      {product.materials.map((item, index) => (
                        <li key={index} className="text-sm text-[#2f3a45] leading-relaxed flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 bg-[#2f3a45] rounded-full flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Care Instructions */}
              <div className="accordion-item border-b border-[#e5eaf0]">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="accordion-header flex items-center justify-between w-full py-4 text-left transition-colors duration-150"
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-[#2f3a45]">Hướng dẫn sử dụng</span>
                  <span className="text-[#9e9e9e] text-lg font-light transition-transform duration-300">
                    {openAccordion === 'care' ? '—' : '+'}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === 'care' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pb-5">
                    <ul className="space-y-2">
                      {product.care.map((item, index) => (
                        <li key={index} className="text-sm text-[#2f3a45] leading-relaxed flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 bg-[#2f3a45] rounded-full flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Service List */}
            <div className="service-list mt-8 pt-6 border-t border-[#e5eaf0]">
              {product.services.map((service, index) => (
                <div key={index} className="service-item flex items-start gap-4 mb-5 last:mb-0">
                  <div className="w-10 h-10 bg-[#f4f6f9] flex items-center justify-center flex-shrink-0 text-[#6b7785]">
                    {service.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#2f3a45]">{service.title}</div>
                    <div className="text-xs text-[#6b7785]">{service.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Reviews Section */}
      <section className="max-w-[1920px] mx-auto px-6 lg:px-8 xl:px-12 pb-12">
        <div className="border-t border-[#e5eaf0] pt-10">
          <h2 className="text-xl font-bold text-[#2f3a45] mb-6">ĐÁNH GIÁ SẢN PHẨM</h2>

          {/* User is NOT authenticated: show only login prompt */}
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center gap-4 px-6 py-5 bg-[#f9fafb] border border-[#e5eaf0]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#adbccd" strokeWidth="1.5" className="flex-shrink-0">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <p className="text-sm text-[#6b7785] flex-1 text-center sm:text-left">Vui lòng đăng nhập để đánh giá sản phẩm</p>
              <Link
                to="/login"
                className="h-9 px-5 bg-[#d71920] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c0161c] transition-colors flex items-center whitespace-nowrap"
              >
                Đăng nhập
              </Link>
            </div>
          )}

          {/* User IS authenticated */}
          {isAuthenticated && (
            <>
              {/* Show "first review" message when no reviews yet */}
              {!showReviewForm && reviews.length === 0 && (
                <div className="flex flex-col sm:flex-row items-center gap-4 px-6 py-5 bg-[#f9fafb] border border-[#e5eaf0] mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#adbccd" strokeWidth="1.5" className="flex-shrink-0">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <p className="text-sm text-[#6b7785] flex-1 text-center sm:text-left">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm!</p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="h-9 px-5 bg-[#d71920] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c0161c] transition-colors whitespace-nowrap"
                  >
                    Viết đánh giá
                  </button>
                </div>
              )}

              {/* Review form (shown when authenticated) */}
              {showReviewForm && (
                <div className="mb-8 border border-[#e5eaf0] p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#2f3a45]">VIẾT ĐÁNH GIÁ CỦA BẠN</h3>
                    <button
                      onClick={() => { setShowReviewForm(false); setReviewErrors({}) }}
                      className="text-[#6b7785] hover:text-[#2f3a45] text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#2f3a45] mb-2">Đánh giá của bạn *</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => { setReviewRating(star); setReviewErrors(prev => ({ ...prev, rating: null })) }}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill={star <= reviewRating ? '#f59e0b' : 'none'}
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    {reviewErrors.rating && (
                      <p className="text-xs text-red-500 mt-1">{reviewErrors.rating}</p>
                    )}
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#2f3a45] mb-2">
                      Nội dung đánh giá *
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => { setReviewComment(e.target.value); setReviewErrors(prev => ({ ...prev, comment: null })) }}
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      rows={4}
                      className={`w-full border text-sm p-3 resize-none outline-none transition-colors focus:border-[#d71920] ${
                        reviewErrors.comment ? 'border-red-400' : 'border-[#e5eaf0]'
                      }`}
                    />
                    {reviewErrors.comment && (
                      <p className="text-xs text-red-500 mt-1">{reviewErrors.comment}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewSubmitting}
                      className="h-10 px-6 bg-[#d71920] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c0161c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {reviewSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                    <button
                      onClick={() => { setShowReviewForm(false); setReviewErrors({}) }}
                      className="h-10 px-6 border border-[#e5eaf0] text-[#6b7785] text-xs font-bold uppercase tracking-wider hover:bg-[#f9fafb] transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Rating Summary — only when there ARE reviews */}
          {reviews.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 p-6 bg-[#f9fafb]">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#2f3a45]">{product.avg_rating || 0}</div>
                <div className="flex gap-0.5 mt-1 justify-center">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={star <= Math.round(product.avg_rating || 0) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <div className="text-xs text-[#6b7785] mt-1">({product.review_count || reviews.length} đánh giá)</div>
              </div>
              <div className="h-px sm:h-16 w-full sm:w-px bg-[#e5eaf0]" />
              <div className="flex-1">
                <div className="text-sm text-[#6b7785] mb-3">Bạn đã mua sản phẩm này chưa?</div>
                {isAuthenticated && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="h-10 px-6 bg-[#d71920] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c0161c] transition-colors"
                  >
                    Viết đánh giá
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 && (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-[#e5eaf0] pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    {review.user_avatar ? (
                      <img
                        src={review.user_avatar}
                        alt={review.user_name}
                        className="w-10 h-10 rounded-full flex-shrink-0 bg-[#f0f0f0] object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex-shrink-0 bg-[#e5eaf0] flex items-center justify-center text-sm font-bold text-[#6b7785]">
                        {(review.user_name || 'A').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-[#2f3a45]">{review.user_name || 'Khách hàng'}</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(star => (
                            <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= review.rating ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.title && (
                        <div className="text-sm font-medium text-[#2f3a45] mb-1">{review.title}</div>
                      )}
                      <p className="text-sm text-[#6b7785] leading-relaxed">{review.content || review.comment}</p>
                      {review.created_at && (
                        <div className="text-xs text-[#adbccd] mt-2">
                          {new Date(review.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1920px] mx-auto px-6 lg:px-8 xl:px-12 pb-16">
          <div className="border-t border-[#e5eaf0] pt-10">
            <h2 className="text-xl font-bold text-[#2f3a45] mb-6">SẢN PHẨM CÙNG PHONG CÁCH</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.slug}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded bg-[#f3f4f6]" style={{ aspectRatio: '3/4' }}>
                    <img
                      src={item.image_url || item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-[#2f3a45] mt-2 line-clamp-2 leading-snug group-hover:text-[#d71920] transition-colors">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-[#2f3a45]">
                      {formatPrice(item.price)}
                    </span>
                    {item.is_on_sale && item.compare_price && item.compare_price > item.price && (
                      <>
                        <span className="text-xs text-[#6b7785] line-through">
                          {formatPrice(item.compare_price)}
                        </span>
                        <span className="text-xs font-bold text-[#d71920]">
                          -{Math.round((1 - item.price / item.compare_price) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
      <Footer />
    </div>
  )
}

export default ProductDetailPage

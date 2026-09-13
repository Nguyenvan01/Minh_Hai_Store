import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { ArrowLeft, Save, Plus, X, AlertTriangle, Loader2 } from 'lucide-react'

const emptyProduct = {
  name: '', slug: '', short_description: '', description: '',
  price: '', compare_price: '', cost_price: '', sku: '',
  stock: '', category_id: '', brand_id: '',
  gender: 'unisex', material: '',
  is_featured: false, is_active: true, images: [], variants: [],
}

export default function AdminProductForm({ isEdit: isEditProp }) {
  const toast = useToast()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = isEditProp || !!id

  const [product, setProduct] = useState(emptyProduct)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [variantMode, setVariantMode] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [uploading, setUploading] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [imageUrlError, setImageUrlError] = useState('')
  const [imageUrlPreview, setImageUrlPreview] = useState('')
  const [sizes] = useState([
    { id: 1, name: 'XS' }, { id: 2, name: 'S' }, { id: 3, name: 'M' },
    { id: 4, name: 'L' }, { id: 5, name: 'XL' }, { id: 6, name: 'XXL' },
  ])
  const [colors] = useState([
    { id: 1, name: 'Đen', hex_code: '#000000' },
    { id: 2, name: 'Trắng', hex_code: '#FFFFFF' },
    { id: 3, name: 'Xám', hex_code: '#808080' },
    { id: 4, name: 'Xanh Navy', hex_code: '#000080' },
    { id: 5, name: 'Xanh Dương', hex_code: '#4169E1' },
    { id: 6, name: 'Đỏ', hex_code: '#DC143C' },
    { id: 7, name: 'Hồng', hex_code: '#FF69B4' },
    { id: 8, name: 'Nâu', hex_code: '#8B4513' },
  ])

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    setError('')

    const saved = sessionStorage.getItem('editProduct')
    if (saved) {
      try {
        const found = JSON.parse(saved)
        if (String(found.id) === String(id)) {
          let images = []
          if (found.image) images = [found.image]
          if (found.images) {
            if (Array.isArray(found.images)) images = found.images
            else if (typeof found.images === 'string') images = found.images.split(',').filter(Boolean)
          }
          setProduct({
            name: found.name || '',
            slug: found.slug || '',
            short_description: found.short_description || '',
            description: found.description || '',
            price: found.price || '',
            compare_price: found.compare_price || '',
            cost_price: found.cost_price || '',
            sku: found.sku || '',
            stock: found.stock || '',
            category_id: found.category_id ? Number(found.category_id) : '',
            brand_id: found.brand_id ? Number(found.brand_id) : '',
            gender: found.gender || 'unisex',
            material: found.material || '',
            is_featured: !!found.is_featured,
            is_active: found.is_active !== false,
            images,
            variants: found.variants || [],
          })
          sessionStorage.removeItem('editProduct')
          setLoading(false)
          return
        }
      } catch (_) { /* ignore parse errors */ }
    }

    try {
      const [catRes, brandRes] = await Promise.all([
        api.get('/admin/categories'),
        api.get('/admin/brands'),
      ])
      setCategories(catRes.categories || [])
      setBrands(brandRes.brands || [])

      if (isEdit && id) {
        const detailRes = await api.get(`/admin/products/${id}`)
        const found = detailRes.product
        if (found) {
          let images = []
          if (found.image) images = [found.image]
          if (found.images) {
            if (Array.isArray(found.images)) images = found.images
            else if (typeof found.images === 'string') images = found.images.split(',').filter(Boolean)
          }
          // Map DB variant fields (size_id, color_id) back to frontend state
          const variants = (found.variants || []).map(v => ({
            size_id: v.size_id,
            color_id: v.color_id,
            sku: v.sku || '',
            price: v.price || found.price || '',
            stock: v.stock || 0,
            is_active: !!v.is_active,
          }))
          setProduct({
            name: found.name || '',
            slug: found.slug || '',
            short_description: found.short_description || '',
            description: found.description || '',
            price: found.price || '',
            compare_price: found.compare_price || '',
            cost_price: found.cost_price || '',
            sku: found.sku || '',
            stock: found.stock || '',
            category_id: found.category_id ? Number(found.category_id) : '',
            brand_id: found.brand_id ? Number(found.brand_id) : '',
            gender: found.gender || 'unisex',
            material: found.material || '',
            is_featured: !!found.is_featured,
            is_active: found.is_active !== false,
            images,
            variants,
          })
        } else {
          setError('Không tìm thấy sản phẩm này')
        }
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    if (field === 'name') {
      const slug = value.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setProduct(prev => ({ ...prev, name: value, slug }))
    } else if (field === 'category_id') {
      setProduct(prev => ({ ...prev, category_id: value ? Number(value) : '' }))
    } else if (field === 'brand_id') {
      setProduct(prev => ({ ...prev, brand_id: value ? Number(value) : '' }))
    } else {
      setProduct(prev => ({ ...prev, [field]: value }))
    }
  }

  const addImage = (url) => {
    if (url && !product.images.includes(url)) {
      setProduct(prev => ({ ...prev, images: [...prev.images, url] }))
      setImageUrlInput('')
      setImageUrlPreview('')
      setImageUrlError('')
    }
  }

  const handleImageFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      })
      const data = await res.json()
      if (data.success) addImage(data.url)
    } catch (_) {
      setError('Tải ảnh thất bại')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (index) => {
    setProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const generateVariants = () => {
    const variants = []
    selectedSizes.forEach(size => {
      selectedColors.forEach(color => {
        variants.push({
          size_id: size,
          color_id: color,
          sku: `${product.sku || 'SKU'}-${size}-${color}`.toUpperCase(),
          price: product.price || 0,
          stock: 0,
          is_active: true,
        })
      })
    })
    setProduct(prev => ({ ...prev, variants }))
    setVariantMode(false)
  }

  const updateVariant = (index, field, value) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v),
    }))
  }

  const removeVariant = (index) => {
    setProduct(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!product.name || !product.price) {
      setError('Vui lòng nhập tên và giá sản phẩm')
      return
    }
    try {
      setSaving(true)
      setError('')
      const { variants, ...productFields } = product
      console.log("Product payload:", { variants, ...productFields })
      const payload = {
        ...productFields,
        price: Number(product.price),
        compare_price: product.compare_price ? Number(product.compare_price) : null,
        cost_price: product.cost_price ? Number(product.cost_price) : null,
        stock: product.stock ? Number(product.stock) : 0,
        category_id: product.category_id ? Number(product.category_id) : null,
        brand_id: product.brand_id ? Number(product.brand_id) : null,
        variants: variants || [],
      }
      if (isEdit && id) {
        await api.put(`/admin/products/${id}`, payload)
        toast.success('Lưu sản phẩm thành công.')
      } else {
        await api.post('/admin/products', payload)
        toast.success('Tạo sản phẩm thành công.')
      }
      navigate('/admin/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu sản phẩm. Vui lòng kiểm tra lại thông tin.')
      toast.error(err.response?.data?.message || 'Không thể lưu sản phẩm. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[#d71920]" />
        <span className="ml-3 text-gray-500">Đang tải dữ liệu...</span>
      </div>
    )
  }

  const inputClass = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"
  const sectionClass = "bg-white rounded-xl p-5 shadow-sm border border-gray-100"

  const getSizeName = (sizeId) => {
    const s = sizes.find(x => x.id === sizeId)
    return s ? s.name : '-'
  }

  const getColorName = (colorId) => {
    const c = colors.find(x => x.id === colorId)
    return c ? c.name : '-'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          <Save size={16} />
          {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo sản phẩm')}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-800 mb-4">Thông tin sản phẩm</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={inputClass}
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input
                  type="text"
                  value={product.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className={inputClass}
                  placeholder="Tự động tạo"
                />
              </div>
              <div>
                <label className={labelClass}>Mô tả ngắn</label>
                <textarea
                  value={product.short_description}
                  onChange={(e) => handleChange('short_description', e.target.value)}
                  rows={2}
                  className={inputClass}
                  placeholder="Nhập mô tả ngắn"
                />
              </div>
              <div>
                <label className={labelClass}>Mô tả chi tiết</label>
                <textarea
                  value={product.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className={inputClass}
                  placeholder="Nhập mô tả chi tiết"
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-800 mb-4">Giá & SKU</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>
                  Giá bán <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className={inputClass}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className={labelClass}>Giá gốc</label>
                <input
                  type="number"
                  value={product.compare_price}
                  onChange={(e) => handleChange('compare_price', e.target.value)}
                  className={inputClass}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className={labelClass}>Giá vốn</label>
                <input
                  type="number"
                  value={product.cost_price}
                  onChange={(e) => handleChange('cost_price', e.target.value)}
                  className={inputClass}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className={labelClass}>SKU</label>
                <input
                  type="text"
                  value={product.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  className={inputClass}
                  placeholder="ATN-001"
                />
              </div>
              <div>
                <label className={labelClass}>Tồn kho</label>
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  className={inputClass}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Biến thể</h3>
              <button
                type="button"
                onClick={() => setVariantMode(!variantMode)}
                className="text-sm text-[#d71920] hover:underline font-medium"
              >
                {variantMode ? 'Tắt chế độ' : '+ Tạo biến thể'}
              </button>
            </div>

            {variantMode ? (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className={labelClass}>Chọn Size</label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => {
                          if (selectedSizes.includes(size.id)) {
                            setSelectedSizes(prev => prev.filter(s => s !== size.id))
                          } else {
                            setSelectedSizes(prev => [...prev, size.id])
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                          selectedSizes.includes(size.id)
                            ? 'bg-[#d71920] text-white border-red-600'
                            : 'border-gray-200 text-gray-600 hover:border-red-300'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Chọn Màu</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => {
                          if (selectedColors.includes(color.id)) {
                            setSelectedColors(prev => prev.filter(c => c !== color.id))
                          } else {
                            setSelectedColors(prev => [...prev, color.id])
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-2 ${
                          selectedColors.includes(color.id)
                            ? 'bg-[#d71920] text-white border-red-600'
                            : 'border-gray-200 text-gray-600 hover:border-red-300'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex_code || '#ccc' }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={generateVariants}
                  disabled={selectedSizes.length === 0 || selectedColors.length === 0}
                  className="px-4 py-2 bg-[#d71920] text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Tạo {selectedSizes.length * selectedColors.length} biến thể
                </button>
              </div>
            ) : (
              product.variants.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-gray-500 px-2">
                    <span>Size</span>
                    <span>Màu</span>
                    <span>SKU</span>
                    <span>Giá</span>
                    <span>Tồn kho</span>
                    <span></span>
                  </div>
                  {product.variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-6 gap-2 items-center">
                      <span className="text-sm text-gray-700">{getSizeName(v.size_id)}</span>
                      <span className="text-sm text-gray-700">{getColorName(v.color_id)}</span>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                        className="px-2 py-1.5 border border-gray-200 rounded text-xs"
                      />
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                        className="px-2 py-1.5 border border-gray-200 rounded text-xs"
                        min="0"
                      />
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => updateVariant(idx, 'stock', e.target.value)}
                        className="px-2 py-1.5 border border-gray-200 rounded text-xs"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-800 mb-4">Trạng thái</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#d71920]"
                />
                <span className="text-sm text-gray-700">Đang bán</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.is_featured}
                  onChange={(e) => handleChange('is_featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#d71920]"
                />
                <span className="text-sm text-gray-700">Sản phẩm nổi bật</span>
              </label>
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-800 mb-4">Phân loại</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={product.category_id}
                  onChange={(e) => handleChange('category_id', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Thương hiệu</label>
                <select
                  value={product.brand_id}
                  onChange={(e) => handleChange('brand_id', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Giới tính</label>
                <select
                  value={product.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={inputClass}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="unisex">Unisex</option>
                  <option value="kids_boy">Trẻ em trai</option>
                  <option value="kids_girl">Trẻ em gái</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Chất liệu</label>
                <input
                  type="text"
                  value={product.material}
                  onChange={(e) => handleChange('material', e.target.value)}
                  className={inputClass}
                  placeholder="Nhập chất liệu"
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="font-semibold text-gray-800 mb-4">Hình ảnh</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {product.images.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-[#d71920] text-white text-xs px-1.5 py-0.5 rounded">
                      Ảnh chính
                    </span>
                  )}
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-red-400 hover:bg-red-50/50 transition-colors relative">
                {uploading ? (
                  <Loader2 size={20} className="text-red-500 animate-spin" />
                ) : (
                  <>
                    <Plus size={20} className="text-gray-400" />
                    <span className="text-xs text-gray-400">Tải lên</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFile}
                  disabled={uploading}
                />
              </label>
            </div>
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => {
                setImageUrlInput(e.target.value)
                setImageUrlError('')
                setImageUrlPreview('')
              }}
              placeholder="Dán URL ảnh..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && imageUrlInput) {
                  setImageUrlPreview(imageUrlInput)
                  setImageUrlError('')
                  addImage(imageUrlInput)
                  setImageUrlInput('')
                  e.preventDefault()
                }
              }}
            />
            {imageUrlPreview && (
              <div className="mt-2 text-xs">
                <img
                  src={imageUrlPreview}
                  alt="Preview"
                  className="w-full h-24 object-cover rounded border border-gray-200"
                  onLoad={() => setImageUrlError('')}
                  onError={() => {
                    setImageUrlError('Không thể tải ảnh từ URL này')
                    setImageUrlPreview('')
                  }}
                />
                {imageUrlError && (
                  <p className="text-red-500 mt-1">{imageUrlError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

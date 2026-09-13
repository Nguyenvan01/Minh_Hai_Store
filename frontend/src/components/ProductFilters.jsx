import React, { useState } from 'react'

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[#E8EAED]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left transition-colors duration-150"
      >
        <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#2f3a45]">
          {title}
        </span>
        <span className={`text-[#9E9E9E] text-lg font-light transition-transform duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pb-5">{children}</div>
      </div>
    </div>
  )
}

// --- Category Filter ---
const CategoryFilter = ({ selected, onChange, categoryList }) => {
  const [showAll, setShowAll] = useState(false)
  const SHOW_LIMIT = 5
  const visible = showAll ? categoryList : categoryList.slice(0, SHOW_LIMIT)
  const remaining = categoryList.length - SHOW_LIMIT

  return (
    <div>
      <ul className="space-y-[19px]">
        {visible.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => onChange(cat.id)}
              className={`text-[14px] leading-none transition-colors ${
                selected === cat.id
                  ? 'text-[#e53935] font-semibold'
                  : 'text-[#2f3a45] hover:text-[#e53935]'
              }`}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
      {!showAll && remaining > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-5 text-[13px] font-medium text-[#DA291C] hover:text-[#b91c1c] transition-colors underline"
        >
          Xem thêm +
        </button>
      )}
    </div>
  )
}

// --- Size Filter ---
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

const normalizeOption = (option) => {
  if (typeof option === 'string') {
    return { id: option, name: option }
  }

  return {
    id: String(option.id ?? option.code ?? option.name ?? ''),
    name: option.name || option.code || String(option.id ?? ''),
    hex: option.hex || option.hex_code || option.color || '#d1d5db',
  }
}

const SizeFilter = ({ selected, onChange, sizeList = [] }) => {
  const sizes = (sizeList.length ? sizeList : SIZES).map(normalizeOption).filter(size => size.id)

  return (
    <div className="flex flex-wrap gap-[10px]">
      {sizes.map((size) => (
        <button
          key={size.id}
          onClick={() => onChange(size.id)}
          className={`min-w-[48px] h-[44px] px-2 border text-[12px] font-bold uppercase tracking-wide transition-all ${
            selected.includes(size.id)
              ? 'border-[#DA291C] bg-[#DA291C] text-white'
              : 'border-[#DEDEDE] bg-white text-[#2f3a45] hover:border-[#DA291C] hover:text-[#DA291C]'
          }`}
        >
          {size.name}
        </button>
      ))}
    </div>
  )
}

// --- Color Filter ---
const COLORS = [
  { id: 'trang', name: 'Trắng', hex: '#FFFFFF' },
  { id: 'den', name: 'Đen', hex: '#1A1A1A' },
  { id: 'do', name: 'Đỏ', hex: '#D32F2F' },
  { id: 'xam', name: 'Xám', hex: '#9E9E9E' },
  { id: 'xanh-duong', name: 'Xanh dương', hex: '#1565C0' },
  { id: 'vang-nhat', name: 'Vàng nhạt', hex: '#FFF9C4' },
  { id: 'hong', name: 'Hồng', hex: '#EC407A' },
  { id: 'vang-neon', name: 'Vàng neon', hex: '#FFEB3B' },
  { id: 'tim', name: 'Tím', hex: '#7B1FA2' },
  { id: 'xanh-ngoc', name: 'Xanh ngọc', hex: '#00897B' },
  { id: 'nau', name: 'Nâu', hex: '#795548' },
  { id: 'hoa-tiet', name: 'Họa tiết sọc', hex: 'linear-gradient(90deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(90deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' },
  { id: 'phoi-mau', name: 'Phối màu', hex: 'linear-gradient(135deg, #1A1A1A 33%, #FFD700 33%, #FFD700 66%, #1A1A1A 66%)' },
]

const ColorFilter = ({ selected, onChange, colorList = [] }) => {
  const colors = (colorList.length ? colorList : COLORS).map(normalizeOption).filter(color => color.id)

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((c) => c !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="flex flex-wrap gap-[11px]">
      {colors.map((color) => {
        const isSelected = selected.includes(color.id)
        const isPattern = color.hex.includes('linear-gradient')
        return (
          <button
            key={color.id}
            onClick={() => toggle(color.id)}
            title={color.name}
            className={`relative w-[42px] h-[42px] rounded-full transition-all ${
              isSelected
                ? 'ring-2 ring-offset-2 ring-[#DA291C]'
                : 'ring-1 ring-[#DEDEDE] hover:ring-[#DA291C]'
            }`}
            style={{
              background: isPattern ? color.hex : color.hex,
              backgroundSize: isPattern ? '8px 8px' : 'cover',
            }}
          >
            {/* check mark */}
            {isSelected && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={color.name?.toLowerCase() === 'trắng' || color.id === 'trang' || color.id === 'vang-nhat' ? '#333' : '#fff'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// --- Price Range Filter ---
const PriceRangeFilter = ({ priceRange, onChange }) => {
  const [minVal, setMinVal] = useState(priceRange[0])
  const [maxVal, setMaxVal] = useState(priceRange[1])
  const [dragging, setDragging] = useState(null) // 'min' | 'max' | null

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - 50000)
    if (val >= 0) setMinVal(val)
  }
  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + 50000)
    if (val <= 5000000) setMaxVal(val)
  }

  const handleApply = () => {
    onChange([minVal, maxVal])
    setDragging(null)
  }

  const MIN = 0
  const MAX = 5000000
  const leftPercent = ((minVal - MIN) / (MAX - MIN)) * 100
  const rightPercent = ((maxVal - MIN) / (MAX - MIN)) * 100

  const minZ = dragging === 'min' ? 20 : 11
  const maxZ = dragging === 'max' ? 20 : 10

  const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val)
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={formatVND(minVal)}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, '')
              const val = Math.max(MIN, Math.min(Number(raw), maxVal - 50000))
              setMinVal(val || 0)
            }}
            onBlur={handleApply}
            className="w-full h-[40px] px-3 border border-[#DEDEDE] text-[13px] text-[#2f3a45] font-medium focus:outline-none focus:border-[#2f3a45] rounded-none"
            placeholder="Từ"
          />
        </div>
        <span className="text-[#9E9E9E] text-sm font-medium flex-shrink-0">—</span>
        <div className="flex-1">
          <input
            type="text"
            value={formatVND(maxVal)}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, '')
              const val = Math.min(MAX, Math.max(Number(raw), minVal + 50000))
              setMaxVal(val || 0)
            }}
            onBlur={handleApply}
            className="w-full h-[40px] px-3 border border-[#DEDEDE] text-[13px] text-[#2f3a45] font-medium focus:outline-none focus:border-[#2f3a45] rounded-none"
            placeholder="Đến"
          />
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="mt-5 relative h-1 mx-1">
        {/* Track background */}
        <div className="absolute inset-0 bg-[#DEDEDE] rounded-full" />
        {/* Active range */}
        <div
          className="absolute top-0 h-full bg-[#DA291C] rounded-full"
          style={{
            left: `${leftPercent}%`,
            right: `${100 - rightPercent}%`,
          }}
        />
        {/* Max thumb (renders first, lower z-index) */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          step="50000"
          value={maxVal}
          onChange={handleMaxChange}
          onMouseDown={() => setDragging('max')}
          onMouseUp={handleApply}
          onTouchStart={() => setDragging('max')}
          onTouchEnd={handleApply}
          style={{ zIndex: maxZ }}
          className="range-thumb-right absolute inset-0 w-full h-1 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-[20px]
            [&::-webkit-slider-thumb]:h-[20px]
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#DA291C]
            [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.2)]
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-[20px]
            [&::-moz-range-thumb]:h-[20px]
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#DA291C]
            [&::-moz-range-thumb]:cursor-grab"
        />
        {/* Min thumb (renders last, higher z-index) */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          step="50000"
          value={minVal}
          onChange={handleMinChange}
          onMouseDown={() => setDragging('min')}
          onMouseUp={handleApply}
          onTouchStart={() => setDragging('min')}
          onTouchEnd={handleApply}
          style={{ zIndex: minZ }}
          className="range-thumb-left absolute inset-0 w-full h-1 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-[20px]
            [&::-webkit-slider-thumb]:h-[20px]
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#DA291C]
            [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.2)]
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-[20px]
            [&::-moz-range-thumb]:h-[20px]
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#DA291C]
            [&::-moz-range-thumb]:cursor-grab"
        />
      </div>

      <div className="flex justify-between mt-3 text-[12px] font-medium text-[#757575] px-1">
        <span>0 ₫</span>
        <span>5.000.000 ₫</span>
      </div>
    </div>
  )
}

// --- Discount Filter ---
const DISCOUNT_OPTIONS = [
  { id: '10', label: 'Giảm 10%' },
  { id: '20', label: 'Giảm 20%' },
  { id: '30', label: 'Giảm 30%' },
  { id: '50', label: 'Giảm 50%' },
]

const DiscountFilter = ({ selected, onChange }) => {
  return (
    <div className="flex flex-col gap-[14px]">
      {DISCOUNT_OPTIONS.map((opt) => (
        <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={selected.includes(opt.id)}
              onChange={() => {
                if (selected.includes(opt.id)) {
                  onChange(selected.filter((d) => d !== opt.id))
                } else {
                  onChange([...selected, opt.id])
                }
              }}
              className="sr-only"
            />
            <div
              className={`w-[18px] h-[18px] border transition-all flex items-center justify-center ${
                selected.includes(opt.id)
                  ? 'bg-[#2f3a45] border-[#2f3a45]'
                  : 'border-[#DEDEDE] group-hover:border-[#9E9E9E]'
              }`}
            >
              {selected.includes(opt.id) && (
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-[14px] text-[#2f3a45] group-hover:text-[#e53935] transition-colors">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  )
}

// --- Main Sidebar ---
const ProductFilters = ({
  categoryList = [],
  selectedCategory,
  onCategoryChange,
  selectedSizes,
  onSizeChange,
  selectedColors,
  onColorChange,
  priceRange,
  onPriceChange,
  selectedDiscounts,
  onDiscountChange,
  sizeList = [],
  colorList = [],
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const filterContent = (
    <div className="bg-white rounded-sm">
      <FilterSection title="Danh mục sản phẩm">
        <CategoryFilter selected={selectedCategory} onChange={onCategoryChange} categoryList={categoryList} />
      </FilterSection>

      <FilterSection title="Kích cỡ">
        <SizeFilter selected={selectedSizes} onChange={onSizeChange} sizeList={sizeList} />
      </FilterSection>

      <FilterSection title="Màu sắc">
        <ColorFilter selected={selectedColors} onChange={onColorChange} colorList={colorList} />
      </FilterSection>

      <FilterSection title="Khoảng giá">
        <PriceRangeFilter priceRange={priceRange} onChange={onPriceChange} />
      </FilterSection>

      <FilterSection title="Phần trăm giảm" defaultOpen={false}>
        <DiscountFilter selected={selectedDiscounts} onChange={onDiscountChange} />
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-[320px] xl:w-[340px] flex-shrink-0 hidden lg:block">
        <div className="sticky top-32">
          <div className="px-6 xl:px-8 py-7">
            <h2 className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#2f3a45] mb-6 pb-4 border-b border-[#E8EAED]">
              Bộ lọc
            </h2>
            {filterContent}
          </div>
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8EAED] px-4 py-3 flex gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2f3a45] text-white py-3 text-[13px] font-bold uppercase tracking-widest"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="14" y2="12"/>
            <line x1="4" y1="18" x2="10" y2="18"/>
          </svg>
          Bộ lọc
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 border border-[#DEDEDE] text-[#2f3a45] py-3 text-[13px] font-bold uppercase tracking-widest">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M6 12h12M9 18h6"/>
          </svg>
          Sắp xếp
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white max-h-[85vh] overflow-y-auto rounded-t-2xl">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 flex items-center justify-between border-b border-[#E8EAED]">
              <h2 className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#2f3a45]">
                Bộ lọc
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-[#757575] hover:text-[#2f3a45]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              {filterContent}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-[#E8EAED] px-6 py-4 flex gap-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-3 text-[13px] font-bold uppercase tracking-widest border border-[#DEDEDE] text-[#2f3a45] hover:bg-[#F5F5F5] transition-colors"
              >
                Xóa bộ lọc
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-3 text-[13px] font-bold uppercase tracking-widest bg-[#2f3a45] text-white hover:bg-[#1a252f] transition-colors"
              >
                Xem kết quả
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductFilters

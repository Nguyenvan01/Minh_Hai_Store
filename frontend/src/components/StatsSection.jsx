import React from 'react'

const StatsSection = () => {
  const stats = [
    { value: '50K+', label: 'Khách hàng', icon: 'group' },
    { value: '2K+', label: 'Sản phẩm', icon: 'inventory_2' },
    { value: '150+', label: 'Thương hiệu', icon: 'verified' },
    { value: '4.9', label: 'Đánh giá', icon: 'star', suffix: '/5' }
  ]

  return (
    <section className="py-24 bg-[#0F172A] overflow-hidden relative">
      {/* Dot pattern texture */}
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-50" />

      {/* Ambient glow - top left */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0052FF]/5 rounded-full blur-[120px] pointer-events-none" />
      {/* Ambient glow - bottom right */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#4D7CFF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-label mb-6 mx-auto border-[#0052FF]/30 bg-[#0052FF]/10">
            <div className="section-label-dot" />
            <span>By The Numbers</span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Con số ấn tượng
          </h2>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Những con số chứng minh sự tin tưởng của khách hàng dành cho Đạt Hoàng
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Card background */}
              <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center
                hover:bg-white/10 hover:border-[#0052FF]/30 hover:shadow-[0_8px_32px_rgba(0,82,255,0.15)]
                transition-all duration-300 group-hover:-translate-y-1">

                {/* Icon */}
                <div className="w-12 h-12 mx-auto mb-6 rounded-xl bg-gradient-to-br from-[#0052FF]/20 to-[#4D7CFF]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#4D7CFF]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                    {stat.icon}
                  </span>
                </div>

                {/* Value */}
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-white">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-xl text-slate-400">{stat.suffix}</span>
                  )}
                </div>

                {/* Label */}
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-slate-400">
                  {stat.label}
                </p>

                {/* Gradient accent line on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-3/4 bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] transition-all duration-500 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection

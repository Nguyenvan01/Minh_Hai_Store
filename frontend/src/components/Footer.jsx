import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#333F48] text-white mt-8">
      <div className="container py-10 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <span className="text-2xl font-black tracking-[0.1em]">Đạt Hoàng</span>
            <p className="mt-3 text-sm font-medium text-white/60 leading-relaxed">
              Thương hiệu thời trang gia đình hàng đầu Việt Nam
            </p>
            <div className="flex gap-3 mt-5">
              {['facebook', 'instagram', 'youtube'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 rounded flex items-center justify-center bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    {icon === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>}
                    {icon === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>}
                    {icon === 'youtube' && <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="font-bold text-sm mb-3">HỖ TRỢ KHÁCH HÀNG</h4>
            <div className="space-y-2">
              {['Chính sách đổi trả', 'Hướng dẫn mua hàng', 'Câu hỏi thường gặp', 'Theo dõi đơn hàng'].map(item => (
                <Link key={item} to="#" className="block text-sm font-medium text-white/60 hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          {/* Về Đạt Hoàng */}
          <div>
            <h4 className="font-bold text-sm mb-3">VỀ ĐẠT HOÀNG</h4>
            <div className="space-y-2">
              {['Giới thiệu', 'Tuyển dụng', 'Liên hệ'].map(item => (
                <Link key={item} to="#" className="block text-sm font-medium text-white/60 hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          {/* Kết nối */}
          <div>
            <h4 className="font-bold text-sm mb-3">KẾT NỐI</h4>
            <div className="space-y-2">
              {['Facebook', 'Instagram', 'YouTube'].map(item => (
                <Link key={item} to="#" className="block text-sm font-medium text-white/60 hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-xs font-medium text-white/40">© 2026 Đạt Hoàng. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

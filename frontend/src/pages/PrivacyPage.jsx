import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'

const sections = [
  {
    number: '01',
    title: 'Thu thập thông tin',
    body: 'Chúng tôi thu thập các thông tin cá nhân khi bạn:',
    items: [
      'Đăng ký tài khoản trên website',
      'Thực hiện đặt hàng',
      'Đăng ký nhận bản tin',
      'Liên hệ với bộ phận chăm sóc khách hàng',
    ],
  },
  {
    number: '02',
    title: 'Thông tin thu thập',
    body: 'Thông tin cá nhân chúng tôi thu thập bao gồm:',
    items: [
      'Họ và tên',
      'Địa chỉ email',
      'Số điện thoại',
      'Địa chỉ giao hàng',
      'Thông tin thanh toán',
    ],
  },
  {
    number: '03',
    title: 'Sử dụng thông tin',
    body: 'Thông tin cá nhân của bạn được sử dụng để:',
    items: [
      'Xử lý đơn hàng và giao hàng',
      'Liên lạc về tình trạng đơn hàng',
      'Gửi thông tin về sản phẩm và khuyến mãi (nếu bạn đồng ý)',
      'Cải thiện dịch vụ khách hàng',
      'Phát hiện và ngăn chặn gian lận',
    ],
  },
  {
    number: '04',
    title: 'Bảo mật thông tin',
    body: 'Đạt Hoàng cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp:',
    items: [
      'Mã hóa dữ liệu SSL 256-bit',
      'Lưu trữ an toàn trên máy chủ bảo mật',
      'Hạn chế quyền truy cập nhân viên',
      'Thường xuyên cập nhật hệ thống bảo mật',
    ],
  },
  {
    number: '05',
    title: 'Quyền của khách hàng',
    body: 'Bạn có quyền:',
    items: [
      'Truy cập thông tin cá nhân của mình',
      'Yêu cầu chỉnh sửa thông tin không chính xác',
      'Yêu cầu xóa thông tin cá nhân',
      'Từ chối nhận email marketing',
    ],
  },
]

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      <Header cartCount={0} />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-[#333F48] text-white py-20">
          <div className="max-w-screen-2xl mx-auto px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#DA291C]/20 border border-[#DA291C]/30 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-3xl text-[#DA291C]">security</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Chính Sách Bảo Mật</h1>
            <p className="text-base text-[#ADBCCD] max-w-2xl mx-auto">
              Cam kết bảo vệ thông tin cá nhân của khách hàng
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 max-w-4xl mx-auto px-6 md:px-8">
          <div className="bg-white rounded-lg border border-[#E5EAF0] overflow-hidden">
            {sections.map((section, idx) => (
              <div
                key={section.number}
                className={`px-8 py-8 ${idx < sections.length - 1 ? 'border-b border-[#E5EAF0]' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FBE9E8] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-[#DA291C]">{section.number}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#333F48] mb-3">{section.title}</h2>
                    <p className="text-sm text-[#74869B] mb-4 leading-relaxed">{section.body}</p>
                    <ul className="space-y-2.5">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#333F48]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#DA291C] mt-2 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            {/* Contact */}
            <div className="px-8 py-8 border-t border-[#E5EAF0]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#FBE9E8] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-[#DA291C]">06</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#333F48] mb-3">Liên hệ</h2>
                  <p className="text-sm text-[#74869B] mb-4 leading-relaxed">
                    Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ:
                  </p>
                  <div className="bg-[#f5f6f7] rounded-lg border border-[#E5EAF0] p-6">
                    <p className="font-bold text-[#333F48] mb-3">Đạt Hoàng - Bộ phận Chăm sóc Khách hàng</p>
                    <div className="space-y-2">
                      <p className="text-sm text-[#74869B] flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#DA291C]">mail</span>
                        privacy@cloth.com
                      </p>
                      <p className="text-sm text-[#74869B] flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#DA291C]">phone</span>
                        1900 1234
                      </p>
                      <p className="text-sm text-[#74869B] flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#DA291C]">location_on</span>
                        123 Đại lộ Tech, Quận 1, TP.HCM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="px-8 py-6 border-t border-[#E5EAF0] text-center">
              <p className="text-xs text-[#ADBCCD]">Cập nhật lần cuối: Tháng 5/2026</p>
            </div>
          </div>
        </section>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}

export default PrivacyPage

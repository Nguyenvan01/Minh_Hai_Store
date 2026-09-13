import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'

const ReturnsPage = () => {
  const returnPolicy = [
    {
      title: 'Đổi hàng',
      icon: 'swap_horiz',
      description: 'Bạn có thể đổi sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên tem, mác và chưa qua sử dụng.'
    },
    {
      title: 'Hoàn tiền',
      icon: 'payments',
      description: 'Yêu cầu hoàn tiền sẽ được xử lý trong vòng 7-14 ngày làm việc sau khi chúng tôi nhận được sản phẩm trả lại.'
    },
    {
      title: 'Điều kiện',
      icon: 'check_circle',
      description: 'Sản phẩm đổi/trả phải còn nguyên vẹn, không có запаh hư, rách hoặc bẩn. Hóa đơn mua hàng phải còn đầy đủ.'
    },
    {
      title: 'Chi phí',
      icon: 'payments',
      description: 'Minh Hải sẽ chịu chi phí vận chuyển cho việc đổi/trả hàng. Bạn chỉ cần liên hệ để được hướng dẫn gửi sản phẩm.'
    }
  ]

  const nonReturnable = [
    'Sản phẩm đã qua sử dụng, giặt tẩy hoặc có dấu hiệu đã được mang',
    'Sản phẩm không còn nguyên tem, mác hoặc bao bì',
    'Sản phẩm giảm giá hoặc nằm trong chương trình khuyến mãi đặc biệt',
    'Đồ lót, vớ, gang tay và các sản phẩm vệ sinh cá nhân'
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={0} />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-slate-900 text-white py-20">
          <div className="max-w-screen-2xl mx-auto px-8 text-center">
            <span className="material-symbols-outlined text-6xl mb-4 text-primary">autorenew</span>
            <h1 className="text-5xl font-bold mb-4">Đổi Trả Hàng</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Chính sách đổi trả linh hoạt, mang đến sự an tâm cho khách hàng
            </p>
          </div>
        </section>

        {/* Return Policy */}
        <section className="py-24 max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Chính sách</span>
            <h2 className="text-4xl font-bold mt-2">Quy định đổi trả</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {returnPolicy.map((item, index) => (
              <div key={index} className="flex gap-6 p-6 bg-slate-50 rounded-2xl">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl text-primary">{item.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Non-returnable */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Sản phẩm không áp dụng đổi trả</h2>
              <ul className="space-y-4">
                {nonReturnable.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl">
                    <span className="material-symbols-outlined text-red-500 mt-0.5">cancel</span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Hướng dẫn</span>
            <h2 className="text-4xl font-bold mt-2">Quy trình đổi trả</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="font-bold mb-2">Liên hệ</h3>
              <p className="text-slate-600 text-sm">Gọi hotline hoặc inbox fanpage để thông báo yêu cầu đổi trả</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="font-bold mb-2">Gửi hàng</h3>
              <p className="text-slate-600 text-sm">Đóng gói sản phẩm và gửi về địa chỉ được hướng dẫn</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="font-bold mb-2">Xác nhận</h3>
              <p className="text-slate-600 text-sm">Minh Hải kiểm tra sản phẩm và xác nhận yêu cầu đổi trả</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h3 className="font-bold mb-2">Hoàn tất</h3>
              <p className="text-slate-600 text-sm">Đổi hàng mới hoặc hoàn tiền trong 7-14 ngày</p>
            </div>
          </div>
        </section>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}

export default ReturnsPage

import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'

const ShippingPage = () => {
  const shippingMethods = [
    {
      name: 'Giao hàng nhanh',
      time: '1-2 ngày làm việc',
      price: '35.000đ',
      description: 'Áp dụng cho các đơn hàng nội thành TP.HCM và Hà Nội'
    },
    {
      name: 'Giao hàng tiêu chuẩn',
      time: '3-5 ngày làm việc',
      price: '25.000đ',
      description: 'Áp dụng cho các tỉnh thành khác trên toàn quốc'
    },
    {
      name: 'Giao hàng tiết kiệm',
      time: '5-7 ngày làm việc',
      price: '15.000đ',
      description: 'Phù hợp với đơn hàng không gấp'
    }
  ]

  const faqItems = [
    {
      question: 'Làm sao để theo dõi đơn hàng?',
      answer: 'Sau khi đặt hàng thành công, bạn sẽ nhận được email và SMS với mã vận đơn. Bạn có thể tra cứu trạng thái đơn hàng trên website của đơn vị vận chuyển hoặc liên hệ hotline 1900 1234.'
    },
    {
      question: 'Tôi có thể thay đổi địa chỉ giao hàng không?',
      answer: 'Bạn chỉ có thể thay đổi địa chỉ nếu đơn hàng chưa được xử lý. Vui lòng liên hệ hotline ngay để được hỗ trợ.'
    },
    {
      question: 'Đơn hàng chưa đến sau thời gian dự kiến?',
      answer: 'Trong một số trường hợp đặc biệt (thiên tai, dịch bệnh...), đơn hàng có thể giao chậm hơn dự kiến. Hãy liên hệ với chúng tôi để được hỗ trợ.'
    },
    {
      question: 'Tôi có thể nhận hàng tại cửa hàng không?',
      answer: 'Có, bạn có thể chọn hình thức nhận hàng tại cửa hàng Đạt Hoàng gần bạn. Đơn hàng sẽ được giữ trong 7 ngày.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={0} />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-slate-900 text-white py-20">
          <div className="max-w-screen-2xl mx-auto px-8 text-center">
            <span className="material-symbols-outlined text-6xl mb-4 text-primary">local_shipping</span>
            <h1 className="text-5xl font-bold mb-4">Giao Hàng</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Thông tin về phương thức vận chuyển và thời gian giao hàng
            </p>
          </div>
        </section>

        {/* Shipping Methods */}
        <section className="py-24 max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Phương thức</span>
            <h2 className="text-4xl font-bold mt-2">Hình thức giao hàng</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {shippingMethods.map((method, index) => (
              <div key={index} className="border border-slate-200 rounded-2xl p-8 hover:border-primary transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{method.name}</h3>
                  <span className="text-2xl font-bold text-primary">{method.price}</span>
                </div>
                <p className="text-slate-600 mb-4">{method.description}</p>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>{method.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <div>
                <h4 className="font-bold mb-2">Miễn phí giao hàng</h4>
                <p className="text-slate-600">Đơn hàng từ 500.000đ sẽ được miễn phí vận chuyển trên toàn quốc.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Hỗ trợ</span>
              <h2 className="text-4xl font-bold mt-2">Câu hỏi thường gặp</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">help</span>
                    {item.question}
                  </h3>
                  <p className="text-slate-600 pl-6">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}

export default ShippingPage

import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={0} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[400px] bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600')] bg-cover bg-center opacity-20"></div>
          <div className="relative text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">Về Chúng Tôi</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Minh Hải - Thương hiệu thời trang Việt Nam hướng đến sự bền vững và phong cách hiện đại
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 max-w-screen-2xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Câu chuyện</span>
              <h2 className="text-4xl font-bold mt-2 mb-6">Khởi nguồn từ đam mê</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Minh Hải được thành lập vào năm 2018 với sứ mệnh mang đến những sản phẩm thời trang chất lượng cao với giá thành hợp lý cho người Việt.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Chúng tôi tin rằng thời trang không chỉ là về vẻ bề ngoài, mà còn là cách bạn thể hiện cá tính và phong cách sống của mình.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Từ một cửa hàng nhỏ tại Quận 1, Minh Hải đã phát triển thành một thương hiệu thời trang được yêu thích trên toàn quốc với hệ thống cửa hàng và cộng đồng khách hàng ngày càng lớn mạnh.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" alt="Store" className="rounded-2xl h-48 object-cover w-full" />
              <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400" alt="Clothes" className="rounded-2xl h-48 object-cover w-full mt-8" />
              <img src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400" alt="Team" className="rounded-2xl h-48 object-cover w-full" />
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400" alt="Fashion" className="rounded-2xl h-48 object-cover w-full mt-8" />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Giá trị</span>
              <h2 className="text-4xl font-bold mt-2">Những điều chúng tôi tin tưởng</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-3xl text-primary">eco</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Bền vững</h3>
                <p className="text-slate-600">Chúng tôi cam kết sử dụng vật liệu thân thiện với môi trường và quy trình sản xuất bền vững.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-3xl text-primary">favorite</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Chất lượng</h3>
                <p className="text-slate-600">Mỗi sản phẩm đều trải qua quy trình kiểm tra nghiêm ngặt để đảm bảo chất lượng tốt nhất.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-3xl text-primary">diversity_3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Cộng đồng</h3>
                <p className="text-slate-600">Minh Hải không chỉ là thương hiệu, mà còn là một cộng đồng những người yêu thời trang.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">6+</div>
                <div className="text-slate-400">Năm kinh nghiệm</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">50K+</div>
                <div className="text-slate-400">Khách hàng</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">500+</div>
                <div className="text-slate-400">Sản phẩm</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">20+</div>
                <div className="text-slate-400">Cửa hàng</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}

export default AboutPage

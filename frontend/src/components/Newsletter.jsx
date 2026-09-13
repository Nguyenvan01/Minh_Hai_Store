import React, { useState } from 'react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section className="py-12 bg-[#F4F6F9]">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl lg:text-2xl font-black text-[#333F48]">Đăng ký nhận tin</h3>
            <p className="font-medium text-sm text-[#74869B] mt-1">Nhận ưu đãi độc quyền và cập nhật xu hướng mới nhất</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                className="flex-1 sm:flex-none sm:w-64 h-10 px-4 border border-[#ADBCCD] rounded text-sm font-medium bg-white focus:outline-none focus:border-[#333F48] transition-colors"
              />
              <button
                type="submit"
                className="h-10 px-6 bg-[#333F48] text-white font-bold text-sm rounded hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Đăng ký
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DA291C] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <p className="font-bold text-[#333F48]">Cảm ơn bạn đã đăng ký!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Newsletter

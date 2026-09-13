import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const VoucherSection = ({ vouchers }) => {
  const navigate = useNavigate()

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return null
    const now = new Date()
    const expiry = new Date(dateStr)
    const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
    return diff
  }

  if (!vouchers || vouchers.length === 0) return null

  return (
    <section className="py-8 lg:py-12">
      <div className="container">
        <h2 className="text-xl lg:text-3xl font-black text-[#333F48] mb-5">ƯU ĐÃI NỔI BẬT</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vouchers.map(voucher => {
            const daysLeft = getDaysLeft(voucher.expiry || voucher.valid_until)
            const expiryDate = voucher.expiry || voucher.valid_until
            return (
              <div key={voucher.id} className="bg-[#F4F6F9] border border-[#ADBCCD] rounded p-4 flex flex-col gap-1">
                <p className="font-bold text-lg text-[#333F48]">{voucher.title}</p>
                <p className="font-medium text-xs text-[#333F48]">{voucher.description}</p>
                <div className="flex items-end justify-between mt-auto pt-3">
                  <div>
                    {voucher.is_expiring_soon && daysLeft !== null && daysLeft >= 0 ? (
                      <p className="font-medium text-xs text-[#DA291C]">
                        Sắp hết hạn: Còn {daysLeft} ngày
                      </p>
                    ) : (
                      <p className="font-medium text-xs text-[#74869B]">HSD: {formatDate(expiryDate)}</p>
                    )}
                    <p className="font-bold text-xs text-[#333F48] mt-0.5">{voucher.condition}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (voucher.code) {
                        sessionStorage.setItem('pendingVoucher', JSON.stringify({
                          code: voucher.code,
                          title: voucher.title,
                          description: voucher.description
                        }))
                      }
                      navigate('/nam')
                    }}
                    className="bg-[#333F48] text-white font-bold text-sm px-4 py-2 rounded hover:opacity-90 transition-opacity"
                  >
                    Dùng mã
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default VoucherSection

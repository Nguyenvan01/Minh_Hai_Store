import React from 'react'

const CLiveSection = ({ image, cta = '/app' }) => {
  const defaultImage = '/images/clive-banner.png'

  return (
    <div className="flex flex-col sm:flex-row">
      {/* Image side */}
      <div className="w-full sm:w-1/2">
        <img
          src={image || defaultImage}
          alt="C-LIVE"
          className="w-full h-full object-cover min-h-[280px]"
        />
      </div>

      {/* Content side */}
      <div className="w-full sm:w-1/2 bg-[#333F48] flex items-center">
        <div className="p-8 lg:p-12 xl:p-16">
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-black text-white mb-4 leading-tight">
            C-LIVE - NHƯ MUA SẮM TẠI CỬA HÀNG
          </h2>
          <p className="font-medium text-white max-w-md mb-6">
            Tính năng mua sắm mới trên app, giúp bạn gọi video call trực tiếp tới nhân viên tư vấn thời trang tại cửa hàng. Hoàn toàn miễn phí.
          </p>
          <div className="flex items-center gap-4">
            {/* QR Box placeholder */}
            <div className="w-24 h-24 bg-white rounded flex items-center justify-center flex-shrink-0">
              <div className="text-center px-2">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#333F48">
                  <rect x="2" y="2" width="7" height="7"/><rect x="15" y="2" width="7" height="7"/>
                  <rect x="2" y="15" width="7" height="7"/>
                  <rect x="4" y="4" width="3" height="3"/><rect x="16" y="4" width="3" height="3"/>
                  <rect x="4" y="16" width="3" height="3"/>
                  <rect x="11" y="11" width="3" height="3"/>
                  <rect x="17" y="17" width="5" height="5"/>
                  <rect x="19" y="19" width="1" height="1"/>
                </svg>
              </div>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Tải app Minh Hải</p>
              <small className="font-medium text-white/70 text-xs">Trải nghiệm C-LIVE ngay hôm nay</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CLiveSection

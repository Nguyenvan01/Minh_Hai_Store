import React from 'react'

const SimpleHome = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#4450b7', fontSize: '32px', marginBottom: '20px' }}>
        Minh Hải Store
      </h1>
      <p style={{ color: '#666', fontSize: '18px' }}>
        Website đang hoạt động!
      </p>
      <p style={{ color: '#999', marginTop: '20px' }}>
        Nếu bạn thấy dòng này, React đang render bình thường.
      </p>
    </div>
  )
}

export default SimpleHome

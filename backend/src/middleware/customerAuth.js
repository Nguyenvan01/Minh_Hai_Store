const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../middleware/auth')

function customerAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.role && decoded.role !== 'user') {
      return res.status(403).json({ success: false, message: 'Tài khoản quản trị không thể sử dụng chức năng khách hàng.' })
    }
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' })
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { id: null }
    return next()
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded.role && decoded.role !== 'user' ? { id: null } : decoded
    next()
  } catch (err) {
    req.user = { id: null }
    next()
  }
}

module.exports = { customerAuth, optionalAuth }

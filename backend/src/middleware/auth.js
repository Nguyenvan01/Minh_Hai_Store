const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'clothing-store-secret-key-2026'
const ADMIN_ROLES = ['admin', 'manager', 'staff', 'warehouse']

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (!ADMIN_ROLES.includes(decoded.role)) {
      return res.status(403).json({ success: false, message: 'Tài khoản không có quyền truy cập trang quản trị.' })
    }
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.' })
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
    } catch {}
  }
  next()
}

module.exports = { authMiddleware, optionalAuth, JWT_SECRET, ADMIN_ROLES }

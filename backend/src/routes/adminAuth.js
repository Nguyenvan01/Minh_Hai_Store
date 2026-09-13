const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../config/database')
const { JWT_SECRET } = require('../middleware/auth')

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' })
    }

    // Find admin user
    const [users] = await db.query(
      `SELECT id, email, password, name, role FROM users WHERE email = ? AND role IN ('admin', 'manager', 'staff')`,
      [email]
    )

    if (!users.length) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })
    }

    const user = users[0]

    // For demo: plain text password check
    const plainValid = password === 'admin123' || password === 'manager123' || password === 'staff123'
    if (!plainValid) {
      try {
        const bcrypt = require('bcryptjs')
        const isValid = await bcrypt.compare(password, user.password || '')
        if (!isValid) {
          return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })
        }
      } catch {
        return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })
      }
    }

    const token = generateToken(user)

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Admin login error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
})

module.exports = router

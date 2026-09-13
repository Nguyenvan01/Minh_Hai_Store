const db = require('../config/database')
const { JWT_SECRET } = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const DEFAULT_AVATAR = null

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'user' },
    JWT_SECRET,
    { expiresIn: '30d' }
  )
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Email không hợp lệ' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email đã được sử dụng' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, role, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, phone?.trim() || '', 'user', DEFAULT_AVATAR]
    )

    const token = generateToken({ id: result.insertId, email: email.toLowerCase().trim(), role: 'user' })

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.insertId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || '',
        avatar: DEFAULT_AVATAR,
        memberLevel: 'Bronze'
      }
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' })
    }

    const [users] = await db.query(
      `SELECT id, name, email, password, phone, avatar, member_level, created_at FROM users WHERE email = ? AND role IN ('user', 'admin', 'manager', 'staff')`,
      [email.toLowerCase().trim()]
    )

    if (!users.length) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })
    }

    const user = users[0]
    const isValid = await bcrypt.compare(password, user.password || '')

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })
    }

    const token = generateToken(user)

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        memberLevel: user.member_level || 'Bronze'
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau' })
  }
}

exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, avatar, member_level, birth_date, gender, created_at FROM users WHERE id = ?',
      [req.user.id]
    )
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' })
    }
    const user = rows[0]
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        memberLevel: user.member_level || 'Bronze',
        birthDate: user.birth_date || '',
        gender: user.gender || ''
      }
    })
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, birthDate, gender } = req.body
    const updates = []
    const values = []

    if (name !== undefined && name !== '') {
      updates.push('name = ?')
      values.push(name.trim())
    }
    if (phone !== undefined) {
      updates.push('phone = ?')
      values.push(phone.trim())
    }
    if (birthDate !== undefined) {
      updates.push('birth_date = ?')
      values.push(birthDate)
    }
    if (gender !== undefined) {
      updates.push('gender = ?')
      values.push(gender)
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có gì để cập nhật' })
    }

    values.push(req.user.id)
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values)

    const [rows] = await db.query(
      'SELECT id, name, email, phone, avatar, member_level, birth_date, gender FROM users WHERE id = ?',
      [req.user.id]
    )
    const user = rows[0]
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        memberLevel: user.member_level || 'Bronze',
        birthDate: user.birth_date || '',
        gender: user.gender || ''
      }
    })
  } catch (err) {
    console.error('Update profile error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// ===== ORDERS =====

exports.createOrder = async (req, res) => {
  const conn = await db.getConnection()
  try {
    const userId = req.user.id
    const {
      items,
      shipping_address,
      shipping_fee = 0,
      discount_amount = 0,
      payment_method = 'cod',
      payment_status = 'unpaid',
      note = '',
      coupon_code = null,
      recipient_name = '',
      recipient_phone = '',
      ward = '',
      district = '',
      city = ''
    } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' })
    }
    if (!shipping_address) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập địa chỉ giao hàng' })
    }

    await conn.beginTransaction()

    // Get customer info from users table
    const [[userRow]] = await conn.query('SELECT name, email, phone FROM users WHERE id = ?', [userId])
    const customer_name = userRow?.name || ''
    const customer_email = userRow?.email || ''
    const customer_phone = userRow?.phone || ''

    // Calculate totals from items
    let subtotal = 0
    for (const item of items) {
      subtotal += parseFloat(item.unit_price || item.price) * parseInt(item.quantity || 1)
    }
    const total_price = subtotal + parseFloat(shipping_fee) - parseFloat(discount_amount)

    // Generate order number
    const [[lastOrder]] = await conn.query('SELECT order_number FROM orders ORDER BY id DESC LIMIT 1')
    const lastNum = lastOrder ? parseInt(lastOrder.order_number.replace(/\D/g, '') || '0') : 0
    const order_number = `ORD${String(lastNum + 1).padStart(6, '0')}`

    // Create order - include ALL NOT NULL columns
    const [orderResult] = await conn.query(
      `INSERT INTO orders (
        user_id, customer_name, customer_email, customer_phone,
        order_number, subtotal, shipping_fee, discount_amount,
        total_price, status, payment_method, payment_status,
        shipping_address, shipping_full_address,
        recipient_name, recipient_phone, ward, district, city,
        note, coupon_code,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId, customer_name, customer_email, customer_phone,
        order_number, subtotal, shipping_fee, discount_amount,
        total_price, payment_method, payment_status,
        shipping_address, shipping_address,
        recipient_name, recipient_phone, ward, district, city,
        note, coupon_code
      ]
    )
    const orderId = orderResult.insertId

    // Create order items
    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, variant_id,
          product_name, product_sku, product_image,
          size_name, color_name, variant_name,
          unit_price, quantity, total_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id || null,
          item.variant_id || null,
          item.product_name || item.name,
          item.product_sku || '',
          item.product_image || item.image || '',
          item.size_name || item.size || '',
          item.color_name || item.color || '',
          item.variant_name || '',
          item.unit_price || item.price,
          item.quantity || 1,
          (item.unit_price || item.price) * (item.quantity || 1)
        ]
      )
    }

    await conn.commit()

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      order: {
        id: orderId,
        order_number,
        total_price,
        status: 'pending',
        payment_status,
        payment_method
      }
    })
  } catch (err) {
    await conn.rollback()
    console.error('Create order error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo đơn hàng' })
  } finally {
    conn.release()
  }
}

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10))
    const offset = (page - 1) * limit

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [userId]
    )

    const [orders] = await db.query(
      `SELECT o.id, o.order_number, o.total_price, o.status, o.payment_status,
              o.shipping_address, o.created_at,
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count,
              (SELECT oi.product_image FROM order_items oi WHERE oi.order_id = o.id LIMIT 1) as first_image
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    )

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    console.error('Get orders error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}

exports.getOrderDetail = async (req, res) => {
  try {
    const userId = req.user.id

    const [orders] = await db.query(
      `SELECT o.* FROM orders o WHERE o.id = ? AND o.user_id = ?`,
      [req.params.id, userId]
    )
    if (!orders.length) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' })

    const order = orders[0]

    const [items] = await db.query(
      `SELECT oi.id, oi.product_id, oi.variant_id,
              oi.product_name, oi.product_sku, oi.product_image,
              oi.size_name, oi.color_name, oi.variant_name,
              oi.unit_price, oi.quantity, oi.total_price
       FROM order_items oi WHERE oi.order_id = ?`,
      [req.params.id]
    )

    res.json({
      success: true,
      order: { ...order, items }
    })
  } catch (err) {
    console.error('Get order detail error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}

exports.cancelOrder = async (req, res) => {
  const conn = await db.getConnection()
  try {
    const userId = req.user.id
    const { reason } = req.body
    const orderId = req.params.id

    const [[order]] = await conn.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    )
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' })

    const cancellable = ['pending', 'confirmed']
    if (!cancellable.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể hủy đơn ở trạng thái chờ xác nhận hoặc đã xác nhận'
      })
    }

    await conn.beginTransaction()

    await conn.query(
      'UPDATE orders SET status = ?, cancel_reason = ?, cancelled_at = NOW(), updated_at = NOW() WHERE id = ?',
      ['cancelled', reason || 'Không ghi nhận lý do', orderId]
    )

    await conn.commit()
    res.json({ success: true, message: 'Đơn hàng đã được hủy' })
  } catch (err) {
    await conn.rollback()
    console.error('Cancel order error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  } finally {
    conn.release()
  }
}

// ===== WISHLIST =====
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const [items] = await db.query(
      `SELECT w.id as wishlist_id, w.created_at as added_at,
              p.id, p.name, p.slug, p.price, p.compare_price,
              p.stock, p.is_active,
              (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [userId]
    )
    res.json({ success: true, wishlist: items || [] })
  } catch (err) {
    console.error('Get wishlist error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Thiếu productId' })
    }

    const [[product]] = await db.query('SELECT id, name, price FROM products WHERE id = ? AND is_active = TRUE', [productId])
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' })
    }

    const [[existing]] = await db.query(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    )
    if (existing) {
      return res.json({ success: true, message: 'Sản phẩm đã có trong danh sách yêu thích' })
    }

    await db.query(
      'INSERT INTO wishlists (user_id, product_id, created_at) VALUES (?, ?, NOW())',
      [userId, productId]
    )

    res.status(201).json({ success: true, message: 'Đã thêm vào danh sách yêu thích' })
  } catch (err) {
    console.error('Add to wishlist error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId } = req.params

    const [[existing]] = await db.query(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    )
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không có trong danh sách yêu thích' })
    }

    await db.query('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [userId, productId])
    res.json({ success: true, message: 'Đã xóa khỏi danh sách yêu thích' })
  } catch (err) {
    console.error('Remove from wishlist error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}

// ===== ADDRESSES =====
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id
    const [addresses] = await db.query(
      `SELECT id, full_name, phone, address, ward, district, city,
              is_default, created_at
       FROM addresses
       WHERE user_id = ?
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    )
    res.json({ success: true, addresses: addresses || [] })
  } catch (err) {
    console.error('Get addresses error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}

exports.createAddress = async (req, res) => {
  const conn = await db.getConnection()
  try {
    const userId = req.user.id
    const { fullName, phone, address, ward, district, city, isDefault } = req.body

    if (!fullName || !phone || !address || !city) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' })
    }

    const [[{ count }]] = await conn.query(
      'SELECT COUNT(*) as count FROM addresses WHERE user_id = ?',
      [userId]
    )

    await conn.beginTransaction()

    if (isDefault || count === 0) {
      await conn.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId])
    }

    const [result] = await conn.query(
      `INSERT INTO addresses (user_id, full_name, phone, address, ward, district, city, is_default, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [userId, fullName.trim(), phone.trim(), address.trim(), ward?.trim() || '', district?.trim() || '', city.trim(), (isDefault || count === 0) ? 1 : 0]
    )

    await conn.commit()

    const [[newAddress]] = await db.query('SELECT * FROM addresses WHERE id = ?', [result.insertId])
    res.status(201).json({ success: true, address: newAddress })
  } catch (err) {
    await conn.rollback()
    console.error('Create address error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  } finally {
    conn.release()
  }
}

exports.updateAddress = async (req, res) => {
  const conn = await db.getConnection()
  try {
    const userId = req.user.id
    const addressId = req.params.id
    const { fullName, phone, address, ward, district, city, isDefault } = req.body

    const [[existing]] = await conn.query(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    )
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' })

    await conn.beginTransaction()

    if (isDefault) {
      await conn.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId])
    }

    const fields = []
    const values = []
    if (fullName !== undefined) { fields.push('full_name = ?'); values.push(fullName.trim()) }
    if (phone !== undefined) { fields.push('phone = ?'); values.push(phone.trim()) }
    if (address !== undefined) { fields.push('address = ?'); values.push(address.trim()) }
    if (ward !== undefined) { fields.push('ward = ?'); values.push(ward?.trim() || '') }
    if (district !== undefined) { fields.push('district = ?'); values.push(district?.trim() || '') }
    if (city !== undefined) { fields.push('city = ?'); values.push(city.trim()) }
    if (isDefault !== undefined) { fields.push('is_default = ?'); values.push(isDefault ? 1 : 0) }

    if (fields.length > 0) {
      values.push(addressId, userId)
      await conn.query(`UPDATE addresses SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values)
    }

    await conn.commit()

    const [[updated]] = await db.query('SELECT * FROM addresses WHERE id = ?', [addressId])
    res.json({ success: true, address: updated })
  } catch (err) {
    await conn.rollback()
    console.error('Update address error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  } finally {
    conn.release()
  }
}

exports.deleteAddress = async (req, res) => {
  const conn = await db.getConnection()
  try {
    const userId = req.user.id
    const addressId = req.params.id

    const [[existing]] = await conn.query(
      'SELECT is_default FROM addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    )
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' })

    await conn.beginTransaction()
    await conn.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId])

    if (existing.is_default) {
      const [[firstAddress]] = await conn.query(
        'SELECT id FROM addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      )
      if (firstAddress) {
        await conn.query('UPDATE addresses SET is_default = TRUE WHERE id = ?', [firstAddress.id])
      }
    }

    await conn.commit()
    res.json({ success: true, message: 'Đã xóa địa chỉ' })
  } catch (err) {
    await conn.rollback()
    console.error('Delete address error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  } finally {
    conn.release()
  }
}

// Gửi đánh giá sản phẩm
exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id
    const { product_id, rating, content } = req.body

    if (!product_id || !rating) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' })
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Số sao phải từ 1 đến 5' })
    }
    if (!content || content.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Nội dung đánh giá phải có ít nhất 10 ký tự' })
    }

    // Kiểm tra sản phẩm tồn tại
    const [[product]] = await db.query('SELECT id, name FROM products WHERE id = ?', [product_id])
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' })
    }

    // Kiểm tra đã mua và đã giao hàng
    const [[order]] = await db.query(`
      SELECT o.id FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
      LIMIT 1
    `, [userId, product_id])

    if (!order) {
      return res.status(403).json({
        success: false,
        message: 'Bạn cần mua và nhận hàng trước khi đánh giá sản phẩm này'
      })
    }

    // Kiểm tra đã đánh giá chưa
    const [[existing]] = await db.query(
      'SELECT id FROM product_reviews WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    )
    if (existing) {
      return res.status(409).json({ success: false, message: 'Bạn đã đánh giá sản phẩm này rồi' })
    }

    await db.query(
      'INSERT INTO product_reviews (user_id, product_id, rating, content, is_approved, is_active, created_at) VALUES (?, ?, ?, ?, 1, 1, NOW())',
      [userId, product_id, rating, content.trim()]
    )

    res.json({ success: true, message: 'Cảm ơn bạn! Đánh giá đã được gửi và đang chờ duyệt.' })
  } catch (err) {
    console.error('Create review error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}

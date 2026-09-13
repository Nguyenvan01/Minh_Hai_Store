const db = require('../config/database')
const { JWT_SECRET } = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const DEFAULT_AVATAR = null

const cleanAddressPart = (value) => {
  const text = String(value ?? '').trim()
  if (!text || ['null', 'undefined'].includes(text.toLowerCase())) return ''
  return text
}

const joinAddressParts = (...parts) => parts.map(cleanAddressPart).filter(Boolean).join(', ')

const toPositiveInt = (value) => {
  const number = Number.parseInt(value, 10)
  return Number.isFinite(number) && number > 0 ? number : 0
}

const toMoney = (value) => {
  const number = Number.parseFloat(value)
  return Number.isFinite(number) ? number : 0
}

const formatOrderAddress = (order = {}) => {
  const fullAddress = cleanAddressPart(order.shipping_full_address)
  if (fullAddress) return fullAddress

  const detail = cleanAddressPart(order.address_detail)
  if (detail) {
    return joinAddressParts(
      detail,
      order.shipping_ward_name || order.shipping_ward || order.ward,
      order.shipping_district_name || order.shipping_district || order.district,
      order.shipping_city_name || order.shipping_city || order.city
    )
  }

  return cleanAddressPart(order.shipping_address) || joinAddressParts(
    order.shipping_ward_name || order.shipping_ward || order.ward,
    order.shipping_district_name || order.shipping_district || order.district,
    order.shipping_city_name || order.shipping_city || order.city
  )
}

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
        memberLevel: 'Bronze',
        rewardPoints: 0
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
      `SELECT id, name, email, password, phone, avatar, member_level, reward_points, created_at FROM users WHERE email = ? AND role = 'user'`,
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
        memberLevel: user.member_level || 'Bronze',
        rewardPoints: user.reward_points || 0,
        created_at: user.created_at
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
      'SELECT id, name, email, phone, avatar, member_level, reward_points, birth_date, gender, created_at FROM users WHERE id = ?',
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
        rewardPoints: user.reward_points || 0,
        birthDate: user.birth_date || '',
        gender: user.gender || '',
        created_at: user.created_at
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
      values.push(cleanAddressPart(phone))
    }
    if (birthDate !== undefined) {
      updates.push('birth_date = ?')
      values.push(cleanAddressPart(birthDate) || null)
    }
    if (gender !== undefined) {
      updates.push('gender = ?')
      values.push(cleanAddressPart(gender) || null)
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có gì để cập nhật' })
    }

    values.push(req.user.id)
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values)

    const [rows] = await db.query(
      'SELECT id, name, email, phone, avatar, member_level, reward_points, birth_date, gender, created_at FROM users WHERE id = ?',
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
        rewardPoints: user.reward_points || 0,
        birthDate: user.birth_date || '',
        gender: user.gender || '',
        created_at: user.created_at
      }
    })
  } catch (err) {
    console.error('Update profile error:', err)
    res.status(500).json({ success: false, message: 'Không thể cập nhật hồ sơ. Vui lòng thử lại sau.' })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
    }

    const [rows] = await db.query(`SELECT id, password FROM users WHERE id = ? AND role = 'user'`, [req.user.id])
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' })
    }

    const isValid = await bcrypt.compare(currentPassword, rows[0].password || '')
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await db.query('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?', [hashedPassword, req.user.id])

    res.json({ success: true, message: 'Đổi mật khẩu thành công' })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ success: false, message: 'Không thể đổi mật khẩu. Vui lòng thử lại sau.' })
  }
}

// ===== ORDERS =====

exports.createOrder = async (req, res) => {
  const conn = await db.getConnection()
  try {
    const userId = req.user?.id || null
    const {
      items,
      shipping_address,
      shipping_fee = 0,
      discount_amount = 0,
      payment_method = 'cod',
      payment_status = 'unpaid',
      shipping_method = 'standard',
      note = '',
      discount_code = null,
      recipient_name = '',
      recipient_phone = '',
      ward = '',
      district = '',
      city = '',
      ward_name = '',
      district_name = '',
      city_name = '',
      shipping_ward_name = '',
      shipping_district_name = '',
      shipping_city_name = '',
      address_detail = '',
      customer_name = '',
      customer_email = '',
      customer_phone = '',
    } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' })
    }
    if (!shipping_address) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập địa chỉ giao hàng' })
    }

    await conn.beginTransaction()

    // Get customer info from users table if logged in, otherwise use form data
    let finalName = cleanAddressPart(customer_name) || cleanAddressPart(recipient_name)
    let finalEmail = cleanAddressPart(customer_email)
    let finalPhone = cleanAddressPart(customer_phone) || cleanAddressPart(recipient_phone)

    if (userId) {
      const [[userRow]] = await conn.query('SELECT name, email, phone FROM users WHERE id = ?', [userId])
      if (userRow) {
        finalName = userRow.name || finalName
        finalEmail = userRow.email || finalEmail
        finalPhone = userRow.phone || finalPhone
      }
    }

    if (!finalName) {
      await conn.rollback()
      return res.status(400).json({ success: false, message: 'Vui lòng nhập họ tên người nhận' })
    }

    const finalRecipientName = cleanAddressPart(recipient_name) || finalName
    const finalRecipientPhone = cleanAddressPart(recipient_phone) || finalPhone
    const addressDetail = cleanAddressPart(address_detail)
    const addressBase = addressDetail || cleanAddressPart(shipping_address)
    const shippingWardName = cleanAddressPart(shipping_ward_name) || cleanAddressPart(ward_name)
    const shippingDistrictName = cleanAddressPart(shipping_district_name) || cleanAddressPart(district_name)
    const shippingCityName = cleanAddressPart(shipping_city_name) || cleanAddressPart(city_name)
    const fullShippingAddress = addressDetail
      ? joinAddressParts(
        addressBase,
        shippingWardName || ward,
        shippingDistrictName || district,
        shippingCityName || city
      )
      : addressBase

    const normalizedItems = []
    let subtotal = 0

    for (const item of items) {
      const productId = toPositiveInt(item.product_id || item.id)
      let variantId = item.variant_id ? toPositiveInt(item.variant_id) : null
      const quantity = toPositiveInt(item.quantity || 1)

      if (!productId) {
        await conn.rollback()
        return res.status(400).json({ success: false, message: 'Sản phẩm trong đơn hàng không hợp lệ.' })
      }
      if (!quantity) {
        await conn.rollback()
        return res.status(400).json({ success: false, message: 'Số lượng sản phẩm không hợp lệ.' })
      }

      const sizeValue = cleanAddressPart(item.size_name || item.size)
      const colorValue = cleanAddressPart(item.color_name || item.color)
      if (!variantId && (sizeValue || colorValue)) {
        const [variantRows] = await conn.query(
          `SELECT pv.id
           FROM product_variants pv
           LEFT JOIN sizes s ON pv.size_id = s.id
           LEFT JOIN colors c ON pv.color_id = c.id
           WHERE pv.product_id = ?
             AND pv.is_active = TRUE
             AND (? = '' OR s.code = ? OR s.name = ?)
             AND (? = '' OR c.code = ? OR c.name = ?)
           LIMIT 1`,
          [productId, sizeValue, sizeValue, sizeValue, colorValue, colorValue, colorValue]
        )
        variantId = variantRows[0]?.id || null
      }

      const [rows] = await conn.query(
        `SELECT p.id as product_id, p.name as product_name, p.sku as product_sku,
                p.price as product_price, p.stock as product_stock, p.is_active,
                (SELECT COUNT(*) FROM product_variants WHERE product_id = p.id AND is_active = TRUE) as variant_count,
                (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as product_image,
                pv.id as variant_id, pv.sku as variant_sku, pv.price as variant_price,
                pv.stock as variant_stock, pv.is_active as variant_active,
                s.name as size_name, c.name as color_name
         FROM products p
         LEFT JOIN product_variants pv ON pv.id = ? AND pv.product_id = p.id
         LEFT JOIN sizes s ON pv.size_id = s.id
         LEFT JOIN colors c ON pv.color_id = c.id
         WHERE p.id = ? AND p.is_active = TRUE
         LIMIT 1`,
        [variantId || 0, productId]
      )

      const product = rows[0]
      if (!product) {
        await conn.rollback()
        return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại hoặc đã ngừng bán.' })
      }
      if (variantId && !product.variant_id) {
        await conn.rollback()
        return res.status(400).json({ success: false, message: `Biến thể của sản phẩm "${product.product_name}" không hợp lệ.` })
      }
      if (!variantId && Number(product.variant_count) > 0) {
        await conn.rollback()
        return res.status(400).json({ success: false, message: `Vui lòng chọn size/màu cho sản phẩm "${product.product_name}".` })
      }
      if (variantId && Number(product.variant_active) !== 1) {
        await conn.rollback()
        return res.status(400).json({ success: false, message: `Biến thể của sản phẩm "${product.product_name}" đang tạm ẩn.` })
      }

      const availableStock = variantId ? Number(product.variant_stock) || 0 : Number(product.product_stock) || 0
      if (availableStock < quantity) {
        await conn.rollback()
        return res.status(400).json({ success: false, message: `Sản phẩm "${product.product_name}" không đủ tồn kho.` })
      }

      const unitPrice = toMoney(product.variant_price || product.product_price)
      const totalPrice = unitPrice * quantity
      subtotal += totalPrice
      normalizedItems.push({
        product_id: product.product_id,
        variant_id: product.variant_id || null,
        product_name: product.product_name,
        product_sku: product.variant_sku || product.product_sku || '',
        product_image: product.product_image || item.product_image || item.image || '',
        size_name: product.size_name || item.size_name || item.size || '',
        color_name: product.color_name || item.color_name || item.color || '',
        unit_price: unitPrice,
        quantity,
        total_price: totalPrice,
      })
    }

    const safeShippingFee = Math.max(0, toMoney(shipping_fee))
    const safeDiscountAmount = Math.max(0, toMoney(discount_amount))
    const total_price = Math.max(0, subtotal + safeShippingFee - safeDiscountAmount)

    // Generate order number
    const [[lastOrder]] = await conn.query('SELECT order_number FROM orders ORDER BY id DESC LIMIT 1')
    let order_number = 'ORD000001'
    if (lastOrder && lastOrder.order_number) {
      const lastNum = parseInt(lastOrder.order_number.replace(/\D/g, '') || '0')
      order_number = `ORD${String(lastNum + 1).padStart(6, '0')}`
    }

    // Insert order - match exact column names from database schema
    const [orderResult] = await conn.query(
      `INSERT INTO orders (
        user_id, customer_name, customer_email, customer_phone,
        order_number, subtotal, shipping_fee, discount_amount, discount_code,
        total_price, status, payment_method, payment_status,
        shipping_address, shipping_city, shipping_district, shipping_ward,
        address_detail, shipping_city_name, shipping_district_name, shipping_ward_name,
        shipping_method, shipping_note, recipient_name, recipient_phone,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId, finalName, finalEmail, finalPhone,
        order_number, subtotal, safeShippingFee, safeDiscountAmount, discount_code,
        total_price, 'pending', payment_method, payment_status,
        fullShippingAddress || shipping_address, city, district, ward,
        addressDetail || null, shippingCityName, shippingDistrictName, shippingWardName,
        shipping_method, note, finalRecipientName, finalRecipientPhone,
      ]
    )
    const orderId = orderResult.insertId

    // Create order items - only columns that exist in the schema
    for (const item of normalizedItems) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, variant_id,
          product_name, product_sku, product_image,
          size_name, color_name,
          unit_price, quantity, total_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.variant_id,
          item.product_name,
          item.product_sku,
          item.product_image,
          item.size_name,
          item.color_name,
          item.unit_price,
          item.quantity,
          item.total_price
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
      `SELECT o.id, o.order_number, o.total_price, o.status,
              o.payment_method, o.payment_status,
              o.shipping_address, o.address_detail,
              o.shipping_city, o.shipping_district, o.shipping_ward,
              o.shipping_city_name, o.shipping_district_name, o.shipping_ward_name,
              o.shipping_method, o.created_at,
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count,
              (SELECT COALESCE(SUM(quantity), 0) FROM order_items WHERE order_id = o.id) as total_items,
              (SELECT string_agg(oi.product_name, '|||' ORDER BY oi.id) FROM order_items oi WHERE oi.order_id = o.id) as product_names,
              (SELECT oi.product_image FROM order_items oi WHERE oi.order_id = o.id LIMIT 1) as first_image
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    )

    res.json({
      success: true,
      orders: orders.map(order => ({
        ...order,
        shipping_full_address: formatOrderAddress(order),
      })),
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
    const shippingFullAddress = formatOrderAddress(order)

    const [items] = await db.query(
      `SELECT oi.id, oi.product_id, oi.variant_id,
              oi.product_name, oi.product_sku, oi.product_image,
              oi.size_name, oi.color_name,
              oi.unit_price, oi.quantity, oi.total_price
       FROM order_items oi WHERE oi.order_id = ?`,
      [req.params.id]
    )

    res.json({
      success: true,
      order: {
        ...order,
        shipping_full_address: shippingFullAddress,
        shipping_info: {
          recipient_name: cleanAddressPart(order.recipient_name) || order.customer_name,
          recipient_phone: cleanAddressPart(order.recipient_phone) || order.customer_phone,
          address: shippingFullAddress,
          address_detail: cleanAddressPart(order.address_detail) || cleanAddressPart(order.shipping_address),
          ward: order.shipping_ward || order.ward,
          district: order.shipping_district || order.district,
          city: order.shipping_city || order.city,
          ward_name: order.shipping_ward_name,
          district_name: order.shipping_district_name,
          city_name: order.shipping_city_name,
          method: order.shipping_method || 'standard',
        },
        items,
      }
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
              c.name as category_name,
              (SELECT COUNT(*) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = TRUE) as variant_count,
              (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
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
      'INSERT INTO product_reviews (user_id, product_id, rating, content, is_approved, is_active, created_at) VALUES (?, ?, ?, ?, 0, 1, NOW())',
      [userId, product_id, rating, content.trim()]
    )

    res.json({ success: true, message: 'Cảm ơn bạn! Đánh giá đã được gửi và đang chờ duyệt.' })
  } catch (err) {
    console.error('Create review error:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}

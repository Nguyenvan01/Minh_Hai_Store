const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, unique + path.extname(file.originalname))
  }
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalname)) cb(null, true)
  else cb(new Error('Chỉ chấp nhận file ảnh'))
} })

// Upload image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Không có file' })
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.json({ success: true, url })
})

// Login - no auth required
router.post('/login', require('../controllers/adminController').adminLogin)

// All routes require authentication + admin role
const { authMiddleware } = require('../middleware/auth')
router.use(authMiddleware)

// Dashboard
router.get('/dashboard', require('../controllers/adminController').getDashboard)

// Notifications
router.get('/notifications', require('../controllers/adminController').getNotifications)

// Products
router.get('/products', require('../controllers/adminController').getProducts)
router.get('/sizes', async (req, res) => {
  const db = require('../config/database')
  const [rows] = await db.query('SELECT * FROM sizes WHERE is_active = TRUE ORDER BY sort_order ASC')
  res.json({ sizes: rows })
})
router.get('/colors', async (req, res) => {
  const db = require('../config/database')
  const [rows] = await db.query('SELECT * FROM colors WHERE is_active = TRUE ORDER BY sort_order ASC')
  res.json({ colors: rows })
})
router.get('/products/options', require('../controllers/adminController').getProductOptions)
router.get('/products/:id', require('../controllers/adminController').getProductById)
router.post('/products', require('../controllers/adminController').createProduct)
router.put('/products/:id', require('../controllers/adminController').updateProduct)
router.delete('/products/:id', require('../controllers/adminController').deleteProduct)
router.put('/products/:id/toggle', require('../controllers/adminController').toggleProduct)
router.put('/products/:id/toggle-featured', require('../controllers/adminController').toggleFeatured)

// Categories
router.get('/categories', require('../controllers/adminController').getCategories)
router.post('/categories', require('../controllers/adminController').createCategory)
router.put('/categories/:id', require('../controllers/adminController').updateCategory)
router.delete('/categories/:id', require('../controllers/adminController').deleteCategory)

// Brands
router.get('/brands', require('../controllers/adminController').getBrands)
router.post('/brands', require('../controllers/adminController').createBrand)
router.put('/brands/:id', require('../controllers/adminController').updateBrand)
router.delete('/brands/:id', require('../controllers/adminController').deleteBrand)

// Orders
router.get('/orders/stats', require('../controllers/adminController').getOrderStats)
router.get('/orders', require('../controllers/adminController').getOrders)
router.get('/orders/:id', require('../controllers/adminController').getOrderDetail)
router.put('/orders/:id/status', require('../controllers/adminController').updateOrderStatus)
router.put('/orders/:id/payment', require('../controllers/adminController').updatePaymentStatus)
router.post('/orders/:id/cancel', require('../controllers/adminController').cancelOrder)

// Customers
router.get('/customers', require('../controllers/adminController').getCustomers)
router.get('/customers/:id', require('../controllers/adminController').getCustomerDetail)
router.post('/customers', require('../controllers/adminController').createCustomer)
router.put('/customers/:id', require('../controllers/adminController').updateCustomer)
router.delete('/customers/:id', require('../controllers/adminController').deleteCustomer)

// Employees
router.get('/employees', require('../controllers/adminController').getEmployees)
router.post('/employees', require('../controllers/adminController').createEmployee)
router.put('/employees/:id', require('../controllers/adminController').updateEmployee)
router.delete('/employees/:id', require('../controllers/adminController').deleteEmployee)
router.put('/employees/:id/toggle', require('../controllers/adminController').toggleEmployee)

// Promotions
router.get('/promotions', require('../controllers/adminController').getPromotions)
router.get('/promotions/:id', require('../controllers/adminController').getPromotionById)
router.post('/promotions', require('../controllers/adminController').createPromotion)
router.put('/promotions/:id', require('../controllers/adminController').updatePromotion)
router.delete('/promotions/:id', require('../controllers/adminController').deletePromotion)

// Coupons
router.get('/coupons', require('../controllers/adminController').getCoupons)
router.post('/coupons', require('../controllers/adminController').createCoupon)
router.put('/coupons/:id', require('../controllers/adminController').updateCoupon)
router.delete('/coupons/:id', require('../controllers/adminController').deleteCoupon)

// Warehouse
router.get('/warehouse', require('../controllers/adminController').getWarehouse)

// Suppliers
router.get('/suppliers', require('../controllers/adminController').getSuppliers)
router.post('/suppliers', require('../controllers/adminController').createSupplier)
router.put('/suppliers/:id', require('../controllers/adminController').updateSupplier)
router.delete('/suppliers/:id', require('../controllers/adminController').deleteSupplier)

// Warehouses management
router.get('/warehouses', require('../controllers/adminController').getWarehouses)
router.post('/warehouses', require('../controllers/adminController').createWarehouse)
router.put('/warehouses/:id', require('../controllers/adminController').updateWarehouse)
router.delete('/warehouses/:id', require('../controllers/adminController').deleteWarehouse)

// Supplier Orders
router.get('/imports', require('../controllers/adminController').getImports)
router.get('/imports/:id', require('../controllers/adminController').getImportDetail)
router.post('/imports', require('../controllers/adminController').createImport)
router.put('/imports/:id', require('../controllers/adminController').updateImport)
router.delete('/imports/:id', require('../controllers/adminController').deleteImport)
router.post('/imports/:id/receive', require('../controllers/adminController').receiveImport)
router.get('/supplier-orders', require('../controllers/adminController').getSupplierOrders)
router.get('/supplier-orders/:id', require('../controllers/adminController').getSupplierOrderDetail)
router.post('/supplier-orders', require('../controllers/adminController').createSupplierOrder)
router.put('/supplier-orders/:id', require('../controllers/adminController').updateSupplierOrder)
router.delete('/supplier-orders/:id', require('../controllers/adminController').deleteSupplierOrder)
router.put('/supplier-orders/:id/receive', require('../controllers/adminController').receiveSupplierOrder)
router.put('/supplier-orders/:id/status', require('../controllers/adminController').updateSupplierOrderStatus)

// Reviews
router.get('/reviews', require('../controllers/adminController').getReviews)
router.get('/reviews/:id', require('../controllers/adminController').getReviewById)
router.put('/reviews/:id/status', require('../controllers/adminController').updateReviewStatus)
router.put('/reviews/:id/approve', require('../controllers/adminController').approveReview)
router.put('/reviews/:id/reply', require('../controllers/adminController').replyReview)
router.put('/reviews/:id/toggle', require('../controllers/adminController').toggleReviewActive)
router.delete('/reviews/:id', require('../controllers/adminController').deleteReview)

// News/Blog
router.get('/blogs', require('../controllers/adminController').getBlogs)
router.get('/blogs/:id', require('../controllers/adminController').getBlogById)
router.post('/blogs', require('../controllers/adminController').createBlog)
router.put('/blogs/:id', require('../controllers/adminController').updateBlog)
router.delete('/blogs/:id', require('../controllers/adminController').deleteBlog)
router.get('/news', require('../controllers/adminController').getNews)
router.get('/news/:id', require('../controllers/adminController').getBlogById)
router.post('/news', require('../controllers/adminController').createNews)
router.put('/news/:id', require('../controllers/adminController').updateNews)
router.delete('/news/:id', require('../controllers/adminController').deleteNews)

// Contacts
router.get('/contacts', require('../controllers/adminController').getContacts)
router.get('/contacts/:id', require('../controllers/adminController').getContactById)
router.put('/contacts/:id/status', require('../controllers/adminController').updateContactStatus)
router.delete('/contacts/:id', require('../controllers/adminController').deleteContact)

// Reports
router.get('/reports/overview', require('../controllers/adminController').getReportsOverview)
router.get('/reports/revenue', require('../controllers/adminController').getReportsRevenue)
router.get('/reports/orders', require('../controllers/adminController').getReportsOrders)
router.get('/reports/products', require('../controllers/adminController').getReportsProducts)
router.get('/reports/customers', require('../controllers/adminController').getReportsCustomers)
router.get('/reports/top-products', require('../controllers/adminController').getReportsProducts)
router.get('/reports/top-customers', require('../controllers/adminController').getReportsCustomers)
router.get('/reports', require('../controllers/adminController').getReports)

// Settings
router.get('/settings', require('../controllers/adminController').getSettings)
router.put('/settings', require('../controllers/adminController').updateSettings)

// Auth
router.get('/profile', require('../controllers/adminController').getProfile)
router.put('/profile', require('../controllers/adminController').updateProfile)
router.post('/logout', require('../controllers/adminController').logout)

module.exports = router

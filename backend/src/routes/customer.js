const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')
const { customerAuth, optionalAuth } = require('../middleware/customerAuth')

router.post('/auth/register', customerController.register)
router.post('/auth/login', customerController.login)
router.get('/profile', customerAuth, customerController.getProfile)
router.put('/profile', customerAuth, customerController.updateProfile)
router.put('/profile/change-password', customerAuth, customerController.changePassword)

// Orders
router.post('/orders', optionalAuth, customerController.createOrder)
router.get('/orders', customerAuth, customerController.getOrders)
router.get('/orders/:id', customerAuth, customerController.getOrderDetail)
router.post('/orders/:id/cancel', customerAuth, customerController.cancelOrder)

// Wishlist
router.get('/wishlist', customerAuth, customerController.getWishlist)
router.post('/wishlist', customerAuth, customerController.addToWishlist)
router.delete('/wishlist/:productId', customerAuth, customerController.removeFromWishlist)

// Addresses
router.get('/addresses', customerAuth, customerController.getAddresses)
router.post('/addresses', customerAuth, customerController.createAddress)
router.put('/addresses/:id', customerAuth, customerController.updateAddress)
router.delete('/addresses/:id', customerAuth, customerController.deleteAddress)

// Reviews
router.post('/reviews', customerAuth, customerController.createReview)

module.exports = router

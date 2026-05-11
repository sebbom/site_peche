const express = require('express');
const router = express.Router();
const {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  createCheckoutSession,
  stripeWebhook,
  getOrderBySession,
  getRecentOrders,
  getOrdersByStatus,
  getOrderStats
} = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// User routes
router.route('/order/new').post(isAuthenticatedUser, createOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);
router.route('/order/session/:sessionId').get(isAuthenticatedUser, getOrderBySession);

// Checkout routes
router.route('/checkout/create-session').post(isAuthenticatedUser, createCheckoutSession);
router.route('/webhook').post(stripeWebhook);

// Admin routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.route('/admin/orders/recent').get(isAuthenticatedUser, authorizeRoles('admin'), getRecentOrders);
router.route('/admin/orders/status/:status').get(isAuthenticatedUser, authorizeRoles('admin'), getOrdersByStatus);
router.route('/admin/orders/stats').get(isAuthenticatedUser, authorizeRoles('admin'), getOrderStats);
router.route('/admin/order/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;

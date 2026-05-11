const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItemCount,
  mergeCart
} = require('../controllers/cartController');
const { isAuthenticatedUser } = require('../middleware/auth');

// All cart routes require authentication
router.route('/cart').get(isAuthenticatedUser, getCart);
router.route('/cart/add').post(isAuthenticatedUser, addToCart);
router.route('/cart/update').put(isAuthenticatedUser, updateCartItem);
router.route('/cart/remove').put(isAuthenticatedUser, removeFromCart);
router.route('/cart/clear').delete(isAuthenticatedUser, clearCart);
router.route('/cart/count').get(isAuthenticatedUser, getCartItemCount);
router.route('/cart/merge').post(isAuthenticatedUser, mergeCart);

module.exports = router;

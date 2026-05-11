const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getAdminProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getFeaturedProducts,
  getNewArrivals,
  getBestsellers,
  getProductsByCategory,
  getRelatedProducts,
  toggleProductFeature,
  toggleProductActive
} = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Public routes
router.route('/products').get(getAllProducts);
router.route('/products/featured').get(getFeaturedProducts);
router.route('/products/new').get(getNewArrivals);
router.route('/products/bestsellers').get(getBestsellers);
router.route('/products/category/:categoryId').get(getProductsByCategory);
router.route('/products/related/:productId').get(getRelatedProducts);
router.route('/product/:id').get(getProductDetails);
router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(getProductReviews);
router.route('/review').delete(isAuthenticatedUser, deleteReview);

// Admin routes
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router.route('/admin/product/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.route('/admin/product/:id/feature').put(isAuthenticatedUser, authorizeRoles('admin'), toggleProductFeature);
router.route('/admin/product/:id/active').put(isAuthenticatedUser, authorizeRoles('admin'), toggleProductActive);

module.exports = router;

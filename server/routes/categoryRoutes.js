const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getAdminCategories,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
  getFeaturedCategories,
  getParentCategories,
  getSubCategories,
  toggleCategoryFeature,
  toggleCategoryActive,
  reorderCategories
} = require('../controllers/categoryController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Public routes
router.route('/categories').get(getAllCategories);
router.route('/categories/featured').get(getFeaturedCategories);
router.route('/categories/parents').get(getParentCategories);
router.route('/categories/parent/:parentId').get(getSubCategories);
router.route('/category/:id').get(getCategoryDetails);

// Admin routes
router.route('/admin/categories').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminCategories);
router.route('/admin/category/new').post(isAuthenticatedUser, authorizeRoles('admin'), createCategory);
router.route('/admin/category/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateCategory)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCategory);
router.route('/admin/category/:id/feature').put(isAuthenticatedUser, authorizeRoles('admin'), toggleCategoryFeature);
router.route('/admin/category/:id/active').put(isAuthenticatedUser, authorizeRoles('admin'), toggleCategoryActive);
router.route('/admin/categories/reorder').put(isAuthenticatedUser, authorizeRoles('admin'), reorderCategories);

module.exports = router;

const Category = require('../models/Category');
const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Create new category (Admin)
exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    category
  });
});

// Get all categories
exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    categories
  });
});

// Get all categories (Admin)
exports.getAdminCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find().sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    categories
  });
});

// Get single category details
exports.getCategoryDetails = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  // Get product count for this category
  const productCount = await Product.countDocuments({ 
    category: req.params.id, 
    isActive: true 
  });

  res.status(200).json({
    success: true,
    category,
    productCount
  });
});

// Update category (Admin)
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    category
  });
});

// Delete category (Admin)
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  // Check if category has products
  const products = await Product.find({ category: req.params.id });
  if (products.length > 0) {
    return next(new ErrorHandler('Cannot delete category with products. Please move products to another category first.', 400));
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});

// Get featured categories
exports.getFeaturedCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find({ isFeatured: true, isActive: true })
    .limit(6)
    .sort({ sortOrder: 1 });

  res.status(200).json({
    success: true,
    categories
  });
});

// Get parent categories (categories without parent)
exports.getParentCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find({ 
    parentCategory: null, 
    isActive: true 
  })
    .sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    categories
  });
});

// Get subcategories for a parent category
exports.getSubCategories = catchAsyncErrors(async (req, res, next) => {
  const subCategories = await Category.find({ 
    parentCategory: req.params.parentId, 
    isActive: true 
  })
    .sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    subCategories
  });
});

// Toggle category feature status (Admin)
exports.toggleCategoryFeature = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  category.isFeatured = !category.isFeatured;
  await category.save();

  res.status(200).json({
    success: true,
    category
  });
});

// Toggle category active status (Admin)
exports.toggleCategoryActive = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  category.isActive = !category.isActive;
  await category.save();

  res.status(200).json({
    success: true,
    category
  });
});

// Reorder categories (Admin)
exports.reorderCategories = catchAsyncErrors(async (req, res, next) => {
  const { categoryIds } = req.body;

  if (!categoryIds || !Array.isArray(categoryIds)) {
    return next(new ErrorHandler('Category IDs array is required', 400));
  }

  // Update sort order for each category
  for (let i = 0; i < categoryIds.length; i++) {
    await Category.findByIdAndUpdate(categoryIds[i], { sortOrder: i });
  }

  const updatedCategories = await Category.find().sort({ sortOrder: 1 });

  res.status(200).json({
    success: true,
    categories: updatedCategories
  });
});

const Product = require('../models/Product');
const Category = require('../models/Category');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

// Create new product (Admin)
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});

// Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 12;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resPerPage
  });
});

// Get all products (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products
  });
});

// Get single product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

// Update product (Admin)
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    product
  });
});

// Delete product (Admin)
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Create new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Calculate average rating
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  });
});

// Get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
});

// Delete review (Admin)
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  // Calculate average rating
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = reviews.length > 0 ? avg / reviews.length : 0;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false
    }
  );

  res.status(200).json({
    success: true
  });
});

// Get featured products
exports.getFeaturedProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .limit(8)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    products
  });
});

// Get new arrivals
exports.getNewArrivals = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({ isNew: true, isActive: true })
    .limit(8)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    products
  });
});

// Get bestsellers
exports.getBestsellers = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({ isBestseller: true, isActive: true })
    .limit(8)
    .sort({ sold: -1 });

  res.status(200).json({
    success: true,
    products
  });
});

// Get products by category
exports.getProductsByCategory = catchAsyncErrors(async (req, res, next) => {
  const categoryId = req.params.categoryId;
  
  // Check if category exists
  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  const products = await Product.find({ 
    category: categoryId, 
    isActive: true 
  })
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    products,
    category
  });
});

// Get related products
exports.getRelatedProducts = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true
  })
    .limit(4)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    relatedProducts
  });
});

// Toggle product feature status (Admin)
exports.toggleProductFeature = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  product.isFeatured = !product.isFeatured;
  await product.save();

  res.status(200).json({
    success: true,
    product
  });
});

// Toggle product active status (Admin)
exports.toggleProductActive = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  product.isActive = !product.isActive;
  await product.save();

  res.status(200).json({
    success: true,
    product
  });
});

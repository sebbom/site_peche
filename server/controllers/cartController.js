const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Add to cart
exports.addToCart = catchAsyncErrors(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  // Check if product exists and is active
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  if (!product.isActive) {
    return next(new ErrorHandler('Product is not available', 400));
  }

  if (product.stock < quantity) {
    return next(new ErrorHandler('Not enough stock available', 400));
  }

  // Find or create cart for user
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      cartItems: []
    });
  }

  // Check if product already exists in cart
  const existingItemIndex = cart.cartItems.findIndex(
    item => item.product.toString() === productId.toString()
  );

  if (existingItemIndex >= 0) {
    // Update quantity if product already in cart
    const existingItem = cart.cartItems[existingItemIndex];
    const newQuantity = existingItem.quantity + quantity;
    
    if (newQuantity > product.stock) {
      return next(new ErrorHandler('Total quantity exceeds available stock', 400));
    }
    
    cart.cartItems[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item to cart
    cart.cartItems.push({
      product: productId,
      quantity,
      price: product.price,
      name: product.name,
      image: product.images[0]?.url || '',
      stock: product.stock
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    cart
  });
});

// Get user cart
exports.getCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'cartItems.product',
    select: 'name price images stock isActive'
  });

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { cartItems: [] }
    });
  }

  // Check for inactive products or stock changes
  let updated = false;
  for (let i = cart.cartItems.length - 1; i >= 0; i--) {
    const item = cart.cartItems[i];
    const product = await Product.findById(item.product);
    
    if (!product || !product.isActive || item.quantity > product.stock) {
      cart.cartItems.splice(i, 1);
      updated = true;
    } else if (item.price !== product.price) {
      cart.cartItems[i].price = product.price;
      updated = true;
    }
  }

  if (updated) {
    await cart.save();
  }

  res.status(200).json({
    success: true,
    cart
  });
});

// Update cart item quantity
exports.updateCartItem = catchAsyncErrors(async (req, res, next) => {
  const { itemId, quantity } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(new ErrorHandler('Cart not found', 404));
  }

  const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === itemId);
  
  if (itemIndex === -1) {
    return next(new ErrorHandler('Cart item not found', 404));
  }

  const item = cart.cartItems[itemIndex];
  const product = await Product.findById(item.product);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  if (quantity <= 0) {
    return next(new ErrorHandler('Quantity must be greater than 0', 400));
  }

  if (quantity > product.stock) {
    return next(new ErrorHandler('Not enough stock available', 400));
  }

  cart.cartItems[itemIndex].quantity = quantity;
  await cart.save();

  res.status(200).json({
    success: true,
    cart
  });
});

// Remove item from cart
exports.removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const { itemId } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(new ErrorHandler('Cart not found', 404));
  }

  const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === itemId);
  
  if (itemIndex === -1) {
    return next(new ErrorHandler('Cart item not found', 404));
  }

  cart.cartItems.splice(itemIndex, 1);
  await cart.save();

  // If cart is empty, delete it
  if (cart.cartItems.length === 0) {
    await Cart.findByIdAndDelete(cart._id);
  }

  res.status(200).json({
    success: true,
    message: 'Item removed from cart successfully'
  });
});

// Clear cart
exports.clearCart = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  await Cart.findOneAndDelete({ user: userId });

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully'
  });
});

// Get cart item count
exports.getCartItemCount = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  const count = cart ? cart.cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

  res.status(200).json({
    success: true,
    count
  });
});

// Merge guest cart with user cart (for login)
exports.mergeCart = catchAsyncErrors(async (req, res, next) => {
  const { guestCartItems } = req.body;
  const userId = req.user._id;

  if (!guestCartItems || !Array.isArray(guestCartItems) || guestCartItems.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No guest cart items to merge'
    });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      cartItems: []
    });
  }

  // Process each guest cart item
  for (const guestItem of guestCartItems) {
    const product = await Product.findById(guestItem.productId);
    
    if (!product || !product.isActive) {
      continue; // Skip if product doesn't exist or is inactive
    }

    const quantity = Math.min(guestItem.quantity, product.stock);
    
    if (quantity <= 0) {
      continue;
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.cartItems.findIndex(
      item => item.product.toString() === guestItem.productId.toString()
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      const newQuantity = cart.cartItems[existingItemIndex].quantity + quantity;
      
      if (newQuantity <= product.stock) {
        cart.cartItems[existingItemIndex].quantity = newQuantity;
      } else {
        cart.cartItems[existingItemIndex].quantity = product.stock;
      }
    } else {
      // Add new item to cart
      cart.cartItems.push({
        product: guestItem.productId,
        quantity,
        price: product.price,
        name: product.name,
        image: product.images[0]?.url || '',
        stock: product.stock
      });
    }
  }

  await cart.save();

  res.status(200).json({
    success: true,
    cart
  });
});

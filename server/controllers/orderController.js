const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create new order
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id
  });

  // Clear the cart after order is created
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({
    success: true,
    order
  });
});

// Get single order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});

// Get logged in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders
  });
});

// Get all orders (Admin)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  let totalAmount = 0;
  orders.forEach(order => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount
  });
});

// Update order status (Admin)
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Check if status is being updated to delivered
  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  order.orderStatus = req.body.status;
  
  if (req.body.trackingNumber) {
    order.trackingNumber = req.body.trackingNumber;
  }
  
  if (req.body.notes) {
    order.notes = req.body.notes;
  }

  await order.save();

  res.status(200).json({
    success: true,
    order
  });
});

// Delete order (Admin)
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully'
  });
});

// Create Stripe checkout session
exports.createCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const { cartItems, shippingInfo } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return next(new ErrorHandler('No items in cart', 400));
  }

  // Calculate order totals
  let itemsPrice = 0;
  let taxPrice = 0;
  let shippingPrice = 0;
  
  // Calculate items price
  cartItems.forEach(item => {
    itemsPrice += item.price * item.quantity;
  });

  // Calculate tax (10% for example)
  taxPrice = itemsPrice * 0.10;
  
  // Calculate shipping (free over $100, otherwise $10)
  shippingPrice = itemsPrice > 100 ? 0 : 10;
  
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Create line items for Stripe
  const line_items = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }));

  // Add shipping and tax as separate line items
  if (taxPrice > 0) {
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Tax',
        },
        unit_amount: Math.round(taxPrice * 100),
      },
      quantity: 1,
    });
  }

  if (shippingPrice > 0) {
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: Math.round(shippingPrice * 100),
      },
      quantity: 1,
    });
  }

  // Create Stripe session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    metadata: {
      userId: req.user._id.toString(),
      itemsPrice: itemsPrice.toString(),
      taxPrice: taxPrice.toString(),
      shippingPrice: shippingPrice.toString(),
      totalPrice: totalPrice.toString(),
      shippingInfo: JSON.stringify(shippingInfo),
      cartItems: JSON.stringify(cartItems)
    }
  });

  res.status(200).json({
    success: true,
    url: session.url
  });
});

// Stripe webhook for payment confirmation
exports.stripeWebhook = catchAsyncErrors(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Extract metadata
    const metadata = session.metadata;
    const userId = metadata.userId;
    const itemsPrice = parseFloat(metadata.itemsPrice);
    const taxPrice = parseFloat(metadata.taxPrice);
    const shippingPrice = parseFloat(metadata.shippingPrice);
    const totalPrice = parseFloat(metadata.totalPrice);
    const shippingInfo = JSON.parse(metadata.shippingInfo);
    const cartItems = JSON.parse(metadata.cartItems);

    // Create order
    const orderItems = cartItems.map(item => ({
      product: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      productId: item.productId
    }));

    const paymentInfo = {
      id: session.id,
      status: session.payment_status,
      paymentMethod: 'Stripe',
      paidAt: new Date(session.created * 1000)
    };

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: userId,
      stripePaymentIntentId: session.payment_intent
    });

    // Clear the cart
    await Cart.findOneAndDelete({ user: userId });

    // Update product stock
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;
        product.sold += item.quantity;
        await product.save();
      }
    }
  }

  res.status(200).json({ received: true });
});

// Get order by Stripe session ID
exports.getOrderBySession = catchAsyncErrors(async (req, res, next) => {
  const { sessionId } = req.params;

  const order = await Order.findOne({ 'paymentInfo.id': sessionId });

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});

// Get recent orders (Admin Dashboard)
exports.getRecentOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    orders
  });
});

// Get orders by status (Admin)
exports.getOrdersByStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.params;

  const orders = await Order.find({ orderStatus: status })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders
  });
});

// Get order statistics (Admin)
exports.getOrderStats = catchAsyncErrors(async (req, res, next) => {
  const [totalOrders, processingOrders, shippedOrders, deliveredOrders, totalRevenue] = 
    await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'Processing' }),
      Order.countDocuments({ orderStatus: 'Shipped' }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ]);

  const stats = {
    totalOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    totalRevenue: totalRevenue[0]?.total || 0
  };

  res.status(200).json({
    success: true,
    stats
  });
});

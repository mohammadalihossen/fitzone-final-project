const Order = require('../models/Order.model');
const Product = require('../models/Product.model');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item.' });
    }

    // Validate stock & calculate totals
    let itemsTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const price = product.discountPrice || product.price;
      itemsTotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price,
        quantity: item.quantity
      });

      // Decrease stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity, totalSold: item.quantity }
      });
    }

    const shippingCost = itemsTotal >= 5000 ? 0 : 120; // Free shipping over 5000 BDT
    const totalPrice = itemsTotal + shippingCost;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsTotal,
      shippingCost,
      totalPrice,
      notes,
      statusHistory: [{ status: 'pending' }]
    });

    await order.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/user
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments({ user: req.user._id })
    ]);

    res.json({
      success: true,
      orders,
      pagination: { page: Number(page), limit: Number(limit), total }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    // Users can only see their own orders
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'This order cannot be cancelled.' });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, totalSold: -item.quantity }
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || 'Cancelled by user';
    await order.save();

    res.json({ success: true, message: 'Order cancelled.', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    res.json({
      success: true,
      orders,
      pagination: { page: Number(page), limit: Number(limit), total }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    order.status = status;
    if (status === 'delivered') order.deliveredAt = new Date();
    order.statusHistory.push({ status, note });
    await order.save();

    res.json({ success: true, message: 'Order status updated.', order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getUserOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus };

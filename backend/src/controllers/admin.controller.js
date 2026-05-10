const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Admin
const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const [
      totalProducts, totalUsers, totalOrders,
      lowStockProducts, recentOrders, orderStats,
      topProducts, revenueByMonth
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),

      // Low stock products
      Product.find({ stock: { $gt: 0, $lte: 10 }, isActive: true })
        .select('name stock brand category')
        .sort('stock')
        .limit(10),

      // Recent orders
      Order.find().sort('-createdAt').limit(5).populate('user', 'name email'),

      // Order stats by status
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } }
      ]),

      // Top selling products
      Product.find({ isActive: true }).sort('-totalSold').limit(5).select('name totalSold price images'),

      // Revenue by month (last 6 months)
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    // Total revenue
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Out of stock
    const outOfStock = await Product.countDocuments({ stock: 0, isActive: true });

    res.json({
      success: true,
      analytics: {
        overview: {
          totalProducts,
          totalUsers,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          outOfStock,
          lowStockCount: lowStockProducts.length
        },
        orderStats,
        lowStockProducts,
        recentOrders,
        topProducts,
        revenueByMonth
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(query).sort('-createdAt').skip((page - 1) * limit).limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({ success: true, users, pagination: { page: Number(page), total } });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status (Admin)
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ error: 'Cannot modify admin accounts.' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics, getAllUsers, toggleUserStatus };

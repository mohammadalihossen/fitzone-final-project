const Product = require('../models/Product.model');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12, search, category, brand,
      minPrice, maxPrice, sort = '-createdAt',
      featured, trending, inStock
    } = req.query;

    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category) query.category = category;
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;
    if (trending === 'true') query.isTrending = true;
    if (inStock === 'true') query.stock = { $gt: 0 };

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select('-reviews'),
      Product.countDocuments(query)
    ]);

    // Get distinct brands and categories for filters
    const brands = await Product.distinct('brand', { isActive: true });
    const categories = await Product.distinct('category', { isActive: true });

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      filters: { brands, categories }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { slug: req.params.id }
      ],
      isActive: true
    }).populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully.', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ success: true, message: 'Product updated.', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, { isActive: false }, { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ error: 'You have already reviewed this product.' });
    }

    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.calcAvgRating();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk upload products (Admin)
// @route   POST /api/products/bulk
// @access  Admin
const bulkUpload = async (req, res, next) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of products.' });
    }
    const created = await Product.insertMany(products);
    res.status(201).json({
      success: true,
      message: `${created.length} products uploaded successfully.`,
      count: created.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview, bulkUpload };

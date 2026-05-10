const User = require('../models/User.model');

// @desc    Toggle wishlist
// @route   PUT /api/users/wishlist
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const updated = await User.findById(req.user._id).populate('wishlist', 'name price images stock brand');

    res.json({
      success: true,
      message: index > -1 ? 'Removed from wishlist.' : 'Added to wishlist.',
      wishlist: updated.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price images stock brand category');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

module.exports = { toggleWishlist, getWishlist };

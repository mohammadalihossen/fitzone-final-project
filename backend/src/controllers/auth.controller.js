const User = require('../models/User.model');
const { generateToken } = require('../middlewares/auth.middleware');


// =========================
// REGISTER USER
// =========================
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Please provide name, email, and password.'
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists.'
      });
    }

    const user = await User.create({ name, email, password });

    // ✅ FIXED: full user pass
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist
      }
    });

  } catch (error) {
    next(error);
  }
};


// =========================
// LOGIN USER
// =========================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: 'Account deactivated.'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    // ✅ FIXED: full user pass
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist,
        avatar: user.avatar
      }
    });

  } catch (error) {
    next(error);
  }
};


// =========================
// GET ME
// =========================
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name price images stock');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};


// =========================
// UPDATE PROFILE
// =========================
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated.',
      user
    });

  } catch (error) {
    next(error);
  }
};


// =========================
// CHANGE PASSWORD
// =========================
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        error: 'Current password is incorrect.'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });

  } catch (error) {
    next(error);
  }
};


// =========================
// EXPORT
// =========================
module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
};

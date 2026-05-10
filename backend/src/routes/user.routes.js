const express = require('express');
const router = express.Router();
const { toggleWishlist, getWishlist } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/wishlist', protect, getWishlist);
router.put('/wishlist', protect, toggleWishlist);

module.exports = router;

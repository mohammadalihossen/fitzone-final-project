const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, addReview, bulkUpload
} = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, createProduct);
router.post('/bulk', protect, adminOnly, bulkUpload);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;

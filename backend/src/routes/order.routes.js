const express = require('express');
const router = express.Router();
const {
  createOrder, getUserOrders, getOrder,
  cancelOrder, getAllOrders, updateOrderStatus
} = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.post('/', protect, createOrder);
router.get('/user', protect, getUserOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;

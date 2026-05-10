const express = require('express');
const router = express.Router();
const { getAnalytics, getAllUsers, toggleUserStatus } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;

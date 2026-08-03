const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// User
router.post('/', verifyToken, orderController.placeOrder);
router.get('/mine', verifyToken, orderController.getMyOrders);

// Admin
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;

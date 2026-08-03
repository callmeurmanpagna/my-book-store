const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/', bookController.getBooks);
router.get('/featured', bookController.getFeatured);
router.get('/categories', bookController.getCategories);
router.get('/:id', bookController.getBookById);

// Admin only
router.post('/', verifyToken, isAdmin, bookController.createBook);
router.put('/:id', verifyToken, isAdmin, bookController.updateBook);
router.delete('/:id', verifyToken, isAdmin, bookController.deleteBook);

module.exports = router;

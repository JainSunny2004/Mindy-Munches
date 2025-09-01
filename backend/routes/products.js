const express = require('express');
const { body, query } = require('express-validator');
const productController = require('../controllers/productController');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['superfoods', 'grains', 'spices', 'oils', 'snacks', 'beverages'])
    .withMessage('Invalid category'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('sku')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be between 3 and 20 characters')
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

const searchValidation = [
  query('q').optional().trim().isLength({ min: 1, max: 100 }),
  query('category').optional().isIn(['superfoods', 'grains', 'spices', 'oils', 'snacks', 'beverages']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 })
];

// Public routes
router.get('/', optionalAuth, productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/categories', productController.getCategories);
router.get('/search', searchValidation, productController.searchProducts);
router.get('/:id', optionalAuth, productController.getProductById);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, productValidation, productController.createProduct);
router.put('/:id', authenticate, requireAdmin, productValidation, productController.updateProduct);
router.delete('/:id', authenticate, requireAdmin, productController.deleteProduct);
router.patch('/:id/status', authenticate, requireAdmin, productController.toggleProductStatus);

// Review routes (Authenticated users)
router.post('/:id/reviews', authenticate, reviewValidation, productController.addReview);
router.get('/:id/reviews', productController.getProductReviews);

module.exports = router;

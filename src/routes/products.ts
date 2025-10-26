import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { validateQuery, querySchema } from '@/middleware/validation';
import { authenticate, optionalAuth, authorize } from '@/middleware/auth';
import { ProductController } from '@/controllers/ProductController';

const router = express.Router();

// Public routes
router.get('/', validateQuery(querySchema), optionalAuth, asyncHandler(ProductController.getAllProducts));
router.get('/search', validateQuery(querySchema), optionalAuth, asyncHandler(ProductController.searchProducts));
router.get('/featured', optionalAuth, asyncHandler(ProductController.getFeaturedProducts));
router.get('/categories', asyncHandler(ProductController.getCategories));
router.get('/:id', optionalAuth, asyncHandler(ProductController.getProductById));
router.get('/artist/:artistId', validateQuery(querySchema), optionalAuth, asyncHandler(ProductController.getProductsByArtist));
router.get('/category/:category', validateQuery(querySchema), optionalAuth, asyncHandler(ProductController.getProductsByCategory));

// Protected routes (require authentication)
router.use(authenticate);

router.post('/:id/view', asyncHandler(ProductController.incrementViews));
router.post('/:id/like', asyncHandler(ProductController.toggleLike));

// Artist and Admin routes
router.use(authorize('artist', 'admin'));

router.post('/', asyncHandler(ProductController.createProduct));
router.put('/:id', asyncHandler(ProductController.updateProduct));
router.delete('/:id', asyncHandler(ProductController.deleteProduct));

// Admin only routes
router.use(authorize('admin'));

router.put('/:id/feature', asyncHandler(ProductController.toggleFeatured));
router.get('/admin/all', validateQuery(querySchema), asyncHandler(ProductController.getAllProductsAdmin));

export default router;

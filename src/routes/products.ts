import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate, authorize } from '@/middleware/auth';
import { ProductController } from '@/controllers/ProductController';

const router = express.Router();

// Public routes
router.get('/', asyncHandler(ProductController.getAll));
router.get('/:id', asyncHandler(ProductController.getById));

// Protected routes - Artist/Admin only
router.post('/', authenticate, authorize('artist', 'admin'), asyncHandler(ProductController.create));
router.put('/:id', authenticate, authorize('artist', 'admin'), asyncHandler(ProductController.update));
router.delete('/:id', authenticate, authorize('artist', 'admin'), asyncHandler(ProductController.delete));

export default router;

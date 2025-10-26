import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate, authorize } from '@/middleware/auth';
import { CategoryController } from '@/controllers/CategoryController';

const router = express.Router();

// Public routes
router.get('/', asyncHandler(CategoryController.getAll));
router.get('/:id', asyncHandler(CategoryController.getById));

// Admin routes
router.post('/', authenticate, authorize('admin'), asyncHandler(CategoryController.create));
router.put('/:id', authenticate, authorize('admin'), asyncHandler(CategoryController.update));
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(CategoryController.delete));
router.post('/update-counts', authenticate, authorize('admin'), asyncHandler(CategoryController.updateProductCounts));

export default router;


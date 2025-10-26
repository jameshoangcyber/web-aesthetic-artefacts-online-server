import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate, authorize } from '@/middleware/auth';
import { OrderController } from '@/controllers/OrderController';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Admin routes (must be before /:id to avoid conflicts)
router.get('/admin/all', authorize('admin'), asyncHandler(OrderController.getAllForAdmin));
router.put('/:id', authorize('admin'), asyncHandler(OrderController.update));

// User routes
router.get('/', asyncHandler(OrderController.getAll));
router.get('/:id', asyncHandler(OrderController.getById));
router.post('/', asyncHandler(OrderController.create));

export default router;

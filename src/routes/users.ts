import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate, authorize } from '@/middleware/auth';
import { UserController } from '@/controllers/UserController';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize('admin'), asyncHandler(UserController.getAll));
router.get('/:id', authorize('admin'), asyncHandler(UserController.getById));
router.put('/:id', authorize('admin'), asyncHandler(UserController.update));
router.delete('/:id', authorize('admin'), asyncHandler(UserController.delete));

export default router;

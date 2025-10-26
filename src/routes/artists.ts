import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate, authorize } from '@/middleware/auth';
import { ArtistController } from '@/controllers/ArtistController';

const router = express.Router();

// Public routes
router.get('/', asyncHandler(ArtistController.getAll));
router.get('/:id', asyncHandler(ArtistController.getById));

// Protected routes - Admin only
router.post('/', authenticate, authorize('admin'), asyncHandler(ArtistController.create));
router.put('/:id', authenticate, authorize('admin'), asyncHandler(ArtistController.update));
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(ArtistController.delete));
router.patch('/:id/status', authenticate, authorize('admin'), asyncHandler(ArtistController.toggleStatus));

export default router;

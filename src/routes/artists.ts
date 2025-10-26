import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { validateQuery, querySchema } from '@/middleware/validation';
import { optionalAuth, authorize } from '@/middleware/auth';
import { ArtistController } from '@/controllers/ArtistController';

const router = express.Router();

// Public routes
router.get('/', validateQuery(querySchema), optionalAuth, asyncHandler(ArtistController.getAllArtists));
router.get('/search', validateQuery(querySchema), optionalAuth, asyncHandler(ArtistController.searchArtists));
router.get('/:id', optionalAuth, asyncHandler(ArtistController.getArtistById));
router.get('/:id/products', validateQuery(querySchema), optionalAuth, asyncHandler(ArtistController.getArtistProducts));

// Protected routes (require authentication)
router.use(require('@/middleware/auth').authenticate);

// Artist and Admin routes
router.use(authorize('artist', 'admin'));

router.post('/', asyncHandler(ArtistController.createArtist));
router.put('/:id', asyncHandler(ArtistController.updateArtist));
router.delete('/:id', asyncHandler(ArtistController.deleteArtist));

// Admin only routes
router.use(authorize('admin'));

router.put('/:id/status', asyncHandler(ArtistController.toggleArtistStatus));
router.get('/admin/all', validateQuery(querySchema), asyncHandler(ArtistController.getAllArtistsAdmin));

export default router;

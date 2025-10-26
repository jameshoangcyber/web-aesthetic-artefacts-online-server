import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate } from '@/middleware/auth';
import { AuthController } from '@/controllers/AuthController';

const router = express.Router();

// Public routes
router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.post('/refresh-token', asyncHandler(AuthController.refreshToken));

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/logout', asyncHandler(AuthController.logout));
router.get('/me', asyncHandler(AuthController.me));

export default router;

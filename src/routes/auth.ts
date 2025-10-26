import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { validate } from '@/middleware/validation';
import { registerSchema, loginSchema, updateProfileSchema } from '@/middleware/validation';
import { authenticate, authorize } from '@/middleware/auth';
import { AuthController } from '@/controllers/AuthController';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), asyncHandler(AuthController.register));
router.post('/login', validate(loginSchema), asyncHandler(AuthController.login));
router.post('/refresh-token', asyncHandler(AuthController.refreshToken));
router.post('/forgot-password', asyncHandler(AuthController.forgotPassword));
router.post('/reset-password', asyncHandler(AuthController.resetPassword));
router.post('/verify-email', asyncHandler(AuthController.verifyEmail));
router.post('/resend-verification', asyncHandler(AuthController.resendVerification));

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/logout', asyncHandler(AuthController.logout));
router.get('/me', asyncHandler(AuthController.getProfile));
router.put('/profile', validate(updateProfileSchema), asyncHandler(AuthController.updateProfile));
router.put('/change-password', asyncHandler(AuthController.changePassword));
router.delete('/account', asyncHandler(AuthController.deleteAccount));

// Admin only routes
router.get('/users', authorize('admin'), asyncHandler(AuthController.getAllUsers));
router.get('/users/:id', authorize('admin'), asyncHandler(AuthController.getUserById));
router.put('/users/:id/role', authorize('admin'), asyncHandler(AuthController.updateUserRole));
router.delete('/users/:id', authorize('admin'), asyncHandler(AuthController.deleteUser));

export default router;

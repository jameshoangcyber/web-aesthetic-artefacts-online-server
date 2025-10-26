import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate, authorize } from '@/middleware/auth';
import { UserController } from '@/controllers/UserController';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// User profile routes
router.get('/profile', asyncHandler(UserController.getProfile));
router.put('/profile', asyncHandler(UserController.updateProfile));
router.put('/avatar', asyncHandler(UserController.updateAvatar));
router.put('/password', asyncHandler(UserController.changePassword));

// User preferences
router.get('/preferences', asyncHandler(UserController.getPreferences));
router.put('/preferences', asyncHandler(UserController.updatePreferences));

// User activity
router.get('/activity', asyncHandler(UserController.getUserActivity));
router.get('/orders', asyncHandler(UserController.getUserOrders));
router.get('/favorites', asyncHandler(UserController.getUserFavorites));

// Admin routes
router.use(authorize('admin'));

router.get('/admin/users', asyncHandler(UserController.getAllUsers));
router.get('/admin/users/:id', asyncHandler(UserController.getUserById));
router.put('/admin/users/:id', asyncHandler(UserController.updateUser));
router.delete('/admin/users/:id', asyncHandler(UserController.deleteUser));
router.get('/admin/stats', asyncHandler(UserController.getUserStats));

export default router;

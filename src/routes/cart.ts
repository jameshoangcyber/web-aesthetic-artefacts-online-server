import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate } from '@/middleware/auth';
import { CartController } from '@/controllers/CartController';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', asyncHandler(CartController.getCart));
router.post('/add', asyncHandler(CartController.addToCart));
router.put('/update', asyncHandler(CartController.updateCart));
router.delete('/remove/:productId', asyncHandler(CartController.removeFromCart));
router.delete('/clear', asyncHandler(CartController.clearCart));

export default router;

import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { addToCartSchema, updateCartItemSchema } from '@/middleware/validation';
import { CartController } from '@/controllers/CartController';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', asyncHandler(CartController.getCart));
router.post('/add', validate(addToCartSchema), asyncHandler(CartController.addToCart));
router.put('/update', validate(updateCartItemSchema), asyncHandler(CartController.updateCartItem));
router.delete('/remove/:productId', asyncHandler(CartController.removeFromCart));
router.delete('/clear', asyncHandler(CartController.clearCart));
router.get('/count', asyncHandler(CartController.getCartCount));

export default router;

import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate, authorize } from '@/middleware/auth';
import { validateQuery, querySchema } from '@/middleware/validation';
import { validate } from '@/middleware/validation';
import { createOrderSchema } from '@/middleware/validation';
import { OrderController } from '@/controllers/OrderController';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// User routes
router.get('/', validateQuery(querySchema), asyncHandler(OrderController.getUserOrders));
router.get('/:id', asyncHandler(OrderController.getOrderById));
router.post('/', validate(createOrderSchema), asyncHandler(OrderController.createOrder));
router.post('/:id/cancel', asyncHandler(OrderController.cancelOrder));
router.post('/:id/confirm-delivery', asyncHandler(OrderController.confirmDelivery));

// Payment routes
router.post('/:id/payment/stripe', asyncHandler(OrderController.createStripePaymentIntent));
router.post('/webhook/stripe', asyncHandler(OrderController.handleStripeWebhook));

// Admin routes
router.use(authorize('admin'));

router.get('/admin/all', validateQuery(querySchema), asyncHandler(OrderController.getAllOrders));
router.put('/:id/status', asyncHandler(OrderController.updateOrderStatus));
router.put('/:id/ship', asyncHandler(OrderController.shipOrder));
router.get('/admin/stats', asyncHandler(OrderController.getOrderStats));

export default router;

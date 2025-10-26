import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate } from '@/middleware/auth';
import { UploadController } from '@/controllers/UploadController';

const router = express.Router();

// All upload routes require authentication
router.use(authenticate);

router.post('/single', asyncHandler(UploadController.uploadImage));
router.post('/multiple', asyncHandler(UploadController.uploadImages));

export default router;

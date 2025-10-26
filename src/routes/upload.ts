import express from 'express';
import { asyncHandler } from '@/middleware/error';
import { authenticate, authorize } from '@/middleware/auth';
import { UploadController } from '@/controllers/UploadController';

const router = express.Router();

// All upload routes require authentication
router.use(authenticate);

// Single file upload
router.post('/single', asyncHandler(UploadController.uploadSingle));

// Multiple files upload
router.post('/multiple', asyncHandler(UploadController.uploadMultiple));

// Delete file
router.delete('/:publicId', asyncHandler(UploadController.deleteFile));

// Admin routes for managing all uploads
router.use(authorize('admin'));

router.get('/admin/all', asyncHandler(UploadController.getAllUploads));
router.delete('/admin/:publicId', asyncHandler(UploadController.adminDeleteFile));

export default router;

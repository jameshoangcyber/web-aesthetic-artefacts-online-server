import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import { AppError } from '@/middleware/error';

export class UploadController {
  static async uploadImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      // Placeholder - implement Cloudinary upload
      const imageUrl = `/uploads/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: { url: imageUrl },
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadImages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new AppError('No files uploaded', 400);
      }

      // Placeholder
      const imageUrls = req.files.map((file: any) => `/uploads/${file.filename}`);

      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: { urls: imageUrls },
      });
    } catch (error) {
      next(error);
    }
  }
}


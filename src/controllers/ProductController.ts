import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import { Product } from '@/models/Product';
import { AppError } from '@/middleware/error';

export class ProductController {
  static async getAll(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await Product.find({ isAvailable: true }).sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await Product.findById(req.params['id']);
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      res.status(200).json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await Product.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await Product.findByIdAndUpdate(req.params['id'], req.body, { new: true });
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await Product.findByIdAndDelete(req.params['id']);
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}


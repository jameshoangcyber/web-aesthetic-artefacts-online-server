import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import { User } from '@/models/User';
import { AppError } from '@/middleware/error';

export class UserController {
  static async getAll(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find().select('-password -refreshTokens');
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.params['id']).select('-password -refreshTokens');
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findByIdAndUpdate(
        req.params['id'],
        req.body,
        { new: true }
      ).select('-password -refreshTokens');
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(req.params['id']);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}


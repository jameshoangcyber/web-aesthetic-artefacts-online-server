import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { AppError } from '@/middleware/error';

export class CategoryController {
  // Get all categories (Public)
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isActive } = req.query;
      
      const query: any = {};
      if (isActive !== undefined) {
        query.isActive = isActive === 'true';
      }

      const categories = await Category.find(query).sort({ order: 1, name: 1 });
      
      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get category by ID or slug (Public)
  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const category = await Category.findOne({
        $or: [{ _id: id }, { slug: id }],
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create category (Admin only)
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, image, icon, order, isActive } = req.body;

      // Generate slug from name
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if category with same name or slug exists
      const existing = await Category.findOne({
        $or: [{ name }, { slug }],
      });

      if (existing) {
        throw new AppError('Category with this name already exists', 400);
      }

      const category = await Category.create({
        name,
        slug,
        description,
        image,
        icon,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        productCount: 0,
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update category (Admin only)
  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, image, icon, order, isActive } = req.body;

      const category = await Category.findById(id);
      
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // If name is being updated, regenerate slug
      if (name && name !== category.name) {
        const slug = name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Check if new name/slug conflicts with another category
        const existing = await Category.findOne({
          _id: { $ne: id },
          $or: [{ name }, { slug }],
        });

        if (existing) {
          throw new AppError('Category with this name already exists', 400);
        }

        category.name = name;
        category.slug = slug;
      }

      if (description !== undefined) category.description = description;
      if (image !== undefined) category.image = image;
      if (icon !== undefined) category.icon = icon;
      if (order !== undefined) category.order = order;
      if (isActive !== undefined) category.isActive = isActive;

      await category.save();

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete category (Admin only)
  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);
      
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // Check if category has products
      const productCount = await Product.countDocuments({ category: category.name });
      
      if (productCount > 0) {
        throw new AppError(
          `Cannot delete category with ${productCount} products. Please reassign or delete products first.`,
          400
        );
      }

      await category.deleteOne();

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update product counts (Admin only - utility)
  static async updateProductCounts(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await Category.find();
      
      for (const category of categories) {
        const count = await Product.countDocuments({ 
          category: category.name,
          isAvailable: true 
        });
        category.productCount = count;
        await category.save();
      }

      res.status(200).json({
        success: true,
        message: 'Product counts updated successfully',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}


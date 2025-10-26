import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import { AppError } from '@/middleware/error';
import { Artist } from '@/models/Artist';
import { Product } from '@/models/Product';

export class ArtistController {
  /**
   * Get all artists (Public)
   */
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, specialty, featured, verified, limit = 50, page = 1 } = req.query;

      // Build query
      const query: any = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { specialty: { $regex: search, $options: 'i' } },
        ];
      }

      if (specialty) {
        query.specialty = specialty;
      }

      if (featured !== undefined) {
        query.featured = featured === 'true';
      }

      if (verified !== undefined) {
        query.verified = verified === 'true';
      }

      // Execute query with pagination
      const skip = (Number(page) - 1) * Number(limit);
      const artists = await Artist.find(query)
        .select('-__v')
        .limit(Number(limit))
        .skip(skip)
        .sort({ createdAt: -1 });

      // Get total count
      const total = await Artist.countDocuments(query);

      // Calculate works count for each artist
      const artistsWithCount = await Promise.all(
        artists.map(async (artist) => {
          const worksCount = await Product.countDocuments({ artistId: artist._id });
          return {
            ...artist.toObject(),
            worksCount,
          };
        })
      );

      res.status(200).json({
        success: true,
        message: 'Artists retrieved successfully',
        data: artistsWithCount,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get artist by ID (Public)
   */
  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const artist = await Artist.findById(id).select('-__v');

      if (!artist) {
        throw new AppError('Artist not found', 404);
      }

      // Get artist's products
      const products = await Product.find({ artistId: id })
        .select('title images priceValue category')
        .limit(10);

      // Get works count
      const worksCount = await Product.countDocuments({ artistId: id });

      res.status(200).json({
        success: true,
        message: 'Artist retrieved successfully',
        data: {
          ...artist.toObject(),
          worksCount,
          products,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new artist (Admin only)
   */
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const artistData = req.body;

      // Create artist
      const artist = await Artist.create(artistData);

      res.status(201).json({
        success: true,
        message: 'Artist created successfully',
        data: artist,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update artist (Admin/Artist owner only)
   */
  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const artist = await Artist.findById(id);

      if (!artist) {
        throw new AppError('Artist not found', 404);
      }

      // Check ownership if user is artist (not admin)
      if (req.user?.role === 'artist' && artist.userId?.toString() !== req.user._id) {
        throw new AppError('You can only update your own artist profile', 403);
      }

      // Update artist
      Object.assign(artist, updateData);
      await artist.save();

      res.status(200).json({
        success: true,
        message: 'Artist updated successfully',
        data: artist,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete artist (Admin only)
   */
  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const artist = await Artist.findById(id);

      if (!artist) {
        throw new AppError('Artist not found', 404);
      }

      // Check if artist has products
      const productsCount = await Product.countDocuments({ artistId: id });
      if (productsCount > 0) {
        throw new AppError('Cannot delete artist with existing products', 400);
      }

      await Artist.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Artist deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle artist status (Admin only)
   */
  static async toggleStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const artist = await Artist.findById(id);

      if (!artist) {
        throw new AppError('Artist not found', 404);
      }

      artist.isActive = isActive;
      await artist.save();

      res.status(200).json({
        success: true,
        message: 'Artist status updated successfully',
        data: artist,
      });
    } catch (error) {
      next(error);
    }
  }
}


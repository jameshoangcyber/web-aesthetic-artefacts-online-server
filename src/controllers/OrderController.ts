import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { Cart } from '@/models/Cart';
import { AppError } from '@/middleware/error';

export class OrderController {
  // Get all orders for admin
  static async getAllForAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 50;
      const skip = (page - 1) * limit;
      const status = req.query['status'] as string;
      const search = req.query['search'] as string;

      // Build query
      const query: any = {};
      if (status && status !== 'all') {
        query.orderStatus = status;
      }
      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
          { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
        ];
      }

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'firstName lastName email')
        .populate('items.productId');

      const total = await Order.countDocuments(query);
      
      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's own orders
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const skip = (page - 1) * limit;

      const orders = await Order.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.productId');

      const total = await Order.countDocuments({ userId: req.user._id });
      
      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const order = await Order.findOne({ 
        _id: req.params['id'],
        userId: req.user._id 
      }).populate('items.productId');

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { items, shippingAddress, paymentMethod, notes } = req.body;

      // Validate items
      if (!items || items.length === 0) {
        throw new AppError('Order must contain at least one item', 400);
      }

      // Process order items and validate products
      const orderItems = [];
      let subtotal = 0;

      for (const item of items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          throw new AppError(`Product ${item.productId} not found`, 404);
        }

        if (!product.isAvailable) {
          throw new AppError(`Product "${product.title}" is not available`, 400);
        }

        if (product.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for "${product.title}". Available: ${product.stock}`,
            400
          );
        }

        const itemTotal = product.priceValue * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          productId: product._id,
          productTitle: product.title,
          productImage: product.images[0] || '',
          artistName: product.artistName,
          quantity: item.quantity,
          price: product.priceValue,
          totalPrice: itemTotal,
        });

        // Update product stock
        product.stock -= item.quantity;
        await product.save();
      }

      // Calculate shipping fee (free shipping for orders >= 5,000,000 VND)
      const shippingFee = subtotal >= 5000000 ? 0 : 50000;
      const totalAmount = subtotal + shippingFee;

      // Generate order number
      const count = await Order.countDocuments();
      const orderNumber = `ART${String(count + 1).padStart(6, '0')}`;

      // Create order
      const order = await Order.create({
        orderNumber,
        userId: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        orderStatus: 'pending',
        subtotal,
        shippingFee,
        totalAmount,
        currency: 'VND',
        notes,
      });

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { items: [], totalItems: 0, totalPrice: 0 }
      );

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await Order.findByIdAndUpdate(req.params['id'], req.body, { new: true });
      
      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}


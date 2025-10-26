import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import { AppError } from '@/middleware/error';

export class CartController {
  static async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
      if (!cart) {
        cart = await Cart.create({ userId: req.user._id, items: [] });
      }

      // Transform cart data to match frontend expectations
      const cartData = cart.toObject();
      cartData.items = cartData.items.map((item: any) => ({
        productId: item.productId._id,
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        addedAt: item.addedAt,
      }));

      res.status(200).json({
        success: true,
        message: 'Cart retrieved successfully',
        data: cartData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addToCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { productId, quantity } = req.body;

      // Get product to get price
      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      if (!product.isAvailable || product.stock < quantity) {
        throw new AppError('Product not available or insufficient stock', 400);
      }

      let cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        cart = await Cart.create({ userId: req.user._id, items: [] });
      }

      // Add or update item
      const existingItemIndex = cart.items.findIndex(
        (item: any) => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        const newQuantity = (cart.items[existingItemIndex] as any).quantity + quantity;
        if (newQuantity > product.stock) {
          throw new AppError('Insufficient stock', 400);
        }
        (cart.items[existingItemIndex] as any).quantity = newQuantity;
      } else {
        cart.items.push({ 
          productId, 
          quantity, 
          price: product.priceValue, 
          addedAt: new Date() 
        } as any);
      }

      await cart.save();
      cart = await Cart.findById(cart._id).populate('items.productId');

      // Transform cart data
      const cartData = cart!.toObject();
      cartData.items = cartData.items.map((item: any) => ({
        productId: item.productId._id,
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        addedAt: item.addedAt,
      }));

      res.status(200).json({
        success: true,
        message: 'Item added to cart',
        data: cartData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { productId, quantity } = req.body;
      let cart = await Cart.findOne({ userId: req.user._id });
      
      if (!cart) {
        throw new AppError('Cart not found', 404);
      }

      // Check product stock
      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      if (quantity > product.stock) {
        throw new AppError('Insufficient stock', 400);
      }

      const itemIndex = cart.items.findIndex((item: any) => item.productId.toString() === productId);
      
      if (itemIndex > -1) {
        (cart.items[itemIndex] as any).quantity = quantity;
        await cart.save();
        cart = await Cart.findById(cart._id).populate('items.productId');
      } else {
        throw new AppError('Item not found in cart', 404);
      }

      // Transform cart data
      const cartData = cart!.toObject();
      cartData.items = cartData.items.map((item: any) => ({
        productId: item.productId._id,
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        addedAt: item.addedAt,
      }));

      res.status(200).json({
        success: true,
        message: 'Cart updated successfully',
        data: cartData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeFromCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { productId } = req.params;
      let cart = await Cart.findOne({ userId: req.user._id });
      
      if (!cart) {
        throw new AppError('Cart not found', 404);
      }

      const itemExists = cart.items.some((item: any) => item.productId.toString() === productId);
      if (!itemExists) {
        throw new AppError('Item not found in cart', 404);
      }

      cart.items = cart.items.filter((item: any) => item.productId.toString() !== productId);
      await cart.save();
      
      cart = await Cart.findById(cart._id).populate('items.productId');

      // Transform cart data
      const cartData = cart!.toObject();
      cartData.items = cartData.items.map((item: any) => ({
        productId: item.productId._id,
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        addedAt: item.addedAt,
      }));

      res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        data: cartData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      let cart = await Cart.findOne({ userId: req.user._id });
      
      if (!cart) {
        cart = await Cart.create({ userId: req.user._id, items: [] });
      } else {
        cart.items = [];
        cart.totalItems = 0;
        cart.totalPrice = 0;
        await cart.save();
      }

      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }
}


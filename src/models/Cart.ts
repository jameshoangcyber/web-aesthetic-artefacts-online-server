import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  productId: string;
  product?: any; // Populated product data
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface ICart extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId | string;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [99, 'Quantity cannot exceed 99'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive'],
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const cartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0,
    min: [0, 'Total items cannot be negative'],
  },
  totalPrice: {
    type: Number,
    default: 0,
    min: [0, 'Total price cannot be negative'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index for better query performance
cartSchema.index({ userId: 1 });

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total: number, item: ICartItem) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total: number, item: ICartItem) => total + (item.price * item.quantity), 0);
  next();
});

export const Cart = mongoose.model<ICart>('Cart', cartSchema);

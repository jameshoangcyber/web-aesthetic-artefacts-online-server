import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  title: string;
  description: string;
  price: string; // Formatted price string (e.g., "15.000.000 ₫")
  priceValue: number; // Numeric value for calculations
  currency: string;
  images: string[];
  category: string;
  dimensions: {
    width: number;
    height: number;
    depth?: number;
    unit: string;
  };
  material: string;
  year: number;
  artistId: mongoose.Types.ObjectId | string;
  artistName: string; // Denormalized for better query performance
  isAvailable: boolean;
  stock: number;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const dimensionsSchema = new Schema({
  width: {
    type: Number,
    required: [true, 'Width is required'],
    min: [0, 'Width must be positive'],
  },
  height: {
    type: Number,
    required: [true, 'Height is required'],
    min: [0, 'Height must be positive'],
  },
  depth: {
    type: Number,
    min: [0, 'Depth must be positive'],
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['cm', 'm', 'inch', 'ft'],
    default: 'cm',
  },
}, { _id: false });

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
    trim: true,
  },
  priceValue: {
    type: Number,
    required: [true, 'Price value is required'],
    min: [0, 'Price must be positive'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['VND', 'USD', 'EUR'],
    default: 'VND',
  },
  images: [{
    type: String,
    required: true,
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Tranh vẽ', 'Ảnh nghệ thuật', 'Điêu khắc', 'Đồ trang trí'],
  },
  dimensions: dimensionsSchema,
  material: {
    type: String,
    required: [true, 'Material is required'],
    trim: true,
    maxlength: [100, 'Material cannot exceed 100 characters'],
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear(), 'Year cannot be in the future'],
  },
  artistId: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required'],
  },
  artistName: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    default: 1,
    min: [0, 'Stock cannot be negative'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative'],
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
productSchema.index({ title: 1 });
productSchema.index({ category: 1 });
productSchema.index({ artistId: 1 });
productSchema.index({ artistName: 1 });
productSchema.index({ priceValue: 1 });
productSchema.index({ year: 1 });
productSchema.index({ isAvailable: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ views: -1 });
productSchema.index({ likes: -1 });

// Text index for search functionality
productSchema.index({
  title: 'text',
  description: 'text',
  artistName: 'text',
  material: 'text',
  tags: 'text',
});

// Compound indexes for common queries
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ artistId: 1, isAvailable: 1 });
productSchema.index({ featured: 1, isAvailable: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);

import { Request } from 'express';
import { IUser } from '@/models/User';

// Extend Express Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | undefined;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  artist?: string;
  year?: number;
  featured?: boolean;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
}

// Product types
export interface CreateProductRequest {
  title: string;
  description: string;
  price: string;
  priceValue: number;
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
  artistId: string;
  stock: number;
  tags: string[];
  featured: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isAvailable?: boolean;
}

// Artist types
export interface CreateArtistRequest {
  name: string;
  specialty: string;
  bio: string;
  avatar: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
    twitter?: string;
  };
}

export interface UpdateArtistRequest extends Partial<CreateArtistRequest> {
  isActive?: boolean;
}

// Cart types
export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

// Order types
export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    district: string;
    ward: string;
  };
  paymentMethod: 'cod' | 'bank_transfer' | 'stripe' | 'paypal';
  notes?: string;
}

export interface UpdateOrderRequest {
  orderStatus?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
}

// File upload types
export interface FileUploadRequest {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Error types - Now using class from middleware/error.ts
// AppError class is defined in middleware/error.ts to avoid circular dependency

// JWT payload
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Email types
export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: Record<string, any>;
}

// Stripe types
export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

// Statistics types
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalArtists: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
  monthlyRevenue: any[];
}

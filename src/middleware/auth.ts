import { Response, NextFunction } from 'express';
import { User } from '@/models/User';
import { JwtService } from '@/utils/jwt';
import { AuthenticatedRequest } from '@/types';
import { AppError } from '@/middleware/error';

/**
 * Authentication middleware to verify JWT token
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Get token from cookies as fallback
    if (!token && req.cookies?.['accessToken']) {
      token = req.cookies['accessToken'];
    }

    if (!token) {
      throw new AppError('Access denied. No token provided.', 401);
    }

    // Verify token
    const decoded = JwtService.verifyAccessToken(token);

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');
    if (!user) {
      throw new AppError('Token is valid but user no longer exists.', 401);
    }

    // Check if user is active
    if (!user.isEmailVerified) {
      throw new AppError('Please verify your email before accessing this resource.', 401);
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid token.', 401));
    }
  }
};

/**
 * Optional authentication middleware (doesn't throw error if no token)
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Get token from cookies as fallback
    if (!token && req.cookies?.['accessToken']) {
      token = req.cookies['accessToken'];
    }

    if (token) {
      try {
        const decoded = JwtService.verifyAccessToken(token);
        const user = await User.findById(decoded.userId).select('-password -refreshTokens');
        
        if (user && user.isEmailVerified) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't throw error in optional auth
        console.log('Invalid token in optional auth:', error);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization middleware to check user roles
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Access denied. Please authenticate first.', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(`Access denied. Required role: ${roles.join(' or ')}`, 403));
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource
 */
export const checkOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Access denied. Please authenticate first.', 401));
      return;
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      next();
      return;
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId !== req.user._id.toString()) {
      next(new AppError('Access denied. You can only access your own resources.', 403));
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    next(new AppError('Access denied. Please authenticate first.', 401));
    return;
  }

  if (req.user.role !== 'admin') {
    next(new AppError('Access denied. Admin role required.', 403));
    return;
  }

  next();
};

/**
 * Middleware to check if user is artist or admin
 */
export const requireArtistOrAdmin = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    next(new AppError('Access denied. Please authenticate first.', 401));
    return;
  }

  if (!['artist', 'admin'].includes(req.user.role)) {
    next(new AppError('Access denied. Artist or Admin role required.', 403));
    return;
  }

  next();
};

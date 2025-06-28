import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        subscriptionTier: string;
        subscriptionStatus: string;
        emailVerified: boolean;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        message: 'Authentication token is required to access this resource.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        emailVerified: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'User associated with this token no longer exists.'
      });
    }

    // Check if account is active
    if (user.subscriptionStatus === 'UNPAID' || user.subscriptionStatus === 'CANCELED') {
      return res.status(403).json({
        error: 'Account inactive',
        message: 'Your account is inactive. Please update your billing information.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authentication token is invalid.'
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Authentication token has expired. Please login again.'
      });
    }

    logger.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'An error occurred during authentication.'
    });
  }
};

/**
 * Middleware to check if user email is verified
 */
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.emailVerified) {
    return res.status(403).json({
      error: 'Email verification required',
      message: 'Please verify your email address to access this feature.'
    });
  }
  next();
};

/**
 * Middleware to check subscription tier
 */
export const requireSubscription = (requiredTier: 'PRO' | 'ENTERPRISE') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userTier = req.user?.subscriptionTier;
    
    const tierHierarchy = {
      'FREE': 0,
      'PRO': 1,
      'ENTERPRISE': 2
    };

    const userTierLevel = tierHierarchy[userTier as keyof typeof tierHierarchy] || 0;
    const requiredTierLevel = tierHierarchy[requiredTier];

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        error: 'Subscription upgrade required',
        message: `This feature requires a ${requiredTier} subscription.`,
        upgradeUrl: `${process.env.FRONTEND_URL}/pricing`
      });
    }

    next();
  };
};

/**
 * Middleware for optional authentication (user may or may not be logged in)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without user
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        emailVerified: true
      }
    });

    if (user && user.subscriptionStatus !== 'UNPAID') {
      req.user = user;
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

/**
 * Middleware to check API key authentication
 */
export const authenticateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        message: 'API key is required to access this resource.'
      });
    }

    // Find API key in database
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            subscriptionTier: true,
            subscriptionStatus: true,
            emailVerified: true
          }
        }
      }
    });

    if (!keyRecord || keyRecord.status !== 'ACTIVE') {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'API key is invalid or inactive.'
      });
    }

    // Check if API key is expired
    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
      return res.status(401).json({
        error: 'API key expired',
        message: 'API key has expired.'
      });
    }

    // Check if user account is active
    if (keyRecord.user.subscriptionStatus === 'UNPAID' || keyRecord.user.subscriptionStatus === 'CANCELED') {
      return res.status(403).json({
        error: 'Account inactive',
        message: 'User account associated with this API key is inactive.'
      });
    }

    // Update usage count and last used
    await prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date()
      }
    });

    // Attach user to request
    req.user = keyRecord.user;
    next();
  } catch (error) {
    logger.error('API key authentication error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'An error occurred during API key authentication.'
    });
  }
};

/**
 * Middleware to check permissions for API key
 */
export const requireApiPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        message: 'API key is required for permission check.'
      });
    }

    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey }
    });

    if (!keyRecord || !keyRecord.permissions.includes(permission)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `API key does not have permission: ${permission}`
      });
    }

    next();
  };
}; 
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { User } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: User;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
      
      // Find user in Supabase database
      const user = await UserModel.findById(decoded.id);
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      // Check if account is active
      if (user.status !== 'active') {
        res.status(403).json({
          success: false,
          message: `Account is ${user.status}. Please contact support.`,
        });
        return;
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token',
      });
      return;
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Authentication error',
    });
  }
};

// Legacy export for backward compatibility
export const protect = authMiddleware;

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/User';
import { CacheService } from '../services/cache.service';
import jwt from 'jsonwebtoken';
import { User } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { name, email, password, phone, dateOfBirth, gender } = req.body;

    // Default to rider - users can switch to driver later from profile
    const role = 'rider';

    // Check if user already exists
    const existingUserByEmail = await UserModel.findByEmail(email);
    if (existingUserByEmail) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
      return;
    }

    const existingUserByPhone = await UserModel.findByPhone(phone);
    if (existingUserByPhone) {
      res.status(400).json({
        success: false,
        message: 'User with this phone number already exists',
      });
      return;
    }

    // Create user in Supabase - Always as rider by default
    const user = await UserModel.create({
      name,
      email,
      password,
      phone,
      role, // Always 'rider' - no option to register as driver
      dateOfBirth,
      gender,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRE,
      }
    );

    // Cache user session in Redis
    await CacheService.cacheUserSession(user.id, {
      userId: user.id,
      email: user.email,
      role: user.role,
      token,
    });

    // Update last login
    await UserModel.updateLastLogin(user.id);

    // Return user data (without sensitive information)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register user',
    });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body;

    // Find user by email in Supabase
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Check if account is locked
    if (user.accountLockedUntil) {
      const lockUntil = new Date(user.accountLockedUntil);
      if (lockUntil > new Date()) {
        res.status(423).json({
          success: false,
          message: `Account is locked. Please try again after ${lockUntil.toLocaleString()}`,
        });
        return;
      }
    }

    // Check if account is active
    if (user.status !== 'active') {
      res.status(403).json({
        success: false,
        message: `Account is ${user.status}. Please contact support.`,
      });
      return;
    }

    // Verify password
    const isPasswordValid = await UserModel.verifyPassword(user, password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      await UserModel.incrementFailedLoginAttempts(user.id);

      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRE,
      }
    );

    // Cache user session in Redis
    await CacheService.cacheUserSession(user.id, {
      userId: user.id,
      email: user.email,
      role: user.role,
      token,
    });

    // Update last login
    await UserModel.updateLastLogin(user.id);

    // Return user data
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        driverProfile: user.driverProfile,
        riderProfile: user.riderProfile,
        preferences: user.preferences,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to login',
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const updateData: any = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.phone) updateData.phone = req.body.phone;
    if (req.body.avatar) updateData.avatar = req.body.avatar;
    if (req.body.bio) updateData.bio = req.body.bio;
    if (req.body.address) updateData.address = req.body.address;
    if (req.body.preferences) updateData.preferences = req.body.preferences;
    if (req.body.role) updateData.role = req.body.role; // Allow role update for driver registration
    if (req.body.cnic) updateData.cnic = req.body.cnic; // CNIC for driver registration
    if (req.body.drivingLicenseNumber) updateData.drivingLicenseNumber = req.body.drivingLicenseNumber; // Driving license for driver registration
    if (req.body.driverProfile) updateData.driverProfile = req.body.driverProfile;
    if (req.body.riderProfile) updateData.riderProfile = req.body.riderProfile;

    const updatedUser = await UserModel.update(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        address: updatedUser.address,
        preferences: updatedUser.preferences,
        cnic: updatedUser.cnic,
        drivingLicenseNumber: updatedUser.drivingLicenseNumber,
        driverProfile: updatedUser.driverProfile,
        riderProfile: updatedUser.riderProfile,
        status: updatedUser.status,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Try to get from cache first
    const cachedSession = await CacheService.getUserSession(userId);
    if (cachedSession) {
      // Cache hit - get user from Supabase
      const user = await UserModel.findById(userId);
      if (user) {
        return res.status(200).json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isVerified: user.isVerified,
            avatar: user.avatar,
            bio: user.bio,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            address: user.address,
            preferences: user.preferences,
            driverProfile: user.driverProfile,
            riderProfile: user.riderProfile,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        });
      }
    }

    // If not in cache, get from Supabase
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        preferences: user.preferences,
        driverProfile: user.driverProfile,
        riderProfile: user.riderProfile,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get profile',
    });
  }
};

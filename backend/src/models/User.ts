import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';
import { User, UserCreateInput, UserUpdateInput } from '../types/user';

export class UserModel {
  private static readonly TABLE_NAME = 'users';

  /**
   * Create a new user in Supabase
   */
  static async create(data: UserCreateInput): Promise<User> {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // Prepare user data
      const userData = {
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        name: data.name.trim(),
        password_hash: hashedPassword,
        role: data.role,
        is_verified: false,
        status: 'active' as const,
        date_of_birth: data.dateOfBirth || null,
        gender: data.gender || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Insert user into Supabase
      const { data: user, error } = await supabase
        .from(this.TABLE_NAME)
        .insert(userData)
        .select()
        .single();

      if (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
          throw new Error('User with this email or phone already exists');
        }
        throw new Error(error.message);
      }

      // Return user without password
      return this.mapToUser(user);
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapToUser(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapToUser(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Find user by phone
   */
  static async findByPhone(phone: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('phone', phone.trim())
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapToUser(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify password
   */
  static async verifyPassword(user: User, password: string): Promise<boolean> {
    try {
      // Get password hash from database
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('password_hash')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        return false;
      }

      return await bcrypt.compare(password, data.password_hash);
    } catch (error) {
      return false;
    }
  }

  /**
   * Update user
   */
  static async update(id: string, data: UserUpdateInput): Promise<User> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.name) updateData.name = data.name.trim();
      if (data.phone) updateData.phone = data.phone.trim();
      if (data.avatar) updateData.avatar = data.avatar;
      if (data.bio) updateData.bio = data.bio;
      if (data.address) updateData.address = data.address;
      if (data.preferences) updateData.preferences = data.preferences;
      if (data.role) updateData.role = data.role; // Allow role update for driver registration
      if (data.cnic) updateData.cnic = data.cnic.trim(); // CNIC for driver registration
      if (data.drivingLicenseNumber) updateData.driving_license_number = data.drivingLicenseNumber.trim(); // Driving license for driver registration
      if (data.driverProfile) updateData.driver_profile = data.driverProfile;
      if (data.riderProfile) updateData.rider_profile = data.riderProfile;

      const { data: updatedUser, error } = await supabase
        .from(this.TABLE_NAME)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return this.mapToUser(updatedUser);
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Update last login
   */
  static async updateLastLogin(id: string): Promise<void> {
    try {
      await supabase
        .from(this.TABLE_NAME)
        .update({
          last_login_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
          failed_login_attempts: 0,
        })
        .eq('id', id);
    } catch (error) {
      // Silently fail - not critical
      console.error('Failed to update last login:', error);
    }
  }

  /**
   * Increment failed login attempts
   */
  static async incrementFailedLoginAttempts(id: string): Promise<void> {
    try {
      const { data: user } = await supabase
        .from(this.TABLE_NAME)
        .select('failed_login_attempts')
        .eq('id', id)
        .single();

      const attempts = (user?.failed_login_attempts || 0) + 1;
      const lockUntil = attempts >= 5 
        ? new Date(Date.now() + 30 * 60 * 1000).toISOString() // Lock for 30 minutes
        : null;

      await supabase
        .from(this.TABLE_NAME)
        .update({
          failed_login_attempts: attempts,
          account_locked_until: lockUntil,
        })
        .eq('id', id);
    } catch (error) {
      console.error('Failed to increment failed login attempts:', error);
    }
  }

  /**
   * Map database row to User type
   */
  private static mapToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      phone: row.phone,
      name: row.name,
      role: row.role,
      isVerified: row.is_verified || false,
      emailVerifiedAt: row.email_verified_at,
      phoneVerifiedAt: row.phone_verified_at,
      avatar: row.avatar,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      bio: row.bio,
      address: row.address,
      preferences: row.preferences,
      cnic: row.cnic,
      drivingLicenseNumber: row.driving_license_number,
      driverProfile: row.driver_profile,
      riderProfile: row.rider_profile,
      status: row.status || 'active',
      lastLoginAt: row.last_login_at,
      lastActiveAt: row.last_active_at,
      failedLoginAttempts: row.failed_login_attempts || 0,
      accountLockedUntil: row.account_locked_until,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

// Comprehensive User Type with diverse attributes for scalability
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'rider' | 'driver';
  
  // Authentication & Verification
  isVerified: boolean;
  emailVerifiedAt?: string;
  phoneVerifiedAt?: string;
  verificationCode?: string;
  verificationCodeExpiry?: string;
  
  // Profile Information
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  bio?: string;
  
  // Location & Address
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Preferences
  preferences?: {
    language?: string;
    currency?: string;
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    theme?: 'light' | 'dark' | 'auto';
  };
  
  // Driver-specific fields (only for drivers)
  cnic?: string; // CNIC/National ID number
  drivingLicenseNumber?: string; // Driving license number
  driverProfile?: {
    licenseNumber?: string;
    licenseExpiry?: string;
    vehicleInfo?: {
      make?: string;
      model?: string;
      year?: number;
      color?: string;
      plateNumber?: string;
      vehicleType?: 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'van';
    };
    documents?: {
      license?: string;
      registration?: string;
      insurance?: string;
    };
    isActive?: boolean;
    rating?: number;
    totalRides?: number;
    totalEarnings?: number;
  };
  
  // Rider-specific fields (only for riders)
  riderProfile?: {
    paymentMethods?: Array<{
      type: 'card' | 'wallet' | 'cash';
      last4?: string;
      isDefault?: boolean;
    }>;
    favoriteLocations?: Array<{
      name: string;
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    }>;
    totalRides?: number;
    rating?: number;
  };
  
  // Account Status
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  lastLoginAt?: string;
  lastActiveAt?: string;
  
  // Security
  failedLoginAttempts?: number;
  accountLockedUntil?: string;
  passwordChangedAt?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface UserCreateInput {
  email: string;
  phone: string;
  name: string;
  password: string;
  role: 'rider' | 'driver';
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

export interface UserUpdateInput {
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  address?: User['address'];
  preferences?: User['preferences'];
  role?: 'rider' | 'driver'; // Allow role update for driver registration
  cnic?: string; // CNIC/National ID for driver registration
  drivingLicenseNumber?: string; // Driving license for driver registration
  driverProfile?: User['driverProfile'];
  riderProfile?: User['riderProfile'];
}













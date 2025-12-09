// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'rider' | 'driver';
  isVerified: boolean;
}

// Auth Types
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'rider' | 'driver';
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Profile: undefined;
};

// API Types
export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Re-export driver types for convenience
export type { Driver, Vehicle, DriverStats, RideRequest as DriverRideRequest, ActiveRide } from './driver';

// Ride Types
export interface Ride {
  id: string;
  riderId: string;
  driverId?: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  createdAt: string;
  updatedAt: string;
}




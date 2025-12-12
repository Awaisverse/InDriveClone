// Comprehensive Rider/Customer Types for Scalability

// Ride Status Types
export type RideStatus = 
  | 'searching'      // Looking for driver
  | 'matched'         // Driver found
  | 'driver-arriving' // Driver on the way to pickup
  | 'arrived'         // Driver arrived at pickup
  | 'in-progress'     // Ride in progress
  | 'completed'       // Ride completed
  | 'cancelled';      // Ride cancelled

// Payment Method Types
export type PaymentMethodType = 'card' | 'wallet' | 'cash' | 'upi' | 'paypal';

// Vehicle Types
export type VehicleType = 
  | 'economy' 
  | 'comfort' 
  | 'premium' 
  | 'luxury' 
  | 'xl' 
  | 'pool';

// Ride Request Interface
export interface RideRequest {
  id: string;
  riderId: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  vehicleType: VehicleType;
  scheduledTime?: string; // For scheduled rides
  isScheduled: boolean;
  estimatedFare: number;
  estimatedDistance: number; // in km
  estimatedDuration: number; // in minutes
  paymentMethod: PaymentMethodType;
  specialRequests?: string[];
  createdAt: string;
  updatedAt: string;
}

// Active Ride Interface
export interface ActiveRide {
  id: string;
  requestId: string;
  riderId: string;
  driverId: string;
  driver: DriverInfo;
  vehicle: VehicleInfo;
  status: RideStatus;
  pickupLocation: Location;
  dropoffLocation: Location;
  currentLocation?: Location; // Driver's current location
  fare: number;
  distance: number; // in km
  duration: number; // in minutes
  startedAt?: string;
  completedAt?: string;
  paymentMethod: PaymentMethodType;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

// Driver Information (for ride display)
export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  rating: number;
  totalRides: number;
  vehicleNumber: string;
  vehicleModel: string;
  vehicleColor: string;
  estimatedArrival?: number; // in minutes
  currentLocation?: Location;
}

// Vehicle Information
export interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vehicleType: VehicleType;
  capacity: number;
  amenities?: string[]; // e.g., ['AC', 'WiFi', 'Charging']
}

// Location Interface
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

// Saved Location (Favorite Places)
export interface SavedLocation {
  id: string;
  name: string; // e.g., "Home", "Work", "Gym"
  location: Location;
  type: 'home' | 'work' | 'favorite' | 'recent';
  createdAt: string;
}

// Payment Method
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  last4?: string; // For cards
  cardBrand?: string; // e.g., "Visa", "Mastercard"
  expiryDate?: string;
  isDefault: boolean;
  walletBalance?: number; // For wallet type
  upiId?: string; // For UPI
  createdAt: string;
}

// Ride History
export interface RideHistory {
  id: string;
  riderId: string;
  driverId: string;
  driverName: string;
  driverRating: number;
  vehicleInfo: {
    make: string;
    model: string;
    plateNumber: string;
  };
  pickupLocation: Location;
  dropoffLocation: Location;
  fare: number;
  distance: number;
  duration: number;
  status: RideStatus;
  paymentMethod: PaymentMethodType;
  rating?: number;
  review?: string;
  cancelledBy?: 'rider' | 'driver';
  cancellationReason?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

// Promo Code / Coupon
export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount?: number;
  minFare?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

// Ride Estimate
export interface RideEstimate {
  vehicleType: VehicleType;
  estimatedFare: number;
  estimatedDistance: number;
  estimatedDuration: number;
  surgeMultiplier?: number; // For surge pricing
  availableDrivers?: number;
}

// Ride Receipt
export interface RideReceipt {
  rideId: string;
  date: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  duration: number;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeFare?: number;
  discount?: number;
  promoCode?: string;
  totalFare: number;
  paymentMethod: PaymentMethodType;
  driverName: string;
  vehicleInfo: string;
  invoiceNumber: string;
}

// Rider Profile
export interface RiderProfile {
  id: string;
  userId: string;
  totalRides: number;
  totalSpent: number;
  averageRating: number;
  favoriteLocations: SavedLocation[];
  paymentMethods: PaymentMethod[];
  promoCode?: PromoCode;
  preferences: {
    defaultVehicleType: VehicleType;
    defaultPaymentMethod: PaymentMethodType;
    notifications: {
      rideUpdates: boolean;
      promotions: boolean;
      news: boolean;
    };
    language: string;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Ride Cancellation Reason
export interface CancellationReason {
  id: string;
  reason: string;
  category: 'rider' | 'driver' | 'system';
}

// Real-time Ride Tracking
export interface RideTracking {
  rideId: string;
  driverLocation: Location;
  estimatedArrival: number; // in minutes
  currentStatus: RideStatus;
  routePolyline?: string; // For map display
  lastUpdated: string;
}













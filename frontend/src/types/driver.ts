// Driver-specific types

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: Vehicle;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  isOnline: boolean;
  currentLocation?: Location;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  type: 'sedan' | 'suv' | 'van' | 'luxury';
}

export interface DriverStats {
  todayEarnings: number;
  todayTrips: number;
  weekEarnings: number;
  weekTrips: number;
  monthEarnings: number;
  monthTrips: number;
  totalEarnings: number;
  totalTrips: number;
  averageRating: number;
  acceptanceRate: number;
}

export interface RideRequest {
  id: string;
  riderId: string;
  riderName: string;
  riderRating: number;
  pickupLocation: Location;
  dropoffLocation: Location;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedFare: number;
  estimatedDistance: number;
  estimatedTime: number;
  requestedAt: string;
  expiresAt: string;
}

export interface ActiveRide {
  id: string;
  riderId: string;
  riderName: string;
  riderPhone: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  pickupAddress: string;
  dropoffAddress: string;
  status: 'picking-up' | 'arrived' | 'in-progress' | 'completed';
  fare: number;
  distance: number;
  startedAt?: string;
  completedAt?: string;
}



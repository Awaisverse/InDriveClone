import { supabase } from '../config/supabase';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

export interface Ride {
  id: string;
  riderId: string;
  driverId?: string;
  vehicleId?: string;
  status: 'pending' | 'searching' | 'accepted' | 'driver_arriving' | 'in_progress' | 'completed' | 'cancelled' | 'rejected' | 'expired';
  pickupLocation: Location;
  dropoffLocation: Location;
  currentLocation?: Location;
  estimatedDistance?: number;
  actualDistance?: number;
  estimatedDuration?: number;
  actualDuration?: number;
  routePolyline?: string;
  baseFare: number;
  distanceFare?: number;
  timeFare?: number;
  surgeMultiplier?: number;
  promoDiscount?: number;
  serviceFee?: number;
  totalFare: number;
  driverEarnings?: number;
  platformCommission?: number;
  paymentMethod?: 'card' | 'wallet' | 'cash' | 'promo';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentTransactionId?: string;
  rideType: 'standard' | 'premium' | 'pool' | 'scheduled';
  scheduledPickupTime?: string;
  requestedAt: string;
  acceptedAt?: string;
  driverArrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  cancellationFee?: number;
  specialInstructions?: string;
  passengerCount: number;
  luggageCount?: number;
  riderRating?: number;
  driverRating?: number;
  riderReview?: string;
  driverReview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RideCreateInput {
  riderId: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  rideType?: 'standard' | 'premium' | 'pool' | 'scheduled';
  scheduledPickupTime?: string;
  estimatedDistance?: number;
  estimatedDuration?: number;
  baseFare: number;
  distanceFare?: number;
  timeFare?: number;
  surgeMultiplier?: number;
  totalFare: number;
  specialInstructions?: string;
  passengerCount?: number;
  luggageCount?: number;
  paymentMethod?: 'card' | 'wallet' | 'cash' | 'promo';
}

export interface RideUpdateInput {
  driverId?: string;
  vehicleId?: string;
  status?: Ride['status'];
  currentLocation?: Location;
  actualDistance?: number;
  actualDuration?: number;
  routePolyline?: string;
  promoDiscount?: number;
  serviceFee?: number;
  totalFare?: number;
  driverEarnings?: number;
  platformCommission?: number;
  paymentStatus?: Ride['paymentStatus'];
  paymentTransactionId?: string;
  acceptedAt?: string;
  driverArrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  cancellationFee?: number;
  riderRating?: number;
  driverRating?: number;
  riderReview?: string;
  driverReview?: string;
}

export class RideModel {
  private static readonly TABLE_NAME = 'rides';

  /**
   * Create a new ride
   */
  static async create(data: RideCreateInput): Promise<Ride> {
    try {
      const rideData = {
        rider_id: data.riderId,
        driver_id: null,
        vehicle_id: null,
        status: 'pending',
        pickup_location: data.pickupLocation,
        dropoff_location: data.dropoffLocation,
        current_location: null,
        estimated_distance: data.estimatedDistance || null,
        actual_distance: null,
        estimated_duration: data.estimatedDuration || null,
        actual_duration: null,
        route_polyline: null,
        base_fare: data.baseFare,
        distance_fare: data.distanceFare || 0,
        time_fare: data.timeFare || 0,
        surge_multiplier: data.surgeMultiplier || 1.00,
        promo_discount: 0,
        service_fee: 0,
        total_fare: data.totalFare,
        driver_earnings: 0,
        platform_commission: 0,
        payment_method: data.paymentMethod || null,
        payment_status: 'pending',
        payment_transaction_id: null,
        ride_type: data.rideType || 'standard',
        scheduled_pickup_time: data.scheduledPickupTime || null,
        requested_at: new Date().toISOString(),
        accepted_at: null,
        driver_arrived_at: null,
        started_at: null,
        completed_at: null,
        cancelled_at: null,
        cancelled_by: null,
        cancellation_reason: null,
        cancellation_fee: 0,
        special_instructions: data.specialInstructions || null,
        passenger_count: data.passengerCount || 1,
        luggage_count: data.luggageCount || 0,
        rider_rating: null,
        driver_rating: null,
        rider_review: null,
        driver_review: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: ride, error } = await supabase
        .from(this.TABLE_NAME)
        .insert(rideData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return this.mapToRide(ride);
    } catch (error: any) {
      throw new Error(`Failed to create ride: ${error.message}`);
    }
  }

  /**
   * Find ride by ID
   */
  static async findById(id: string): Promise<Ride | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapToRide(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Find rides by rider ID
   */
  static async findByRiderId(riderId: string, limit?: number): Promise<Ride[]> {
    try {
      let query = supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('rider_id', riderId)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error || !data) {
        return [];
      }

      return data.map((row) => this.mapToRide(row));
    } catch (error) {
      return [];
    }
  }

  /**
   * Find rides by driver ID
   */
  static async findByDriverId(driverId: string, limit?: number): Promise<Ride[]> {
    try {
      let query = supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error || !data) {
        return [];
      }

      return data.map((row) => this.mapToRide(row));
    } catch (error) {
      return [];
    }
  }

  /**
   * Find active ride by driver ID
   */
  static async findActiveByDriverId(driverId: string): Promise<Ride | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('driver_id', driverId)
        .in('status', ['accepted', 'driver_arriving', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapToRide(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Find active ride by rider ID
   */
  static async findActiveByRiderId(riderId: string): Promise<Ride | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('rider_id', riderId)
        .in('status', ['pending', 'searching', 'accepted', 'driver_arriving', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapToRide(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Find pending ride requests (for drivers)
   */
  static async findPendingRequests(limit: number = 20): Promise<Ride[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .in('status', ['pending', 'searching'])
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error || !data) {
        return [];
      }

      return data.map((row) => this.mapToRide(row));
    } catch (error) {
      return [];
    }
  }

  /**
   * Update ride
   */
  static async update(id: string, data: RideUpdateInput): Promise<Ride> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.driverId !== undefined) updateData.driver_id = data.driverId || null;
      if (data.vehicleId !== undefined) updateData.vehicle_id = data.vehicleId || null;
      if (data.status) updateData.status = data.status;
      if (data.currentLocation !== undefined) updateData.current_location = data.currentLocation || null;
      if (data.actualDistance !== undefined) updateData.actual_distance = data.actualDistance || null;
      if (data.actualDuration !== undefined) updateData.actual_duration = data.actualDuration || null;
      if (data.routePolyline !== undefined) updateData.route_polyline = data.routePolyline || null;
      if (data.promoDiscount !== undefined) updateData.promo_discount = data.promoDiscount;
      if (data.serviceFee !== undefined) updateData.service_fee = data.serviceFee;
      if (data.totalFare !== undefined) updateData.total_fare = data.totalFare;
      if (data.driverEarnings !== undefined) updateData.driver_earnings = data.driverEarnings;
      if (data.platformCommission !== undefined) updateData.platform_commission = data.platformCommission;
      if (data.paymentStatus) updateData.payment_status = data.paymentStatus;
      if (data.paymentTransactionId !== undefined) updateData.payment_transaction_id = data.paymentTransactionId || null;
      if (data.acceptedAt !== undefined) updateData.accepted_at = data.acceptedAt || null;
      if (data.driverArrivedAt !== undefined) updateData.driver_arrived_at = data.driverArrivedAt || null;
      if (data.startedAt !== undefined) updateData.started_at = data.startedAt || null;
      if (data.completedAt !== undefined) updateData.completed_at = data.completedAt || null;
      if (data.cancelledAt !== undefined) updateData.cancelled_at = data.cancelledAt || null;
      if (data.cancelledBy !== undefined) updateData.cancelled_by = data.cancelledBy || null;
      if (data.cancellationReason !== undefined) updateData.cancellation_reason = data.cancellationReason || null;
      if (data.cancellationFee !== undefined) updateData.cancellation_fee = data.cancellationFee;
      if (data.riderRating !== undefined) updateData.rider_rating = data.riderRating || null;
      if (data.driverRating !== undefined) updateData.driver_rating = data.driverRating || null;
      if (data.riderReview !== undefined) updateData.rider_review = data.riderReview || null;
      if (data.driverReview !== undefined) updateData.driver_review = data.driverReview || null;

      const { data: updatedRide, error } = await supabase
        .from(this.TABLE_NAME)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return this.mapToRide(updatedRide);
    } catch (error: any) {
      throw new Error(`Failed to update ride: ${error.message}`);
    }
  }

  /**
   * Map database row to Ride type
   */
  private static mapToRide(row: any): Ride {
    return {
      id: row.id,
      riderId: row.rider_id,
      driverId: row.driver_id,
      vehicleId: row.vehicle_id,
      status: row.status,
      pickupLocation: row.pickup_location,
      dropoffLocation: row.dropoff_location,
      currentLocation: row.current_location,
      estimatedDistance: row.estimated_distance,
      actualDistance: row.actual_distance,
      estimatedDuration: row.estimated_duration,
      actualDuration: row.actual_duration,
      routePolyline: row.route_polyline,
      baseFare: parseFloat(row.base_fare) || 0,
      distanceFare: parseFloat(row.distance_fare) || 0,
      timeFare: parseFloat(row.time_fare) || 0,
      surgeMultiplier: parseFloat(row.surge_multiplier) || 1.00,
      promoDiscount: parseFloat(row.promo_discount) || 0,
      serviceFee: parseFloat(row.service_fee) || 0,
      totalFare: parseFloat(row.total_fare) || 0,
      driverEarnings: parseFloat(row.driver_earnings) || 0,
      platformCommission: parseFloat(row.platform_commission) || 0,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      paymentTransactionId: row.payment_transaction_id,
      rideType: row.ride_type,
      scheduledPickupTime: row.scheduled_pickup_time,
      requestedAt: row.requested_at,
      acceptedAt: row.accepted_at,
      driverArrivedAt: row.driver_arrived_at,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      cancelledAt: row.cancelled_at,
      cancelledBy: row.cancelled_by,
      cancellationReason: row.cancellation_reason,
      cancellationFee: parseFloat(row.cancellation_fee) || 0,
      specialInstructions: row.special_instructions,
      passengerCount: row.passenger_count || 1,
      luggageCount: row.luggage_count || 0,
      riderRating: row.rider_rating ? parseFloat(row.rider_rating) : undefined,
      driverRating: row.driver_rating ? parseFloat(row.driver_rating) : undefined,
      riderReview: row.rider_review,
      driverReview: row.driver_review,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}


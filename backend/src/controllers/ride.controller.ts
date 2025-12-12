import { Request, Response } from 'express';
import { RideModel, RideCreateInput, RideUpdateInput } from '../models/Ride';
import { VehicleModel } from '../models/Vehicle';
import { UserModel } from '../models/User';

/**
 * Create a new ride request
 */
export const createRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Verify user is a rider
    const user = await UserModel.findById(userId);
    if (!user || user.role !== 'rider') {
      res.status(403).json({
        success: false,
        message: 'Only riders can request rides',
      });
      return;
    }

    // Check for active ride
    const activeRide = await RideModel.findActiveByRiderId(userId);
    if (activeRide) {
      res.status(400).json({
        success: false,
        message: 'You already have an active ride',
        activeRide,
      });
      return;
    }

    const rideData: RideCreateInput = {
      riderId: userId,
      pickupLocation: req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
      rideType: req.body.rideType || 'standard',
      scheduledPickupTime: req.body.scheduledPickupTime,
      estimatedDistance: req.body.estimatedDistance,
      estimatedDuration: req.body.estimatedDuration,
      baseFare: req.body.baseFare || 0,
      distanceFare: req.body.distanceFare || 0,
      timeFare: req.body.timeFare || 0,
      surgeMultiplier: req.body.surgeMultiplier || 1.00,
      totalFare: req.body.totalFare || 0,
      specialInstructions: req.body.specialInstructions,
      passengerCount: req.body.passengerCount || 1,
      luggageCount: req.body.luggageCount || 0,
      paymentMethod: req.body.paymentMethod,
    };

    const ride = await RideModel.create(rideData);

    res.status(201).json({
      success: true,
      message: 'Ride requested successfully',
      ride,
    });
  } catch (error: any) {
    console.error('Create ride error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create ride',
    });
  }
};

/**
 * Get active ride for rider
 */
export const getActiveRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const ride = await RideModel.findActiveByRiderId(userId);

    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'No active ride found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      ride,
    });
  } catch (error: any) {
    console.error('Get active ride error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get active ride',
    });
  }
};

/**
 * Get active ride for driver
 */
export const getDriverActiveRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const ride = await RideModel.findActiveByDriverId(userId);

    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'No active ride found',
      });
      return;
    }

    // Get rider information
    const rider = await UserModel.findById(ride.riderId);
    const vehicle = ride.vehicleId ? await VehicleModel.findById(ride.vehicleId) : null;

    res.status(200).json({
      success: true,
      ride: {
        ...ride,
        rider: rider ? {
          id: rider.id,
          name: rider.name,
          phone: rider.phone,
          rating: rider.driverProfile?.rating || 0,
        } : null,
        vehicle: vehicle ? {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          plateNumber: vehicle.plateNumber,
        } : null,
      },
    });
  } catch (error: any) {
    console.error('Get driver active ride error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get active ride',
    });
  }
};

/**
 * Get ride history for rider
 */
export const getRideHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const rides = await RideModel.findByRiderId(userId, limit);

    res.status(200).json({
      success: true,
      rides,
      count: rides.length,
    });
  } catch (error: any) {
    console.error('Get ride history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get ride history',
    });
  }
};

/**
 * Get ride history for driver
 */
export const getDriverRideHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const rides = await RideModel.findByDriverId(userId, limit);

    res.status(200).json({
      success: true,
      rides,
      count: rides.length,
    });
  } catch (error: any) {
    console.error('Get driver ride history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get ride history',
    });
  }
};

/**
 * Get pending ride requests (for drivers)
 */
export const getPendingRideRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Verify user is a driver
    const user = await UserModel.findById(userId);
    if (!user || user.role !== 'driver') {
      res.status(403).json({
        success: false,
        message: 'Only drivers can view ride requests',
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 20;
    const rides = await RideModel.findPendingRequests(limit);

    // Enrich with rider information
    const enrichedRides = await Promise.all(
      rides.map(async (ride) => {
        const rider = await UserModel.findById(ride.riderId);
        return {
          ...ride,
          rider: rider ? {
            id: rider.id,
            name: rider.name,
            phone: rider.phone,
            rating: rider.riderProfile?.rating || 0,
          } : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      rides: enrichedRides,
      count: enrichedRides.length,
    });
  } catch (error: any) {
    console.error('Get pending ride requests error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get ride requests',
    });
  }
};

/**
 * Accept a ride request (driver)
 */
export const acceptRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const rideId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Verify user is a driver
    const user = await UserModel.findById(userId);
    if (!user || user.role !== 'driver') {
      res.status(403).json({
        success: false,
        message: 'Only drivers can accept rides',
      });
      return;
    }

    // Check for active ride
    const activeRide = await RideModel.findActiveByDriverId(userId);
    if (activeRide) {
      res.status(400).json({
        success: false,
        message: 'You already have an active ride',
      });
      return;
    }

    // Get the ride
    const ride = await RideModel.findById(rideId);
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
      return;
    }

    if (ride.status !== 'pending' && ride.status !== 'searching') {
      res.status(400).json({
        success: false,
        message: 'Ride is no longer available',
      });
      return;
    }

    // Get driver's active vehicle
    const vehicle = await VehicleModel.findActiveByDriverId(userId);
    if (!vehicle) {
      res.status(400).json({
        success: false,
        message: 'No active vehicle found. Please register a vehicle first.',
      });
      return;
    }

    // Update ride
    const updateData: RideUpdateInput = {
      driverId: userId,
      vehicleId: vehicle.id,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    };

    const updatedRide = await RideModel.update(rideId, updateData);

    res.status(200).json({
      success: true,
      message: 'Ride accepted successfully',
      ride: updatedRide,
    });
  } catch (error: any) {
    console.error('Accept ride error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to accept ride',
    });
  }
};

/**
 * Update ride status
 */
export const updateRideStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const rideId = req.params.id;
    const { status, currentLocation } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const ride = await RideModel.findById(rideId);
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
      return;
    }

    // Verify user is part of the ride
    if (ride.riderId !== userId && ride.driverId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    const updateData: RideUpdateInput = {
      status,
      currentLocation,
    };

    // Set timestamps based on status
    const now = new Date().toISOString();
    if (status === 'driver_arriving') {
      updateData.driverArrivedAt = now;
    } else if (status === 'in_progress') {
      updateData.startedAt = now;
    } else if (status === 'completed') {
      updateData.completedAt = now;
      updateData.paymentStatus = 'processing';
    } else if (status === 'cancelled') {
      updateData.cancelledAt = now;
      updateData.cancelledBy = userId;
    }

    const updatedRide = await RideModel.update(rideId, updateData);

    res.status(200).json({
      success: true,
      message: 'Ride status updated successfully',
      ride: updatedRide,
    });
  } catch (error: any) {
    console.error('Update ride status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update ride status',
    });
  }
};

/**
 * Cancel a ride
 */
export const cancelRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const rideId = req.params.id;
    const { reason } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const ride = await RideModel.findById(rideId);
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
      return;
    }

    // Verify user is part of the ride
    if (ride.riderId !== userId && ride.driverId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    // Check if ride can be cancelled
    if (ride.status === 'completed' || ride.status === 'cancelled') {
      res.status(400).json({
        success: false,
        message: 'Ride cannot be cancelled',
      });
      return;
    }

    const updateData: RideUpdateInput = {
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelledBy: userId,
      cancellationReason: reason,
    };

    const updatedRide = await RideModel.update(rideId, updateData);

    res.status(200).json({
      success: true,
      message: 'Ride cancelled successfully',
      ride: updatedRide,
    });
  } catch (error: any) {
    console.error('Cancel ride error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel ride',
    });
  }
};

/**
 * Complete a ride
 */
export const completeRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const rideId = req.params.id;
    const { actualDistance, actualDuration } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const ride = await RideModel.findById(rideId);
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
      return;
    }

    // Verify user is the driver
    if (ride.driverId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Only the driver can complete the ride',
      });
      return;
    }

    if (ride.status !== 'in_progress') {
      res.status(400).json({
        success: false,
        message: 'Ride is not in progress',
      });
      return;
    }

    // Calculate final fare if needed
    // This is simplified - you might want to recalculate based on actual distance/duration
    const updateData: RideUpdateInput = {
      status: 'completed',
      completedAt: new Date().toISOString(),
      actualDistance: actualDistance || ride.estimatedDistance,
      actualDuration: actualDuration || ride.estimatedDuration,
      paymentStatus: 'processing',
    };

    const updatedRide = await RideModel.update(rideId, updateData);

    res.status(200).json({
      success: true,
      message: 'Ride completed successfully',
      ride: updatedRide,
    });
  } catch (error: any) {
    console.error('Complete ride error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete ride',
    });
  }
};


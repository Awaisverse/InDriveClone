import { Request, Response } from 'express';
import { VehicleModel, VehicleCreateInput, VehicleUpdateInput } from '../models/Vehicle';
import { UserModel } from '../models/User';

/**
 * Get all vehicles for the authenticated driver
 */
export const getMyVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const vehicles = await VehicleModel.findByDriverId(userId);

    res.status(200).json({
      success: true,
      vehicles,
    });
  } catch (error: any) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get vehicles',
    });
  }
};

/**
 * Get a specific vehicle by ID
 */
export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const vehicleId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
      return;
    }

    // Verify the vehicle belongs to the user
    if (vehicle.driverId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error: any) {
    console.error('Get vehicle error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get vehicle',
    });
  }
};

/**
 * Create a new vehicle
 */
export const createVehicle = async (req: Request, res: Response): Promise<void> => {
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
        message: 'Only drivers can register vehicles',
      });
      return;
    }

    const vehicleData: VehicleCreateInput = {
      driverId: userId,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      plateNumber: req.body.plateNumber,
      vehicleType: req.body.vehicleType,
      seatingCapacity: req.body.seatingCapacity,
      fuelType: req.body.fuelType,
      transmission: req.body.transmission,
      documents: req.body.documents,
      insuranceProvider: req.body.insuranceProvider,
      insurancePolicyNumber: req.body.insurancePolicyNumber,
      insuranceExpiryDate: req.body.insuranceExpiryDate,
    };

    const vehicle = await VehicleModel.create(vehicleData);

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully',
      vehicle,
    });
  } catch (error: any) {
    console.error('Create vehicle error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create vehicle',
    });
  }
};

/**
 * Update a vehicle
 */
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const vehicleId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Verify the vehicle belongs to the user
    const existingVehicle = await VehicleModel.findById(vehicleId);
    if (!existingVehicle) {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
      return;
    }

    if (existingVehicle.driverId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    const updateData: VehicleUpdateInput = {
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      plateNumber: req.body.plateNumber,
      vehicleType: req.body.vehicleType,
      seatingCapacity: req.body.seatingCapacity,
      fuelType: req.body.fuelType,
      transmission: req.body.transmission,
      documents: req.body.documents,
      isActive: req.body.isActive,
      insuranceProvider: req.body.insuranceProvider,
      insurancePolicyNumber: req.body.insurancePolicyNumber,
      insuranceExpiryDate: req.body.insuranceExpiryDate,
    };

    const vehicle = await VehicleModel.update(vehicleId, updateData);

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle,
    });
  } catch (error: any) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update vehicle',
    });
  }
};

/**
 * Delete a vehicle
 */
export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const vehicleId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Verify the vehicle belongs to the user
    const existingVehicle = await VehicleModel.findById(vehicleId);
    if (!existingVehicle) {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
      return;
    }

    if (existingVehicle.driverId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    await VehicleModel.delete(vehicleId);

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete vehicle',
    });
  }
};


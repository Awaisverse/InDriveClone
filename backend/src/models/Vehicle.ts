import { supabase } from '../config/supabase';

export interface Vehicle {
  id: string;
  driverId: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  plateNumber: string;
  vehicleType: 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'van' | 'motorcycle' | 'truck';
  seatingCapacity: number;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng';
  transmission?: 'manual' | 'automatic';
  documents?: {
    license?: string;
    registration?: string;
    insurance?: string;
    inspection?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'expired';
  verifiedAt?: string;
  verifiedBy?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleCreateInput {
  driverId: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  plateNumber: string;
  vehicleType: Vehicle['vehicleType'];
  seatingCapacity: number;
  fuelType?: Vehicle['fuelType'];
  transmission?: Vehicle['transmission'];
  documents?: Vehicle['documents'];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
}

export interface VehicleUpdateInput {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  plateNumber?: string;
  vehicleType?: Vehicle['vehicleType'];
  seatingCapacity?: number;
  fuelType?: Vehicle['fuelType'];
  transmission?: Vehicle['transmission'];
  documents?: Vehicle['documents'];
  isActive?: boolean;
  isVerified?: boolean;
  verificationStatus?: Vehicle['verificationStatus'];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
}

export class VehicleModel {
  private static readonly TABLE_NAME = 'vehicles';

  /**
   * Create a new vehicle
   */
  static async create(data: VehicleCreateInput): Promise<Vehicle> {
    try {
      const vehicleData = {
        driver_id: data.driverId,
        make: data.make.trim(),
        model: data.model.trim(),
        year: data.year,
        color: data.color?.trim() || null,
        plate_number: data.plateNumber.trim().toUpperCase(),
        vehicle_type: data.vehicleType,
        seating_capacity: data.seatingCapacity,
        fuel_type: data.fuelType || null,
        transmission: data.transmission || null,
        documents: data.documents || null,
        is_active: true,
        is_verified: false,
        verification_status: 'pending',
        insurance_provider: data.insuranceProvider?.trim() || null,
        insurance_policy_number: data.insurancePolicyNumber?.trim() || null,
        insurance_expiry_date: data.insuranceExpiryDate || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: vehicle, error } = await supabase
        .from(this.TABLE_NAME)
        .insert(vehicleData)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Vehicle with this plate number already exists');
        }
        throw new Error(error.message);
      }

      return this.mapToVehicle(vehicle);
    } catch (error: any) {
      throw new Error(`Failed to create vehicle: ${error.message}`);
    }
  }

  /**
   * Find vehicle by ID
   */
  static async findById(id: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapToVehicle(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Find vehicles by driver ID
   */
  static async findByDriverId(driverId: string): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map((row) => this.mapToVehicle(row));
    } catch (error) {
      return [];
    }
  }

  /**
   * Find active vehicle by driver ID
   */
  static async findActiveByDriverId(driverId: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('driver_id', driverId)
        .eq('is_active', true)
        .eq('is_verified', true)
        .eq('verification_status', 'approved')
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapToVehicle(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Update vehicle
   */
  static async update(id: string, data: VehicleUpdateInput): Promise<Vehicle> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.make) updateData.make = data.make.trim();
      if (data.model) updateData.model = data.model.trim();
      if (data.year) updateData.year = data.year;
      if (data.color !== undefined) updateData.color = data.color?.trim() || null;
      if (data.plateNumber) updateData.plate_number = data.plateNumber.trim().toUpperCase();
      if (data.vehicleType) updateData.vehicle_type = data.vehicleType;
      if (data.seatingCapacity) updateData.seating_capacity = data.seatingCapacity;
      if (data.fuelType !== undefined) updateData.fuel_type = data.fuelType || null;
      if (data.transmission !== undefined) updateData.transmission = data.transmission || null;
      if (data.documents !== undefined) updateData.documents = data.documents;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;
      if (data.isVerified !== undefined) updateData.is_verified = data.isVerified;
      if (data.verificationStatus) updateData.verification_status = data.verificationStatus;
      if (data.insuranceProvider !== undefined) updateData.insurance_provider = data.insuranceProvider?.trim() || null;
      if (data.insurancePolicyNumber !== undefined) updateData.insurance_policy_number = data.insurancePolicyNumber?.trim() || null;
      if (data.insuranceExpiryDate !== undefined) updateData.insurance_expiry_date = data.insuranceExpiryDate || null;

      const { data: updatedVehicle, error } = await supabase
        .from(this.TABLE_NAME)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return this.mapToVehicle(updatedVehicle);
    } catch (error: any) {
      throw new Error(`Failed to update vehicle: ${error.message}`);
    }
  }

  /**
   * Delete vehicle
   */
  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(`Failed to delete vehicle: ${error.message}`);
    }
  }

  /**
   * Map database row to Vehicle type
   */
  private static mapToVehicle(row: any): Vehicle {
    return {
      id: row.id,
      driverId: row.driver_id,
      make: row.make,
      model: row.model,
      year: row.year,
      color: row.color,
      plateNumber: row.plate_number,
      vehicleType: row.vehicle_type,
      seatingCapacity: row.seating_capacity,
      fuelType: row.fuel_type,
      transmission: row.transmission,
      documents: row.documents,
      isActive: row.is_active,
      isVerified: row.is_verified,
      verificationStatus: row.verification_status,
      verifiedAt: row.verified_at,
      verifiedBy: row.verified_by,
      insuranceProvider: row.insurance_provider,
      insurancePolicyNumber: row.insurance_policy_number,
      insuranceExpiryDate: row.insurance_expiry_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}


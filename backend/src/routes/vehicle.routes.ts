import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getMyVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicle.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Validation middleware
const createVehicleValidation = [
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('plateNumber').trim().notEmpty().withMessage('Plate number is required'),
  body('vehicleType').isIn(['sedan', 'suv', 'hatchback', 'luxury', 'van', 'motorcycle', 'truck']).withMessage('Valid vehicle type is required'),
  body('seatingCapacity').isInt({ min: 1, max: 20 }).withMessage('Seating capacity must be between 1 and 20'),
];

const updateVehicleValidation = [
  body('make').optional().trim().notEmpty(),
  body('model').optional().trim().notEmpty(),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  body('plateNumber').optional().trim().notEmpty(),
  body('vehicleType').optional().isIn(['sedan', 'suv', 'hatchback', 'luxury', 'van', 'motorcycle', 'truck']),
  body('seatingCapacity').optional().isInt({ min: 1, max: 20 }),
];

// Routes
router.get('/', getMyVehicles);
router.get('/:id', getVehicleById);
router.post('/', createVehicleValidation, createVehicle);
router.put('/:id', updateVehicleValidation, updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;


import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createRide,
  getActiveRide,
  getDriverActiveRide,
  getRideHistory,
  getDriverRideHistory,
  getPendingRideRequests,
  acceptRide,
  updateRideStatus,
  cancelRide,
  completeRide,
} from '../controllers/ride.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Validation middleware
const createRideValidation = [
  body('pickupLocation').notEmpty().withMessage('Pickup location is required'),
  body('pickupLocation.latitude').isFloat().withMessage('Valid pickup latitude is required'),
  body('pickupLocation.longitude').isFloat().withMessage('Valid pickup longitude is required'),
  body('dropoffLocation').notEmpty().withMessage('Dropoff location is required'),
  body('dropoffLocation.latitude').isFloat().withMessage('Valid dropoff latitude is required'),
  body('dropoffLocation.longitude').isFloat().withMessage('Valid dropoff longitude is required'),
  body('baseFare').optional().isFloat({ min: 0 }),
  body('totalFare').optional().isFloat({ min: 0 }),
];

// Rider routes
router.post('/', createRideValidation, createRide);
router.get('/active', getActiveRide);
router.get('/history', getRideHistory);
router.get('/:id', getActiveRide); // Get specific ride
router.put('/:id/status', updateRideStatus);
router.post('/:id/cancel', cancelRide);

// Driver routes
router.get('/driver/active', getDriverActiveRide);
router.get('/driver/history', getDriverRideHistory);
router.get('/driver/requests', getPendingRideRequests);
router.post('/:id/accept', acceptRide);
router.post('/:id/complete', completeRide);

export default router;


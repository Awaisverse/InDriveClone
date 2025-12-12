import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';
import redis from './config/redis';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    // Allow all origins in development for phone testing
    origin: process.env.NODE_ENV === 'production' 
      ? (process.env.CORS_ORIGIN || 'http://localhost:19006')
      : true, // Allow all origins in development
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', async (req, res) => {
  try {
    // Test Supabase connection
    const { error: supabaseError } = await supabase.from('users').select('id').limit(1);
    
    // Test Redis connection
    await redis.ping();
    
    res.status(200).json({
      status: 'OK',
      message: 'RideShare API is running',
      database: {
        supabase: supabaseError ? 'Error' : 'Connected',
        redis: 'Connected',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'ERROR',
      message: 'RideShare API is running but some services failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'RideShare API v1.0.0',
    version: '1.0.0',
    database: 'Supabase (PostgreSQL)',
    cache: 'Redis (Redis Labs)',
  });
});

// Import routes
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';
import rideRoutes from './routes/ride.routes';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/rides', rideRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: Supabase (PostgreSQL)`);
  console.log(`⚡ Cache: Redis (Redis Labs)`);
  console.log(`\n✅ API Endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log(`   - Register: http://localhost:${PORT}/api/auth/register`);
  console.log(`   - Login: http://localhost:${PORT}/api/auth/login`);
  console.log(`   - Vehicles: http://localhost:${PORT}/api/vehicles`);
  console.log(`   - Rides: http://localhost:${PORT}/api/rides`);
});

export default app;

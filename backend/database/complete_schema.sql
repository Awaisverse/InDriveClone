-- ============================================================================
-- COMPREHENSIVE RIDE-SHARING DATABASE SCHEMA
-- ============================================================================
-- This schema includes all tables needed for a complete ride-sharing platform
-- Optimized with proper indexes, constraints, and relationships
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE (Already exists, but enhanced)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Role (defaults to 'rider')
  role VARCHAR(10) NOT NULL DEFAULT 'rider' CHECK (role IN ('rider', 'driver')),
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  phone_verified_at TIMESTAMP WITH TIME ZONE,
  verification_code VARCHAR(10),
  verification_code_expiry TIMESTAMP WITH TIME ZONE,
  
  -- Profile
  avatar TEXT,
  date_of_birth DATE,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say')),
  bio TEXT,
  
  -- Address (stored as JSONB for flexibility)
  -- Format: {street, city, state, country, postal_code, coordinates: {lat, lng}}
  address JSONB,
  
  -- Driver-specific Information (required for drivers, NULL for riders)
  cnic VARCHAR(20) UNIQUE, -- CNIC/National ID number (required when role = 'driver')
  driving_license_number VARCHAR(50) UNIQUE, -- Driving license number (required when role = 'driver')
  
  -- Preferences (stored as JSONB)
  preferences JSONB,
  
  -- Driver Profile (stored as JSONB, only for drivers)
  driver_profile JSONB,
  
  -- Rider Profile (stored as JSONB, only for riders)
  rider_profile JSONB,
  
  -- Account Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
  
  -- Security
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_active_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add driver-specific columns if they don't exist (for existing tables)
DO $$
BEGIN
  -- Add cnic column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'cnic'
  ) THEN
    ALTER TABLE users ADD COLUMN cnic VARCHAR(20);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_cnic_unique ON users(cnic) WHERE cnic IS NOT NULL;
  END IF;
  
  -- Add driving_license_number column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'driving_license_number'
  ) THEN
    ALTER TABLE users ADD COLUMN driving_license_number VARCHAR(50);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_driving_license_unique ON users(driving_license_number) WHERE driving_license_number IS NOT NULL;
  END IF;
END $$;

-- ============================================================================
-- 2. VEHICLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Vehicle Information
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
  color VARCHAR(30),
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('sedan', 'suv', 'hatchback', 'luxury', 'van', 'motorcycle', 'truck')),
  
  -- Vehicle Details
  seating_capacity INTEGER NOT NULL CHECK (seating_capacity >= 1 AND seating_capacity <= 20),
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'cng')),
  transmission VARCHAR(20) CHECK (transmission IN ('manual', 'automatic')),
  
  -- Documents (stored as JSONB)
  documents JSONB, -- {license: url, registration: url, insurance: url, inspection: url}
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'expired')),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES users(id),
  
  -- Insurance
  insurance_provider VARCHAR(100),
  insurance_policy_number VARCHAR(50),
  insurance_expiry_date DATE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. RIDES TABLE (Main rides/trips table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Participants
  rider_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  
  -- Ride Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'searching', 'accepted', 'driver_arriving', 'in_progress', 
    'completed', 'cancelled', 'rejected', 'expired'
  )),
  
  -- Location Information (stored as JSONB for flexibility)
  pickup_location JSONB NOT NULL, -- {latitude, longitude, address, name}
  dropoff_location JSONB NOT NULL, -- {latitude, longitude, address, name}
  current_location JSONB, -- Real-time location during ride
  
  -- Route Information
  estimated_distance DECIMAL(10, 2), -- in kilometers
  actual_distance DECIMAL(10, 2), -- in kilometers
  estimated_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  route_polyline TEXT, -- Encoded polyline for route visualization
  
  -- Pricing
  base_fare DECIMAL(10, 2) NOT NULL DEFAULT 0,
  distance_fare DECIMAL(10, 2) DEFAULT 0,
  time_fare DECIMAL(10, 2) DEFAULT 0,
  surge_multiplier DECIMAL(3, 2) DEFAULT 1.00 CHECK (surge_multiplier >= 1.00),
  promo_discount DECIMAL(10, 2) DEFAULT 0,
  service_fee DECIMAL(10, 2) DEFAULT 0,
  total_fare DECIMAL(10, 2) NOT NULL DEFAULT 0,
  driver_earnings DECIMAL(10, 2) DEFAULT 0, -- After platform commission
  platform_commission DECIMAL(10, 2) DEFAULT 0,
  
  -- Payment
  payment_method VARCHAR(20) CHECK (payment_method IN ('card', 'wallet', 'cash', 'promo')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_transaction_id UUID, -- Foreign key will be added after payments table is created
  
  -- Ride Details
  ride_type VARCHAR(20) DEFAULT 'standard' CHECK (ride_type IN ('standard', 'premium', 'pool', 'scheduled')),
  scheduled_pickup_time TIMESTAMP WITH TIME ZONE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  driver_arrived_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Cancellation
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  cancellation_fee DECIMAL(10, 2) DEFAULT 0,
  
  -- Additional Information
  special_instructions TEXT,
  passenger_count INTEGER DEFAULT 1 CHECK (passenger_count >= 1),
  luggage_count INTEGER DEFAULT 0,
  
  -- Ratings (denormalized for quick access)
  rider_rating DECIMAL(2, 1) CHECK (rider_rating >= 1.0 AND rider_rating <= 5.0),
  driver_rating DECIMAL(2, 1) CHECK (driver_rating >= 1.0 AND driver_rating <= 5.0),
  rider_review TEXT,
  driver_review TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. RIDE_REQUESTS TABLE (Temporary requests before matching)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ride_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Request Details
  pickup_location JSONB NOT NULL,
  dropoff_location JSONB NOT NULL,
  ride_type VARCHAR(20) DEFAULT 'standard',
  vehicle_type_preference VARCHAR(20),
  
  -- Pricing Estimate
  estimated_fare DECIMAL(10, 2),
  estimated_distance DECIMAL(10, 2),
  estimated_duration INTEGER,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'matched', 'expired', 'cancelled')),
  
  -- Matching
  matched_driver_id UUID REFERENCES users(id),
  matched_ride_id UUID REFERENCES rides(id),
  
  -- Expiry
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. PAYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Transaction Details
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  ride_id UUID REFERENCES rides(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  
  -- Payment Information
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('card', 'wallet', 'cash', 'bank_transfer', 'promo')),
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('ride_payment', 'refund', 'topup', 'withdrawal', 'commission', 'fee')),
  
  -- Payment Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  
  -- Payment Gateway
  gateway VARCHAR(50), -- 'stripe', 'paypal', 'razorpay', etc.
  gateway_transaction_id VARCHAR(255),
  gateway_response JSONB,
  
  -- Card Information (last 4 digits only for security)
  card_last4 VARCHAR(4),
  card_brand VARCHAR(20),
  
  -- Refund Information
  refund_amount DECIMAL(10, 2) DEFAULT 0,
  refund_reason TEXT,
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint from rides to payments (after payments table is created)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'fk_rides_payment_transaction_id'
  ) THEN
    ALTER TABLE rides 
      ADD CONSTRAINT fk_rides_payment_transaction_id 
      FOREIGN KEY (payment_transaction_id) 
      REFERENCES payments(id) 
      ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================================
-- 6. PAYMENT_METHODS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment Method Type
  type VARCHAR(20) NOT NULL CHECK (type IN ('card', 'wallet', 'bank_account')),
  
  -- Card Information (encrypted/tokenized)
  card_last4 VARCHAR(4),
  card_brand VARCHAR(20),
  card_exp_month INTEGER CHECK (card_exp_month >= 1 AND card_exp_month <= 12),
  card_exp_year INTEGER CHECK (card_exp_year >= EXTRACT(YEAR FROM NOW())),
  card_holder_name VARCHAR(100),
  payment_token VARCHAR(255), -- Tokenized card info from payment gateway
  
  -- Bank Account (for withdrawals)
  bank_name VARCHAR(100),
  account_number_last4 VARCHAR(4),
  account_holder_name VARCHAR(100),
  routing_number VARCHAR(20),
  
  -- Wallet
  wallet_balance DECIMAL(10, 2) DEFAULT 0 CHECK (wallet_balance >= 0),
  
  -- Status
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. RATINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  
  -- Rating Details
  rated_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Who gave the rating
  rated_to UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Who received the rating
  role VARCHAR(10) NOT NULL CHECK (role IN ('rider', 'driver')), -- Role of person who gave rating
  
  -- Rating Scores (1-5)
  overall_rating DECIMAL(2, 1) NOT NULL CHECK (overall_rating >= 1.0 AND overall_rating <= 5.0),
  cleanliness_rating DECIMAL(2, 1) CHECK (cleanliness_rating >= 1.0 AND cleanliness_rating <= 5.0),
  driving_rating DECIMAL(2, 1) CHECK (driving_rating >= 1.0 AND driving_rating <= 5.0),
  communication_rating DECIMAL(2, 1) CHECK (communication_rating >= 1.0 AND communication_rating <= 5.0),
  punctuality_rating DECIMAL(2, 1) CHECK (punctuality_rating >= 1.0 AND punctuality_rating <= 5.0),
  
  -- Review
  review_text TEXT,
  review_tags TEXT[], -- Array of tags like ['friendly', 'clean', 'fast']
  
  -- Status
  is_visible BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE, -- Verified ride completion
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one rating per ride per person
  UNIQUE(ride_id, rated_by)
);

-- ============================================================================
-- 8. PROMO_CODES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Code Information
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  
  -- Discount Type
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_ride')),
  discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value >= 0),
  max_discount_amount DECIMAL(10, 2), -- For percentage discounts
  min_ride_amount DECIMAL(10, 2) DEFAULT 0, -- Minimum ride amount to use code
  
  -- Usage Limits
  max_uses INTEGER, -- Total uses allowed
  max_uses_per_user INTEGER DEFAULT 1, -- Uses per user
  current_uses INTEGER DEFAULT 0,
  
  -- Validity
  is_active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Applicability
  applicable_ride_types TEXT[], -- ['standard', 'premium']
  applicable_vehicle_types TEXT[], -- ['sedan', 'suv']
  applicable_regions TEXT[], -- ['city1', 'city2']
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 9. PROMO_CODE_USAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS promo_code_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES rides(id) ON DELETE SET NULL,
  
  -- Usage Details
  discount_applied DECIMAL(10, 2) NOT NULL,
  original_amount DECIMAL(10, 2) NOT NULL,
  final_amount DECIMAL(10, 2) NOT NULL,
  
  -- Timestamps
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure tracking
  UNIQUE(promo_code_id, user_id, ride_id)
);

-- ============================================================================
-- 10. SAVED_LOCATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Location Information
  name VARCHAR(100) NOT NULL, -- 'Home', 'Work', 'Gym', etc.
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- Additional Details
  location_type VARCHAR(20) DEFAULT 'other' CHECK (location_type IN ('home', 'work', 'favorite', 'other')),
  is_default BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 11. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification Details
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN (
    'ride_requested', 'ride_accepted', 'ride_cancelled', 'ride_completed',
    'payment_received', 'payment_failed', 'driver_arrived', 'promo_code',
    'rating_received', 'account_verification', 'system_announcement', 'general'
  )),
  
  -- Related Entity
  related_entity_type VARCHAR(50), -- 'ride', 'payment', 'user', etc.
  related_entity_id UUID,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Priority
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Action
  action_url TEXT, -- Deep link or URL
  action_text VARCHAR(50), -- 'View Ride', 'View Payment', etc.
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 12. DRIVER_LOCATIONS TABLE (Real-time location tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  
  -- Location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  heading DECIMAL(5, 2), -- Direction in degrees (0-360)
  speed DECIMAL(5, 2), -- Speed in km/h
  
  -- Status
  is_online BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT FALSE, -- Available for new rides
  current_ride_id UUID REFERENCES rides(id) ON DELETE SET NULL,
  
  -- Accuracy
  accuracy DECIMAL(5, 2), -- GPS accuracy in meters
  
  -- Timestamps
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 13. DRIVER_DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS driver_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Document Information
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
    'license', 'registration', 'insurance', 'inspection', 'background_check', 'vehicle_photo', 'profile_photo'
  )),
  document_number VARCHAR(100),
  
  -- File Information
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER, -- in bytes
  mime_type VARCHAR(50),
  
  -- Verification
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'expired')),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES users(id), -- Admin who verified
  rejection_reason TEXT,
  
  -- Expiry
  expiry_date DATE,
  is_expired BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 14. RIDE_HISTORY TABLE (Denormalized for quick access)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ride_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_role VARCHAR(10) NOT NULL CHECK (user_role IN ('rider', 'driver')),
  
  -- Quick Access Fields (denormalized from rides table)
  other_user_id UUID NOT NULL REFERENCES users(id),
  other_user_name VARCHAR(100),
  pickup_address TEXT,
  dropoff_address TEXT,
  total_fare DECIMAL(10, 2),
  ride_date TIMESTAMP WITH TIME ZONE,
  ride_status VARCHAR(20),
  rating_given DECIMAL(2, 1),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 15. DRIVER_EARNINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS driver_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES rides(id) ON DELETE SET NULL,
  
  -- Earnings Details
  gross_earnings DECIMAL(10, 2) NOT NULL,
  platform_commission DECIMAL(10, 2) NOT NULL,
  net_earnings DECIMAL(10, 2) NOT NULL,
  
  -- Payment Status
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR(20),
  
  -- Period
  earnings_period DATE, -- For weekly/monthly summaries
  earnings_type VARCHAR(20) DEFAULT 'ride' CHECK (earnings_type IN ('ride', 'bonus', 'referral', 'adjustment')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 16. SUPPORT_TICKETS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES rides(id) ON DELETE SET NULL,
  
  -- Ticket Information
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'ride_issue', 'payment_issue', 'account_issue', 'technical_issue', 'safety_concern', 'general'
  )),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Status
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'cancelled')),
  assigned_to UUID REFERENCES users(id), -- Support agent
  
  -- Resolution
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 17. SUPPORT_TICKET_MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  
  -- Message
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE, -- Internal note (not visible to user)
  
  -- Attachments
  attachments JSONB, -- Array of file URLs
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 18. APP_SETTINGS TABLE (System-wide settings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Setting Information
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type VARCHAR(50) NOT NULL CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'array')),
  description TEXT,
  
  -- Scope
  scope VARCHAR(50) DEFAULT 'global' CHECK (scope IN ('global', 'region', 'city')),
  region VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR OPTIMAL PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Driver-specific indexes (only create if columns exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'cnic') THEN
    CREATE INDEX IF NOT EXISTS idx_users_cnic ON users(cnic) WHERE cnic IS NOT NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'driving_license_number') THEN
    CREATE INDEX IF NOT EXISTS idx_users_driving_license ON users(driving_license_number) WHERE driving_license_number IS NOT NULL;
  END IF;
END $$;

-- Vehicles indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_active ON vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicles_verification_status ON vehicles(verification_status);

-- Rides indexes
CREATE INDEX IF NOT EXISTS idx_rides_rider_id ON rides(rider_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_vehicle_id ON rides(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_created_at ON rides(created_at);
CREATE INDEX IF NOT EXISTS idx_rides_payment_status ON rides(payment_status);
CREATE INDEX IF NOT EXISTS idx_rides_completed_at ON rides(completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rides_payment_transaction_id ON rides(payment_transaction_id);

-- Ride Requests indexes
CREATE INDEX IF NOT EXISTS idx_ride_requests_rider_id ON ride_requests(rider_id);
CREATE INDEX IF NOT EXISTS idx_ride_requests_status ON ride_requests(status);
CREATE INDEX IF NOT EXISTS idx_ride_requests_expires_at ON ride_requests(expires_at);
CREATE INDEX IF NOT EXISTS idx_ride_requests_created_at ON ride_requests(created_at);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_ride_id ON payments(ride_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);

-- Payment Methods indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(user_id, is_default) WHERE is_default = TRUE;

-- Ratings indexes
CREATE INDEX IF NOT EXISTS idx_ratings_ride_id ON ratings(ride_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_to ON ratings(rated_to);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_by ON ratings(rated_by);
CREATE INDEX IF NOT EXISTS idx_ratings_overall_rating ON ratings(rated_to, overall_rating);

-- Promo Codes indexes
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON promo_codes(is_active, valid_until);
CREATE INDEX IF NOT EXISTS idx_promo_codes_valid_until ON promo_codes(valid_until);

-- Saved Locations indexes
CREATE INDEX IF NOT EXISTS idx_saved_locations_user_id ON saved_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_locations_type ON saved_locations(user_id, location_type);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(user_id, created_at DESC);

-- Driver Locations indexes
CREATE INDEX IF NOT EXISTS idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_locations_online ON driver_locations(is_online, is_available) WHERE is_online = TRUE;
CREATE INDEX IF NOT EXISTS idx_driver_locations_recorded_at ON driver_locations(recorded_at DESC);

-- Driver Documents indexes
CREATE INDEX IF NOT EXISTS idx_driver_documents_driver_id ON driver_documents(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_documents_type ON driver_documents(driver_id, document_type);
CREATE INDEX IF NOT EXISTS idx_driver_documents_status ON driver_documents(verification_status);

-- Ride History indexes
CREATE INDEX IF NOT EXISTS idx_ride_history_user_id ON ride_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ride_history_ride_date ON ride_history(user_id, ride_date DESC);

-- Driver Earnings indexes
CREATE INDEX IF NOT EXISTS idx_driver_earnings_driver_id ON driver_earnings(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_earnings_period ON driver_earnings(driver_id, earnings_period DESC);
CREATE INDEX IF NOT EXISTS idx_driver_earnings_status ON driver_earnings(payment_status);

-- Support Tickets indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_ticket_number ON support_tickets(ticket_number);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at (idempotent - checks if trigger exists first)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'users' AND t.tgname = 'update_users_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'vehicles' AND t.tgname = 'update_vehicles_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'rides' AND t.tgname = 'update_rides_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'ride_requests' AND t.tgname = 'update_ride_requests_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_ride_requests_updated_at BEFORE UPDATE ON ride_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'payments' AND t.tgname = 'update_payments_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'payment_methods' AND t.tgname = 'update_payment_methods_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'ratings' AND t.tgname = 'update_ratings_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'promo_codes' AND t.tgname = 'update_promo_codes_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'saved_locations' AND t.tgname = 'update_saved_locations_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_saved_locations_updated_at BEFORE UPDATE ON saved_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'driver_documents' AND t.tgname = 'update_driver_documents_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_driver_documents_updated_at BEFORE UPDATE ON driver_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'support_tickets' AND t.tgname = 'update_support_tickets_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'app_settings' AND t.tgname = 'update_app_settings_updated_at' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for backend operations)
-- Drop policies if they exist, then create them (idempotent)
DROP POLICY IF EXISTS "Service role full access" ON users;
CREATE POLICY "Service role full access" ON users FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON vehicles;
CREATE POLICY "Service role full access" ON vehicles FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON rides;
CREATE POLICY "Service role full access" ON rides FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON ride_requests;
CREATE POLICY "Service role full access" ON ride_requests FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON payments;
CREATE POLICY "Service role full access" ON payments FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON payment_methods;
CREATE POLICY "Service role full access" ON payment_methods FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON ratings;
CREATE POLICY "Service role full access" ON ratings FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON promo_codes;
CREATE POLICY "Service role full access" ON promo_codes FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON promo_code_usages;
CREATE POLICY "Service role full access" ON promo_code_usages FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON saved_locations;
CREATE POLICY "Service role full access" ON saved_locations FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON notifications;
CREATE POLICY "Service role full access" ON notifications FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON driver_locations;
CREATE POLICY "Service role full access" ON driver_locations FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON driver_documents;
CREATE POLICY "Service role full access" ON driver_documents FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON ride_history;
CREATE POLICY "Service role full access" ON ride_history FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON driver_earnings;
CREATE POLICY "Service role full access" ON driver_earnings FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON support_tickets;
CREATE POLICY "Service role full access" ON support_tickets FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON support_ticket_messages;
CREATE POLICY "Service role full access" ON support_ticket_messages FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON app_settings;
CREATE POLICY "Service role full access" ON app_settings FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- USEFUL VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Active Rides (rides currently in progress)
CREATE OR REPLACE VIEW active_rides AS
SELECT 
  r.id,
  r.rider_id,
  r.driver_id,
  r.vehicle_id,
  r.status,
  r.pickup_location,
  r.dropoff_location,
  r.current_location,
  r.total_fare,
  r.started_at,
  u_rider.name AS rider_name,
  u_rider.phone AS rider_phone,
  u_driver.name AS driver_name,
  u_driver.phone AS driver_phone,
  v.make || ' ' || v.model AS vehicle_info,
  v.plate_number
FROM rides r
LEFT JOIN users u_rider ON r.rider_id = u_rider.id
LEFT JOIN users u_driver ON r.driver_id = u_driver.id
LEFT JOIN vehicles v ON r.vehicle_id = v.id
WHERE r.status IN ('accepted', 'driver_arriving', 'in_progress');

-- View: Driver Statistics
CREATE OR REPLACE VIEW driver_statistics AS
SELECT 
  d.id AS driver_id,
  d.name AS driver_name,
  d.email,
  d.phone,
  COUNT(DISTINCT r.id) AS total_rides,
  COUNT(DISTINCT CASE WHEN r.status = 'completed' THEN r.id END) AS completed_rides,
  COUNT(DISTINCT CASE WHEN r.status = 'cancelled' THEN r.id END) AS cancelled_rides,
  COALESCE(AVG(CASE WHEN r.driver_rating IS NOT NULL THEN r.driver_rating END), 0) AS avg_rating,
  COALESCE(SUM(CASE WHEN r.status = 'completed' THEN de.net_earnings END), 0) AS total_earnings,
  COALESCE(SUM(CASE WHEN r.status = 'completed' THEN de.net_earnings END), 0) / 
    NULLIF(COUNT(DISTINCT CASE WHEN r.status = 'completed' THEN r.id END), 0) AS avg_earnings_per_ride
FROM users d
LEFT JOIN rides r ON d.id = r.driver_id
LEFT JOIN driver_earnings de ON r.id = de.ride_id
WHERE d.role = 'driver'
GROUP BY d.id, d.name, d.email, d.phone;

-- View: Rider Statistics
CREATE OR REPLACE VIEW rider_statistics AS
SELECT 
  r.id AS rider_id,
  r.name AS rider_name,
  r.email,
  r.phone,
  COUNT(DISTINCT ride.id) AS total_rides,
  COUNT(DISTINCT CASE WHEN ride.status = 'completed' THEN ride.id END) AS completed_rides,
  COUNT(DISTINCT CASE WHEN ride.status = 'cancelled' THEN ride.id END) AS cancelled_rides,
  COALESCE(AVG(CASE WHEN ride.rider_rating IS NOT NULL THEN ride.rider_rating END), 0) AS avg_rating,
  COALESCE(SUM(CASE WHEN ride.status = 'completed' THEN ride.total_fare END), 0) AS total_spent
FROM users r
LEFT JOIN rides ride ON r.id = ride.rider_id
WHERE r.role = 'rider'
GROUP BY r.id, r.name, r.email, r.phone;

-- View: Available Drivers (online and available)
CREATE OR REPLACE VIEW available_drivers AS
SELECT 
  dl.driver_id,
  u.name AS driver_name,
  u.phone,
  dl.latitude,
  dl.longitude,
  dl.heading,
  dl.speed,
  dl.vehicle_id,
  v.make || ' ' || v.model AS vehicle_info,
  v.vehicle_type,
  v.seating_capacity,
  dl.recorded_at AS last_location_update
FROM driver_locations dl
INNER JOIN users u ON dl.driver_id = u.id
LEFT JOIN vehicles v ON dl.vehicle_id = v.id
WHERE dl.is_online = TRUE 
  AND dl.is_available = TRUE
  AND u.status = 'active'
  AND v.is_active = TRUE
  AND v.is_verified = TRUE
  AND dl.recorded_at > NOW() - INTERVAL '5 minutes'; -- Only recent locations

-- View: Pending Payments
CREATE OR REPLACE VIEW pending_payments AS
SELECT 
  p.id,
  p.transaction_id,
  p.ride_id,
  p.user_id,
  u.name AS user_name,
  u.email,
  p.amount,
  p.payment_method,
  p.status,
  p.created_at,
  r.pickup_location->>'address' AS pickup_address,
  r.dropoff_location->>'address' AS dropoff_address
FROM payments p
INNER JOIN users u ON p.user_id = u.id
LEFT JOIN rides r ON p.ride_id = r.id
WHERE p.status IN ('pending', 'processing');

-- View: Unread Notifications Count
CREATE OR REPLACE VIEW unread_notifications_count AS
SELECT 
  user_id,
  COUNT(*) AS unread_count
FROM notifications
WHERE is_read = FALSE
GROUP BY user_id;

-- ============================================================================
-- USEFUL FUNCTIONS
-- ============================================================================

-- Function: Calculate Driver Average Rating
CREATE OR REPLACE FUNCTION get_driver_avg_rating(driver_uuid UUID)
RETURNS DECIMAL(2,1) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(AVG(overall_rating), 0)
    FROM ratings
    WHERE rated_to = driver_uuid
      AND role = 'driver'
      AND is_visible = TRUE
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate Rider Average Rating
CREATE OR REPLACE FUNCTION get_rider_avg_rating(rider_uuid UUID)
RETURNS DECIMAL(2,1) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(AVG(overall_rating), 0)
    FROM ratings
    WHERE rated_to = rider_uuid
      AND role = 'rider'
      AND is_visible = TRUE
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Get Driver Total Earnings
CREATE OR REPLACE FUNCTION get_driver_total_earnings(driver_uuid UUID, start_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  total DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(net_earnings), 0) INTO total
  FROM driver_earnings
  WHERE driver_id = driver_uuid
    AND payment_status = 'paid'
    AND (start_date IS NULL OR earnings_period >= start_date)
    AND (end_date IS NULL OR earnings_period <= end_date);
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if Promo Code is Valid
CREATE OR REPLACE FUNCTION is_promo_code_valid(code_text VARCHAR, user_uuid UUID, ride_amount DECIMAL DEFAULT 0)
RETURNS BOOLEAN AS $$
DECLARE
  promo_record promo_codes%ROWTYPE;
  usage_count INTEGER;
BEGIN
  -- Get promo code
  SELECT * INTO promo_record
  FROM promo_codes
  WHERE code = code_text;
  
  -- Check if code exists
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if active
  IF promo_record.is_active = FALSE THEN
    RETURN FALSE;
  END IF;
  
  -- Check validity dates
  IF NOW() < promo_record.valid_from OR NOW() > promo_record.valid_until THEN
    RETURN FALSE;
  END IF;
  
  -- Check total uses
  IF promo_record.max_uses IS NOT NULL AND promo_record.current_uses >= promo_record.max_uses THEN
    RETURN FALSE;
  END IF;
  
  -- Check user usage limit
  SELECT COUNT(*) INTO usage_count
  FROM promo_code_usages
  WHERE promo_code_id = promo_record.id
    AND user_id = user_uuid;
  
  IF usage_count >= promo_record.max_uses_per_user THEN
    RETURN FALSE;
  END IF;
  
  -- Check minimum ride amount
  IF ride_amount < promo_record.min_ride_amount THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate Ride Fare
CREATE OR REPLACE FUNCTION calculate_ride_fare(
  base_fare_amount DECIMAL,
  distance_km DECIMAL,
  duration_minutes INTEGER,
  surge_mult DECIMAL DEFAULT 1.0,
  promo_discount_amount DECIMAL DEFAULT 0
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  distance_fare DECIMAL(10,2);
  time_fare DECIMAL(10,2);
  subtotal DECIMAL(10,2);
  service_fee DECIMAL(10,2);
  total DECIMAL(10,2);
BEGIN
  -- Calculate distance fare (assuming $1 per km)
  distance_fare := distance_km * 1.0;
  
  -- Calculate time fare (assuming $0.20 per minute)
  time_fare := duration_minutes * 0.20;
  
  -- Calculate subtotal
  subtotal := (base_fare_amount + distance_fare + time_fare) * surge_mult;
  
  -- Apply promo discount
  subtotal := subtotal - promo_discount_amount;
  
  -- Calculate service fee (10% of subtotal)
  service_fee := subtotal * 0.10;
  
  -- Calculate total
  total := subtotal + service_fee;
  
  -- Ensure minimum fare
  IF total < 5.0 THEN
    total := 5.0;
  END IF;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function: Get Nearby Drivers
CREATE OR REPLACE FUNCTION get_nearby_drivers(
  lat DECIMAL,
  lng DECIMAL,
  radius_km DECIMAL DEFAULT 5.0,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  driver_id UUID,
  driver_name VARCHAR,
  vehicle_info TEXT,
  distance_km DECIMAL,
  latitude DECIMAL,
  longitude DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dl.driver_id,
    u.name,
    v.make || ' ' || v.model,
    -- Haversine formula for distance calculation (simplified)
    6371 * acos(
      cos(radians(lat)) * 
      cos(radians(dl.latitude)) * 
      cos(radians(dl.longitude) - radians(lng)) + 
      sin(radians(lat)) * 
      sin(radians(dl.latitude))
    ) AS distance,
    dl.latitude,
    dl.longitude
  FROM driver_locations dl
  INNER JOIN users u ON dl.driver_id = u.id
  LEFT JOIN vehicles v ON dl.vehicle_id = v.id
  WHERE dl.is_online = TRUE
    AND dl.is_available = TRUE
    AND u.status = 'active'
    AND v.is_active = TRUE
    AND v.is_verified = TRUE
    AND dl.recorded_at > NOW() - INTERVAL '5 minutes'
  ORDER BY distance
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ADDITIONAL RLS POLICIES FOR AUTHENTICATED USERS
-- ============================================================================

-- Allow user registration (INSERT) - for new user signups
-- Note: Backend should use service role for registration, but this allows flexibility
DROP POLICY IF EXISTS "Allow user registration" ON users;
CREATE POLICY "Allow user registration" ON users
  FOR INSERT WITH CHECK (true); -- Allow anyone to register (backend should validate)

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (including converting to driver)
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can view their own rides
DROP POLICY IF EXISTS "Users can view own rides" ON rides;
CREATE POLICY "Users can view own rides" ON rides
  FOR SELECT USING (auth.uid() = rider_id OR auth.uid() = driver_id);

-- Users can view their own payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own payment methods
DROP POLICY IF EXISTS "Users can manage own payment methods" ON payment_methods;
CREATE POLICY "Users can manage own payment methods" ON payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Users can view their own saved locations
DROP POLICY IF EXISTS "Users can manage own saved locations" ON saved_locations;
CREATE POLICY "Users can manage own saved locations" ON saved_locations
  FOR ALL USING (auth.uid() = user_id);

-- Users can view their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Drivers can view their own vehicles
DROP POLICY IF EXISTS "Drivers can manage own vehicles" ON vehicles;
CREATE POLICY "Drivers can manage own vehicles" ON vehicles
  FOR ALL USING (auth.uid() = driver_id);

-- Drivers can view their own documents
DROP POLICY IF EXISTS "Drivers can manage own documents" ON driver_documents;
CREATE POLICY "Drivers can manage own documents" ON driver_documents
  FOR ALL USING (auth.uid() = driver_id);

-- Drivers can view their own location
DROP POLICY IF EXISTS "Drivers can manage own location" ON driver_locations;
CREATE POLICY "Drivers can manage own location" ON driver_locations
  FOR ALL USING (auth.uid() = driver_id);

-- Users can view ratings for their rides
DROP POLICY IF EXISTS "Users can view own ride ratings" ON ratings;
CREATE POLICY "Users can view own ride ratings" ON ratings
  FOR SELECT USING (
    auth.uid() = rated_by OR 
    auth.uid() = rated_to OR
    EXISTS (SELECT 1 FROM rides WHERE rides.id = ratings.ride_id AND (rides.rider_id = auth.uid() OR rides.driver_id = auth.uid()))
  );

-- Users can create ratings for their completed rides
DROP POLICY IF EXISTS "Users can create own ratings" ON ratings;
CREATE POLICY "Users can create own ratings" ON ratings
  FOR INSERT WITH CHECK (
    auth.uid() = rated_by AND
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = ratings.ride_id 
        AND rides.status = 'completed'
        AND (rides.rider_id = auth.uid() OR rides.driver_id = auth.uid())
    )
  );

-- Users can view their own support tickets
DROP POLICY IF EXISTS "Users can manage own support tickets" ON support_tickets;
CREATE POLICY "Users can manage own support tickets" ON support_tickets
  FOR ALL USING (auth.uid() = user_id);

-- Users can view messages for their tickets
DROP POLICY IF EXISTS "Users can view own ticket messages" ON support_ticket_messages;
CREATE POLICY "Users can view own ticket messages" ON support_ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = support_ticket_messages.ticket_id 
        AND support_tickets.user_id = auth.uid()
    )
  );

-- Users can create messages for their tickets
DROP POLICY IF EXISTS "Users can create own ticket messages" ON support_ticket_messages;
CREATE POLICY "Users can create own ticket messages" ON support_ticket_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = support_ticket_messages.ticket_id 
        AND support_tickets.user_id = auth.uid()
    )
  );

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================


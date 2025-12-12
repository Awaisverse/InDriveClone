# Complete Database Schema Documentation

## 📊 Overview

This comprehensive database schema supports a full-featured ride-sharing platform with 18 optimized tables covering all aspects of the system.

## 🗂️ Table Structure

### 1. **users** - User Accounts
- Stores all user information (riders and drivers)
- Includes profile data, preferences, and role-based information
- **Key Fields**: email, phone, role, driver_profile, rider_profile
- **Driver-specific Fields**: cnic, driving_license_number, address (required for driver registration)
- **Indexes**: email, phone, role, status, cnic, driving_license_number

### 2. **vehicles** - Vehicle Information
- Separate table for vehicle details (normalized from users)
- Supports multiple vehicles per driver
- Document management and verification
- **Key Fields**: driver_id, make, model, plate_number, verification_status
- **Indexes**: driver_id, is_active, verification_status

### 3. **rides** - Main Rides/Trips Table
- Core table for all ride transactions
- Complete ride lifecycle tracking
- Pricing and payment integration
- **Key Fields**: rider_id, driver_id, status, pickup_location, dropoff_location, total_fare
- **Indexes**: rider_id, driver_id, status, payment_status, completed_at

### 4. **ride_requests** - Temporary Ride Requests
- Active ride requests before driver matching
- Expires automatically
- Used for real-time matching
- **Key Fields**: rider_id, pickup_location, dropoff_location, status, expires_at
- **Indexes**: rider_id, status, expires_at

### 5. **payments** - Payment Transactions
- All payment records
- Supports multiple payment gateways
- Refund tracking
- **Key Fields**: transaction_id, ride_id, user_id, amount, status
- **Indexes**: user_id, ride_id, status, transaction_id

### 6. **payment_methods** - User Payment Methods
- Saved payment methods (cards, wallets, bank accounts)
- Tokenized card storage
- Default payment method tracking
- **Key Fields**: user_id, type, payment_token, is_default
- **Indexes**: user_id, is_default

### 7. **ratings** - Ratings and Reviews
- Bidirectional ratings (rider rates driver, driver rates rider)
- Multi-dimensional ratings (cleanliness, driving, communication, etc.)
- Review text and tags
- **Key Fields**: ride_id, rated_by, rated_to, overall_rating, review_text
- **Indexes**: ride_id, rated_to, rated_by

### 8. **promo_codes** - Promotional Codes
- Discount codes and offers
- Usage limits and validity periods
- Regional and ride-type restrictions
- **Key Fields**: code, discount_type, discount_value, valid_until
- **Indexes**: code, is_active, valid_until

### 9. **promo_code_usages** - Promo Code Usage Tracking
- Tracks which users used which codes
- Prevents duplicate usage
- **Key Fields**: promo_code_id, user_id, ride_id, discount_applied
- **Unique Constraint**: (promo_code_id, user_id, ride_id)

### 10. **saved_locations** - User Saved Locations
- Favorite locations (Home, Work, etc.)
- Quick access for frequent destinations
- **Key Fields**: user_id, name, address, latitude, longitude
- **Indexes**: user_id, location_type

### 11. **notifications** - User Notifications
- Push notifications and in-app messages
- Multiple notification types
- Read/unread tracking
- **Key Fields**: user_id, title, message, notification_type, is_read
- **Indexes**: user_id, is_read, created_at

### 12. **driver_locations** - Real-time Location Tracking
- GPS coordinates for active drivers
- Heading and speed tracking
- Online/offline status
- **Key Fields**: driver_id, latitude, longitude, is_online, is_available
- **Indexes**: driver_id, is_online, recorded_at

### 13. **driver_documents** - Driver Document Management
- License, registration, insurance documents
- Verification workflow
- Expiry tracking
- **Key Fields**: driver_id, document_type, file_url, verification_status
- **Indexes**: driver_id, document_type, verification_status

### 14. **ride_history** - Denormalized Ride History
- Quick access to ride history
- Pre-computed for performance
- **Key Fields**: ride_id, user_id, other_user_name, total_fare, ride_date
- **Indexes**: user_id, ride_date

### 15. **driver_earnings** - Driver Earnings Tracking
- Detailed earnings per ride
- Commission calculations
- Payment status
- **Key Fields**: driver_id, ride_id, gross_earnings, net_earnings, payment_status
- **Indexes**: driver_id, earnings_period, payment_status

### 16. **support_tickets** - Customer Support
- Support ticket system
- Assignment and resolution tracking
- **Key Fields**: user_id, ticket_number, subject, status, priority
- **Indexes**: user_id, status, ticket_number

### 17. **support_ticket_messages** - Support Messages
- Conversation threads for tickets
- Internal notes support
- **Key Fields**: ticket_id, sender_id, message
- **Indexes**: ticket_id, created_at

### 18. **app_settings** - System Configuration
- Global and regional settings
- Dynamic configuration
- **Key Fields**: setting_key, setting_value, scope, region
- **Indexes**: setting_key, scope

## 👤 Driver Registration Requirements

When a user registers as a driver, the following fields are required:

- **CNIC (National ID)**: Unique CNIC/National ID number (`cnic` field)
- **Driving License Number**: Unique driving license number (`driving_license_number` field)
- **Address**: Complete address information stored as JSONB (`address` field)
  - Format: `{street, city, state, country, postal_code, coordinates: {lat, lng}}`

These fields are optional for riders (can be NULL) but must be provided for drivers during registration. The application should enforce this validation.

**Note**: Document pictures (CNIC photo, license photo) are not stored in the users table. Use the `driver_documents` table for document file storage when needed.

## 🔑 Key Features

### Optimizations
- ✅ Comprehensive indexing for fast queries
- ✅ Proper foreign key relationships
- ✅ Check constraints for data integrity
- ✅ JSONB fields for flexible data storage
- ✅ Denormalized tables for performance (ride_history)
- ✅ Automatic timestamp updates via triggers

### Data Integrity
- ✅ Foreign key constraints with CASCADE/SET NULL
- ✅ Unique constraints where needed
- ✅ Check constraints for enum values
- ✅ NOT NULL constraints for required fields
- ✅ Default values for common fields

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Service role policies for backend access
- ✅ User-specific data isolation

### Scalability
- ✅ Partitioning-ready structure
- ✅ Efficient indexes for common queries
- ✅ JSONB for flexible schema evolution
- ✅ Separate tables for different concerns

## 📋 Usage Instructions

1. **Run the Schema**:
   - Open Supabase SQL Editor
   - Copy and paste the entire `complete_schema.sql` file
   - Click "Run" to execute

2. **Verify Tables**:
   - Go to Table Editor in Supabase
   - You should see all 18 tables listed

3. **Test Queries**:
   - Use the SQL Editor to test queries
   - Check indexes are created properly

## 🔄 Migration Notes

- The `users` table already exists - the schema will use `CREATE TABLE IF NOT EXISTS`
- All other tables are new
- Indexes are created with `IF NOT EXISTS` to prevent errors
- Triggers are created or replaced automatically

## 📊 Table Relationships

```
users (1) ──< (many) vehicles
users (1) ──< (many) rides (as rider)
users (1) ──< (many) rides (as driver)
rides (1) ──< (many) payments
rides (1) ──< (many) ratings
users (1) ──< (many) saved_locations
users (1) ──< (many) notifications
users (1) ──< (many) driver_locations
users (1) ──< (many) driver_documents
users (1) ──< (many) support_tickets
```

## 📊 Database Views

The schema includes several useful views for common queries:

### 1. **active_rides**
- Shows all rides currently in progress
- Includes rider and driver information
- Useful for real-time ride tracking

### 2. **driver_statistics**
- Aggregated statistics for each driver
- Total rides, completed rides, average rating, earnings
- Useful for driver dashboards

### 3. **rider_statistics**
- Aggregated statistics for each rider
- Total rides, completed rides, average rating, total spent
- Useful for rider profiles

### 4. **available_drivers**
- List of drivers currently online and available
- Includes location and vehicle information
- Filtered to only recent locations (last 5 minutes)

### 5. **pending_payments**
- All payments that are pending or processing
- Includes user and ride information
- Useful for payment monitoring

### 6. **unread_notifications_count**
- Count of unread notifications per user
- Useful for notification badges

## 🔧 Database Functions

The schema includes helper functions for common operations:

### Rating Functions
- `get_driver_avg_rating(driver_uuid)` - Calculate average rating for a driver
- `get_rider_avg_rating(rider_uuid)` - Calculate average rating for a rider

### Earnings Functions
- `get_driver_total_earnings(driver_uuid, start_date, end_date)` - Calculate total earnings for a driver in a date range

### Promo Code Functions
- `is_promo_code_valid(code_text, user_uuid, ride_amount)` - Validate if a promo code can be used

### Ride Functions
- `calculate_ride_fare(base_fare, distance_km, duration_minutes, surge_mult, promo_discount)` - Calculate total fare for a ride
- `get_nearby_drivers(lat, lng, radius_km, limit_count)` - Find drivers within a radius

## 🔒 Enhanced RLS Policies

In addition to service role policies, the schema includes user-specific RLS policies:

- Users can view and update their own profile
- Users can view their own rides, payments, and payment methods
- Users can manage their own saved locations
- Users can view and update their own notifications
- Drivers can manage their own vehicles, documents, and locations
- Users can view and create ratings for their rides
- Users can manage their own support tickets and messages

## 🎯 Next Steps

1. Run the schema in Supabase
2. Update backend models to use new tables
3. Create API endpoints for new entities
4. Update frontend to use new data structures
5. Test all functionality
6. Use views and functions for optimized queries

---

**Total Tables**: 18  
**Total Views**: 6  
**Total Functions**: 6  
**Total Indexes**: 50+  
**Total Triggers**: 12  
**RLS Policies**: 35+ (Service role + User-specific)


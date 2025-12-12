import redis from '../config/redis';

/**
 * Cache Service for Redis
 * Handles all caching operations for the ride-sharing application
 */
export class CacheService {
  // Default TTL values (in seconds)
  private static readonly TTL = {
    DRIVER_LOCATION: 30,        // 30 seconds - driver locations update frequently
    RIDE_REQUESTS: 120,         // 2 minutes - active ride requests
    API_RESPONSE: 300,          // 5 minutes - general API responses
    USER_SESSION: 3600,         // 1 hour - user sessions
    RIDE_MATCHING: 60,          // 1 minute - ride matching cache
  };

  /**
   * Cache driver location (updated frequently)
   */
  static async cacheDriverLocation(driverId: string, location: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
  }): Promise<void> {
    try {
      const key = `driver:location:${driverId}`;
      const data = {
        ...location,
        timestamp: new Date().toISOString(),
      };
      await redis.setex(key, this.TTL.DRIVER_LOCATION, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching driver location:', error);
    }
  }

  /**
   * Get driver location from cache
   */
  static async getDriverLocation(driverId: string): Promise<{
    latitude: number;
    longitude: number;
    timestamp: string;
  } | null> {
    try {
      const key = `driver:location:${driverId}`;
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting driver location:', error);
      return null;
    }
  }

  /**
   * Cache active ride requests
   */
  static async cacheRideRequests(requests: any[]): Promise<void> {
    try {
      const key = 'ride:requests:active';
      await redis.setex(key, this.TTL.RIDE_REQUESTS, JSON.stringify(requests));
    } catch (error) {
      console.error('Error caching ride requests:', error);
    }
  }

  /**
   * Get cached ride requests
   */
  static async getCachedRideRequests(): Promise<any[] | null> {
    try {
      const key = 'ride:requests:active';
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached ride requests:', error);
      return null;
    }
  }

  /**
   * Cache nearby drivers for a location
   */
  static async cacheNearbyDrivers(
    latitude: number,
    longitude: number,
    drivers: any[]
  ): Promise<void> {
    try {
      // Round coordinates to cache by area (0.01 degree ≈ 1km)
      const latRounded = Math.round(latitude * 100) / 100;
      const lngRounded = Math.round(longitude * 100) / 100;
      const key = `drivers:nearby:${latRounded}:${lngRounded}`;
      await redis.setex(key, this.TTL.RIDE_MATCHING, JSON.stringify(drivers));
    } catch (error) {
      console.error('Error caching nearby drivers:', error);
    }
  }

  /**
   * Get cached nearby drivers
   */
  static async getCachedNearbyDrivers(
    latitude: number,
    longitude: number
  ): Promise<any[] | null> {
    try {
      const latRounded = Math.round(latitude * 100) / 100;
      const lngRounded = Math.round(longitude * 100) / 100;
      const key = `drivers:nearby:${latRounded}:${lngRounded}`;
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached nearby drivers:', error);
      return null;
    }
  }

  /**
   * Cache API response
   */
  static async cacheAPIResponse(
    key: string,
    data: any,
    ttl: number = this.TTL.API_RESPONSE
  ): Promise<void> {
    try {
      await redis.setex(`api:${key}`, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching API response:', error);
    }
  }

  /**
   * Get cached API response
   */
  static async getCachedResponse(key: string): Promise<any | null> {
    try {
      const data = await redis.get(`api:${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached response:', error);
      return null;
    }
  }

  /**
   * Cache user session
   */
  static async cacheUserSession(userId: string, sessionData: any): Promise<void> {
    try {
      const key = `session:${userId}`;
      await redis.setex(key, this.TTL.USER_SESSION, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error caching user session:', error);
    }
  }

  /**
   * Get user session
   */
  static async getUserSession(userId: string): Promise<any | null> {
    try {
      const key = `session:${userId}`;
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  }

  /**
   * Cache active ride
   */
  static async cacheActiveRide(rideId: string, rideData: any): Promise<void> {
    try {
      const key = `ride:active:${rideId}`;
      await redis.setex(key, 600, JSON.stringify(rideData)); // 10 minutes
    } catch (error) {
      console.error('Error caching active ride:', error);
    }
  }

  /**
   * Get cached active ride
   */
  static async getCachedActiveRide(rideId: string): Promise<any | null> {
    try {
      const key = `ride:active:${rideId}`;
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached active ride:', error);
      return null;
    }
  }

  /**
   * Delete cache by key
   */
  static async deleteCache(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Error deleting cache:', error);
    }
  }

  /**
   * Delete cache by pattern
   */
  static async deleteCacheByPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Error deleting cache by pattern:', error);
    }
  }

  /**
   * Clear all cache (use with caution!)
   */
  static async clearAllCache(): Promise<void> {
    try {
      await redis.flushdb();
      console.log('✅ All cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    totalKeys: number;
    memoryUsage: string;
  }> {
    try {
      const info = await redis.info('memory');
      const keys = await redis.dbsize();
      
      // Parse memory info
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      const memoryUsage = memoryMatch ? memoryMatch[1].trim() : 'Unknown';

      return {
        totalKeys: keys,
        memoryUsage,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { totalKeys: 0, memoryUsage: 'Unknown' };
    }
  }
}













/**
 * Redis Connection Example
 *
 * This is a simple example showing how to connect to Redis
 * Similar to the C# StackExchange.Redis example
 */

import redis from '../config/redis';

export class RedisConnectionExample {
  /**
   * Basic Redis connection and operations example
   */
  public static async run(): Promise<void> {
    try {
      // Wait for Redis connection to be ready
      console.log('⏳ Waiting for Redis connection...');
      await new Promise<void>((resolve, reject) => {
        if (redis.status === 'ready') {
          resolve();
          return;
        }

        const timeout = setTimeout(() => {
          reject(new Error('Redis connection timeout after 10 seconds'));
        }, 10000);

        redis.once('ready', () => {
          clearTimeout(timeout);
          resolve();
        });

        redis.once('error', error => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      console.log('✅ Redis connection ready!');

      // Test connection
      const pingResult = await redis.ping();
      console.log('✅ Redis Ping:', pingResult);

      // Set a value (equivalent to db.StringSet("foo", "bar"))
      await redis.set('foo', 'bar');
      console.log('✅ Set key "foo" to "bar"');

      // Get a value (equivalent to db.StringGet("foo"))
      const result = await redis.get('foo');
      console.log('✅ Get key "foo":', result); // Should print: bar

      // Example with expiration (TTL)
      await redis.setex('temp-key', 60, 'temporary-value'); // Expires in 60 seconds
      console.log('✅ Set key "temp-key" with 60 second expiration');

      // Get with expiration check
      const tempValue = await redis.get('temp-key');
      console.log('✅ Get key "temp-key":', tempValue);

      // Delete a key
      await redis.del('foo');
      console.log('✅ Deleted key "foo"');

      // Verify deletion
      const deletedValue = await redis.get('foo');
      console.log('✅ Get deleted key "foo":', deletedValue); // Should print: null
    } catch (error: any) {
      console.error('❌ Redis Error:', error.message);
      throw error;
    }
  }

  /**
   * Test Redis connection
   */
  public static async testConnection(): Promise<boolean> {
    try {
      await redis.ping();
      console.log('✅ Redis connection successful');
      return true;
    } catch (error: any) {
      console.error('❌ Redis connection failed:', error.message);
      return false;
    }
  }
}

// Run example if this file is executed directly
if (require.main === module) {
  RedisConnectionExample.run()
    .then(() => {
      console.log('\n✅ Example completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Example failed:', error);
      process.exit(1);
    });
}

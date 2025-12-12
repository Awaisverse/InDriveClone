import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Redis configuration from Redis Labs
// Try connection string first (most reliable for Redis Labs), then fall back to individual options
let redisConfig: any;

// Common Redis options
const redisOptions = {
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true, // Allow queuing commands while connecting
};

if (process.env.REDIS_URL) {
  // Use connection string if provided (format: redis://username:password@host:port)
  // ioredis accepts connection string as first arg and options as second arg
  redisConfig = [process.env.REDIS_URL, redisOptions];
} else {
  // Build connection from individual environment variables
  const host =
    process.env.REDIS_HOST ||
    'redis-14210.c10.us-east-1-2.ec2.cloud.redislabs.com';
  const port = parseInt(process.env.REDIS_PORT || '14210');
  const username = process.env.REDIS_USERNAME;
  const password = process.env.REDIS_PASSWORD;

  // Try connection string format if username is provided (Redis Labs ACL)
  // Format: redis://username:password@host:port
  if (username && password) {
    redisConfig = [
      `redis://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}`,
      redisOptions,
    ];
  } else if (password) {
    // Use individual options if no username
    redisConfig = {
      host,
      port,
      password,
      ...redisOptions,
    };
  } else {
    // Fallback: no password (not recommended for production)
    redisConfig = {
      host,
      port,
      ...redisOptions,
    };
  }
}

// Create Redis client
// Handle both connection string + options array and options object
let redis: Redis;
if (Array.isArray(redisConfig)) {
  // Connection string with options: [url, options]
  redis = new Redis(redisConfig[0], redisConfig[1]);
} else {
  // Options object or connection string
  redis = new Redis(redisConfig);
}
export { redis };
export default redis;

// Connection events
redis.on('connect', () => {
  console.log('🔄 Connecting to Redis...');
});

redis.on('ready', () => {
  console.log('✅ Redis Connected and Ready');
});

redis.on('error', error => {
  console.error('❌ Redis Error:', error.message);
});

redis.on('close', () => {
  console.log('⚠️ Redis Connection Closed');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis Reconnecting...');
});

// Test connection on startup
redis
  .ping()
  .then(() => {
    console.log('✅ Redis Ping Successful');
  })
  .catch(error => {
    console.error('❌ Redis Ping Failed:', error.message);
  });

export default redis;

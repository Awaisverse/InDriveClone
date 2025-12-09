// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3000/api'
    : 'https://your-backend-url.com/api',
  TIMEOUT: 10000,
};

// App Constants
export const APP_CONSTANTS = {
  APP_NAME: 'RideShare',
  VERSION: '1.0.0',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@rideshare:auth_token',
  USER_DATA: '@rideshare:user_data',
};




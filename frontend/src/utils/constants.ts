// API Configuration
// __DEV__ is a global variable in React Native/Expo
declare const __DEV__: boolean;

// For mobile devices, replace 'localhost' with your computer's IP address
// Example: 'http://192.168.1.100:3000/api'
// To find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
const getBaseURL = () => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    // Use your computer's local IP address instead of localhost for mobile testing
    // Example: return 'http://192.168.1.100:3000/api';
    return 'http://localhost:3000/api';
  }
  return 'https://your-backend-url.com/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
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
} as const;


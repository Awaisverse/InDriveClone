import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'rider' | 'driver';
  isVerified?: boolean;
  driverProfile?: {
    licenseNumber?: string;
    licenseExpiry?: string;
    vehicleInfo?: {
      make?: string;
      model?: string;
      year?: number;
      color?: string;
      plateNumber?: string;
      vehicleType?: 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'van';
    };
    isActive?: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  currentMode: 'rider' | 'driver'; // Mode switching
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
  switchMode: (mode: 'rider' | 'driver') => Promise<{ needsDriverInfo: boolean }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  currentMode: 'rider', // Start in rider mode

  login: async (user: User, token: string) => {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    const savedMode = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_MODE);
    set({
      user,
      token,
      isAuthenticated: true,
      currentMode: (savedMode as 'rider' | 'driver') || 'rider',
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_MODE);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      currentMode: 'rider',
    });
  },

  loadAuth: async () => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    const savedMode = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_MODE);

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        set({
          token,
          user,
          isAuthenticated: true,
          currentMode: (savedMode as 'rider' | 'driver') || 'rider',
        });
      } catch (error) {
        // Invalid user data, clear it
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          currentMode: 'rider',
        });
      }
    } else {
      // No saved auth - user needs to login
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        currentMode: 'rider',
      });
    }
  },

  switchMode: async (mode: 'rider' | 'driver') => {
    // If switching to driver mode, check if driver profile exists
    if (mode === 'driver') {
      const state = get();
      const currentUser = state.user;
      // Check if driver profile exists and has required info
      const hasDriverProfile = currentUser?.driverProfile && 
        currentUser.driverProfile.licenseNumber &&
        currentUser.driverProfile.vehicleInfo?.make &&
        currentUser.driverProfile.vehicleInfo?.model;
      
      // Return a flag indicating if driver info is needed
      if (!hasDriverProfile) {
        return { needsDriverInfo: true };
      }
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_MODE, mode);
    set({ currentMode: mode });
    return { needsDriverInfo: false };
  },
}));






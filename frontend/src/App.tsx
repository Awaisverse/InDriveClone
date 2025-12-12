import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import Navigation from './navigation/Navigation';
import RiderNavigation from './navigation/RiderNavigation';
import DriverNavigation from './navigation/DriverNavigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const { isAuthenticated, currentMode, loadAuth } = useAuthStore();

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          {!isAuthenticated ? (
            // Show login/register screens when not authenticated
            <Navigation />
          ) : (
            // Show appropriate navigation based on current mode
            currentMode === 'rider' ? <RiderNavigation /> : <DriverNavigation />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

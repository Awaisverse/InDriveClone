import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components';

export default function RiderHomeScreen() {
  const { user, isAuthenticated, currentMode, switchMode } = useAuthStore();
  const navigation = useNavigation();

  const handleSwitchToDriver = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to switch to driver mode. You can register as a driver from your profile after signing in.',
        [{ text: 'OK' }]
      );
      return;
    }
    const result = await switchMode('driver');
    if (result.needsDriverInfo) {
      Alert.alert(
        'Driver Information Required',
        'Please complete your driver profile information in Profile section first.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBookRide = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in or create an account to book a ride.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => {
              // Navigate to login - this will be handled by App.tsx
              // For now, we'll show an alert
              Alert.alert('Please use the navigation to go to Login screen');
            },
          },
        ]
      );
      return;
    }
    navigation.navigate('Book' as never);
  };

  const handleViewHistory = () => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to view your ride history.');
      return;
    }
    navigation.navigate('History' as never);
  };

  const handleViewSaved = () => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to view your saved locations.');
      return;
    }
    navigation.navigate('Saved' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {isAuthenticated && user ? (
              <>
                <Text style={styles.greeting}>Hello, {user.name}</Text>
                <Text style={styles.subtitle}>Where would you like to go?</Text>
              </>
            ) : (
              <>
                <Text style={styles.greeting}>Welcome to RideShare</Text>
                <Text style={styles.subtitle}>Sign in to start booking rides</Text>
              </>
            )}
          </View>
          {isAuthenticated && (
            <TouchableOpacity
              style={styles.modeSwitch}
              onPress={handleSwitchToDriver}
            >
              <Text style={styles.modeSwitchText}>🚗 Driver</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sign In Prompt (if not authenticated) */}
        {!isAuthenticated && (
          <View style={styles.signInPrompt}>
            <Text style={styles.signInTitle}>Get Started</Text>
            <Text style={styles.signInText}>
              Create an account or sign in to book rides, save locations, and track your trips.
            </Text>
            <View style={styles.signInButtons}>
              <Button
                title="Sign In"
                onPress={() => {
                  // Navigation will be handled by App.tsx when auth state changes
                  Alert.alert(
                    'Sign In',
                    'Please use the app navigation to access the Sign In screen.',
                    [{ text: 'OK' }]
                  );
                }}
                style={styles.signInButton}
              />
            </View>
          </View>
        )}

        {/* Quick Book Ride Card - Only show if authenticated */}
        {isAuthenticated && (
          <TouchableOpacity
            style={styles.quickBookCard}
            onPress={handleBookRide}
            activeOpacity={0.8}
          >
            <View style={styles.quickBookContent}>
              <Text style={styles.quickBookTitle}>Book a Ride</Text>
              <Text style={styles.quickBookSubtitle}>Tap to set pickup and destination</Text>
              <View style={styles.quickBookIcon}>
                <Text style={styles.quickBookIconText}>🚕</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Saved Locations - Only show if authenticated */}
        {isAuthenticated && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
              <TouchableOpacity onPress={handleViewSaved}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.savedLocations}>
              <TouchableOpacity
                style={styles.locationCard}
                onPress={handleBookRide}
              >
                <Text style={styles.locationIcon}>🏠</Text>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>Home</Text>
                  <Text style={styles.locationAddress}>Tap to set your home address</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.locationCard}
                onPress={handleBookRide}
              >
                <Text style={styles.locationIcon}>💼</Text>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>Work</Text>
                  <Text style={styles.locationAddress}>Tap to set your work address</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Recent Rides - Only show if authenticated */}
        {isAuthenticated && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Rides</Text>
              <TouchableOpacity onPress={handleViewHistory}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentRides}>
              <View style={styles.recentRideCard}>
                <View style={styles.rideInfo}>
                  <Text style={styles.rideRoute}>No rides yet</Text>
                  <Text style={styles.rideDate}>Book your first ride to get started</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Promotions - Show for all users */}
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>🎉 Welcome to RideShare</Text>
          {isAuthenticated ? (
            <>
              <Text style={styles.promoText}>Get 20% off your next ride!</Text>
              <Text style={styles.promoCode}>Use code: RIDE20</Text>
            </>
          ) : (
            <Text style={styles.promoText}>
              Sign up today and get 20% off your first ride!
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 15,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  modeSwitch: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    marginLeft: 10,
  },
  modeSwitchText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  signInPrompt: {
    margin: 15,
    marginTop: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  signInTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  signInText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  signInButtons: {
    gap: 10,
  },
  signInButton: {
    marginTop: 0,
  },
  quickBookCard: {
    margin: 15,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  quickBookContent: {
    position: 'relative',
  },
  quickBookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  quickBookSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  quickBookIcon: {
    position: 'absolute',
    right: 0,
    top: -10,
  },
  quickBookIconText: {
    fontSize: 60,
  },
  section: {
    padding: 15,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  savedLocations: {
    gap: 10,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  recentRides: {
    gap: 10,
  },
  recentRideCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideInfo: {
    flex: 1,
  },
  rideRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  rideDate: {
    fontSize: 14,
    color: '#666',
  },
  rideFare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  promoCard: {
    margin: 15,
    marginTop: 0,
    marginBottom: 30,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  promoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  promoCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components';
import { Ride, Location } from '../../types';
import api from '../../services/api';

interface ActiveRide extends Ride {
  passengerName: string;
  passengerPhone: string;
  passengerRating: number;
  pickupAddress: string;
  dropoffAddress: string;
  currentStatus: 'picking-up' | 'in-progress' | 'arrived';
}

export default function ActiveRideScreen({ route }: any) {
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [rideStatus, setRideStatus] = useState<'picking-up' | 'in-progress' | 'arrived'>('picking-up');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveRide();
  }, []);

  const loadActiveRide = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rides/driver/active');
      if (response.data.success && response.data.ride) {
        const ride = response.data.ride;
        setActiveRide({
          id: ride.id,
          riderId: ride.riderId,
          passengerName: ride.rider?.name || 'Passenger',
          passengerPhone: ride.rider?.phone || '',
          passengerRating: ride.rider?.rating || 0,
          pickupAddress: ride.pickupLocation?.address || 'Pickup location',
          dropoffAddress: ride.dropoffLocation?.address || 'Dropoff location',
          pickupLocation: ride.pickupLocation,
          dropoffLocation: ride.dropoffLocation,
          status: ride.status,
          fare: ride.totalFare,
          distance: ride.estimatedDistance || 0,
          currentStatus: ride.status === 'accepted' ? 'picking-up' : ride.status === 'driver_arriving' ? 'arrived' : 'in-progress',
          createdAt: ride.createdAt,
          updatedAt: ride.updatedAt,
        });
        // Set ride status based on ride status
        if (ride.status === 'accepted') setRideStatus('picking-up');
        else if (ride.status === 'driver_arriving') setRideStatus('arrived');
        else if (ride.status === 'in_progress') setRideStatus('in-progress');
      }
    } catch (error: any) {
      // No active ride - this is okay
      setActiveRide(null);
    } finally {
      setLoading(false);
    }
  };

  const handleArrived = async () => {
    if (!activeRide) return;
    
    Alert.alert(
      'Arrived at Pickup?',
      'Confirm that you have arrived at the pickup location.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await api.put(`/rides/${activeRide.id}/status`, {
                status: 'driver_arriving',
              });
              setRideStatus('arrived');
              await loadActiveRide();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to update ride status');
            }
          },
        },
      ]
    );
  };

  const handleStartRide = async () => {
    if (!activeRide) return;
    
    Alert.alert(
      'Start Ride?',
      'The passenger is in the vehicle. Start the trip.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Ride',
          onPress: async () => {
            try {
              await api.put(`/rides/${activeRide.id}/status`, {
                status: 'in_progress',
              });
              setRideStatus('in-progress');
              await loadActiveRide();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to start ride');
            }
          },
        },
      ]
    );
  };

  const handleCompleteRide = async () => {
    if (!activeRide) return;
    
    Alert.alert(
      'Complete Ride?',
      'Confirm that the passenger has reached their destination.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await api.post(`/rides/${activeRide.id}/complete`, {
                actualDistance: activeRide.distance,
                actualDuration: 15, // TODO: Calculate actual duration
              });
              Alert.alert('Success', `Ride completed! Fare: $${activeRide.fare.toFixed(2)}`);
              await loadActiveRide(); // Will return null, showing empty state
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to complete ride');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!activeRide) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active ride</Text>
          <Text style={styles.emptySubtext}>Accept a ride request to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, styles.statusDotActive]} />
            <Text style={styles.statusText}>
              {rideStatus === 'picking-up' && 'Heading to Pickup'}
              {rideStatus === 'arrived' && 'Arrived at Pickup'}
              {rideStatus === 'in-progress' && 'Ride in Progress'}
            </Text>
          </View>
        </View>

        {/* Passenger Info */}
        <View style={styles.passengerCard}>
          <View style={styles.passengerHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{activeRide.passengerName.charAt(0)}</Text>
            </View>
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerName}>{activeRide.passengerName}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.rating}>{activeRide.passengerRating}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callIcon}>📞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Route Info */}
        <View style={styles.routeCard}>
          <View style={styles.routePoint}>
            <View style={styles.pickupDot} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeAddress}>{activeRide.pickupAddress}</Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <View style={styles.dropoffDot} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Dropoff</Text>
              <Text style={styles.routeAddress}>{activeRide.dropoffAddress}</Text>
            </View>
          </View>
        </View>

        {/* Ride Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailValue}>{activeRide.distance} km</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Fare</Text>
            <Text style={styles.detailValue}>${activeRide.fare.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ride ID</Text>
            <Text style={styles.detailValue}>#{activeRide.id}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {rideStatus === 'picking-up' && (
            <Button
              title="I've Arrived"
              onPress={handleArrived}
              variant="primary"
            />
          )}
          {rideStatus === 'arrived' && (
            <Button
              title="Start Ride"
              onPress={handleStartRide}
              variant="primary"
            />
          )}
          {rideStatus === 'in-progress' && (
            <Button
              title="Complete Ride"
              onPress={handleCompleteRide}
              variant="secondary"
            />
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
  statusHeader: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  statusDotActive: {
    backgroundColor: '#34C759',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  passengerCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  rating: {
    fontSize: 16,
    color: '#666',
  },
  callButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callIcon: {
    fontSize: 24,
  },
  routeCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pickupDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
    marginRight: 15,
    marginTop: 4,
  },
  dropoffDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    marginRight: 15,
    marginTop: 4,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginLeft: 7,
    marginVertical: 10,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  detailsCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  actionsContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});


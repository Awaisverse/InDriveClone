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
import { Ride } from '../../types';

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

  // Mock data - replace with route params or API call
  useEffect(() => {
    const mockRide: ActiveRide = {
      id: '1',
      riderId: 'r1',
      passengerName: 'John Doe',
      passengerPhone: '+1234567890',
      passengerRating: 4.8,
      pickupAddress: '123 Main Street, Downtown',
      dropoffAddress: '456 Park Avenue, Uptown',
      pickupLocation: { latitude: 40.7128, longitude: -74.0060 },
      dropoffLocation: { latitude: 40.7589, longitude: -73.9851 },
      status: 'in-progress',
      fare: 15.50,
      distance: 5.2,
      currentStatus: 'picking-up',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setActiveRide(mockRide);
  }, []);

  const handleArrived = () => {
    Alert.alert(
      'Arrived at Pickup?',
      'Confirm that you have arrived at the pickup location.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setRideStatus('arrived');
            // TODO: API call to update ride status
          },
        },
      ]
    );
  };

  const handleStartRide = () => {
    Alert.alert(
      'Start Ride?',
      'The passenger is in the vehicle. Start the trip.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Ride',
          onPress: () => {
            setRideStatus('in-progress');
            // TODO: API call to start ride
          },
        },
      ]
    );
  };

  const handleCompleteRide = () => {
    Alert.alert(
      'Complete Ride?',
      'Confirm that the passenger has reached their destination.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            // TODO: API call to complete ride
            Alert.alert('Success', 'Ride completed! Fare: $15.50');
          },
        },
      ]
    );
  };

  if (!activeRide) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active ride</Text>
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
  },
});


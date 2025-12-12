import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components';
import { Ride } from '../../types';
import api from '../../services/api';

interface RideRequest extends Ride {
  passengerName: string;
  passengerRating: number;
  estimatedFare: number;
  estimatedDistance: string;
  estimatedTime: string;
  pickupAddress: string;
  dropoffAddress: string;
}

export default function RideRequestsScreen() {
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRideRequests();
  }, []);

  const loadRideRequests = async () => {
    try {
      setRefreshing(true);
      const response = await api.get('/rides/driver/requests');
      if (response.data.success) {
        const rides = response.data.rides || [];
        const formattedRequests: RideRequest[] = rides.map((ride: any) => ({
          id: ride.id,
          riderId: ride.riderId,
          passengerName: ride.rider?.name || 'Passenger',
          passengerRating: ride.rider?.rating || 0,
          estimatedFare: ride.totalFare || 0,
          estimatedDistance: ride.estimatedDistance ? `${ride.estimatedDistance.toFixed(1)} km` : 'N/A',
          estimatedTime: ride.estimatedDuration ? `${ride.estimatedDuration} min` : 'N/A',
          pickupAddress: ride.pickupLocation?.address || 'Pickup location',
          dropoffAddress: ride.dropoffLocation?.address || 'Dropoff location',
          pickupLocation: ride.pickupLocation,
          dropoffLocation: ride.dropoffLocation,
          status: ride.status,
          fare: ride.totalFare || 0,
          distance: ride.estimatedDistance || 0,
          createdAt: ride.createdAt,
          updatedAt: ride.updatedAt,
        }));
        setRideRequests(formattedRequests);
      }
    } catch (error: any) {
      console.error('Error loading ride requests:', error);
      setRideRequests([]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAccept = async (rideId: string) => {
    Alert.alert(
      'Accept Ride?',
      'You will be assigned to this ride request.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await api.post(`/rides/${rideId}/accept`);
              setRideRequests(prev => prev.filter(r => r.id !== rideId));
              Alert.alert('Success', 'Ride accepted! Navigate to pickup location.');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to accept ride');
            }
          },
        },
      ]
    );
  };

  const handleDecline = async (rideId: string) => {
    Alert.alert(
      'Decline Ride?',
      'This ride request will be declined.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.post(`/rides/${rideId}/cancel`, {
                reason: 'Driver declined',
              });
              setRideRequests(prev => prev.filter(r => r.id !== rideId));
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to decline ride');
            }
          },
        },
      ]
    );
  };

  const renderRideRequest = ({ item }: { item: RideRequest }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={styles.passengerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.passengerName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.passengerName}>{item.passengerName}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.rating}>{item.passengerRating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.fareContainer}>
          <Text style={styles.fareAmount}>${item.estimatedFare.toFixed(2)}</Text>
          <Text style={styles.fareLabel}>Est. Fare</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoint}>
          <View style={styles.pickupDot} />
          <View style={styles.routeText}>
            <Text style={styles.routeLabel}>Pickup</Text>
            <Text style={styles.routeAddress}>{item.pickupAddress}</Text>
          </View>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routePoint}>
          <View style={styles.dropoffDot} />
          <View style={styles.routeText}>
            <Text style={styles.routeLabel}>Dropoff</Text>
            <Text style={styles.routeAddress}>{item.dropoffAddress}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rideDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📏</Text>
          <Text style={styles.detailText}>{item.estimatedDistance}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>⏱️</Text>
          <Text style={styles.detailText}>{item.estimatedTime}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => handleDecline(item.id)}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAccept(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ride Requests</Text>
        <Text style={styles.subtitle}>
          {rideRequests.length} new request{rideRequests.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {rideRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={styles.emptyText}>No ride requests</Text>
          <Text style={styles.emptySubtext}>
            New ride requests will appear here when you're online
          </Text>
        </View>
      ) : (
        <FlatList
          data={rideRequests}
          renderItem={renderRideRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadRideRequests} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 15,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  fareContainer: {
    alignItems: 'flex-end',
  },
  fareAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 2,
  },
  fareLabel: {
    fontSize: 12,
    color: '#666',
  },
  routeContainer: {
    marginBottom: 15,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    marginRight: 12,
    marginTop: 4,
  },
  dropoffDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    marginRight: 12,
    marginTop: 4,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#ddd',
    marginLeft: 5,
    marginVertical: 5,
  },
  routeText: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  rideDetails: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

















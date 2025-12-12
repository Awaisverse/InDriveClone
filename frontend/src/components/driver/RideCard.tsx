import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ride } from '../../types';

interface RideCardProps {
  ride: Ride;
  onPress?: () => void;
  showActions?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({
  ride,
  onPress,
  showActions = false,
  onAccept,
  onDecline,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.rideInfo}>
          <Text style={styles.rideId}>Ride #{ride.id}</Text>
          <Text style={styles.rideStatus}>{ride.status}</Text>
        </View>
        <Text style={styles.fare}>${ride.fare.toFixed(2)}</Text>
      </View>

      <View style={styles.route}>
        <View style={styles.routePoint}>
          <View style={styles.pickupDot} />
          <Text style={styles.routeText}>Pickup Location</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routePoint}>
          <View style={styles.dropoffDot} />
          <Text style={styles.routeText}>Dropoff Location</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detail}>📏 {ride.distance} km</Text>
        <Text style={styles.detail}>⏱️ {new Date(ride.createdAt).toLocaleTimeString()}</Text>
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={onDecline}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={onAccept}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rideInfo: {
    flex: 1,
  },
  rideId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  rideStatus: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  fare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
  },
  route: {
    marginBottom: 15,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759',
    marginRight: 10,
  },
  dropoffDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    marginRight: 10,
  },
  routeLine: {
    width: 2,
    height: 15,
    backgroundColor: '#ddd',
    marginLeft: 4,
    marginBottom: 10,
  },
  routeText: {
    fontSize: 14,
    color: '#666',
  },
  details: {
    flexDirection: 'row',
    gap: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detail: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    padding: 12,
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
  declineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});





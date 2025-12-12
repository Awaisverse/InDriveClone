import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Trip {
  id: string;
  date: string;
  time: string;
  passengerName: string;
  pickupAddress: string;
  dropoffAddress: string;
  fare: number;
  distance: number;
  duration: number;
  rating: number;
  status: 'completed' | 'cancelled';
}

export default function TripHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const trips: Trip[] = [
    {
      id: '1',
      date: '2024-01-15',
      time: '10:30 AM',
      passengerName: 'John Doe',
      pickupAddress: '123 Main St',
      dropoffAddress: '456 Park Ave',
      fare: 18.50,
      distance: 6.2,
      duration: 15,
      rating: 5,
      status: 'completed',
    },
    {
      id: '2',
      date: '2024-01-15',
      time: '2:15 PM',
      passengerName: 'Jane Smith',
      pickupAddress: '789 Oak St',
      dropoffAddress: '321 Elm St',
      fare: 22.00,
      distance: 8.5,
      duration: 20,
      rating: 4,
      status: 'completed',
    },
  ];

  const renderTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View>
          <Text style={styles.tripDate}>{item.date}</Text>
          <Text style={styles.tripTime}>{item.time}</Text>
        </View>
        <View style={styles.fareContainer}>
          <Text style={styles.fare}>${item.fare.toFixed(2)}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
      </View>

      <View style={styles.passengerInfo}>
        <Text style={styles.passengerName}>{item.passengerName}</Text>
      </View>

      <View style={styles.route}>
        <View style={styles.routePoint}>
          <View style={styles.pickupDot} />
          <Text style={styles.routeAddress}>{item.pickupAddress}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routePoint}>
          <View style={styles.dropoffDot} />
          <Text style={styles.routeAddress}>{item.dropoffAddress}</Text>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <Text style={styles.detail}>📏 {item.distance} km</Text>
        <Text style={styles.detail}>⏱️ {item.duration} min</Text>
        <View style={[styles.statusBadge, item.status === 'completed' && styles.statusCompleted]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Trip History</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'today', 'week', 'month'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trips found</Text>
          </View>
        }
      />
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
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 15,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tripDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  tripTime: {
    fontSize: 12,
    color: '#666',
  },
  fareContainer: {
    alignItems: 'flex-end',
  },
  fare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 5,
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
    fontSize: 12,
    color: '#666',
  },
  passengerInfo: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
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
  routeAddress: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detail: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginLeft: 'auto',
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});





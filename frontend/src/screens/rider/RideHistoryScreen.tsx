import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockRideHistory = [
  {
    id: '1',
    route: 'Downtown → Airport',
    date: 'Today, 2:30 PM',
    fare: 25.50,
    status: 'completed',
    driver: 'John Driver',
    rating: 5,
  },
  {
    id: '2',
    route: 'Home → Mall',
    date: 'Yesterday, 5:15 PM',
    fare: 18.00,
    status: 'completed',
    driver: 'Jane Smith',
    rating: 4,
  },
  {
    id: '3',
    route: 'Office → Restaurant',
    date: 'Dec 7, 12:00 PM',
    fare: 12.50,
    status: 'completed',
    driver: 'Mike Johnson',
    rating: 5,
  },
];

export default function RideHistoryScreen() {
  const renderRideItem = ({ item }: any) => (
    <TouchableOpacity style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <Text style={styles.rideRoute}>{item.route}</Text>
        <Text style={styles.rideFare}>${item.fare.toFixed(2)}</Text>
      </View>
      <Text style={styles.rideDate}>{item.date}</Text>
      <View style={styles.rideFooter}>
        <Text style={styles.driverName}>Driver: {item.driver}</Text>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ride History</Text>
      </View>
      <FlatList
        data={mockRideHistory}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No ride history yet</Text>
            <Text style={styles.emptySubtext}>Book your first ride to get started!</Text>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    padding: 15,
  },
  rideCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
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
    marginBottom: 8,
  },
  rideRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  rideFare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  rideDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});













import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';

interface EarningsData {
  today: number;
  week: number;
  month: number;
  total: number;
}

interface Trip {
  id: string;
  date: string;
  fare: number;
  distance: number;
  passengerName: string;
  rating: number;
}

export default function EarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [earnings, setEarnings] = useState<EarningsData>({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, [selectedPeriod]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rides/driver/history?limit=100');
      if (response.data.success) {
        const rides = response.data.rides || [];
        
        // Calculate earnings by period
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const completedRides = rides.filter((r: any) => r.status === 'completed');
        
        const todayEarnings = completedRides
          .filter((r: any) => new Date(r.completedAt) >= today)
          .reduce((sum: number, r: any) => sum + (r.driverEarnings || 0), 0);
        
        const weekEarnings = completedRides
          .filter((r: any) => new Date(r.completedAt) >= weekAgo)
          .reduce((sum: number, r: any) => sum + (r.driverEarnings || 0), 0);
        
        const monthEarnings = completedRides
          .filter((r: any) => new Date(r.completedAt) >= monthAgo)
          .reduce((sum: number, r: any) => sum + (r.driverEarnings || 0), 0);
        
        const totalEarnings = completedRides
          .reduce((sum: number, r: any) => sum + (r.driverEarnings || 0), 0);

        setEarnings({
          today: todayEarnings,
          week: weekEarnings,
          month: monthEarnings,
          total: totalEarnings,
        });

        // Format trips for display
        const formattedTrips: Trip[] = completedRides.slice(0, 10).map((ride: any) => ({
          id: ride.id,
          date: new Date(ride.completedAt).toLocaleDateString(),
          fare: ride.driverEarnings || 0,
          distance: ride.actualDistance || ride.estimatedDistance || 0,
          passengerName: 'Passenger', // TODO: Get rider name from ride
          rating: ride.driverRating || 0,
        }));

        setTrips(formattedTrips);
      }
    } catch (error: any) {
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEarnings = () => {
    switch (selectedPeriod) {
      case 'today':
        return earnings.today;
      case 'week':
        return earnings.week;
      case 'month':
        return earnings.month;
      default:
        return earnings.today;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'today' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('today')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'today' && styles.periodTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
              This Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryAmount}>${getEarnings().toFixed(2)}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{trips.length}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              ${trips.length > 0 ? (getEarnings() / trips.length).toFixed(2) : '0.00'}
            </Text>
            <Text style={styles.statLabel}>Avg. per Trip</Text>
          </View>
        </View>

        {/* Trip History */}
        <View style={styles.tripsSection}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          {trips.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View>
                  <Text style={styles.tripDate}>{trip.date}</Text>
                  <Text style={styles.tripPassenger}>{trip.passengerName}</Text>
                </View>
                <Text style={styles.tripFare}>${trip.fare.toFixed(2)}</Text>
              </View>
              <View style={styles.tripDetails}>
                <Text style={styles.tripDetail}>📏 {trip.distance} km</Text>
                <Text style={styles.tripDetail}>⭐ {trip.rating}</Text>
              </View>
            </View>
          ))}
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
  scrollView: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  periodTextActive: {
    color: '#fff',
  },
  summaryCard: {
    margin: 15,
    padding: 30,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 10,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tripsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tripDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  tripPassenger: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  tripFare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
  },
  tripDetails: {
    flexDirection: 'row',
    gap: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tripDetail: {
    fontSize: 14,
    color: '#666',
  },
});

















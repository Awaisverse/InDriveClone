import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [earnings] = useState<EarningsData>({
    today: 125.50,
    week: 850.75,
    month: 3200.00,
    total: 12500.00,
  });

  const [trips] = useState<Trip[]>([
    {
      id: '1',
      date: '2024-01-15',
      fare: 18.50,
      distance: 6.2,
      passengerName: 'John Doe',
      rating: 5,
    },
    {
      id: '2',
      date: '2024-01-15',
      fare: 22.00,
      distance: 8.5,
      passengerName: 'Jane Smith',
      rating: 4,
    },
  ]);

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
              ${(getEarnings() / trips.length).toFixed(2)}
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



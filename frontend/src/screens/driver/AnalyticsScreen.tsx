import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const stats = {
    totalRides: 156,
    totalEarnings: 2340.50,
    averageRating: 4.8,
    acceptanceRate: 94,
    cancellationRate: 6,
    averageFare: 15.00,
    totalDistance: 1245.5,
    onlineHours: 120,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.totalRides}</Text>
            <Text style={styles.metricLabel}>Total Rides</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>${stats.totalEarnings.toFixed(2)}</Text>
            <Text style={styles.metricLabel}>Total Earnings</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.averageRating}</Text>
            <Text style={styles.metricLabel}>Avg Rating</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.acceptanceRate}%</Text>
            <Text style={styles.metricLabel}>Acceptance</Text>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Average Fare</Text>
            <Text style={styles.statValue}>${stats.averageFare.toFixed(2)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Distance</Text>
            <Text style={styles.statValue}>{stats.totalDistance} km</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Online Hours</Text>
            <Text style={styles.statValue}>{stats.onlineHours} hrs</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Cancellation Rate</Text>
            <Text style={styles.statValue}>{stats.cancellationRate}%</Text>
          </View>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Earnings Trend</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>📊 Chart will be displayed here</Text>
            <Text style={styles.chartSubtext}>Integration with chart library needed</Text>
          </View>
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
    backgroundColor: '#fff',
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  periodTextActive: {
    color: '#fff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  statsSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  chartSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  chartSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

















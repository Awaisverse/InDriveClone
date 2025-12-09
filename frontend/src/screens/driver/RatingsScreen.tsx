import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RatingDisplay } from '../../components/driver/RatingDisplay';

interface Review {
  id: string;
  passengerName: string;
  rating: number;
  comment: string;
  date: string;
  tripId: string;
}

export default function RatingsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  const reviews: Review[] = [
    {
      id: '1',
      passengerName: 'John Doe',
      rating: 5,
      comment: 'Excellent driver! Very professional and safe.',
      date: '2024-01-15',
      tripId: 'trip-123',
    },
    {
      id: '2',
      passengerName: 'Jane Smith',
      rating: 5,
      comment: 'Great service, arrived on time.',
      date: '2024-01-14',
      tripId: 'trip-124',
    },
    {
      id: '3',
      passengerName: 'Mike Johnson',
      rating: 4,
      comment: 'Good driver, clean car.',
      date: '2024-01-13',
      tripId: 'trip-125',
    },
  ];

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const filteredReviews = selectedFilter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === parseInt(selectedFilter));

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.passengerName}>{item.passengerName}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        <RatingDisplay rating={item.rating} size="small" />
      </View>
      {item.comment && (
        <Text style={styles.comment}>{item.comment}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ratings & Reviews</Text>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Rating Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
                <RatingDisplay rating={averageRating} totalReviews={reviews.length} size="large" />
              </View>

              {/* Rating Distribution */}
              <View style={styles.distribution}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <View key={rating} style={styles.distributionRow}>
                    <Text style={styles.distributionLabel}>{rating} ⭐</Text>
                    <View style={styles.distributionBar}>
                      <View
                        style={[
                          styles.distributionFill,
                          {
                            width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.distributionCount}>
                      {ratingDistribution[rating as keyof typeof ratingDistribution]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              {(['all', '5', '4', '3', '2', '1'] as const).map((filter) => (
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
                    {filter === 'all' ? 'All' : `${filter} ⭐`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        data={filteredReviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reviews found</Text>
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
  summaryCard: {
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
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  distribution: {
    marginTop: 10,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  distributionLabel: {
    width: 50,
    fontSize: 14,
    color: '#666',
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  distributionCount: {
    width: 30,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    backgroundColor: '#fff',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 15,
  },
  reviewCard: {
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
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  comment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 5,
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


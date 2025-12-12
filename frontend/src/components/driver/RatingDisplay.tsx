import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingDisplayProps {
  rating: number;
  totalReviews?: number;
  size?: 'small' | 'medium' | 'large';
  showNumber?: boolean;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  totalReviews,
  size = 'medium',
  showNumber = true,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSize = size === 'small' ? 12 : size === 'large' ? 20 : 16;
  const fontSize = size === 'small' ? 12 : size === 'large' ? 18 : 14;

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Text key={i} style={[styles.star, { fontSize: starSize }]}>
            ⭐
          </Text>
        ))}
        {hasHalfStar && (
          <Text style={[styles.star, { fontSize: starSize }]}>⭐</Text>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Text key={i} style={[styles.star, styles.emptyStar, { fontSize: starSize }]}>
            ⭐
          </Text>
        ))}
      </View>
      {showNumber && (
        <Text style={[styles.ratingText, { fontSize }]}>
          {rating.toFixed(1)}
        </Text>
      )}
      {totalReviews && (
        <Text style={[styles.reviewsText, { fontSize: fontSize - 2 }]}>
          ({totalReviews})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    color: '#FFD700',
  },
  emptyStar: {
    opacity: 0.3,
  },
  ratingText: {
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
  },
  reviewsText: {
    color: '#666',
    marginLeft: 4,
  },
});

















import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components';
import { VehicleType } from '../../types/rider';

export default function BookRideScreen() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('economy');
  const [estimatedFare, setEstimatedFare] = useState(0);

  const vehicleTypes: { type: VehicleType; name: string; icon: string; price: string }[] = [
    { type: 'economy', name: 'Economy', icon: '🚗', price: '$' },
    { type: 'comfort', name: 'Comfort', icon: '🚙', price: '$$' },
    { type: 'premium', name: 'Premium', icon: '✨', price: '$$$' },
    { type: 'luxury', name: 'Luxury', icon: '👑', price: '$$$$' },
    { type: 'xl', name: 'XL', icon: '🚐', price: '$$' },
  ];

  const handleBookRide = () => {
    if (!pickup || !destination) {
      Alert.alert('Error', 'Please enter both pickup and destination locations');
      return;
    }
    Alert.alert('Ride Booked', 'Your ride request has been sent to nearby drivers!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Book a Ride</Text>
        </View>

        {/* Location Inputs */}
        <View style={styles.locationSection}>
          <View style={styles.locationInput}>
            <Text style={styles.locationLabel}>📍 Pickup Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter pickup address"
              value={pickup}
              onChangeText={setPickup}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.locationInput}>
            <Text style={styles.locationLabel}>🎯 Destination</Text>
            <TextInput
              style={styles.input}
              placeholder="Where do you want to go?"
              value={destination}
              onChangeText={setDestination}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Vehicle Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Vehicle Type</Text>
          <View style={styles.vehicleGrid}>
            {vehicleTypes.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.type}
                style={[
                  styles.vehicleCard,
                  selectedVehicle === vehicle.type && styles.vehicleCardSelected,
                ]}
                onPress={() => setSelectedVehicle(vehicle.type)}
              >
                <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                <Text
                  style={[
                    styles.vehicleName,
                    selectedVehicle === vehicle.type && styles.vehicleNameSelected,
                  ]}
                >
                  {vehicle.name}
                </Text>
                <Text
                  style={[
                    styles.vehiclePrice,
                    selectedVehicle === vehicle.type && styles.vehiclePriceSelected,
                  ]}
                >
                  {vehicle.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ride Estimate */}
        {pickup && destination && (
          <View style={styles.estimateCard}>
            <Text style={styles.estimateTitle}>Estimated Fare</Text>
            <Text style={styles.estimateAmount}>${estimatedFare.toFixed(2)}</Text>
            <Text style={styles.estimateDetails}>Distance: ~5.2 km • Time: ~15 min</Text>
          </View>
        )}

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity style={styles.paymentCard}>
              <Text style={styles.paymentIcon}>💳</Text>
              <Text style={styles.paymentText}>Card •••• 1234</Text>
              <Text style={styles.paymentCheck}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentCard}>
              <Text style={styles.paymentIcon}>💵</Text>
              <Text style={styles.paymentText}>Cash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Book Button */}
        <View style={styles.bookButtonContainer}>
          <Button
            title="Book Ride"
            onPress={handleBookRide}
            variant="primary"
            disabled={!pickup || !destination}
          />
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  locationSection: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  locationInput: {
    marginBottom: 15,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  section: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  vehicleCard: {
    width: '30%',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vehicleCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  vehicleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  vehicleNameSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  vehiclePrice: {
    fontSize: 12,
    color: '#999',
  },
  vehiclePriceSelected: {
    color: '#007AFF',
  },
  estimateCard: {
    margin: 15,
    padding: 20,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  estimateTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 5,
  },
  estimateAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  estimateDetails: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  paymentMethods: {
    gap: 10,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  paymentCheck: {
    fontSize: 20,
    color: '#34C759',
  },
  bookButtonContainer: {
    padding: 15,
    marginBottom: 20,
  },
});













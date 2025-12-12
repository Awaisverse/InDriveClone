import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../components';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function DriverInfoScreen({ onComplete }: { onComplete: () => void }) {
  const { user, login: loginStore } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    licenseExpiry: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    plateNumber: '',
    vehicleType: 'sedan' as 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'van',
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.licenseNumber || !formData.vehicleMake || !formData.vehicleModel) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Update user with driver profile
      const driverProfile = {
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry || undefined,
        vehicleInfo: {
          make: formData.vehicleMake,
          model: formData.vehicleModel,
          year: formData.vehicleYear ? parseInt(formData.vehicleYear) : undefined,
          color: formData.vehicleColor || undefined,
          plateNumber: formData.plateNumber || undefined,
          vehicleType: formData.vehicleType,
        },
        isActive: false, // Start as inactive until verified
      };

      const response = await api.put(`/auth/profile`, {
        driverProfile,
      });

      if (response.data.success) {
        // Update user in store with new driver profile
        if (user && response.data.user) {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const token = await AsyncStorage.getItem('@rideshare:auth_token');
          if (token) {
            // Update user data with new driver profile
            await AsyncStorage.setItem('@rideshare:user_data', JSON.stringify(response.data.user));
            await loginStore(response.data.user, token);
          }
        }
        Alert.alert('Success', 'Driver information saved! You can now switch to driver mode.');
        onComplete();
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save driver information. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Driver Information</Text>
            <Text style={styles.subtitle}>
              Please provide your driver license and vehicle information to complete your driver
              profile.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>License Information</Text>
            <Input
              label="License Number *"
              placeholder="Enter your license number"
              value={formData.licenseNumber}
              onChangeText={(text) => setFormData({ ...formData, licenseNumber: text })}
              autoCapitalize="characters"
            />

            <Input
              label="License Expiry Date"
              placeholder="YYYY-MM-DD"
              value={formData.licenseExpiry}
              onChangeText={(text) => setFormData({ ...formData, licenseExpiry: text })}
            />

            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            <Input
              label="Vehicle Make *"
              placeholder="e.g., Toyota, Honda"
              value={formData.vehicleMake}
              onChangeText={(text) => setFormData({ ...formData, vehicleMake: text })}
              autoCapitalize="words"
            />

            <Input
              label="Vehicle Model *"
              placeholder="e.g., Camry, Accord"
              value={formData.vehicleModel}
              onChangeText={(text) => setFormData({ ...formData, vehicleModel: text })}
              autoCapitalize="words"
            />

            <Input
              label="Vehicle Year"
              placeholder="e.g., 2020"
              value={formData.vehicleYear}
              onChangeText={(text) => setFormData({ ...formData, vehicleYear: text })}
              keyboardType="numeric"
            />

            <Input
              label="Vehicle Color"
              placeholder="e.g., Red, Blue"
              value={formData.vehicleColor}
              onChangeText={(text) => setFormData({ ...formData, vehicleColor: text })}
              autoCapitalize="words"
            />

            <Input
              label="License Plate Number"
              placeholder="Enter plate number"
              value={formData.plateNumber}
              onChangeText={(text) => setFormData({ ...formData, plateNumber: text })}
              autoCapitalize="characters"
            />

            <Text style={styles.infoText}>
              * Required fields. Your driver profile will be reviewed before you can start
              accepting rides.
            </Text>

            <Button
              title="Save Driver Information"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 18,
  },
});


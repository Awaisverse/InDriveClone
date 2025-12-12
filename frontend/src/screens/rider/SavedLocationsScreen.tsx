import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockSavedLocations = [
  { id: '1', name: 'Home', address: '123 Main St, City', icon: '🏠', type: 'home' },
  { id: '2', name: 'Work', address: '456 Business Ave', icon: '💼', type: 'work' },
  { id: '3', name: 'Gym', address: '789 Fitness Rd', icon: '💪', type: 'favorite' },
  { id: '4', name: 'Airport', address: 'International Airport', icon: '✈️', type: 'favorite' },
];

export default function SavedLocationsScreen() {
  const renderLocation = ({ item }: any) => (
    <TouchableOpacity style={styles.locationCard}>
      <Text style={styles.locationIcon}>{item.icon}</Text>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Locations</Text>
        <TouchableOpacity>
          <Text style={styles.addButton}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={mockSavedLocations}
        renderItem={renderLocation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  locationIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});













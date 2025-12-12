import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../components';
import { Vehicle } from '../../types/driver';

export default function VehicleInfoScreen() {
  const [vehicle, setVehicle] = useState<Vehicle>({
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'White',
    licensePlate: 'ABC-1234',
    type: 'sedan',
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Vehicle Information</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Vehicle Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageIcon}>🚗</Text>
            <Text style={styles.imageText}>Vehicle Photo</Text>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Vehicle Details */}
        <View style={styles.detailsSection}>
          <Input
            label="Make"
            value={vehicle.make}
            editable={isEditing}
            onChangeText={(text) => setVehicle({ ...vehicle, make: text })}
          />
          <Input
            label="Model"
            value={vehicle.model}
            editable={isEditing}
            onChangeText={(text) => setVehicle({ ...vehicle, model: text })}
          />
          <Input
            label="Year"
            value={vehicle.year.toString()}
            editable={isEditing}
            keyboardType="numeric"
            onChangeText={(text) => setVehicle({ ...vehicle, year: parseInt(text) || 2020 })}
          />
          <Input
            label="Color"
            value={vehicle.color}
            editable={isEditing}
            onChangeText={(text) => setVehicle({ ...vehicle, color: text })}
          />
          <Input
            label="License Plate"
            value={vehicle.licensePlate}
            editable={isEditing}
            onChangeText={(text) => setVehicle({ ...vehicle, licensePlate: text })}
          />

          {/* Vehicle Type */}
          <View style={styles.typeContainer}>
            <Text style={styles.typeLabel}>Vehicle Type</Text>
            <View style={styles.typeButtons}>
              {(['sedan', 'suv', 'van', 'luxury'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    vehicle.type === type && styles.typeButtonActive,
                    !isEditing && styles.typeButtonDisabled,
                  ]}
                  onPress={() => isEditing && setVehicle({ ...vehicle, type })}
                  disabled={!isEditing}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      vehicle.type === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Documents Section */}
        <View style={styles.documentsSection}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <View style={styles.documentItem}>
            <Text style={styles.documentIcon}>📄</Text>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>Registration Certificate</Text>
              <Text style={styles.documentStatus}>Verified ✓</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewButton}>View</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.documentItem}>
            <Text style={styles.documentIcon}>📄</Text>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>Insurance</Text>
              <Text style={styles.documentStatus}>Verified ✓</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewButton}>View</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.documentItem}>
            <Text style={styles.documentIcon}>📄</Text>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>Driver License</Text>
              <Text style={styles.documentStatus}>Verified ✓</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewButton}>View</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  editButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imageIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  imageText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  uploadButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  uploadText: {
    color: '#fff',
    fontWeight: '600',
  },
  detailsSection: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  typeContainer: {
    marginTop: 10,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonDisabled: {
    opacity: 0.5,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  documentsSection: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  documentIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  documentStatus: {
    fontSize: 12,
    color: '#34C759',
  },
  viewButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});





import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function DriverMapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [pickupLocation, setPickupLocation] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
  });
  const [dropoffLocation, setDropoffLocation] = useState({
    latitude: 40.7589,
    longitude: -73.9851,
  });
  const [hasActiveRide, setHasActiveRide] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const region = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
      >
        {/* Driver Location */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            pinColor="#007AFF"
          />
        )}

        {/* Pickup Location */}
        {hasActiveRide && (
          <>
            <Marker
              coordinate={pickupLocation}
              title="Pickup Location"
              pinColor="#34C759"
            />
            <Marker
              coordinate={dropoffLocation}
              title="Dropoff Location"
              pinColor="#FF3B30"
            />
            <Polyline
              coordinates={[pickupLocation, dropoffLocation]}
              strokeColor="#007AFF"
              strokeWidth={3}
            />
          </>
        )}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlIcon}>📍</Text>
          <Text style={styles.controlText}>Center</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlIcon}>🔍</Text>
          <Text style={styles.controlText}>Zoom</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlIcon: {
    fontSize: 20,
  },
  controlText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
});


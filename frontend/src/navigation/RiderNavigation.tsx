import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RiderHomeScreen from '../screens/rider/RiderHomeScreen';
import BookRideScreen from '../screens/rider/BookRideScreen';
import RideHistoryScreen from '../screens/rider/RideHistoryScreen';
import RiderProfileScreen from '../screens/rider/RiderProfileScreen';
import SavedLocationsScreen from '../screens/rider/SavedLocationsScreen';

const Tab = createBottomTabNavigator();

export default function RiderNavigation() {
  return (
    <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={RiderHomeScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen
          name="Book"
          component={BookRideScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🚗</Text>,
            tabBarLabel: 'Book Ride',
          }}
        />
        <Tab.Screen
          name="History"
          component={RideHistoryScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📋</Text>,
            tabBarLabel: 'History',
          }}
        />
        <Tab.Screen
          name="Saved"
          component={SavedLocationsScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⭐</Text>,
            tabBarLabel: 'Saved',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={RiderProfileScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
  );
}


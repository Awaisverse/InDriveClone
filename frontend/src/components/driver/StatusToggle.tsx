import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

interface StatusToggleProps {
  isOnline: boolean;
  onToggle: (value: boolean) => void;
  showLabel?: boolean;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({
  isOnline,
  onToggle,
  showLabel = true,
}) => {
  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <View style={[styles.statusDot, isOnline && styles.statusDotActive]} />
          <Text style={styles.label}>
            {isOnline ? "You're Online" : "You're Offline"}
          </Text>
        </View>
      )}
      <Switch
        value={isOnline}
        onValueChange={onToggle}
        trackColor={{ false: '#ddd', true: '#34C759' }}
        thumbColor="#fff"
        ios_backgroundColor="#ddd"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#999',
    marginRight: 10,
  },
  statusDotActive: {
    backgroundColor: '#34C759',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});





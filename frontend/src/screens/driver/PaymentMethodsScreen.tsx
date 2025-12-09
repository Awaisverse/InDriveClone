import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components';

interface PaymentMethod {
  id: string;
  type: 'bank' | 'paypal' | 'cash';
  name: string;
  details: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'bank',
      name: 'Bank Account',
      details: '****1234',
      isDefault: true,
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal',
      details: 'driver@example.com',
      isDefault: false,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return '🏦';
      case 'paypal':
        return '💳';
      default:
        return '💰';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Methods</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {paymentMethods.map((method) => (
          <View key={method.id} style={styles.methodCard}>
            <View style={styles.methodInfo}>
              <Text style={styles.methodIcon}>{getIcon(method.type)}</Text>
              <View style={styles.methodDetails}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodDetailsText}>{method.details}</Text>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.addSection}>
          <Button
            title="Add Payment Method"
            onPress={() => {}}
            variant="outline"
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Payment Schedule</Text>
          <Text style={styles.infoText}>
            Earnings are automatically transferred to your default payment method every week.
          </Text>
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
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    marginBottom: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  methodDetailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#34C759',
  },
  editButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  addSection: {
    padding: 15,
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});


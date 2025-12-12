import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Button, Input } from '../components';
import { useAuth } from '../hooks/useAuth';
import { validateRegisterForm } from '../utils/validation';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleRegister = async () => {
    const validation = validateRegisterForm(
      formData.name,
      formData.email,
      formData.password,
      formData.phone
    );

    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.error);
      return;
    }

    try {
      // Register as rider by default (no role selection needed)
      await register({
        ...formData,
        role: 'rider', // Always register as rider
      });

      // Success - redirect to login screen
      Alert.alert(
        'Success',
        'Account created successfully! Please sign in to continue.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        'Registration Failed',
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start booking rides today</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={text => setFormData({ ...formData, name: text })}
              autoCapitalize="words"
              autoComplete="name"
            />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={text => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={text => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
              autoComplete="tel"
            />

            <Input
              label="Password"
              placeholder="Create a password (min. 6 characters)"
              value={formData.password}
              onChangeText={text =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
              autoComplete="password-new"
            />

            <Text style={styles.infoText}>
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </Text>

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              disabled={
                isLoading ||
                !formData.name ||
                !formData.email ||
                !formData.phone ||
                !formData.password
              }
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Text style={styles.loginLinkText}>
                Already have an account?{' '}
                <Text style={styles.loginLinkBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Driver Option */}
          <View style={styles.driverOption}>
            <Text style={styles.driverOptionText}>Want to drive?</Text>
            <Text style={styles.driverOptionSubtext}>
              You can switch to driver mode after registration from your profile
              settings.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  form: {
    width: '100%',
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#999',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginLinkBold: {
    fontWeight: '600',
    color: '#007AFF',
  },
  driverOption: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
  },
  driverOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  driverOptionSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

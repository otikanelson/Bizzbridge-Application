/**
 * RegisterCustomer Screen
 * Requirements: 2.4, 2.7, 34.4, 34.9
 */

import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../../src/context/AuthContext';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { Picker } from '../../src/components/common/Picker';
import { useTheme } from '../../src/theme/ThemeContext';
import {
  getEmailError,
  getPasswordError,
  validateRequired,
  getRequiredError,
} from '../../src/utils/validation';
import { LAGOS_LGAS, getLocalitiesByLGA } from '../../src/constants/locations';

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  lga?: string;
}

export default function RegisterCustomer() {
  const router = useRouter();
  const { registerCustomer, loading } = useAuthContext();
  const { theme } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLga, setSelectedLga] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const lgaOptions = LAGOS_LGAS.map((lga) => ({ label: lga.name, value: lga.id }));
  const localityOptions = getLocalitiesByLGA(selectedLga).map((loc) => ({
    label: loc,
    value: loc,
  }));

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateRequired(fullName)) newErrors.fullName = getRequiredError('Full name');
    const emailErr = getEmailError(email);
    if (emailErr) newErrors.email = emailErr;
    const passwordErr = getPasswordError(password);
    if (passwordErr) newErrors.password = passwordErr;
    if (!validateRequired(selectedLga)) newErrors.lga = getRequiredError('Location (LGA)');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setSubmitError(null);
    if (!validate()) return;

    try {
      await registerCustomer({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        location: {
          lga: selectedLga,
          ...(selectedLocality ? { locality: selectedLocality } : {}),
        },
      });
      // Navigation handled by index.tsx via auth state change
    } catch (err: any) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleLgaChange = (value: string | number) => {
    setSelectedLga(String(value));
    setSelectedLocality(''); // Reset locality when LGA changes
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backText, { color: theme.colors.primary }]}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Customer Registration</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Create your customer account
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {submitError && (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: theme.colors.error + '20', borderColor: theme.colors.error },
              ]}
            >
              <Text style={[styles.errorBannerText, { color: theme.colors.error }]}>
                {submitError}
              </Text>
            </View>
          )}

          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            autoCapitalize="words"
            error={errors.fullName}
            accessibilityLabel="Full name"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            accessibilityLabel="Email address"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password (min. 6 characters)"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
            accessibilityLabel="Password"
          />

          <Picker
            label="Location (LGA)"
            value={selectedLga}
            onValueChange={handleLgaChange}
            options={lgaOptions}
            placeholder="Select your LGA"
            error={errors.lga}
          />

          {selectedLga && localityOptions.length > 0 && (
            <Picker
              label="Locality (Optional)"
              value={selectedLocality}
              onValueChange={(v) => setSelectedLocality(String(v))}
              options={localityOptions}
              placeholder="Select your locality"
            />
          )}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.submitButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    marginTop: 48,
    marginBottom: 8,
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },
  form: {
    marginBottom: 24,
  },
  errorBanner: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

/**
 * RegisterArtisan Screen
 * Requirements: 2.5, 2.7, 34.3, 34.4, 34.9
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
  getPhoneNumberError,
  validateRequired,
  getRequiredError,
} from '../../src/utils/validation';
import { LAGOS_LGAS, getLocalitiesByLGA } from '../../src/constants/locations';

interface FormErrors {
  contactName?: string;
  businessName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  lga?: string;
}

export default function RegisterArtisan() {
  const router = useRouter();
  const { registerArtisan, loading } = useAuthContext();
  const { theme } = useTheme();

  const [contactName, setContactName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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

    if (!validateRequired(contactName)) newErrors.contactName = getRequiredError('Contact name');
    if (!validateRequired(businessName)) newErrors.businessName = getRequiredError('Business name');
    const emailErr = getEmailError(email);
    if (emailErr) newErrors.email = emailErr;
    const passwordErr = getPasswordError(password);
    if (passwordErr) newErrors.password = passwordErr;
    const phoneErr = getPhoneNumberError(phoneNumber);
    if (phoneErr) newErrors.phoneNumber = phoneErr;
    if (!validateRequired(selectedLga)) newErrors.lga = getRequiredError('Location (LGA)');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setSubmitError(null);
    if (!validate()) return;

    try {
      await registerArtisan({
        contactName: contactName.trim(),
        businessName: businessName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
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
    setSelectedLocality('');
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
          <Text style={[styles.title, { color: theme.colors.text }]}>Artisan Registration</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Create your artisan business account
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
            label="Contact Name"
            value={contactName}
            onChangeText={setContactName}
            placeholder="Your full name"
            autoCapitalize="words"
            error={errors.contactName}
            accessibilityLabel="Contact name"
          />

          <Input
            label="Business Name"
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Your business or brand name"
            autoCapitalize="words"
            error={errors.businessName}
            accessibilityLabel="Business name"
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

          <Input
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="e.g. 08012345678"
            keyboardType="phone-pad"
            autoCapitalize="none"
            error={errors.phoneNumber}
            accessibilityLabel="Phone number"
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
            title="Create Artisan Account"
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

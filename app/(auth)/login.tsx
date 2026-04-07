/**
 * Login Screen
 * Requirements: 2.1, 2.3, 2.7, 34.1, 34.2, 34.4, 34.9
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthContext } from '../../src/context/AuthContext';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { useTheme } from '../../src/theme/ThemeContext';
import { getEmailError, getPasswordError } from '../../src/utils/validation';

export default function Login() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { login, loading } = useAuthContext();
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password);
    if (emailErr) newErrors.email = emailErr;
    if (passwordErr) newErrors.password = passwordErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setSubmitError(null);
    if (!validate()) return;

    try {
      await login({ email: email.trim(), password });
      // If a deep link redirect was provided, navigate there after login
      if (redirect) {
        router.replace(redirect as any);
      }
      // Otherwise navigation is handled by index.tsx via auth state change
    } catch (err: any) {
      setSubmitError(err.message || 'Login failed. Please try again.');
    }
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>BizBridge</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Welcome back
          </Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Sign in to your account
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
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
            accessibilityLabel="Password"
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.submitButton}
          />
        </View>

        {/* Footer links */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register-choice')}
            accessibilityRole="button"
            accessibilityLabel="Register"
          >
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Register
            </Text>
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
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
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

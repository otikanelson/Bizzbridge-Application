/**
 * RegisterChoice Screen
 * Lets users choose between customer and artisan registration
 * Requirements: 2.2
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components/common/Button';

export default function RegisterChoice() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
        <Text style={[styles.title, { color: theme.colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          How would you like to use BizBridge?
        </Text>
      </View>

      {/* Choice cards */}
      <View style={styles.cards}>
        {/* Customer card */}
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              ...theme.shadows.md,
            },
          ]}
          onPress={() => router.push('/(auth)/register-customer')}
          accessibilityRole="button"
          accessibilityLabel="Register as Customer"
        >
          <Text style={styles.cardIcon}>🛍️</Text>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Customer</Text>
          <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
            Browse and hire skilled artisans for your projects
          </Text>
          <View style={[styles.cardButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.cardButtonText}>Register as Customer</Text>
          </View>
        </TouchableOpacity>

        {/* Artisan card */}
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              ...theme.shadows.md,
            },
          ]}
          onPress={() => router.push('/(auth)/register-artisan')}
          accessibilityRole="button"
          accessibilityLabel="Register as Artisan"
        >
          <Text style={styles.cardIcon}>🔨</Text>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Artisan</Text>
          <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
            Showcase your craft and connect with customers
          </Text>
          <View
            style={[
              styles.cardButton,
              { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.colors.primary },
            ]}
          >
            <Text style={[styles.cardButtonText, { color: theme.colors.primary }]}>
              Register as Artisan
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Login link */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  cards: {
    flex: 1,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  cardButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

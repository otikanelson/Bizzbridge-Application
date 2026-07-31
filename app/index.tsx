import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://biz-bridge-marketplacebackend.vercel.app/api';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAndNavigate = async () => {
    setError(null);
    setLoading(true);

    try {
      console.log('Verifying API connection...');
      const healthRes = await fetch(`${API_BASE_URL}/health`);

      if (!healthRes.ok) {
        throw new Error(`Server returned status ${healthRes.status}`);
      }

      console.log('API reachable. Redirecting to home...');
      setLoading(false);
      
      router.replace('/(tabs)/home' as any);
    } catch (err: any) {
      console.log('Diagnostic check skipped or failed:', err.message);
      
      setError('Could not reach backend API. You can still proceed or retry.');
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAndNavigate();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading BizBridge...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Connection Issue</Text>
        <Text style={styles.errorSub}>{error}</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)/home' as any)}>
          <Text style={styles.buttonText}>Proceed Anyway</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={checkAndNavigate}>
          <Text style={styles.secondaryText}>Retry Diagnostics</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryText: {
    color: '#0066CC',
    fontWeight: '600',
    fontSize: 15,
  },
});
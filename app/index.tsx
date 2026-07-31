import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://biz-bridge-marketplacebackend.vercel.app/api';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyEndpoints = async (retries = 3, delay = 1000) => {
    setError(null);
    setLoading(true);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Testing Health Endpoint (Attempt ${attempt})...`);
        const healthRes = await fetch(`${API_BASE_URL}/health`);

        if (!healthRes.ok) {
          throw new Error(`Health status returned ${healthRes.status}`);
        }

        const healthData = await healthRes.json();
        console.log('Health Output:', JSON.stringify(healthData));

        console.log('Testing Services Endpoint...');
        const servicesRes = await fetch(`${API_BASE_URL}/services`);

        if (!servicesRes.ok) {
          throw new Error(`Services status returned ${servicesRes.status}`);
        }

        const servicesData = await servicesRes.json();
        console.log('Services Sample Count:', servicesData.count || servicesData.services?.length);

        setLoading(false);
        return;
      } catch (err: any) {
        console.log(`Fetch attempt ${attempt} failed:`, err.message);

        if (attempt === retries) {
          setError(err.message || 'Network request failed. Please check backend connection.');
          setLoading(false);
        } else {
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }
  };

  useEffect(() => {
    verifyEndpoints();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Connecting to BizBridge Services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorSub}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => verifyEndpoints()}>
          <Text style={styles.retryText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BizBridge Marketplace</Text>
      <Text style={styles.subtitle}>API connection verified successfully.</Text>
      
      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={() => router.replace('/(tabs)/home' as any)}
      >
        <Text style={styles.buttonText}>Continue to Home</Text>
      </TouchableOpacity>
    </View>
  );
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 24,
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
  retryButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
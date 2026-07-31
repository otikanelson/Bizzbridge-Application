import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/context/AuthContext';
import { getOnboardingCompleted } from '../src/utils/storage';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuthContext();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    getOnboardingCompleted().then((done) => {
      setOnboardingDone(done);
      setOnboardingChecked(true);
    });
  }, []);

  const verifyEndpoints = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log('Testing Health Endpoint...');
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/health`);
        if (response.ok) {
          const data = await response.json();
          console.log('Health Status:', response.status);
          console.log('Health Output:', JSON.stringify(data));
          return;
        }
      } catch (error) {
        if (i === retries - 1) {
          console.error('Diagnostic Fetch Failed:', error);
        } else {
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }
  };

  useEffect(() => {
    const verifyEndpoints = async () => {
      const baseUrl = 'https://biz-bridge-marketplacebackend.vercel.app/api';

      try {
        console.log('Testing Health Endpoint...');
        const healthRes = await fetch(`${baseUrl}/health`);
        console.log('Health Status:', healthRes.status);
        const healthData = await healthRes.json();
        console.log('Health Output:', healthData);

        console.log('Testing Services Endpoint...');
        const servicesRes = await fetch(`${baseUrl}/services`);
        console.log('Services Status:', servicesRes.status);
        const servicesData = await servicesRes.json();
        console.log('Services Output Sample:', servicesData);
      } catch (err: any) {
        console.error('Diagnostic Fetch Failed:', err.message);
      }
    };

    verifyEndpoints();
  }, []);

  useEffect(() => {
    if (loading || !onboardingChecked) return;

    if (!onboardingDone) {
      router.replace('/(auth)/onboarding');
      return;
    }

    if (isAuthenticated && user) {
      if (user.role === 'artisan') {
        router.replace('/(artisan)/');
      } else {
        router.replace('/(customer)/');
      }
    } else {
      // Allow guests to view customer screens without logging in
      router.replace('/(customer)/');
    }
  }, [loading, isAuthenticated, user, onboardingChecked, onboardingDone]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>BizBridge</Text>
      <Text style={styles.subtext}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DC143C',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtext: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
});
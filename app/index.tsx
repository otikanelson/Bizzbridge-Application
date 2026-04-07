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
      router.replace('/(auth)/login');
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

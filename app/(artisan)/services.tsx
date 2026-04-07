/**
 * Artisan My Services Screen - Requirements: 15.1-15.10
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { ServiceCard } from '../../src/components/service/ServiceCard';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { EmptyState } from '../../src/components/common/EmptyState';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import { getMyServices } from '../../src/services/service.service';
import { Service } from '../../src/types/models';

export default function MyServices() {
  const router = useRouter();
  const { theme } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const data = await getMyServices();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner fullScreen message="Loading services..." />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>My Services</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/service/add')}
          accessibilityLabel="Add new service"
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {error ? (
        <ErrorMessage message={error} onRetry={load} fullScreen />
      ) : (
        <FlatList
          data={services}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.colors.primary} />}
          ListEmptyComponent={
            <EmptyState
              icon="🛠️"
              title="No services yet"
              message="Add your first service to start receiving requests"
              action={{ label: 'Add Service', onPress: () => router.push('/service/add') }}
            />
          }
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              onPress={s => router.push({ pathname: '/service/[id]', params: { id: s._id } })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 20, borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '700' },
  addBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, paddingBottom: 32 },
});

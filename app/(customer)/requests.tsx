import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { RequestCard } from '../../src/components/request/RequestCard';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { EmptyState } from '../../src/components/common/EmptyState';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import { getMyRequests } from '../../src/services/serviceRequest.service';
import { ServiceRequest } from '../../src/types/models';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Declined', value: 'declined' },
  { label: 'Converted', value: 'converted' },
];

export default function Requests() {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const load = async () => {
    try {
      setError(null);
      const data = await getMyRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter ? requests.filter(r => r.status === filter) : requests;
  const statusBarPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || insets.top) : 0;

  if (loading) return <LoadingSpinner fullScreen message="Loading requests..." />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border, paddingTop: statusBarPadding + 16 }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>My Requests</Text>
      </View>

      <View style={[styles.filterRow, { borderBottomColor: theme.colors.border }]}>
        {STATUS_FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterTab, filter === f.value && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterTabText, { color: filter === f.value ? theme.colors.primary : theme.colors.textSecondary }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <ErrorMessage message={error} onRetry={load} fullScreen />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.colors.primary} />}
          ListEmptyComponent={<EmptyState icon="📨" title="No requests yet" message="Request a service to get started" />}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              viewerRole="customer"
              onPress={r => router.push({ pathname: '/request/[id]', params: { id: r._id } })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '700' },
  filterRow: { flexDirection: 'row', borderBottomWidth: 1 },
  filterTab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  filterTabText: { fontSize: 12, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 32 },
});
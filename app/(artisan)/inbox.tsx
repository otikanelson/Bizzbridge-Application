/**
 * Artisan Request Inbox Screen - Requirements: 13.1-13.10
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { RequestCard } from '../../src/components/request/RequestCard';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { EmptyState } from '../../src/components/common/EmptyState';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import { getInbox } from '../../src/services/serviceRequest.service';
import { ServiceRequest } from '../../src/types/models';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'New', value: 'pending' },
  { label: 'Viewed', value: 'viewed' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Declined', value: 'declined' },
];

export default function Inbox() {
  const router = useRouter();
  const { theme } = useTheme();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const load = async () => {
    try {
      setError(null);
      const data = await getInbox();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load inbox');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter ? requests.filter(r => r.status === filter) : requests;
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (loading) return <LoadingSpinner fullScreen message="Loading inbox..." />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Request Inbox</Text>
          {pendingCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.badgeText}>{pendingCount}</Text>
            </View>
          )}
        </View>
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
          ListEmptyComponent={<EmptyState icon="📬" title="Inbox is empty" message="Service requests from customers will appear here" />}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              viewerRole="artisan"
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
  header: { padding: 16, paddingTop: 20, borderBottomWidth: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  filterRow: { flexDirection: 'row', borderBottomWidth: 1 },
  filterTab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  filterTabText: { fontSize: 12, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 32 },
});

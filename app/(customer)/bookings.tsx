/**
 * Customer Bookings Screen - Requirements: 9.1-9.9
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { BookingCard } from '../../src/components/booking/BookingCard';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { EmptyState } from '../../src/components/common/EmptyState';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import { getMyBookings } from '../../src/services/booking.service';
import { Booking } from '../../src/types/models';
import { BOOKING_STATUSES } from '../../src/constants/statuses';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'in_progress' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function Bookings() {
  const router = useRouter();
  const { theme } = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const load = async () => {
    try {
      setError(null);
      const data = await getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter ? bookings.filter(b => b.status === filter) : bookings;

  if (loading) return <LoadingSpinner fullScreen message="Loading bookings..." />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>My Bookings</Text>
      </View>

      {/* Filter tabs */}
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
          ListEmptyComponent={<EmptyState icon="📅" title="No bookings yet" message="Your bookings will appear here" />}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              viewerRole="customer"
              onPress={b => router.push({ pathname: '/booking/[id]', params: { id: b._id } })}
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
  title: { fontSize: 22, fontWeight: '700' },
  filterRow: { flexDirection: 'row', borderBottomWidth: 1 },
  filterTab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  filterTabText: { fontSize: 12, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 32 },
});

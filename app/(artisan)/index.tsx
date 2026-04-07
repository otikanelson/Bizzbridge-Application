/**
 * Artisan Dashboard Screen - Requirements: 11.1-11.10, 66.1-66.10
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { useAuthContext } from '../../src/context/AuthContext';
import { BookingCard } from '../../src/components/booking/BookingCard';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { getMyWork } from '../../src/services/booking.service';
import { getAnalytics } from '../../src/services/booking.service';
import { Booking } from '../../src/types/models';
import { BookingAnalytics } from '../../src/types/api';

export default function ArtisanHome() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuthContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const firstName = user?.contactName?.split(' ')[0] || user?.businessName || 'Artisan';

  const load = async () => {
    try {
      const [work, stats] = await Promise.all([getMyWork(), getAnalytics()]);
      setBookings(work.slice(0, 5));
      setAnalytics(stats);
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner fullScreen message="Loading dashboard..." />;

  const StatCard = ({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.colors.primary} />}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.greeting}>Welcome back, {firstName} 👋</Text>
          <Text style={styles.headerSub}>{user?.businessName || 'Your Dashboard'}</Text>
        </View>

        {/* Stats */}
        {analytics && (
          <View style={styles.statsGrid}>
            <StatCard label="Active" value={analytics.activeBookings} icon="briefcase-outline" color="#3B82F6" />
            <StatCard label="Pending" value={analytics.pendingRequests || 0} icon="mail-outline" color="#F59E0B" />
            <StatCard label="Completed" value={analytics.completedBookings} icon="checkmark-circle-outline" color="#10B981" />
            <StatCard label="Rating" value={analytics.averageRating > 0 ? analytics.averageRating.toFixed(1) : 'N/A'} icon="star-outline" color="#8B5CF6" />
          </View>
        )}

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {[
              { label: 'My Work', icon: 'briefcase-outline', route: '/(artisan)/my-work' },
              { label: 'Requests', icon: 'mail-outline', route: '/(artisan)/inbox' },
              { label: 'Services', icon: 'grid-outline', route: '/(artisan)/services' },
            ].map(action => (
              <TouchableOpacity
                key={action.label}
                style={[styles.actionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                onPress={() => router.push(action.route as any)}
              >
                <Ionicons name={action.icon as any} size={24} color={theme.colors.primary} />
                <Text style={[styles.actionLabel, { color: theme.colors.text }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent bookings */}
        {bookings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Work</Text>
              <TouchableOpacity onPress={() => router.push('/(artisan)/my-work')}>
                <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>
            {bookings.map(b => (
              <BookingCard
                key={b._id}
                booking={b}
                viewerRole="artisan"
                onPress={booking => router.push({ pathname: '/booking/[id]', params: { id: booking._id } })}
              />
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { padding: 24, paddingTop: 48, paddingBottom: 24 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  statCard: { flex: 1, minWidth: '44%', padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center', gap: 6 },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 12 },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, gap: 8 },
  actionLabel: { fontSize: 12, fontWeight: '600' },
});

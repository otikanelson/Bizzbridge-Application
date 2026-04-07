/**
 * Customer Home Screen
 * Requirements: 4.1-4.10, 57.1-57.7
 */
import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, FlatList, RefreshControl, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { useAuthContext } from '../../src/context/AuthContext';
import { ServiceCard } from '../../src/components/service/ServiceCard';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import { getFeaturedServices } from '../../src/services/service.service';
import { getFeaturedArtisans } from '../../src/services/user.service';
import { JOB_CATEGORIES } from '../../src/constants/categories';
import { Service, User } from '../../src/types/models';

export default function CustomerHome() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuthContext();

  const [services, setServices] = useState<Service[]>([]);
  const [artisans, setArtisans] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  const loadData = async () => {
    try {
      setError(null);
      const [featuredServices, featuredArtisans] = await Promise.all([
        getFeaturedServices(),
        getFeaturedArtisans(),
      ]);
      setServices(featuredServices);
      setArtisans(featuredArtisans);
    } catch (err: any) {
      setError(err.message || 'Failed to load home data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = () => { setRefreshing(true); loadData(); };

  const handleSearch = () => {
    router.push({ pathname: '/(customer)/search', params: { q: searchQuery } });
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push({ pathname: '/(customer)/search', params: { category: categoryId } });
  };

  const handleServicePress = (service: Service) => {
    router.push({ pathname: '/service/[id]', params: { id: service._id } });
  };

  const handleArtisanPress = (artisan: User) => {
    router.push({ pathname: '/artisan/[id]', params: { id: artisan._id } });
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading..." />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.colors.primary} />}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
          <Text style={styles.headerSub}>Find skilled artisans near you</Text>
          {/* Search bar */}
          <TouchableOpacity
            style={[styles.searchBar, { backgroundColor: '#fff' }]}
            onPress={handleSearch}
            activeOpacity={0.9}
          >
            <Ionicons name="search-outline" size={18} color="#666" />
            <Text style={styles.searchPlaceholder}>Search services...</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Browse Categories</Text>
          <FlatList
            data={JOB_CATEGORIES.slice(0, 12)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryChip, { backgroundColor: item.color + '20', borderColor: item.color }]}
                onPress={() => handleCategoryPress(item.id)}
                accessibilityLabel={item.name}
              >
                <Ionicons name={item.icon as any} size={20} color={item.color} />
                <Text style={[styles.categoryName, { color: item.color }]} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Featured Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured Services</Text>
            <TouchableOpacity onPress={() => router.push('/(customer)/search')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {error ? (
            <ErrorMessage message={error} onRetry={loadData} />
          ) : services.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No featured services yet</Text>
          ) : (
            <View style={styles.servicesList}>
              {services.slice(0, 6).map((service) => (
                <ServiceCard key={service._id} service={service} onPress={handleServicePress} />
              ))}
            </View>
          )}
        </View>

        {/* Featured Artisans */}
        {artisans.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Top Artisans</Text>
            <FlatList
              data={artisans.slice(0, 8)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.artisansList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.artisanCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                  onPress={() => handleArtisanPress(item)}
                >
                  <View style={[styles.artisanAvatar, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.artisanInitial}>
                      {(item.businessName || item.contactName || 'A')[0].toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.artisanName, { color: theme.colors.text }]} numberOfLines={1}>
                    {item.businessName || item.contactName}
                  </Text>
                  {item.ratings && (
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                        {item.ratings.average.toFixed(1)}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { padding: 24, paddingTop: 48, paddingBottom: 32 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10,
  },
  searchPlaceholder: { color: '#999', fontSize: 15 },
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: '600' },
  categoriesList: { paddingRight: 16, gap: 10 },
  categoryChip: {
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1, minWidth: 80, gap: 4,
  },
  categoryName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  servicesList: { gap: 0 },
  emptyText: { textAlign: 'center', paddingVertical: 24, fontSize: 14 },
  artisansList: { paddingRight: 16, gap: 12 },
  artisanCard: {
    width: 90, alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, gap: 6,
  },
  artisanAvatar: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
  },
  artisanInitial: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  artisanName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 11 },
});

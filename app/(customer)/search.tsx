/**
 * Search Screen - Requirements: 5.1-5.10, 38.1-38.10, 39.1-39.10, 65.1-65.9
 */
import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
  Modal, ScrollView, SafeAreaView, RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { ServiceCard } from '../../src/components/service/ServiceCard';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { EmptyState } from '../../src/components/common/EmptyState';
import { Picker } from '../../src/components/common/Picker';
import { searchServices } from '../../src/services/service.service';
import { JOB_CATEGORIES } from '../../src/constants/categories';
import { LAGOS_LGAS } from '../../src/constants/locations';
import { Service } from '../../src/types/models';
import { debounce } from '../../src/utils/helpers';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Reviews', value: 'reviews' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function Search() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();

  const [query, setQuery] = useState(params.q || '');
  const [results, setResults] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [category, setCategory] = useState(params.category || '');
  const [lga, setLga] = useState('');
  const [pricingType, setPricingType] = useState('');
  const [sortBy, setSortBy] = useState<any>('newest');

  const categoryOptions = [{ label: 'All Categories', value: '' }, ...JOB_CATEGORIES.map(c => ({ label: c.name, value: c.id }))];
  const lgaOptions = [{ label: 'All Locations', value: '' }, ...LAGOS_LGAS.map(l => ({ label: l.name, value: l.id }))];
  const pricingOptions = [
    { label: 'All Pricing', value: '' },
    { label: 'Fixed Price', value: 'fixed' },
    { label: 'Negotiable', value: 'negotiate' },
    { label: 'Categorized', value: 'categorized' },
  ];

  const activeFilters = [category, lga, pricingType].filter(Boolean).length;

  const doSearch = useCallback(async (q: string, cat: string, lgaVal: string, pricing: string, sort: string) => {
    setLoading(true);
    try {
      const res = await searchServices({ query: q || undefined, category: cat || undefined, lga: lgaVal || undefined, pricingType: pricing || undefined, sortBy: sort as any });
      setResults(res.data);
    } catch { setResults([]); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  const debouncedSearch = useCallback(debounce((q: string) => doSearch(q, category, lga, pricingType, sortBy), 500), [category, lga, pricingType, sortBy]);

  useEffect(() => { doSearch(query, category, lga, pricingType, sortBy); }, [category, lga, pricingType, sortBy]);
  useEffect(() => { debouncedSearch(query); }, [query]);

  const clearFilters = () => { setCategory(''); setLga(''); setPricingType(''); };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      {/* Search bar */}
      <View style={[styles.searchRow, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <View style={[styles.inputWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Ionicons name="search-outline" size={18} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search services..."
            placeholderTextColor={theme.colors.placeholder}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: activeFilters > 0 ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="options-outline" size={20} color={activeFilters > 0 ? '#fff' : theme.colors.text} />
          {activeFilters > 0 && <Text style={styles.filterBadge}>{activeFilters}</Text>}
        </TouchableOpacity>
      </View>

      {/* Sort row */}
      <View style={[styles.sortRow, { borderBottomColor: theme.colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortList}>
          {SORT_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.sortChip, { backgroundColor: sortBy === opt.value ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => setSortBy(opt.value)}
            >
              <Text style={[styles.sortChipText, { color: sortBy === opt.value ? '#fff' : theme.colors.text }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      {loading && !refreshing ? (
        <LoadingSpinner fullScreen message="Searching..." />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); doSearch(query, category, lga, pricingType, sortBy); }} tintColor={theme.colors.primary} />}
          ListEmptyComponent={<EmptyState icon="🔍" title="No services found" message="Try adjusting your search or filters" action={activeFilters > 0 ? { label: 'Clear Filters', onPress: clearFilters } : undefined} />}
          renderItem={({ item }) => (
            <ServiceCard service={item} onPress={s => router.push({ pathname: '/service/[id]', params: { id: s._id } })} />
          )}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={filterVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalSafe, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Picker label="Category" value={category} onValueChange={v => setCategory(String(v))} options={categoryOptions} />
            <Picker label="Location (LGA)" value={lga} onValueChange={v => setLga(String(v))} options={lgaOptions} />
            <Picker label="Pricing Type" value={pricingType} onValueChange={v => setPricingType(String(v))} options={pricingOptions} />
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.clearBtn, { borderColor: theme.colors.border }]} onPress={clearFilters}>
              <Text style={[styles.clearBtnText, { color: theme.colors.text }]}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.applyBtn, { backgroundColor: theme.colors.primary }]} onPress={() => setFilterVisible(false)}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  searchRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8, borderBottomWidth: 1 },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  input: { flex: 1, fontSize: 15, padding: 0 },
  filterBtn: { width: 44, height: 44, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  filterBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#fff', color: '#DC143C', fontSize: 10, fontWeight: 'bold', width: 16, height: 16, borderRadius: 8, textAlign: 'center', lineHeight: 16 },
  sortRow: { borderBottomWidth: 1 },
  sortList: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  sortChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  sortChipText: { fontSize: 13, fontWeight: '500' },
  list: { padding: 16, paddingBottom: 32 },
  modalSafe: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalBody: { flex: 1, padding: 16 },
  modalFooter: { flexDirection: 'row', gap: 12, padding: 16 },
  clearBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  clearBtnText: { fontSize: 15, fontWeight: '600' },
  applyBtn: { flex: 2, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

/**
 * Service Details Screen - Requirements: 6.1-6.13, 58.1-58.7, 63.1-63.7, 80.1-80.7
 */
import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Share, Switch, SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { useAuthContext } from '../../src/context/AuthContext';
import { ServiceGallery } from '../../src/components/service/ServiceGallery';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import { getServiceById, deleteService, toggleServiceStatus } from '../../src/services/service.service';
import { getUserById } from '../../src/services/user.service';
import { getCategoryById } from '../../src/constants/categories';
import { formatPrice } from '../../src/utils/formatting';
import { generateServiceLink } from '../../src/navigation/linking';
import { Service, User } from '../../src/types/models';

export default function ServiceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuthContext();

  const [service, setService] = useState<Service | null>(null);
  const [artisan, setArtisan] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const isOwner = user?.role === 'artisan' && service && (
    typeof service.artisan === 'string' ? service.artisan === user._id : (service.artisan as User)._id === user._id
  );
  const isCustomer = user?.role === 'customer';

  const load = async () => {
    if (!id) return;
    try {
      setError(null);
      const svc = await getServiceById(id);
      setService(svc);
      const artisanId = typeof svc.artisan === 'string' ? svc.artisan : (svc.artisan as User)._id;
      const artisanData = await getUserById(artisanId);
      setArtisan(artisanData);
    } catch (err: any) {
      setError(err.message || 'Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleDelete = () => {
    Alert.alert('Delete Service', 'Are you sure you want to delete this service? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteService(id!);
            router.back();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete service');
          }
        }
      },
    ]);
  };

  const handleToggleStatus = async () => {
    if (!service) return;
    setToggling(true);
    try {
      const updated = await toggleServiceStatus(service._id);
      setService(updated);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update status');
    } finally {
      setToggling(false);
    }
  };

  const handleShare = async () => {
    if (!service) return;
    const link = generateServiceLink(service._id);
    await Share.share({ message: `Check out "${service.title}" on BizBridge: ${link}` });
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading service..." />;
  if (error || !service) return <ErrorMessage message={error || 'Service not found'} onRetry={load} fullScreen />;

  const category = getCategoryById(service.category);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Gallery */}
        <ServiceGallery images={service.images} />

        {/* Back + Share buttons */}
        <View style={styles.topActions}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title + category */}
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{service.title}</Text>
            {!service.isActive && (
              <View style={[styles.inactiveBadge, { backgroundColor: theme.colors.disabled }]}>
                <Text style={styles.inactiveBadgeText}>Inactive</Text>
              </View>
            )}
          </View>

          {category && (
            <View style={[styles.categoryChip, { backgroundColor: category.color + '20' }]}>
              <Ionicons name={category.icon as any} size={14} color={category.color} />
              <Text style={[styles.categoryText, { color: category.color }]}>{category.name}</Text>
            </View>
          )}

          {/* Pricing */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Pricing</Text>
            {service.pricingType === 'fixed' && service.basePrice != null && (
              <Text style={[styles.price, { color: theme.colors.primary }]}>{formatPrice(service.basePrice)}</Text>
            )}
            {service.pricingType === 'negotiate' && (
              <Text style={[styles.price, { color: theme.colors.primary }]}>Negotiable</Text>
            )}
            {service.pricingType === 'categorized' && service.pricingCategories?.map((pc, i) => (
              <View key={i} style={styles.pricingRow}>
                <Text style={[styles.pricingCat, { color: theme.colors.text }]}>{pc.category}</Text>
                <Text style={[styles.pricingPrice, { color: theme.colors.primary }]}>{formatPrice(pc.price)}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>About this Service</Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{service.description}</Text>
          </View>

          {/* Locations */}
          {service.locations.length > 0 && (
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Service Areas</Text>
              {service.locations.map((loc, i) => (
                <View key={i} style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.locationText, { color: theme.colors.textSecondary }]}>
                    {loc.localities?.length ? `${loc.localities.join(', ')}, ${loc.lga}` : loc.lga}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Tags */}
          {service.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {service.tags.map((tag, i) => (
                <View key={i} style={[styles.tag, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Artisan info */}
          {artisan && (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              onPress={() => router.push({ pathname: '/artisan/[id]', params: { id: artisan._id } })}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>About the Artisan</Text>
              <Text style={[styles.artisanName, { color: theme.colors.text }]}>{artisan.businessName || artisan.contactName}</Text>
              {artisan.ratings && artisan.ratings.count > 0 && (
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                    {artisan.ratings.average.toFixed(1)} ({artisan.ratings.count} reviews)
                  </Text>
                </View>
              )}
              <Text style={[styles.viewProfile, { color: theme.colors.primary }]}>View Profile →</Text>
            </TouchableOpacity>
          )}

          {/* Owner controls */}
          {isOwner && (
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>Service Active</Text>
                <Switch
                  value={service.isActive}
                  onValueChange={handleToggleStatus}
                  disabled={toggling}
                  trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
                />
              </View>
              <TouchableOpacity
                style={[styles.editBtn, { borderColor: theme.colors.primary }]}
                onPress={() => router.push({ pathname: '/service/edit/[id]', params: { id: service._id } })}
              >
                <Ionicons name="pencil-outline" size={16} color={theme.colors.primary} />
                <Text style={[styles.editBtnText, { color: theme.colors.primary }]}>Edit Service</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.deleteBtn, { borderColor: theme.colors.error }]} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                <Text style={[styles.deleteBtnText, { color: theme.colors.error }]}>Delete Service</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* CTA for customers */}
      {isCustomer && service.isActive && (
        <View style={[styles.cta, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push({ pathname: '/service/request/[id]', params: { id: service._id } })}
          >
            <Text style={styles.ctaBtnText}>Request This Service</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topActions: { position: 'absolute', top: 48, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 10 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1, fontSize: 22, fontWeight: '700' },
  inactiveBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  inactiveBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  categoryText: { fontSize: 13, fontWeight: '600' },
  card: { borderRadius: 12, borderWidth: 1, padding: 16, gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  price: { fontSize: 22, fontWeight: '800' },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pricingCat: { fontSize: 14 },
  pricingPrice: { fontSize: 14, fontWeight: '700' },
  description: { fontSize: 14, lineHeight: 22 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 14 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  tagText: { fontSize: 12 },
  artisanName: { fontSize: 16, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13 },
  viewProfile: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleLabel: { fontSize: 15, fontWeight: '600' },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, borderWidth: 1, justifyContent: 'center' },
  editBtnText: { fontSize: 14, fontWeight: '600' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, borderWidth: 1, justifyContent: 'center' },
  deleteBtnText: { fontSize: 14, fontWeight: '600' },
  cta: { padding: 16, borderTopWidth: 1 },
  ctaBtn: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

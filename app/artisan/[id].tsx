/**
 * Artisan Profile Screen - Requirements: 23.1, 56.1-56.11
 * Public artisan profile view
 */
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import { ServiceCard } from '../../src/components/service/ServiceCard';
import { getUserById } from '../../src/services/user.service';
import { getMyServices } from '../../src/services/service.service';
import { User, Service } from '../../src/types/models';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export default function ArtisanProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();

  const [artisan, setArtisan] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    try {
      setError(null);
      const [userData] = await Promise.all([getUserById(id)]);
      setArtisan(userData);
      // Fetch artisan's services via search
      try {
        const { searchServices } = await import('../../src/services/service.service');
        const result = await searchServices({ query: '', limit: 20 });
        // Filter by artisan
        const artisanServices = result.data.filter(s =>
          typeof s.artisan === 'string' ? s.artisan === id : (s.artisan as User)._id === id
        );
        setServices(artisanServices);
      } catch { /* services optional */ }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <LoadingSpinner fullScreen message="Loading profile..." />;
  if (error || !artisan) return <ErrorMessage message={error || 'Profile not found'} onRetry={load} fullScreen />;

  const profileImageUri = artisan.profileImage
    ? (artisan.profileImage.startsWith('http') ? artisan.profileImage : `${API_BASE}/${artisan.profileImage}`)
    : null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {artisan.businessName || artisan.contactName}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile header */}
        <View style={[styles.profileHeader, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="person" size={40} color={theme.colors.primary} />
            </View>
          )}
          <Text style={[styles.businessName, { color: theme.colors.text }]}>{artisan.businessName || artisan.contactName}</Text>
          {artisan.businessName && artisan.contactName && (
            <Text style={[styles.contactName, { color: theme.colors.textSecondary }]}>{artisan.contactName}</Text>
          )}
          {artisan.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.locationText, { color: theme.colors.textSecondary }]}>
                {artisan.location.locality ? `${artisan.location.locality}, ` : ''}{artisan.location.lga}
              </Text>
            </View>
          )}
          {artisan.ratings && artisan.ratings.count > 0 && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                {artisan.ratings.average.toFixed(1)}
              </Text>
              <Text style={[styles.ratingCount, { color: theme.colors.textSecondary }]}>
                ({artisan.ratings.count} reviews)
              </Text>
            </View>
          )}
        </View>

        {/* About */}
        {artisan.businessDescription && (
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{artisan.businessDescription}</Text>
          </View>
        )}

        {/* Details */}
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Details</Text>
          {artisan.experience != null && (
            <View style={styles.detailRow}>
              <Ionicons name="briefcase-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{artisan.experience} years experience</Text>
            </View>
          )}
          {artisan.yearEstablished && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>Est. {artisan.yearEstablished}</Text>
            </View>
          )}
          {artisan.cacRegistration && (
            <View style={styles.detailRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.success} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>CAC Registered</Text>
            </View>
          )}
          {artisan.phoneNumber && (
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{artisan.phoneNumber}</Text>
            </View>
          )}
        </View>

        {/* Specialties */}
        {artisan.specialties && artisan.specialties.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Specialties</Text>
            <View style={styles.tagsRow}>
              {artisan.specialties.map((s, i) => (
                <View key={i} style={[styles.tag, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary + '40' }]}>
                  <Text style={[styles.tagText, { color: theme.colors.primary }]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Social media */}
        {artisan.socialMedia && (artisan.socialMedia.facebook || artisan.socialMedia.instagram || artisan.socialMedia.twitter) && (
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Social Media</Text>
            <View style={styles.socialRow}>
              {artisan.socialMedia.facebook && (
                <TouchableOpacity onPress={() => Linking.openURL(artisan.socialMedia!.facebook!)} style={[styles.socialBtn, { backgroundColor: '#1877F2' }]}>
                  <Ionicons name="logo-facebook" size={20} color="#fff" />
                </TouchableOpacity>
              )}
              {artisan.socialMedia.instagram && (
                <TouchableOpacity onPress={() => Linking.openURL(artisan.socialMedia!.instagram!)} style={[styles.socialBtn, { backgroundColor: '#E1306C' }]}>
                  <Ionicons name="logo-instagram" size={20} color="#fff" />
                </TouchableOpacity>
              )}
              {artisan.socialMedia.twitter && (
                <TouchableOpacity onPress={() => Linking.openURL(artisan.socialMedia!.twitter!)} style={[styles.socialBtn, { backgroundColor: '#1DA1F2' }]}>
                  <Ionicons name="logo-twitter" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Services */}
        {services.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, paddingHorizontal: 4, marginBottom: 8 }]}>Services</Text>
            {services.map(svc => (
              <ServiceCard
                key={svc._id}
                service={svc}
                onPress={s => router.push({ pathname: '/service/[id]', params: { id: s._id } })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  backBtn: { width: 40 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', padding: 20, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  businessName: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  contactName: { fontSize: 14, marginTop: 2, textAlign: 'center' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  locationText: { fontSize: 13 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  ratingText: { fontSize: 16, fontWeight: '700' },
  ratingCount: { fontSize: 13 },
  card: { borderRadius: 10, borderWidth: 1, padding: 14, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  description: { fontSize: 14, lineHeight: 22 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  detailText: { fontSize: 14 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 13, fontWeight: '500' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});

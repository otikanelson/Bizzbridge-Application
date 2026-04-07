/**
 * Edit Profile Screen - Requirements: 22.2, 23.1-23.11
 */
import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../src/theme/ThemeContext';
import { useAuthContext } from '../../src/context/AuthContext';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { updateProfile, uploadImage } from '../../src/services/user.service';
import { LAGOS_LGAS } from '../../src/constants/locations';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export default function EditProfile() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, refreshUser } = useAuthContext();

  const [submitting, setSubmitting] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  // Customer fields
  const [fullName, setFullName] = useState('');
  // Artisan fields
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [cacRegistration, setCacRegistration] = useState('');
  const [yearEstablished, setYearEstablished] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  // Shared
  const [lga, setLga] = useState('');
  const [locality, setLocality] = useState('');
  const [showLGAPicker, setShowLGAPicker] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName || '');
    setBusinessName(user.businessName || '');
    setContactName(user.contactName || '');
    setPhoneNumber(user.phoneNumber || '');
    setBusinessDescription(user.businessDescription || '');
    setExperience(user.experience?.toString() || '');
    setCacRegistration(user.cacRegistration || '');
    setYearEstablished(user.yearEstablished?.toString() || '');
    setFacebook(user.socialMedia?.facebook || '');
    setInstagram(user.socialMedia?.instagram || '');
    setTwitter(user.socialMedia?.twitter || '');
    setSpecialties(user.specialties || []);
    setLga(user.location?.lga || '');
    setLocality(user.location?.locality || '');
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setProfileImageUri(result.assets[0].uri);
  };

  const addSpecialty = () => {
    const s = specialtyInput.trim();
    if (s && !specialties.includes(s)) setSpecialties(prev => [...prev, s]);
    setSpecialtyInput('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let profileImage: string | undefined;
      if (profileImageUri) {
        const uploaded = await uploadImage(profileImageUri, 'profile');
        profileImage = uploaded.url;
      }

      const payload: any = {
        location: lga ? { lga, locality: locality || undefined } : undefined,
      };

      if (user?.role === 'customer') {
        payload.fullName = fullName.trim() || undefined;
      } else {
        payload.businessName = businessName.trim() || undefined;
        payload.contactName = contactName.trim() || undefined;
        payload.phoneNumber = phoneNumber.trim() || undefined;
        payload.businessDescription = businessDescription.trim() || undefined;
        payload.experience = experience ? Number(experience) : undefined;
        payload.cacRegistration = cacRegistration.trim() || undefined;
        payload.yearEstablished = yearEstablished ? Number(yearEstablished) : undefined;
        payload.specialties = specialties.length > 0 ? specialties : undefined;
        payload.socialMedia = {
          facebook: facebook.trim() || undefined,
          instagram: instagram.trim() || undefined,
          twitter: twitter.trim() || undefined,
        };
      }

      if (profileImage) payload.profileImage = profileImage;

      await updateProfile(payload);
      await refreshUser();
      Alert.alert('Updated', 'Profile updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const currentImage = profileImageUri || (user?.profileImage
    ? (user.profileImage.startsWith('http') ? user.profileImage : `${API_BASE}/${user.profileImage}`)
    : null);

  const selectedLGA = LAGOS_LGAS.find(l => l.id === lga);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Profile image */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage}>
              {currentImage ? (
                <Image source={{ uri: currentImage }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Ionicons name="person" size={40} color={theme.colors.primary} />
                </View>
              )}
              <View style={[styles.editAvatarBadge, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.changePhotoText, { color: theme.colors.primary }]}>Change Photo</Text>
          </View>

          {/* Customer fields */}
          {user?.role === 'customer' && (
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Full Name</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={fullName} onChangeText={setFullName} placeholder="Your full name" placeholderTextColor={theme.colors.textSecondary} />
            </View>
          )}

          {/* Artisan fields */}
          {user?.role === 'artisan' && (
            <>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Business Name</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={businessName} onChangeText={setBusinessName} placeholder="Your business name" placeholderTextColor={theme.colors.textSecondary} />
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Contact Name</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={contactName} onChangeText={setContactName} placeholder="Your contact name" placeholderTextColor={theme.colors.textSecondary} />
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Phone Number</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="+234..." placeholderTextColor={theme.colors.textSecondary} keyboardType="phone-pad" />
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Business Description</Text>
                <TextInput style={[styles.textarea, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={businessDescription} onChangeText={setBusinessDescription} placeholder="Describe your business" placeholderTextColor={theme.colors.textSecondary} multiline numberOfLines={4} textAlignVertical="top" />
              </View>
              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>Experience (years)</Text>
                  <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={experience} onChangeText={setExperience} placeholder="e.g. 5" placeholderTextColor={theme.colors.textSecondary} keyboardType="numeric" />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>Year Established</Text>
                  <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={yearEstablished} onChangeText={setYearEstablished} placeholder="e.g. 2018" placeholderTextColor={theme.colors.textSecondary} keyboardType="numeric" />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.text }]}>CAC Registration</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={cacRegistration} onChangeText={setCacRegistration} placeholder="CAC number (optional)" placeholderTextColor={theme.colors.textSecondary} />
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Specialties</Text>
                <View style={styles.tagInputRow}>
                  <TextInput style={[styles.tagInput, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={specialtyInput} onChangeText={setSpecialtyInput} placeholder="Add specialty" placeholderTextColor={theme.colors.textSecondary} onSubmitEditing={addSpecialty} returnKeyType="done" />
                  <TouchableOpacity style={[styles.addTagBtn, { backgroundColor: theme.colors.primary }]} onPress={addSpecialty}>
                    <Text style={styles.addTagBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
                {specialties.length > 0 && (
                  <View style={styles.tagsRow}>
                    {specialties.map((s, i) => (
                      <TouchableOpacity key={i} style={[styles.tag, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => setSpecialties(prev => prev.filter((_, idx) => idx !== i))}>
                        <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>{s}</Text>
                        <Ionicons name="close" size={12} color={theme.colors.textSecondary} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Social Media</Text>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Facebook</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={facebook} onChangeText={setFacebook} placeholder="https://facebook.com/..." placeholderTextColor={theme.colors.textSecondary} autoCapitalize="none" />
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Instagram</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={instagram} onChangeText={setInstagram} placeholder="https://instagram.com/..." placeholderTextColor={theme.colors.textSecondary} autoCapitalize="none" />
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Twitter / X</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={twitter} onChangeText={setTwitter} placeholder="https://twitter.com/..." placeholderTextColor={theme.colors.textSecondary} autoCapitalize="none" />
              </View>
            </>
          )}

          {/* Location */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Location</Text>
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>LGA</Text>
            <TouchableOpacity style={[styles.selector, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={() => setShowLGAPicker(!showLGAPicker)}>
              <Text style={[styles.selectorText, { color: selectedLGA ? theme.colors.text : theme.colors.textSecondary }]}>{selectedLGA ? selectedLGA.name : 'Select LGA'}</Text>
              <Ionicons name={showLGAPicker ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            {showLGAPicker && (
              <View style={[styles.pickerList, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                {LAGOS_LGAS.map(l => (
                  <TouchableOpacity key={l.id} style={[styles.pickerItem, lga === l.id && { backgroundColor: theme.colors.primary + '15' }]} onPress={() => { setLga(l.id); setShowLGAPicker(false); }}>
                    <Text style={[styles.pickerItemText, { color: lga === l.id ? theme.colors.primary : theme.colors.text }]}>{l.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Locality</Text>
            <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={locality} onChangeText={setLocality} placeholder="e.g. Ikeja, Lekki" placeholderTextColor={theme.colors.textSecondary} />
          </View>

          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: theme.colors.primary }, submitting && { opacity: 0.7 }]} onPress={handleSubmit} disabled={submitting}>
            {submitting ? <LoadingSpinner size="small" /> : <Text style={styles.submitBtnText}>Save Changes</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  backBtn: { width: 40 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  editAvatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  changePhotoText: { marginTop: 8, fontSize: 14, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  field: { marginBottom: 14 },
  row: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  textarea: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15, minHeight: 100 },
  selector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 8, padding: 12 },
  selectorText: { fontSize: 15 },
  pickerList: { borderWidth: 1, borderRadius: 8, marginTop: 4, maxHeight: 200, overflow: 'hidden' },
  pickerItem: { padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  pickerItemText: { fontSize: 14 },
  tagInputRow: { flexDirection: 'row', gap: 8 },
  tagInput: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  addTagBtn: { paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  addTagBtnText: { color: '#fff', fontWeight: '700' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 13 },
  submitBtn: { padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

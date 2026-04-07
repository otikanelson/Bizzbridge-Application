/**
 * Edit Service Screen - Requirements: 20.3, 17.1-17.8
 * Artisan edits an existing service
 */
import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../src/theme/ThemeContext';
import { LoadingSpinner } from '../../../src/components/common/LoadingSpinner';
import { ErrorMessage } from '../../../src/components/common/ErrorMessage';
import { getServiceById, updateService } from '../../../src/services/service.service';
import { uploadImage } from '../../../src/services/user.service';
import { JOB_CATEGORIES } from '../../../src/constants/categories';
import { LAGOS_LGAS } from '../../../src/constants/locations';
import { PRICING_TYPES } from '../../../src/constants/statuses';
import { Service } from '../../../src/types/models';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export default function EditService() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [pricingType, setPricingType] = useState<'fixed' | 'negotiate' | 'categorized'>('fixed');
  const [basePrice, setBasePrice] = useState('');
  const [baseDuration, setBaseDuration] = useState('');
  const [selectedLGAs, setSelectedLGAs] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [pricingCategories, setPricingCategories] = useState([{ category: '', price: '', duration: '', description: '' }]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLGAPicker, setShowLGAPicker] = useState(false);

  useEffect(() => {
    if (!id) return;
    getServiceById(id)
      .then(svc => {
        setTitle(svc.title);
        setDescription(svc.description);
        setCategory(svc.category);
        setPricingType(svc.pricingType as any);
        setBasePrice(svc.basePrice?.toString() || '');
        setBaseDuration(svc.baseDuration || '');
        setSelectedLGAs(svc.locations.map(l => l.lga));
        setTags(svc.tags);
        setExistingImages(svc.images);
        if (svc.pricingCategories && svc.pricingCategories.length > 0) {
          setPricingCategories(svc.pricingCategories.map(pc => ({
            category: pc.category,
            price: pc.price.toString(),
            duration: pc.duration || '',
            description: pc.description || '',
          })));
        }
      })
      .catch(err => setError(err.message || 'Failed to load service'))
      .finally(() => setLoading(false));
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri);
      setNewImages(prev => [...prev, ...uris].slice(0, 5 - existingImages.length));
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const toggleLGA = (lga: string) => {
    setSelectedLGAs(prev => prev.includes(lga) ? prev.filter(l => l !== lga) : [...prev, lga]);
  };

  const validate = () => {
    if (!title.trim()) { Alert.alert('Required', 'Please enter a title'); return false; }
    if (!description.trim()) { Alert.alert('Required', 'Please enter a description'); return false; }
    if (!category) { Alert.alert('Required', 'Please select a category'); return false; }
    if (pricingType === 'fixed' && (!basePrice || isNaN(Number(basePrice)))) { Alert.alert('Required', 'Please enter a valid price'); return false; }
    if (selectedLGAs.length === 0) { Alert.alert('Required', 'Please select at least one service area'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const uploadedUrls: string[] = [];
      for (const uri of newImages) {
        try {
          const result = await uploadImage(uri, 'service');
          uploadedUrls.push(result.url);
        } catch { /* skip */ }
      }

      await updateService(id!, {
        title: title.trim(),
        description: description.trim(),
        category,
        images: [...existingImages, ...uploadedUrls],
        pricingType,
        basePrice: pricingType === 'fixed' ? Number(basePrice) : undefined,
        baseDuration: baseDuration.trim() || undefined,
        pricingCategories: pricingType === 'categorized'
          ? pricingCategories.filter(pc => pc.category && pc.price).map(pc => ({
              category: pc.category,
              price: Number(pc.price),
              duration: pc.duration || undefined,
              description: pc.description || undefined,
            }))
          : undefined,
        locations: selectedLGAs.map(lga => ({ lga })),
        tags,
      });
      Alert.alert('Updated', 'Service updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading service..." />;
  if (error) return <ErrorMessage message={error} fullScreen />;

  const selectedCategory = JOB_CATEGORIES.find(c => c.id === category);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Service</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Images */}
          <Text style={[styles.label, { color: theme.colors.text }]}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
            {existingImages.map((uri, i) => (
              <View key={`existing-${i}`} style={styles.imageThumb}>
                <Image source={{ uri: uri.startsWith('http') ? uri : `${API_BASE}/${uri}` }} style={styles.thumbImg} />
                <TouchableOpacity style={styles.removeImg} onPress={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}>
                  <Ionicons name="close-circle" size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            {newImages.map((uri, i) => (
              <View key={`new-${i}`} style={styles.imageThumb}>
                <Image source={{ uri }} style={styles.thumbImg} />
                <TouchableOpacity style={styles.removeImg} onPress={() => setNewImages(prev => prev.filter((_, idx) => idx !== i))}>
                  <Ionicons name="close-circle" size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            {(existingImages.length + newImages.length) < 5 && (
              <TouchableOpacity style={[styles.addImageBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]} onPress={pickImage}>
                <Ionicons name="camera-outline" size={28} color={theme.colors.textSecondary} />
                <Text style={[styles.addImageText, { color: theme.colors.textSecondary }]}>Add</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Title *</Text>
            <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={title} onChangeText={setTitle} placeholder="Service title" placeholderTextColor={theme.colors.textSecondary} maxLength={100} />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Description *</Text>
            <TextInput style={[styles.textarea, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={description} onChangeText={setDescription} placeholder="Describe your service" placeholderTextColor={theme.colors.textSecondary} multiline numberOfLines={5} textAlignVertical="top" maxLength={2000} />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Category *</Text>
            <TouchableOpacity style={[styles.selector, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={() => setShowCategoryPicker(!showCategoryPicker)}>
              <Text style={[styles.selectorText, { color: selectedCategory ? theme.colors.text : theme.colors.textSecondary }]}>{selectedCategory ? selectedCategory.name : 'Select a category'}</Text>
              <Ionicons name={showCategoryPicker ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            {showCategoryPicker && (
              <View style={[styles.pickerList, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                {JOB_CATEGORIES.map(cat => (
                  <TouchableOpacity key={cat.id} style={[styles.pickerItem, category === cat.id && { backgroundColor: theme.colors.primary + '15' }]} onPress={() => { setCategory(cat.id); setShowCategoryPicker(false); }}>
                    <Text style={[styles.pickerItemText, { color: category === cat.id ? theme.colors.primary : theme.colors.text }]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Pricing Type *</Text>
            <View style={styles.pricingTypeRow}>
              {PRICING_TYPES.map(pt => (
                <TouchableOpacity key={pt} style={[styles.pricingTypeBtn, { borderColor: pricingType === pt ? theme.colors.primary : theme.colors.border, backgroundColor: pricingType === pt ? theme.colors.primary + '15' : theme.colors.card }]} onPress={() => setPricingType(pt)}>
                  <Text style={[styles.pricingTypeBtnText, { color: pricingType === pt ? theme.colors.primary : theme.colors.textSecondary }]}>{pt.charAt(0).toUpperCase() + pt.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {pricingType === 'fixed' && (
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Price (₦) *</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={basePrice} onChangeText={setBasePrice} placeholder="e.g. 50000" placeholderTextColor={theme.colors.textSecondary} keyboardType="numeric" />
            </View>
          )}

          {pricingType !== 'categorized' && (
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Duration</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={baseDuration} onChangeText={setBaseDuration} placeholder="e.g. 1 day" placeholderTextColor={theme.colors.textSecondary} />
            </View>
          )}

          {pricingType === 'categorized' && (
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Pricing Categories</Text>
              {pricingCategories.map((pc, i) => (
                <View key={i} style={[styles.pricingCatCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                  <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text, marginBottom: 8 }]} value={pc.category} onChangeText={v => setPricingCategories(prev => prev.map((p, idx) => idx === i ? { ...p, category: v } : p))} placeholder="Category name" placeholderTextColor={theme.colors.textSecondary} />
                  <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]} value={pc.price} onChangeText={v => setPricingCategories(prev => prev.map((p, idx) => idx === i ? { ...p, price: v } : p))} placeholder="Price (₦)" placeholderTextColor={theme.colors.textSecondary} keyboardType="numeric" />
                  {pricingCategories.length > 1 && (
                    <TouchableOpacity onPress={() => setPricingCategories(prev => prev.filter((_, idx) => idx !== i))} style={styles.removePcBtn}>
                      <Text style={[styles.removePcText, { color: theme.colors.error }]}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity style={[styles.addPcBtn, { borderColor: theme.colors.primary }]} onPress={() => setPricingCategories(prev => [...prev, { category: '', price: '', duration: '', description: '' }])}>
                <Text style={[styles.addPcText, { color: theme.colors.primary }]}>+ Add Category</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Service Areas *</Text>
            <TouchableOpacity style={[styles.selector, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={() => setShowLGAPicker(!showLGAPicker)}>
              <Text style={[styles.selectorText, { color: selectedLGAs.length > 0 ? theme.colors.text : theme.colors.textSecondary }]}>{selectedLGAs.length > 0 ? `${selectedLGAs.length} area(s) selected` : 'Select service areas'}</Text>
              <Ionicons name={showLGAPicker ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            {showLGAPicker && (
              <View style={[styles.pickerList, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                {LAGOS_LGAS.map(lga => (
                  <TouchableOpacity key={lga.id} style={[styles.pickerItem, selectedLGAs.includes(lga.id) && { backgroundColor: theme.colors.primary + '15' }]} onPress={() => toggleLGA(lga.id)}>
                    <Ionicons name={selectedLGAs.includes(lga.id) ? 'checkbox' : 'square-outline'} size={18} color={selectedLGAs.includes(lga.id) ? theme.colors.primary : theme.colors.textSecondary} />
                    <Text style={[styles.pickerItemText, { color: theme.colors.text, marginLeft: 8 }]}>{lga.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Tags</Text>
            <View style={styles.tagInputRow}>
              <TextInput style={[styles.tagInput, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={tagInput} onChangeText={setTagInput} placeholder="Add a tag" placeholderTextColor={theme.colors.textSecondary} onSubmitEditing={addTag} returnKeyType="done" />
              <TouchableOpacity style={[styles.addTagBtn, { backgroundColor: theme.colors.primary }]} onPress={addTag}>
                <Text style={styles.addTagBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
            {tags.length > 0 && (
              <View style={styles.tagsRow}>
                {tags.map((tag, i) => (
                  <TouchableOpacity key={i} style={[styles.tag, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => setTags(prev => prev.filter((_, idx) => idx !== i))}>
                    <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>#{tag}</Text>
                    <Ionicons name="close" size={12} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
  imageRow: { marginBottom: 16 },
  imageThumb: { width: 90, height: 90, marginRight: 8, position: 'relative' },
  thumbImg: { width: 90, height: 90, borderRadius: 8 },
  removeImg: { position: 'absolute', top: -6, right: -6 },
  addImageBtn: { width: 90, height: 90, borderRadius: 8, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  addImageText: { fontSize: 11, marginTop: 4 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  textarea: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15, minHeight: 100 },
  selector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 8, padding: 12 },
  selectorText: { fontSize: 15 },
  pickerList: { borderWidth: 1, borderRadius: 8, marginTop: 4, maxHeight: 200, overflow: 'hidden' },
  pickerItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  pickerItemText: { fontSize: 14 },
  pricingTypeRow: { flexDirection: 'row', gap: 8 },
  pricingTypeBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1.5, alignItems: 'center' },
  pricingTypeBtnText: { fontSize: 13, fontWeight: '600' },
  pricingCatCard: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 },
  removePcBtn: { marginTop: 8, alignItems: 'flex-end' },
  removePcText: { fontSize: 13 },
  addPcBtn: { padding: 10, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', borderStyle: 'dashed' },
  addPcText: { fontSize: 14, fontWeight: '600' },
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

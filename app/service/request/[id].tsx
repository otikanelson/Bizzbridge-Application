/**
 * Service Request Screen - Requirements: 7.1-7.11
 * Customer submits a service request to an artisan
 */
import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme/ThemeContext';
import { LoadingSpinner } from '../../../src/components/common/LoadingSpinner';
import { ErrorMessage } from '../../../src/components/common/ErrorMessage';
import { getServiceById } from '../../../src/services/service.service';
import { createRequest } from '../../../src/services/serviceRequest.service';
import { Service } from '../../../src/types/models';

export default function ServiceRequest() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preferredSchedule, setPreferredSchedule] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (!id) return;
    getServiceById(id)
      .then(svc => { setService(svc); setTitle(svc.title); })
      .catch(err => setError(err.message || 'Failed to load service'))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    if (!title.trim()) { Alert.alert('Validation', 'Please enter a title'); return false; }
    if (!description.trim()) { Alert.alert('Validation', 'Please describe what you need'); return false; }
    if (description.trim().length < 20) { Alert.alert('Validation', 'Description must be at least 20 characters'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate() || !service) return;
    setSubmitting(true);
    try {
      await createRequest({
        service: service._id,
        title: title.trim(),
        description: description.trim(),
        preferredSchedule: preferredSchedule.trim() || undefined,
        specialRequirements: specialRequirements.trim() || undefined,
        selectedCategory: selectedCategory || undefined,
      });
      Alert.alert('Request Sent', 'Your service request has been sent to the artisan.', [
        { text: 'OK', onPress: () => router.replace('/(customer)/requests') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading service..." />;
  if (error || !service) return <ErrorMessage message={error || 'Service not found'} fullScreen />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Request Service</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Service info */}
          <View style={[styles.serviceInfo, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.serviceLabel, { color: theme.colors.textSecondary }]}>Requesting</Text>
            <Text style={[styles.serviceName, { color: theme.colors.text }]}>{service.title}</Text>
          </View>

          {/* Title */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Request Title *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Brief title for your request"
              placeholderTextColor={theme.colors.textSecondary}
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Description *</Text>
            <TextInput
              style={[styles.textarea, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what you need in detail (min 20 characters)"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text style={[styles.charCount, { color: theme.colors.textSecondary }]}>{description.length}/1000</Text>
          </View>

          {/* Categorized pricing selector */}
          {service.pricingType === 'categorized' && service.pricingCategories && service.pricingCategories.length > 0 && (
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Select Category</Text>
              {service.pricingCategories.map((pc, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.categoryOption,
                    { borderColor: selectedCategory === pc.category ? theme.colors.primary : theme.colors.border, backgroundColor: theme.colors.card },
                    selectedCategory === pc.category && { borderWidth: 2 },
                  ]}
                  onPress={() => setSelectedCategory(pc.category)}
                >
                  <View style={styles.categoryOptionLeft}>
                    <Text style={[styles.categoryOptionName, { color: theme.colors.text }]}>{pc.category}</Text>
                    {pc.description && <Text style={[styles.categoryOptionDesc, { color: theme.colors.textSecondary }]}>{pc.description}</Text>}
                  </View>
                  <Text style={[styles.categoryOptionPrice, { color: theme.colors.primary }]}>₦{pc.price.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Preferred Schedule */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Preferred Schedule</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={preferredSchedule}
              onChangeText={setPreferredSchedule}
              placeholder="e.g. Weekdays, mornings, ASAP"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* Special Requirements */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Special Requirements</Text>
            <TextInput
              style={[styles.textarea, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={specialRequirements}
              onChangeText={setSpecialRequirements}
              placeholder="Any special requirements or notes"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.colors.primary }, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <LoadingSpinner size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Send Request</Text>
            )}
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
  serviceInfo: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 20 },
  serviceLabel: { fontSize: 12, marginBottom: 4 },
  serviceName: { fontSize: 16, fontWeight: '600' },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  textarea: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15, minHeight: 100 },
  charCount: { fontSize: 12, textAlign: 'right', marginTop: 4 },
  categoryOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 8 },
  categoryOptionLeft: { flex: 1 },
  categoryOptionName: { fontSize: 15, fontWeight: '600' },
  categoryOptionDesc: { fontSize: 12, marginTop: 2 },
  categoryOptionPrice: { fontSize: 15, fontWeight: '700', marginLeft: 8 },
  submitBtn: { padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

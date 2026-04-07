/**
 * Create Booking Screen - Requirements: 17.6, 62.4-62.10
 * Creates a booking from an accepted service request
 */
import { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
    Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { getRequestById } from '../../src/services/serviceRequest.service';
import { createBooking } from '../../src/services/booking.service';
import { ServiceRequest, Service, User } from '../../src/types/models';

export default function CreateBooking() {
    const { requestId } = useLocalSearchParams<{ requestId: string }>();
    const router = useRouter();
    const { theme } = useTheme();

    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('');
    const [additionalTerms, setAdditionalTerms] = useState('');

    useEffect(() => {
        if (!requestId) return;
        getRequestById(requestId)
            .then(req => {
                setRequest(req);
                setTitle(req.title);
                setDescription(req.description);
                if (req.response?.proposedTerms) setAdditionalTerms(req.response.proposedTerms);
            })
            .catch(err => Alert.alert('Error', err.message || 'Failed to load request'))
            .finally(() => setLoading(false));
    }, [requestId]);

    const validate = () => {
        if (!title.trim()) { Alert.alert('Required', 'Please enter a title'); return false; }
        if (!startDate.trim()) { Alert.alert('Required', 'Please enter a start date'); return false; }
        if (!price.trim() || isNaN(Number(price))) { Alert.alert('Required', 'Please enter a valid price'); return false; }
        if (!duration.trim()) { Alert.alert('Required', 'Please enter the duration'); return false; }
        if (!location.trim()) { Alert.alert('Required', 'Please enter the location'); return false; }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate() || !request) return;
        const service = typeof request.service === 'object' ? (request.service as Service)._id : request.service;
        setSubmitting(true);
        try {
            const booking = await createBooking({
                service,
                title: title.trim(),
                description: description.trim(),
                scheduledStartDate: startDate.trim(),
                agreedTerms: {
                    price: Number(price),
                    duration: duration.trim(),
                    location: location.trim(),
                    additionalTerms: additionalTerms.trim() || undefined,
                },
                serviceRequest: request._id,
            });
            Alert.alert('Booking Created', 'Your booking has been created successfully.', [
                { text: 'View Booking', onPress: () => router.replace({ pathname: '/booking/[id]', params: { id: booking._id } }) },
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner fullScreen message="Loading request..." />;

    const artisan = request && typeof request.artisan === 'object' ? request.artisan as User : null;

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Create Booking</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    {artisan && (
                        <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Booking with</Text>
                            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{artisan.businessName || artisan.contactName}</Text>
                        </View>
                    )}

                    <View style={styles.field}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Title *</Text>
                        <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={title} onChangeText={setTitle} placeholder="Booking title" placeholderTextColor={theme.colors.textSecondary} />
                    </View>

                    <View style={styles.field}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
                        <TextInput style={[styles.textarea, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={description} onChangeText={setDescription} placeholder="Describe the work" placeholderTextColor={theme.colors.textSecondary} multiline numberOfLines={3} textAlignVertical="top" />
                    </View>

                    <View style={styles.field}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Start Date *</Text>
                        <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={startDate} onChangeText={setStartDate} placeholder="e.g. 2025-08-15 or Monday morning" placeholderTextColor={theme.colors.textSecondary} />
                    </View>

                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Agreed Terms</Text>

                    <View style={styles.field}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Price (₦) *</Text>
                        <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={price} onChangeText={setPrice} placeholder="e.g. 50000" placeholderTextColor={theme.colors.textSecondary} keyboardType="numeric" />
                    </View>

                    <View style={styles.field}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Duration *</Text>
                        <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={duration} onChangeText={setDuration} placeholder="e.g. 2 days, 1 week" placeholderTextColor={theme.colors.textSecondary} />
                    </View>

                    <View style={styles.field}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Location *</Text>
                        <TextInput style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={location} onChangeText={setLocation} placeholder="Where the work will be done" placeholderTextColor={theme.colors.textSecondary} />
                    </View>

                    <View style={styles.field}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Additional Terms</Text>
                        <TextInput style={[styles.textarea, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]} value={additionalTerms} onChangeText={setAdditionalTerms} placeholder="Any additional agreed terms" placeholderTextColor={theme.colors.textSecondary} multiline numberOfLines={3} textAlignVertical="top" />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, { backgroundColor: theme.colors.primary }, submitting && { opacity: 0.7 }]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? <LoadingSpinner size="small" /> : <Text style={styles.submitBtnText}>Create Booking</Text>}
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
    infoCard: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 20 },
    infoLabel: { fontSize: 12, marginBottom: 2 },
    infoValue: { fontSize: 16, fontWeight: '600' },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 4 },
    field: { marginBottom: 14 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
    input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
    textarea: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15, minHeight: 80 },
    submitBtn: { padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

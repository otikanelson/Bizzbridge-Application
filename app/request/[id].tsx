/**
 * Request Details Screen - Requirements: 17.1-17.6
 * Accept/decline/retract/convert to booking
 */
import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  SafeAreaView, Alert, Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { useAuthContext } from '../../src/context/AuthContext';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import {
  getRequestById, acceptRequest, declineRequest, retractRequest,
} from '../../src/services/serviceRequest.service';
import { ServiceRequest, User, Service } from '../../src/types/models';
import { formatDate } from '../../src/utils/formatting';

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  viewed: '#3B82F6',
  accepted: '#10B981',
  declined: '#EF4444',
  converted: '#8B5CF6',
  retracted: '#6B7280',
};

export default function RequestDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuthContext();

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [acceptModal, setAcceptModal] = useState(false);
  const [acceptMessage, setAcceptMessage] = useState('');
  const [acceptTerms, setAcceptTerms] = useState('');
  const [declineModal, setDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const load = async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await getRequestById(id);
      setRequest(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const isArtisan = user?.role === 'artisan';
  const isCustomer = user?.role === 'customer';

  const handleAccept = async () => {
    if (!acceptMessage.trim()) { Alert.alert('Required', 'Please add a response message'); return; }
    setActionLoading(true);
    try {
      const updated = await acceptRequest(request!._id, { message: acceptMessage.trim(), proposedTerms: acceptTerms.trim() || undefined });
      setRequest(updated);
      setAcceptModal(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to accept request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) { Alert.alert('Required', 'Please provide a reason'); return; }
    setActionLoading(true);
    try {
      const updated = await declineRequest(request!._id, { reason: declineReason.trim() });
      setRequest(updated);
      setDeclineModal(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to decline request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetract = () => {
    Alert.alert('Retract Request', 'Are you sure you want to retract this request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Retract', style: 'destructive', onPress: async () => {
          setActionLoading(true);
          try {
            const updated = await retractRequest(request!._id);
            setRequest(updated);
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to retract request');
          } finally {
            setActionLoading(false);
          }
        }
      },
    ]);
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading request..." />;
  if (error || !request) return <ErrorMessage message={error || 'Request not found'} onRetry={load} fullScreen />;

  const service = typeof request.service === 'object' ? request.service as Service : null;
  const customer = typeof request.customer === 'object' ? request.customer as User : null;
  const artisan = typeof request.artisan === 'object' ? request.artisan as User : null;
  const statusColor = STATUS_COLORS[request.status] || theme.colors.textSecondary;

  const canAccept = isArtisan && (request.status === 'pending' || request.status === 'viewed');
  const canDecline = isArtisan && (request.status === 'pending' || request.status === 'viewed');
  const canRetract = isCustomer && request.status === 'pending';
  const canCreateBooking = isCustomer && request.status === 'accepted';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Request Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{request.status.toUpperCase()}</Text>
        </View>

        {/* Request info */}
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{request.title}</Text>
          <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]}>{request.description}</Text>
          <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Submitted: {formatDate(request.createdAt)}</Text>
        </View>

        {/* Service */}
        {service && (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => router.push({ pathname: '/service/[id]', params: { id: service._id } })}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Service</Text>
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>{service.title} →</Text>
          </TouchableOpacity>
        )}

        {/* Schedule & requirements */}
        {(request.preferredSchedule || request.specialRequirements || request.selectedCategory) && (
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Details</Text>
            {request.selectedCategory && (
              <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Category: {request.selectedCategory}</Text>
            )}
            {request.preferredSchedule && (
              <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Schedule: {request.preferredSchedule}</Text>
            )}
            {request.specialRequirements && (
              <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Requirements: {request.specialRequirements}</Text>
            )}
          </View>
        )}

        {/* Parties */}
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Parties</Text>
          {customer && <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Customer: {customer.fullName || customer.email}</Text>}
          {artisan && (
            <TouchableOpacity onPress={() => router.push({ pathname: '/artisan/[id]', params: { id: typeof request.artisan === 'string' ? request.artisan : (request.artisan as User)._id } })}>
              <Text style={[styles.meta, { color: theme.colors.primary }]}>Artisan: {artisan.businessName || artisan.contactName} →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Response */}
        {request.response && (
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Artisan Response</Text>
            <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]}>{request.response.message}</Text>
            {request.response.proposedTerms && (
              <Text style={[styles.meta, { color: theme.colors.textSecondary, marginTop: 8 }]}>Proposed Terms: {request.response.proposedTerms}</Text>
            )}
            <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Responded: {formatDate(request.response.respondedAt)}</Text>
          </View>
        )}

        {/* Decline reason */}
        {request.declineReason && (
          <View style={[styles.card, { backgroundColor: '#FEF2F2', borderColor: theme.colors.error }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>Declined</Text>
            <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]}>{request.declineReason}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {canCreateBooking && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push({ pathname: '/booking/create', params: { requestId: request._id } })}
            >
              <Text style={styles.actionBtnText}>Create Booking</Text>
            </TouchableOpacity>
          )}
          {canAccept && (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.success }]} onPress={() => setAcceptModal(true)}>
              <Text style={styles.actionBtnText}>Accept Request</Text>
            </TouchableOpacity>
          )}
          {canDecline && (
            <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: theme.colors.error }]} onPress={() => setDeclineModal(true)}>
              <Text style={[styles.actionBtnOutlineText, { color: theme.colors.error }]}>Decline Request</Text>
            </TouchableOpacity>
          )}
          {canRetract && (
            <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: theme.colors.error }]} onPress={handleRetract} disabled={actionLoading}>
              <Text style={[styles.actionBtnOutlineText, { color: theme.colors.error }]}>Retract Request</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Accept Modal */}
      <Modal visible={acceptModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Accept Request</Text>
            <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>Response Message *</Text>
            <TextInput
              style={[styles.textarea, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={acceptMessage}
              onChangeText={setAcceptMessage}
              placeholder="Tell the customer you're accepting their request..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Text style={[styles.modalLabel, { color: theme.colors.textSecondary, marginTop: 12 }]}>Proposed Terms (optional)</Text>
            <TextInput
              style={[styles.textarea, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={acceptTerms}
              onChangeText={setAcceptTerms}
              placeholder="Price, duration, location, etc."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { borderColor: theme.colors.border }]} onPress={() => setAcceptModal(false)}>
                <Text style={[styles.modalBtnText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.colors.success }]} onPress={handleAccept} disabled={actionLoading}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Decline Modal */}
      <Modal visible={declineModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Decline Request</Text>
            <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>Reason *</Text>
            <TextInput
              style={[styles.textarea, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={declineReason}
              onChangeText={setDeclineReason}
              placeholder="Explain why you're declining..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { borderColor: theme.colors.border }]} onPress={() => setDeclineModal(false)}>
                <Text style={[styles.modalBtnText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.colors.error }]} onPress={handleDecline} disabled={actionLoading}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  backBtn: { width: 40 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  card: { borderRadius: 10, borderWidth: 1, padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  cardDesc: { fontSize: 14, lineHeight: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  meta: { fontSize: 13, marginBottom: 4 },
  linkText: { fontSize: 15, fontWeight: '600' },
  actions: { gap: 10, marginTop: 8 },
  actionBtn: { padding: 14, borderRadius: 10, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  actionBtnOutline: { padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1.5 },
  actionBtnOutlineText: { fontSize: 15, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalLabel: { fontSize: 13, marginBottom: 6 },
  textarea: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 14, minHeight: 80 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  modalBtnText: { fontSize: 14, fontWeight: '700' },
});

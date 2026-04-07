/**
 * Booking Details Screen - Requirements: 16.1-16.7, 18.1-18.13, 40.1-40.10
 * Full booking management: messages, complete, cancel, contract, dispute, review
 */
import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { useAuthContext } from '../../src/context/AuthContext';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import { BookingStatus } from '../../src/components/booking/BookingStatus';
import {
  getBookingById, completeBooking, cancelBooking,
  acceptContract, fileDispute, addMessage, submitReview,
} from '../../src/services/booking.service';
import { Booking, User } from '../../src/types/models';
import { CANCELLATION_REASONS, DISPUTE_REASONS } from '../../src/constants/statuses';
import { formatDate } from '../../src/utils/formatting';

export default function BookingDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuthContext();
  const scrollRef = useRef<ScrollView>(null);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Modal states
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDesc, setCancelDesc] = useState('');
  const [disputeModal, setDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await getBookingById(id);
      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const isCustomer = user?.role === 'customer';
  const isArtisan = user?.role === 'artisan';

  const handleSendMessage = async () => {
    if (!messageText.trim() || !booking) return;
    setSendingMsg(true);
    try {
      const updated = await addMessage(booking._id, messageText.trim());
      setBooking(updated);
      setMessageText('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send message');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleAcceptContract = async () => {
    if (!booking) return;
    Alert.alert('Accept Contract', 'Do you accept the terms of this booking?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Accept', onPress: async () => {
          setActionLoading(true);
          try {
            const updated = await acceptContract(booking._id);
            setBooking(updated);
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to accept contract');
          } finally {
            setActionLoading(false);
          }
        }
      },
    ]);
  };

  const handleComplete = async () => {
    if (!booking) return;
    Alert.alert('Mark as Completed', 'Confirm the service has been completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete', onPress: async () => {
          setActionLoading(true);
          try {
            const updated = await completeBooking(booking._id);
            setBooking(updated);
            if (!updated.review) setReviewModal(true);
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to complete booking');
          } finally {
            setActionLoading(false);
          }
        }
      },
    ]);
  };

  const handleCancel = async () => {
    if (!cancelReason) { Alert.alert('Required', 'Please select a cancellation reason'); return; }
    setActionLoading(true);
    try {
      const updated = await cancelBooking(booking!._id, cancelReason, cancelDesc);
      setBooking(updated);
      setCancelModal(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeReason) { Alert.alert('Required', 'Please select a dispute reason'); return; }
    if (!disputeDesc.trim()) { Alert.alert('Required', 'Please describe the dispute'); return; }
    setActionLoading(true);
    try {
      const updated = await fileDispute(booking!._id, disputeReason, disputeDesc.trim());
      setBooking(updated);
      setDisputeModal(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to file dispute');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async () => {
    setActionLoading(true);
    try {
      const updated = await submitReview(booking!._id, reviewRating, reviewComment.trim() || undefined);
      setBooking(updated);
      setReviewModal(false);
      Alert.alert('Thank you!', 'Your review has been submitted.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading booking..." />;
  if (error || !booking) return <ErrorMessage message={error || 'Booking not found'} onRetry={load} fullScreen />;

  const service = typeof booking.service === 'object' ? booking.service : null;
  const customer = typeof booking.customer === 'object' ? booking.customer as User : null;
  const artisan = typeof booking.artisan === 'object' ? booking.artisan as User : null;
  const myContractAccepted = isCustomer ? booking.contractAcceptance.customer : booking.contractAcceptance.artisan;
  const canAcceptContract = !myContractAccepted && booking.status === 'pending';
  const canComplete = isCustomer && booking.status === 'in_progress';
  const canCancel = booking.status === 'pending' || booking.status === 'in_progress';
  const canDispute = booking.status === 'in_progress';
  const canReview = isCustomer && booking.status === 'completed' && !booking.review;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>Booking Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status */}
          <View style={styles.statusRow}>
            <BookingStatus status={booking.status} />
          </View>

          {/* Booking info */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{booking.title}</Text>
            <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]}>{booking.description}</Text>
            {service && <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Service: {service.title}</Text>}
            <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
              Scheduled: {formatDate(booking.scheduledStartDate)}
            </Text>
          </View>

          {/* Agreed Terms */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Agreed Terms</Text>
            <View style={styles.termRow}>
              <Text style={[styles.termLabel, { color: theme.colors.textSecondary }]}>Price</Text>
              <Text style={[styles.termValue, { color: theme.colors.primary }]}>₦{booking.agreedTerms.price.toLocaleString()}</Text>
            </View>
            <View style={styles.termRow}>
              <Text style={[styles.termLabel, { color: theme.colors.textSecondary }]}>Duration</Text>
              <Text style={[styles.termValue, { color: theme.colors.text }]}>{booking.agreedTerms.duration}</Text>
            </View>
            <View style={styles.termRow}>
              <Text style={[styles.termLabel, { color: theme.colors.textSecondary }]}>Location</Text>
              <Text style={[styles.termValue, { color: theme.colors.text }]}>{booking.agreedTerms.location}</Text>
            </View>
            {booking.agreedTerms.additionalTerms && (
              <Text style={[styles.additionalTerms, { color: theme.colors.textSecondary }]}>{booking.agreedTerms.additionalTerms}</Text>
            )}
          </View>

          {/* Contract Acceptance */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contract Acceptance</Text>
            <View style={styles.contractRow}>
              <Ionicons name={booking.contractAcceptance.customer ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={booking.contractAcceptance.customer ? theme.colors.success : theme.colors.textSecondary} />
              <Text style={[styles.contractLabel, { color: theme.colors.text }]}>Customer</Text>
            </View>
            <View style={styles.contractRow}>
              <Ionicons name={booking.contractAcceptance.artisan ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={booking.contractAcceptance.artisan ? theme.colors.success : theme.colors.textSecondary} />
              <Text style={[styles.contractLabel, { color: theme.colors.text }]}>Artisan</Text>
            </View>
            {canAcceptContract && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
                onPress={handleAcceptContract}
                disabled={actionLoading}
              >
                <Text style={styles.actionBtnText}>Accept Contract</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Parties */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Parties</Text>
            {customer && (
              <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Customer: {customer.fullName || customer.email}</Text>
            )}
            {artisan && (
              <TouchableOpacity onPress={() => router.push({ pathname: '/artisan/[id]', params: { id: typeof booking.artisan === 'string' ? booking.artisan : (booking.artisan as User)._id } })}>
                <Text style={[styles.meta, { color: theme.colors.primary }]}>Artisan: {artisan.businessName || artisan.contactName} →</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Messages */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Messages</Text>
            {booking.messages.length === 0 ? (
              <Text style={[styles.emptyMsg, { color: theme.colors.textSecondary }]}>No messages yet. Start the conversation.</Text>
            ) : (
              booking.messages.map((msg, i) => {
                const isMe = msg.senderRole === user?.role;
                return (
                  <View key={i} style={[styles.msgBubble, isMe ? styles.msgRight : styles.msgLeft, { backgroundColor: isMe ? theme.colors.primary : theme.colors.surface }]}>
                    <Text style={[styles.msgSender, { color: isMe ? 'rgba(255,255,255,0.8)' : theme.colors.textSecondary }]}>{msg.senderRole}</Text>
                    <Text style={[styles.msgText, { color: isMe ? '#fff' : theme.colors.text }]}>{msg.message}</Text>
                    <Text style={[styles.msgTime, { color: isMe ? 'rgba(255,255,255,0.6)' : theme.colors.textSecondary }]}>{formatDate(msg.timestamp)}</Text>
                  </View>
                );
              })
            )}
          </View>

          {/* Review */}
          {booking.review && (
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Review</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => (
                  <Ionicons key={s} name="star" size={18} color={s <= booking.review!.rating ? '#F59E0B' : theme.colors.border} />
                ))}
              </View>
              {booking.review.comment && <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]}>{booking.review.comment}</Text>}
            </View>
          )}

          {/* Dispute info */}
          {booking.dispute && (
            <View style={[styles.card, { backgroundColor: '#FEF2F2', borderColor: theme.colors.error }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>Dispute Filed</Text>
              <Text style={[styles.meta, { color: theme.colors.text }]}>Reason: {booking.dispute.reason}</Text>
              <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]}>{booking.dispute.description}</Text>
            </View>
          )}

          {/* Cancellation info */}
          {booking.cancellation && (
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Cancellation</Text>
              <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Reason: {booking.cancellation.reason}</Text>
            </View>
          )}

          {/* Action buttons */}
          {(canComplete || canCancel || canDispute || canReview) && (
            <View style={styles.actions}>
              {canComplete && (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.success }]} onPress={handleComplete} disabled={actionLoading}>
                  <Text style={styles.actionBtnText}>Mark as Completed</Text>
                </TouchableOpacity>
              )}
              {canReview && (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F59E0B' }]} onPress={() => setReviewModal(true)}>
                  <Text style={styles.actionBtnText}>Leave a Review</Text>
                </TouchableOpacity>
              )}
              {canDispute && (
                <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: theme.colors.error }]} onPress={() => setDisputeModal(true)}>
                  <Text style={[styles.actionBtnOutlineText, { color: theme.colors.error }]}>File Dispute</Text>
                </TouchableOpacity>
              )}
              {canCancel && (
                <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: theme.colors.error }]} onPress={() => setCancelModal(true)}>
                  <Text style={[styles.actionBtnOutlineText, { color: theme.colors.error }]}>Cancel Booking</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>

        {/* Message input */}
        {booking.status !== 'cancelled' && booking.status !== 'disputed' && (
          <View style={[styles.msgInput, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
            <TextInput
              style={[styles.msgTextInput, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: theme.colors.primary }, (!messageText.trim() || sendingMsg) && { opacity: 0.5 }]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || sendingMsg}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Cancel Modal */}
      <Modal visible={cancelModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Cancel Booking</Text>
            <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>Reason *</Text>
            {CANCELLATION_REASONS.map(r => (
              <TouchableOpacity key={r} style={[styles.radioRow, cancelReason === r && { backgroundColor: theme.colors.primary + '15' }]} onPress={() => setCancelReason(r)}>
                <Ionicons name={cancelReason === r ? 'radio-button-on' : 'radio-button-off'} size={18} color={cancelReason === r ? theme.colors.primary : theme.colors.textSecondary} />
                <Text style={[styles.radioText, { color: theme.colors.text }]}>{r}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text, marginTop: 8 }]}
              value={cancelDesc}
              onChangeText={setCancelDesc}
              placeholder="Additional details (optional)"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { borderColor: theme.colors.border }]} onPress={() => setCancelModal(false)}>
                <Text style={[styles.modalBtnText, { color: theme.colors.text }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.colors.error }]} onPress={handleCancel} disabled={actionLoading}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Confirm Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Dispute Modal */}
      <Modal visible={disputeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>File a Dispute</Text>
            <Text style={[styles.modalLabel, { color: theme.colors.textSecondary }]}>Reason *</Text>
            {DISPUTE_REASONS.map(r => (
              <TouchableOpacity key={r} style={[styles.radioRow, disputeReason === r && { backgroundColor: theme.colors.primary + '15' }]} onPress={() => setDisputeReason(r)}>
                <Ionicons name={disputeReason === r ? 'radio-button-on' : 'radio-button-off'} size={18} color={disputeReason === r ? theme.colors.primary : theme.colors.textSecondary} />
                <Text style={[styles.radioText, { color: theme.colors.text }]}>{r}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={[styles.textarea, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text, marginTop: 8 }]}
              value={disputeDesc}
              onChangeText={setDisputeDesc}
              placeholder="Describe the issue in detail *"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { borderColor: theme.colors.border }]} onPress={() => setDisputeModal(false)}>
                <Text style={[styles.modalBtnText, { color: theme.colors.text }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.colors.error }]} onPress={handleDispute} disabled={actionLoading}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Submit Dispute</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal visible={reviewModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Leave a Review</Text>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map(s => (
                <TouchableOpacity key={s} onPress={() => setReviewRating(s)}>
                  <Ionicons name="star" size={32} color={s <= reviewRating ? '#F59E0B' : theme.colors.border} />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.textarea, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text, marginTop: 12 }]}
              value={reviewComment}
              onChangeText={setReviewComment}
              placeholder="Share your experience (optional)"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { borderColor: theme.colors.border }]} onPress={() => setReviewModal(false)}>
                <Text style={[styles.modalBtnText, { color: theme.colors.text }]}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.colors.primary }]} onPress={handleReview} disabled={actionLoading}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Submit Review</Text>
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
  content: { padding: 16, paddingBottom: 24 },
  statusRow: { marginBottom: 12 },
  card: { borderRadius: 10, borderWidth: 1, padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  cardDesc: { fontSize: 14, lineHeight: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  meta: { fontSize: 13, marginBottom: 4 },
  termRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  termLabel: { fontSize: 13 },
  termValue: { fontSize: 13, fontWeight: '600' },
  additionalTerms: { fontSize: 13, marginTop: 6, fontStyle: 'italic' },
  contractRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  contractLabel: { fontSize: 14 },
  emptyMsg: { fontSize: 13, textAlign: 'center', paddingVertical: 8 },
  msgBubble: { maxWidth: '80%', padding: 10, borderRadius: 10, marginBottom: 8 },
  msgLeft: { alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  msgRight: { alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  msgSender: { fontSize: 10, textTransform: 'capitalize', marginBottom: 2 },
  msgText: { fontSize: 14 },
  msgTime: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  starsRow: { flexDirection: 'row', gap: 4, marginBottom: 8 },
  actions: { gap: 10, marginTop: 8 },
  actionBtn: { padding: 14, borderRadius: 10, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  actionBtnOutline: { padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1.5 },
  actionBtnOutlineText: { fontSize: 15, fontWeight: '700' },
  msgInput: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, borderTopWidth: 1, gap: 8 },
  msgTextInput: { flex: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalLabel: { fontSize: 13, marginBottom: 8 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 8, marginBottom: 4 },
  radioText: { fontSize: 14 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 14 },
  textarea: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 14, minHeight: 80 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  modalBtnText: { fontSize: 14, fontWeight: '700' },
});

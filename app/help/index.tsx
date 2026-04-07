/**
 * Help & Support Screen - Requirements: 24.1, 70.1-70.6
 */
import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';

const FAQS = [
  {
    q: 'How do I request a service?',
    a: 'Browse or search for a service, tap on it to view details, then tap "Request This Service". Fill in your requirements and submit.',
  },
  {
    q: 'How does the booking process work?',
    a: 'After an artisan accepts your service request, you can create a booking with agreed terms. Both parties must accept the contract before work begins.',
  },
  {
    q: 'How do I pay for services?',
    a: 'Payment terms are agreed upon between you and the artisan as part of the booking terms. BizBridge facilitates the connection but payments are handled directly.',
  },
  {
    q: 'What if I have a dispute with an artisan?',
    a: 'You can file a dispute from the booking details screen. Our team will review the dispute and help resolve it.',
  },
  {
    q: 'How do I become an artisan on BizBridge?',
    a: 'Register as an artisan during sign-up. You can then create services, manage bookings, and receive service requests from customers.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes, you can cancel a booking from the booking details screen. Please provide a reason for cancellation.',
  },
  {
    q: 'How do reviews work?',
    a: 'After a booking is completed, customers can leave a star rating and optional comment for the artisan.',
  },
  {
    q: 'Is my personal information secure?',
    a: 'Yes, we take data security seriously. Your information is encrypted and never shared with third parties without your consent.',
  },
];

export default function Help() {
  const router = useRouter();
  const { theme } = useTheme();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* FAQs */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Frequently Asked Questions</Text>
        {FAQS.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.faqItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>{faq.q}</Text>
              <Ionicons
                name={expandedFaq === i ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={theme.colors.textSecondary}
              />
            </View>
            {expandedFaq === i && (
              <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Contact */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>Contact Us</Text>
        <View style={[styles.contactCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:support@bizbridge.ng')}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.text }]}>support@bizbridge.ng</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('tel:+2348000000000')}>
            <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.text }]}>+234 800 000 0000</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Legal links */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>Legal</Text>
        <View style={[styles.contactCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('https://bizbridge.ng/terms')}>
            <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.text }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('https://bizbridge.ng/privacy')}>
            <Ionicons name="shield-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.text }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: theme.colors.textSecondary }]}>BizBridge v1.0.0</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  faqItem: { borderRadius: 10, borderWidth: 1, padding: 14, marginBottom: 8 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: '600', marginRight: 8 },
  faqAnswer: { fontSize: 14, lineHeight: 20, marginTop: 10 },
  contactCard: { borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  contactText: { flex: 1, fontSize: 15 },
  divider: { height: StyleSheet.hairlineWidth },
  version: { textAlign: 'center', fontSize: 13, marginTop: 32 },
});

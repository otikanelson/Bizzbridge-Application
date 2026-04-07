/**
 * Change Password Screen - Requirements: 22.3, 64.1-64.9
 */
import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { changePassword } from '../../src/services/user.service';

export default function ChangePassword() {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const newRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const validate = () => {
    if (!currentPassword) { Alert.alert('Required', 'Please enter your current password'); return false; }
    if (!newPassword || newPassword.length < 8) { Alert.alert('Validation', 'New password must be at least 8 characters'); return false; }
    if (newPassword !== confirmPassword) { Alert.alert('Validation', 'Passwords do not match'); return false; }
    if (newPassword === currentPassword) { Alert.alert('Validation', 'New password must be different from current password'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password changed successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Change Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your new password must be at least 8 characters long.
          </Text>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Current Password</Text>
            <View style={[styles.inputRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showCurrent}
                returnKeyType="next"
                onSubmitEditing={() => newRef.current?.focus()}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
                <Ionicons name={showCurrent ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>New Password</Text>
            <View style={[styles.inputRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <TextInput
                ref={newRef}
                style={[styles.input, { color: theme.colors.text }]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showNew}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Confirm New Password</Text>
            <View style={[styles.inputRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <TextInput
                ref={confirmRef}
                style={[styles.input, { color: theme.colors.text }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showConfirm}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>Passwords do not match</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.colors.primary }, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <LoadingSpinner size="small" /> : <Text style={styles.submitBtnText}>Change Password</Text>}
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
  subtitle: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8 },
  input: { flex: 1, padding: 12, fontSize: 15 },
  eyeBtn: { padding: 12 },
  errorText: { fontSize: 12, marginTop: 4 },
  submitBtn: { padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

/**
 * Customer Profile Screen - Requirements: 22.1-22.11, 69.1, 69.2
 */
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { useAuthContext } from '../../src/context/AuthContext';
import Constants from 'expo-constants';

export default function CustomerProfile() {
  const router = useRouter();
  const { theme, toggleTheme, themeMode } = useTheme();
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); } },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, danger }: { icon: string; label: string; onPress: () => void; danger?: boolean }) => (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Ionicons name={icon as any} size={20} color={danger ? theme.colors.error : theme.colors.text} />
      <Text style={[styles.menuLabel, { color: danger ? theme.colors.error : theme.colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.avatarWrap}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <Text style={styles.avatarInitial}>{(user?.fullName || 'U')[0].toUpperCase()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{user?.fullName || 'Customer'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.locationText}>{user.location.lga}</Text>
            </View>
          )}
        </View>

        {/* Menu */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <MenuItem icon="person-outline" label="Edit Profile" onPress={() => router.push('/profile/edit')} />
          <MenuItem icon="lock-closed-outline" label="Change Password" onPress={() => router.push('/profile/change-password')} />
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]} onPress={toggleTheme}>
            <Ionicons name={themeMode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={20} color={theme.colors.text} />
            <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
              {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => router.push('/help')} />
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <MenuItem icon="log-out-outline" label="Logout" onPress={handleLogout} danger />
        </View>

        <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
          Version {Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { alignItems: 'center', padding: 24, paddingTop: 32, paddingBottom: 32 },
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  section: { marginTop: 16, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  menuLabel: { flex: 1, fontSize: 15 },
  version: { textAlign: 'center', fontSize: 12, marginTop: 24, marginBottom: 32 },
});

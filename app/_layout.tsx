import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="(artisan)" />
          {/* Shared screens */}
          <Stack.Screen name="service/[id]" />
          <Stack.Screen name="service/request/[id]" />
          <Stack.Screen name="service/add" />
          <Stack.Screen name="service/edit/[id]" />
          <Stack.Screen name="booking/[id]" />
          <Stack.Screen name="booking/create" />
          <Stack.Screen name="request/[id]" />
          <Stack.Screen name="artisan/[id]" />
          <Stack.Screen name="profile/edit" />
          <Stack.Screen name="profile/change-password" />
          <Stack.Screen name="help/index" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}

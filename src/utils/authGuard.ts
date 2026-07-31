import { Router } from 'expo-router';

export function requireAuth(
  isAuthenticated: boolean,
  router: Router,
  currentPath: string
): boolean {
  if (!isAuthenticated) {
    router.push({
      pathname: '/(auth)/login',
      params: { redirect: currentPath },
    });
    return false;
  }
  return true;
}
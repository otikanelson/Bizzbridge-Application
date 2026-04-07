/**
 * Storage utilities for AsyncStorage operations
 * Requirements: 29.1, 29.2, 29.7, 29.8
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: '@bizbridge:auth_token',
  USER_DATA: '@bizbridge:user_data',
  USER_ROLE: '@bizbridge:user_role',
  THEME_PREFERENCE: '@bizbridge:theme_preference',
  ONBOARDING_COMPLETED: '@bizbridge:onboarding_completed',
} as const;

/**
 * Stores authentication token in AsyncStorage
 * Requirement: 29.1
 * 
 * @param token - JWT authentication token
 * @returns Promise that resolves when token is stored
 */
export const storeAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error storing auth token:', error);
    throw new Error('Failed to store authentication token');
  }
};

/**
 * Retrieves authentication token from AsyncStorage
 * 
 * @returns Promise that resolves with token or null if not found
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

/**
 * Removes authentication token from AsyncStorage
 * 
 * @returns Promise that resolves when token is removed
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error removing auth token:', error);
    throw new Error('Failed to remove authentication token');
  }
};

/**
 * Stores user data in AsyncStorage
 * 
 * @param userData - User data object
 * @returns Promise that resolves when user data is stored
 */
export const storeUserData = async (userData: object): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, jsonValue);
  } catch (error) {
    console.error('Error storing user data:', error);
    throw new Error('Failed to store user data');
  }
};

/**
 * Retrieves user data from AsyncStorage
 * 
 * @returns Promise that resolves with user data or null if not found
 */
export const getUserData = async <T = object>(): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Removes user data from AsyncStorage
 * 
 * @returns Promise that resolves when user data is removed
 */
export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error removing user data:', error);
    throw new Error('Failed to remove user data');
  }
};

/**
 * Stores user role in AsyncStorage
 * Requirement: 29.2
 * 
 * @param role - User role ('customer' or 'artisan')
 * @returns Promise that resolves when role is stored
 */
export const storeUserRole = async (role: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  } catch (error) {
    console.error('Error storing user role:', error);
    throw new Error('Failed to store user role');
  }
};

/**
 * Retrieves user role from AsyncStorage
 * 
 * @returns Promise that resolves with user role or null if not found
 */
export const getUserRole = async (): Promise<string | null> => {
  try {
    const role = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return role;
  } catch (error) {
    console.error('Error retrieving user role:', error);
    return null;
  }
};

/**
 * Removes user role from AsyncStorage
 * 
 * @returns Promise that resolves when role is removed
 */
export const removeUserRole = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  } catch (error) {
    console.error('Error removing user role:', error);
    throw new Error('Failed to remove user role');
  }
};

/**
 * Stores theme preference in AsyncStorage
 * 
 * @param theme - Theme preference ('light' or 'dark')
 * @returns Promise that resolves when theme is stored
 */
export const storeThemePreference = async (theme: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
  } catch (error) {
    console.error('Error storing theme preference:', error);
    throw new Error('Failed to store theme preference');
  }
};

/**
 * Retrieves theme preference from AsyncStorage
 * 
 * @returns Promise that resolves with theme preference or null if not found
 */
export const getThemePreference = async (): Promise<string | null> => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);
    return theme;
  } catch (error) {
    console.error('Error retrieving theme preference:', error);
    return null;
  }
};

/**
 * Removes theme preference from AsyncStorage
 * 
 * @returns Promise that resolves when theme is removed
 */
export const removeThemePreference = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.THEME_PREFERENCE);
  } catch (error) {
    console.error('Error removing theme preference:', error);
    throw new Error('Failed to remove theme preference');
  }
};

/**
 * Stores onboarding completion status
 * 
 * @param completed - Whether onboarding is completed
 * @returns Promise that resolves when status is stored
 */
export const storeOnboardingCompleted = async (completed: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(completed));
  } catch (error) {
    console.error('Error storing onboarding status:', error);
    throw new Error('Failed to store onboarding status');
  }
};

/**
 * Retrieves onboarding completion status
 * 
 * @returns Promise that resolves with completion status
 */
export const getOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  } catch (error) {
    console.error('Error retrieving onboarding status:', error);
    return false;
  }
};

/**
 * Clears all stored data from AsyncStorage
 * Requirement: 29.7
 * 
 * @returns Promise that resolves when all data is cleared
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    const keys = [
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.USER_ROLE,
      // Note: We don't clear theme preference and onboarding status on logout
    ];
    
    await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw new Error('Failed to clear storage');
  }
};

/**
 * Stores authentication data (token, user data, and role)
 * 
 * @param token - JWT authentication token
 * @param userData - User data object
 * @param role - User role
 * @returns Promise that resolves when all data is stored
 */
export const storeAuthData = async (
  token: string,
  userData: object,
  role: string
): Promise<void> => {
  try {
    await Promise.all([
      storeAuthToken(token),
      storeUserData(userData),
      storeUserRole(role),
    ]);
  } catch (error) {
    console.error('Error storing auth data:', error);
    throw new Error('Failed to store authentication data');
  }
};

/**
 * Retrieves all authentication data
 * 
 * @returns Promise that resolves with auth data or null if not found
 */
export const getAuthData = async <T = object>(): Promise<{
  token: string | null;
  userData: T | null;
  role: string | null;
}> => {
  try {
    const [token, userData, role] = await Promise.all([
      getAuthToken(),
      getUserData<T>(),
      getUserRole(),
    ]);
    
    return { token, userData, role };
  } catch (error) {
    console.error('Error retrieving auth data:', error);
    return { token: null, userData: null, role: null };
  }
};

/**
 * Checks if user is authenticated
 * 
 * @returns Promise that resolves with authentication status
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    return token !== null && token.length > 0;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Generic storage utility for storing any data
 * 
 * @param key - Storage key
 * @param value - Value to store
 * @returns Promise that resolves when data is stored
 */
export const storeData = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
    throw new Error(`Failed to store data for key ${key}`);
  }
};

/**
 * Generic storage utility for retrieving any data
 * 
 * @param key - Storage key
 * @returns Promise that resolves with stored value or null
 */
export const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return null;
  }
};

/**
 * Generic storage utility for removing any data
 * 
 * @param key - Storage key
 * @returns Promise that resolves when data is removed
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    throw new Error(`Failed to remove data for key ${key}`);
  }
};

/**
 * Handles AsyncStorage errors gracefully
 * Requirement: 29.8
 * 
 * @param error - Error object
 * @param operation - Operation that failed
 */
export const handleStorageError = (error: unknown, operation: string): void => {
  console.error(`AsyncStorage error during ${operation}:`, error);
  
  // You can add additional error handling here, such as:
  // - Logging to error tracking service
  // - Showing user-friendly error messages
  // - Attempting recovery strategies
};

export default {
  storeAuthToken,
  getAuthToken,
  removeAuthToken,
  storeUserData,
  getUserData,
  removeUserData,
  storeUserRole,
  getUserRole,
  removeUserRole,
  storeThemePreference,
  getThemePreference,
  removeThemePreference,
  storeOnboardingCompleted,
  getOnboardingCompleted,
  clearAllStorage,
  storeAuthData,
  getAuthData,
  isAuthenticated,
  storeData,
  getData,
  removeData,
  handleStorageError,
};

/**
 * useAuth Hook
 * Custom hook for authentication state management
 * Requirements: 2.6, 2.7, 2.10, 29.1, 29.2, 29.4, 29.5, 29.7, 32.1, 32.7, 32.8, 32.9, 32.10
 */

import { useState, useEffect } from 'react';
import * as authService from '../services/auth.service';
import * as storage from '../utils/storage';
import { User } from '../types/models';
import {
  LoginRequest,
  RegisterCustomerRequest,
  RegisterArtisanRequest,
} from '../types/api';

/**
 * Return type for useAuth hook
 */
export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  registerCustomer: (data: RegisterCustomerRequest) => Promise<void>;
  registerArtisan: (data: RegisterArtisanRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

/**
 * Custom hook for authentication operations
 * Manages user authentication state, token persistence, and auth operations
 * 
 * Requirements:
 * - 2.6: Store JWT token in AsyncStorage on successful authentication
 * - 2.7: Navigate to appropriate dashboard after authentication
 * - 2.10: Provide logout function that clears AsyncStorage
 * - 29.1: Store auth token in AsyncStorage
 * - 29.2: Store user data in AsyncStorage
 * - 29.4: Load stored auth on app launch
 * - 29.5: Check authentication state on mount
 * - 29.7: Clear AsyncStorage on logout
 * - 32.1: Provide useAuth hook for authentication operations
 * - 32.7: Manage loading states during async operations
 * - 32.8: Manage error states with user-friendly messages
 * - 32.9: Handle API errors gracefully
 * - 32.10: Provide consistent error handling patterns
 * 
 * @returns Authentication state and operations
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load stored authentication data on mount
   * Requirement: 29.4, 29.5 - Load stored auth on app launch
   */
  useEffect(() => {
    loadStoredAuth();
  }, []);

  /**
   * Load authentication data from AsyncStorage
   * Checks for stored token and user data on app launch
   * Requirement: 29.4 - Load stored auth on app launch
   */
  const loadStoredAuth = async (): Promise<void> => {
    try {
      const authData = await storage.getAuthData<User>();

      if (authData.token && authData.userData) {
        setToken(authData.token);
        setUser(authData.userData);
      }
    } catch (err) {
      console.error('Failed to load stored auth:', err);
      // Don't set error state here as this is a silent background operation
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save authentication data to AsyncStorage
   * Stores token, user data, and user role
   * Requirements: 29.1, 29.2 - Store auth token and user data
   * 
   * @param authToken - JWT authentication token
   * @param userData - User data object
   */
  const saveAuth = async (authToken: string, userData: User): Promise<void> => {
    await storage.storeAuthData(authToken, userData, userData.role);
    setToken(authToken);
    setUser(userData);
  };

  /**
   * Clear authentication data from AsyncStorage
   * Removes token, user data, and user role
   * Requirement: 29.7 - Clear AsyncStorage on logout
   */
  const clearAuth = async (): Promise<void> => {
    await storage.clearAllStorage();
    setToken(null);
    setUser(null);
  };

  /**
   * Login user with email and password
   * Requirement: 2.6 - Store JWT token on successful authentication
   * 
   * @param credentials - User email and password
   * @throws Error if login fails
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      await saveAuth(response.token, response.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new customer
   * Requirement: 2.6 - Store JWT token on successful registration
   * 
   * @param data - Customer registration data
   * @throws Error if registration fails
   */
  const registerCustomer = async (data: RegisterCustomerRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.registerCustomer(data);
      await saveAuth(response.token, response.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new artisan
   * Requirement: 2.6 - Store JWT token on successful registration
   * 
   * @param data - Artisan registration data
   * @throws Error if registration fails
   */
  const registerArtisan = async (data: RegisterArtisanRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.registerArtisan(data);
      await saveAuth(response.token, response.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   * Clears authentication data from state and AsyncStorage
   * Requirement: 2.10, 29.7 - Logout clears AsyncStorage
   */
  const logout = async (): Promise<void> => {
    try {
      await clearAuth();
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Even if clearing storage fails, we should clear the state
      setToken(null);
      setUser(null);
    }
  };

  /**
   * Refresh user data from the server
   * Fetches the latest user profile and updates local storage
   * Handles 401 errors by logging out the user
   * 
   * @throws Error if refresh fails (except for 401 which triggers logout)
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
      await storage.storeUserData(userData);
    } catch (err: any) {
      console.error('Failed to refresh user:', err);
      
      // If we get a 401, the token is invalid - logout the user
      if (err.response?.status === 401) {
        await clearAuth();
      }
      
      throw err;
    }
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    registerCustomer,
    registerArtisan,
    logout,
    refreshUser,
    isAuthenticated: !!token && !!user,
  };
};

export default useAuth;

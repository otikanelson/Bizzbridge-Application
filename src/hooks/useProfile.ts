/**
 * useProfile Hook
 * Custom hook for user profile state management
 * Requirements: 32.5, 32.9, 32.10
 */

import { useState } from 'react';
import * as userService from '../services/user.service';
import { User } from '../types/models';
import { UpdateProfileRequest, ChangePasswordRequest } from '../types/api';

/**
 * Return type for useProfile hook
 */
export interface UseProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileRequest) => Promise<User>;
  changePassword: (passwordData: ChangePasswordRequest) => Promise<void>;
  uploadProfileImage: (imageUri: string) => Promise<string>;
  clearError: () => void;
}

/**
 * Custom hook for user profile operations
 * Manages profile state, loading states, and error handling
 * 
 * Requirements:
 * - 32.5: Provide useProfile hook for fetching and updating user profiles
 * - 32.9: Handle loading and error states within hooks
 * - 32.10: Return data, loading, and error states from all hooks
 * 
 * @returns Profile state and operations
 */
export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user profile
   * Requirement: 32.5 - Fetch user profile
   * 
   * @throws Error if fetch fails
   */
  const fetchProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await userService.getProfile();
      setProfile(profileData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile';
      setError(errorMessage);
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user profile
   * Requirement: 32.5 - Update user profile
   * 
   * @param profileData - Updated profile data
   * @returns Updated user profile
   * @throws Error if update fails
   */
  const updateProfile = async (profileData: UpdateProfileRequest): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await userService.updateProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      console.error('Failed to update profile:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change user password
   * Requirement: 32.5 - Change user password
   * 
   * @param passwordData - Current and new password data
   * @throws Error if password change fails
   */
  const changePassword = async (passwordData: ChangePasswordRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await userService.changePassword(passwordData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change password';
      setError(errorMessage);
      console.error('Failed to change password:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload profile image
   * Requirement: 32.5 - Upload profile image
   * 
   * @param imageUri - Local URI of the image to upload
   * @returns URL of the uploaded image
   * @throws Error if upload fails
   */
  const uploadProfileImage = async (imageUri: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const uploadResponse = await userService.uploadImage(imageUri, 'profile');
      return uploadResponse.url;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload image';
      setError(errorMessage);
      console.error('Failed to upload image:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   * Useful for dismissing error messages
   */
  const clearError = (): void => {
    setError(null);
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    uploadProfileImage,
    clearError,
  };
};

export default useProfile;

/**
 * User Service
 * Handles all user-related API calls
 * Requirements: 22.2, 23.6, 64.5, 56.2, 57.1, 25.7
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../constants/api';
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  UploadResponse,
  ApiResponse,
} from '../types/api';
import { User } from '../types/models';

/**
 * Get user profile
 * Requirement: 22.2 - Fetch user profile from /api/auth/me
 * 
 * @returns Promise with user profile data
 */
export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(
    API_ENDPOINTS.ME
  );
  return response.data.data;
};

/**
 * Update user profile
 * Requirement: 23.6 - Send PUT request to /api/users/profile
 * 
 * @param profileData - Updated profile data
 * @returns Promise with updated user data
 */
export const updateProfile = async (
  profileData: UpdateProfileRequest
): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>(
    API_ENDPOINTS.PROFILE,
    profileData
  );
  return response.data.data;
};

/**
 * Change user password
 * Requirement: 64.5 - Send PUT request to /api/users/change-password
 * 
 * @param passwordData - Current and new password data
 * @returns Promise with success message
 */
export const changePassword = async (
  passwordData: ChangePasswordRequest
): Promise<{ message: string }> => {
  const response = await apiClient.put<ApiResponse<{ message: string }>>(
    API_ENDPOINTS.CHANGE_PASSWORD,
    passwordData
  );
  return response.data.data;
};

/**
 * Get user by ID
 * Requirement: 56.2 - Fetch user details by ID
 * 
 * @param userId - User ID
 * @returns Promise with user data
 */
export const getUserById = async (userId: string): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(
    `${API_ENDPOINTS.USERS}/${userId}`
  );
  return response.data.data;
};

/**
 * Get featured artisans
 * Requirement: 57.1 - Fetch featured artisans from /api/users/featured
 * 
 * @returns Promise with array of featured artisan users
 */
export const getFeaturedArtisans = async (): Promise<User[]> => {
  const response = await apiClient.get<ApiResponse<User[]>>(
    API_ENDPOINTS.FEATURED_ARTISANS
  );
  return response.data.data;
};

/**
 * Upload image
 * Requirement: 25.7 - Send images to /api/upload endpoint
 * 
 * @param imageUri - Local URI of the image to upload
 * @param type - Type of upload ('profile' or 'service')
 * @returns Promise with uploaded image URL
 */
export const uploadImage = async (
  imageUri: string,
  type: 'profile' | 'service' = 'profile'
): Promise<UploadResponse> => {
  // Create FormData for multipart/form-data upload
  const formData = new FormData();
  
  // Extract filename from URI
  const filename = imageUri.split('/').pop() || 'image.jpg';
  
  // Determine MIME type from filename extension
  const match = /\.(\w+)$/.exec(filename);
  const mimeType = match ? `image/${match[1]}` : 'image/jpeg';
  
  // Append image file to FormData
  // @ts-ignore - React Native FormData accepts this format
  formData.append('image', {
    uri: imageUri,
    name: filename,
    type: mimeType,
  });
  
  // Append upload type
  formData.append('type', type);
  
  // Send multipart/form-data request
  const response = await apiClient.post<ApiResponse<UploadResponse>>(
    API_ENDPOINTS.UPLOAD,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data.data;
};

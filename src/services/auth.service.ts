/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Requirements: 2.3, 2.4, 2.5
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../constants/api';
import {
  LoginRequest,
  LoginResponse,
  RegisterCustomerRequest,
  RegisterArtisanRequest,
  ApiResponse,
} from '../types/api';
import { User } from '../types/models';

/**
 * Login user with email and password
 * Requirement: 2.3 - POST request to /api/auth/login
 * 
 * @param credentials - User email and password
 * @returns Promise with JWT token and user data
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.LOGIN,
    credentials
  );
  return response.data.data;
};

/**
 * Register a new customer
 * Requirement: 2.4 - POST request to /api/auth/register/customer
 * 
 * @param customerData - Customer registration data (fullName, email, password, location)
 * @returns Promise with JWT token and user data
 */
export const registerCustomer = async (
  customerData: RegisterCustomerRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.REGISTER_CUSTOMER,
    customerData
  );
  return response.data.data;
};

/**
 * Register a new artisan
 * Requirement: 2.5 - POST request to /api/auth/register/artisan
 * 
 * @param artisanData - Artisan registration data (contactName, businessName, email, password, phoneNumber, location)
 * @returns Promise with JWT token and user data
 */
export const registerArtisan = async (
  artisanData: RegisterArtisanRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.REGISTER_ARTISAN,
    artisanData
  );
  return response.data.data;
};

/**
 * Get current authenticated user profile
 * Fetches the user's profile data using the stored JWT token
 * 
 * @returns Promise with user data
 */
export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(
    API_ENDPOINTS.ME
  );
  return response.data.data;
};

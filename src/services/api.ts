/**
 * Axios API client with interceptors
 * Requirements: 2.8, 2.9, 26.2, 52.3, 52.7, 72.1, 72.2, 72.3, 72.4, 72.5
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../constants/api';
import { getAuthToken, clearAllStorage } from '../utils/storage';

/**
 * Create Axios instance with base configuration
 * Requirement: 72.1
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add Authorization header with JWT token
 * Requirements: 2.8, 72.2
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Retrieve JWT token from AsyncStorage
      const token = await getAuthToken();
      
      // Add Authorization header if token exists
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle 401 errors and retry logic
 * Requirements: 2.9, 26.2, 52.3, 52.7, 72.3, 72.4, 72.5
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful response
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };
    
    // Handle 401 Unauthorized errors - trigger logout
    // Requirement: 2.9, 26.2
    if (error.response?.status === 401) {
      try {
        // Clear auth state from AsyncStorage
        await clearAllStorage();
        
        // Note: Navigation to login screen should be handled by the app's auth context
        // This is because we can't directly access navigation from the API service layer
        console.log('401 Unauthorized - User session expired');
        
        // Reject the promise to allow the calling code to handle the redirect
        return Promise.reject(error);
      } catch (clearError) {
        console.error('Error clearing storage on 401:', clearError);
        return Promise.reject(error);
      }
    }
    
    // Handle 5xx server errors with exponential backoff retry logic
    // Requirements: 52.3, 52.7, 72.4, 72.5
    if (
      error.response?.status &&
      error.response.status >= 500 &&
      error.response.status < 600 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // Initialize retry count
      originalRequest._retryCount = originalRequest._retryCount || 0;
      
      // Check if we've exceeded max retry attempts
      if (originalRequest._retryCount < API_CONFIG.RETRY_ATTEMPTS) {
        originalRequest._retry = true;
        originalRequest._retryCount += 1;
        
        // Calculate exponential backoff delay
        // Formula: RETRY_DELAY * (2 ^ retryCount)
        // Example: 1000ms, 2000ms, 4000ms for 3 attempts
        const backoffDelay = API_CONFIG.RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);
        
        console.log(
          `Retrying request (attempt ${originalRequest._retryCount}/${API_CONFIG.RETRY_ATTEMPTS}) ` +
          `after ${backoffDelay}ms delay due to ${error.response.status} error`
        );
        
        // Wait for backoff delay before retrying
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        
        // Retry the request
        return apiClient(originalRequest);
      } else {
        console.error(
          `Max retry attempts (${API_CONFIG.RETRY_ATTEMPTS}) exceeded for request to ${originalRequest.url}`
        );
      }
    }
    
    // Return error for all other cases
    return Promise.reject(error);
  }
);

/**
 * Helper function to extract error message from API error response
 * 
 * @param error - Axios error object
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Check for response error message
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    // Check for network errors
    if (error.message === 'Network Error') {
      return 'No internet connection. Please check your network and try again.';
    }
    
    // Check for timeout errors
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    
    // Return generic error message
    return error.message || 'An unexpected error occurred';
  }
  
  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Helper function to check if error is a network error
 * 
 * @param error - Error object
 * @returns True if network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return error.message === 'Network Error' || error.code === 'ECONNABORTED';
  }
  return false;
};

/**
 * Helper function to check if error is a 401 Unauthorized error
 * 
 * @param error - Error object
 * @returns True if 401 error
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 401;
  }
  return false;
};

/**
 * Helper function to check if error is a server error (5xx)
 * 
 * @param error - Error object
 * @returns True if server error
 */
export const isServerError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status !== undefined && status >= 500 && status < 600;
  }
  return false;
};

export default apiClient;

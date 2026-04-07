/**
 * Service Request Service
 * Handles all service request-related API calls
 * Requirements: 7.5, 10.2, 13.2, 14.5, 14.7, 61.3
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../constants/api';
import {
  ApiResponse,
  CreateServiceRequestRequest,
  RespondToRequestRequest,
  DeclineRequestRequest,
} from '../types/api';
import { ServiceRequest } from '../types/models';

/**
 * Get customer's service requests
 * Requirement: 10.2 - GET request to /api/service-requests/my-requests
 * 
 * @returns Promise with array of customer service requests
 */
export const getMyRequests = async (): Promise<ServiceRequest[]> => {
  const response = await apiClient.get<ApiResponse<ServiceRequest[]>>(
    API_ENDPOINTS.MY_REQUESTS
  );
  return response.data.data;
};

/**
 * Get artisan's service request inbox
 * Requirement: 13.2 - GET request to /api/service-requests/inbox
 * 
 * @returns Promise with array of incoming service requests for artisan
 */
export const getInbox = async (): Promise<ServiceRequest[]> => {
  const response = await apiClient.get<ApiResponse<ServiceRequest[]>>(
    API_ENDPOINTS.REQUEST_INBOX
  );
  return response.data.data;
};

/**
 * Get service request by ID
 * Requirement: 14.2 - GET request to /api/service-requests/:id
 * 
 * @param requestId - Service request ID
 * @returns Promise with service request details
 */
export const getRequestById = async (requestId: string): Promise<ServiceRequest> => {
  const response = await apiClient.get<ApiResponse<ServiceRequest>>(
    `${API_ENDPOINTS.SERVICE_REQUESTS}/${requestId}`
  );
  return response.data.data;
};

/**
 * Create a new service request
 * Requirement: 7.5 - POST request to /api/service-requests
 * 
 * @param requestData - Service request creation data
 * @returns Promise with created service request
 */
export const createRequest = async (
  requestData: CreateServiceRequestRequest
): Promise<ServiceRequest> => {
  const response = await apiClient.post<ApiResponse<ServiceRequest>>(
    API_ENDPOINTS.SERVICE_REQUESTS,
    requestData
  );
  return response.data.data;
};

/**
 * Accept a service request (artisan)
 * Requirement: 14.5 - PUT request to /api/service-requests/:id/accept
 * 
 * @param requestId - Service request ID to accept
 * @param responseData - Optional message and proposed terms
 * @returns Promise with updated service request
 */
export const acceptRequest = async (
  requestId: string,
  responseData: RespondToRequestRequest
): Promise<ServiceRequest> => {
  const response = await apiClient.put<ApiResponse<ServiceRequest>>(
    `${API_ENDPOINTS.SERVICE_REQUESTS}/${requestId}/accept`,
    responseData
  );
  return response.data.data;
};

/**
 * Decline a service request (artisan)
 * Requirement: 14.7 - PUT request to /api/service-requests/:id/decline
 * 
 * @param requestId - Service request ID to decline
 * @param declineData - Decline reason
 * @returns Promise with updated service request
 */
export const declineRequest = async (
  requestId: string,
  declineData: DeclineRequestRequest
): Promise<ServiceRequest> => {
  const response = await apiClient.put<ApiResponse<ServiceRequest>>(
    `${API_ENDPOINTS.SERVICE_REQUESTS}/${requestId}/decline`,
    declineData
  );
  return response.data.data;
};

/**
 * Retract a service request (customer)
 * Requirement: 61.3 - PUT request to /api/service-requests/:id/retract
 * 
 * @param requestId - Service request ID to retract
 * @returns Promise with updated service request
 */
export const retractRequest = async (requestId: string): Promise<ServiceRequest> => {
  const response = await apiClient.put<ApiResponse<ServiceRequest>>(
    `${API_ENDPOINTS.SERVICE_REQUESTS}/${requestId}/retract`
  );
  return response.data.data;
};

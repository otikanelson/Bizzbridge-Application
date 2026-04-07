/**
 * Service Service
 * Handles all service-related API calls
 * Requirements: 4.2, 5.2, 6.2, 15.2, 16.9, 17.4, 58.3, 63.3
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../constants/api';
import {
  ApiResponse,
  PaginatedResponse,
  SearchServicesParams,
  CreateServiceRequest,
} from '../types/api';
import { Service } from '../types/models';

/**
 * Search services with filters, pagination, and sorting
 * Requirements: 5.2 - GET request to /api/services/search with query parameters
 * 
 * @param params - Search parameters (query, category, lga, pricingType, sortBy, page, limit)
 * @returns Promise with paginated service results
 */
export const searchServices = async (
  params: SearchServicesParams
): Promise<PaginatedResponse<Service>> => {
  const response = await apiClient.get<PaginatedResponse<Service>>(
    API_ENDPOINTS.SERVICES_SEARCH,
    { params }
  );
  return response.data;
};

/**
 * Get service by ID
 * Requirement: 6.2 - GET request to /api/services/:id
 * 
 * @param serviceId - Service ID
 * @returns Promise with service details
 */
export const getServiceById = async (serviceId: string): Promise<Service> => {
  const response = await apiClient.get<ApiResponse<Service>>(
    `${API_ENDPOINTS.SERVICES}/${serviceId}`
  );
  return response.data.data;
};

/**
 * Get featured services for home screen
 * Requirement: 4.2 - GET request to /api/services/featured
 * 
 * @returns Promise with array of featured services
 */
export const getFeaturedServices = async (): Promise<Service[]> => {
  const response = await apiClient.get<ApiResponse<Service[]>>(
    API_ENDPOINTS.SERVICES_FEATURED
  );
  return response.data.data;
};

/**
 * Get artisan's own services
 * Requirement: 15.2 - GET request to /api/services/my-services
 * 
 * @returns Promise with array of artisan's services
 */
export const getMyServices = async (): Promise<Service[]> => {
  const response = await apiClient.get<ApiResponse<Service[]>>(
    API_ENDPOINTS.MY_SERVICES
  );
  return response.data.data;
};

/**
 * Create a new service
 * Requirement: 16.9 - POST request to /api/services
 * 
 * @param serviceData - Service creation data
 * @returns Promise with created service
 */
export const createService = async (
  serviceData: CreateServiceRequest
): Promise<Service> => {
  const response = await apiClient.post<ApiResponse<Service>>(
    API_ENDPOINTS.SERVICES,
    serviceData
  );
  return response.data.data;
};

/**
 * Update an existing service
 * Requirement: 17.4 - PUT request to /api/services/:id
 * 
 * @param serviceId - Service ID to update
 * @param serviceData - Updated service data
 * @returns Promise with updated service
 */
export const updateService = async (
  serviceId: string,
  serviceData: Partial<CreateServiceRequest>
): Promise<Service> => {
  const response = await apiClient.put<ApiResponse<Service>>(
    `${API_ENDPOINTS.SERVICES}/${serviceId}`,
    serviceData
  );
  return response.data.data;
};

/**
 * Delete a service
 * Requirement: 58.3 - DELETE request to /api/services/:id
 * 
 * @param serviceId - Service ID to delete
 * @returns Promise with success response
 */
export const deleteService = async (serviceId: string): Promise<void> => {
  await apiClient.delete<ApiResponse<void>>(
    `${API_ENDPOINTS.SERVICES}/${serviceId}`
  );
};

/**
 * Toggle service active status
 * Requirement: 63.3 - PATCH request to /api/services/:id/toggle-status
 * 
 * @param serviceId - Service ID to toggle status
 * @returns Promise with updated service
 */
export const toggleServiceStatus = async (serviceId: string): Promise<Service> => {
  const response = await apiClient.patch<ApiResponse<Service>>(
    `${API_ENDPOINTS.SERVICES}/${serviceId}/toggle-status`
  );
  return response.data.data;
};

/**
 * useServices Hook
 * Custom hook for service state management
 * Requirements: 32.2, 32.9, 32.10
 */

import { useState } from 'react';
import * as serviceService from '../services/service.service';
import { Service } from '../types/models';
import { CreateServiceRequest, SearchServicesParams } from '../types/api';

/**
 * Return type for useServices hook
 */
export interface UseServicesReturn {
  services: Service[];
  service: Service | null;
  loading: boolean;
  error: string | null;
  fetchServices: (params?: SearchServicesParams) => Promise<void>;
  fetchServiceById: (serviceId: string) => Promise<void>;
  createService: (serviceData: CreateServiceRequest) => Promise<Service>;
  updateService: (serviceId: string, serviceData: Partial<CreateServiceRequest>) => Promise<Service>;
  deleteService: (serviceId: string) => Promise<void>;
  toggleServiceStatus: (serviceId: string) => Promise<Service>;
  clearError: () => void;
}

/**
 * Custom hook for service operations
 * Manages service state, loading states, and error handling
 * 
 * Requirements:
 * - 32.2: Provide useServices hook for fetching and managing services
 * - 32.9: Handle loading and error states within hooks
 * - 32.10: Return data, loading, and error states from all hooks
 * 
 * @returns Service state and operations
 */
export const useServices = (): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch services with optional search parameters
   * Can be used for searching, filtering, or fetching all services
   * Requirement: 32.2 - Fetch and manage services
   * 
   * @param params - Optional search parameters (query, category, lga, etc.)
   * @throws Error if fetch fails
   */
  const fetchServices = async (params?: SearchServicesParams): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await serviceService.searchServices(params || {});
      setServices(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch services';
      setError(errorMessage);
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a single service by ID
   * Requirement: 32.2 - Fetch and manage services
   * 
   * @param serviceId - Service ID to fetch
   * @throws Error if fetch fails
   */
  const fetchServiceById = async (serviceId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const serviceData = await serviceService.getServiceById(serviceId);
      setService(serviceData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch service';
      setError(errorMessage);
      console.error('Failed to fetch service:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new service
   * Requirement: 32.2 - Manage services
   * 
   * @param serviceData - Service creation data
   * @returns Created service
   * @throws Error if creation fails
   */
  const createService = async (serviceData: CreateServiceRequest): Promise<Service> => {
    try {
      setLoading(true);
      setError(null);
      const newService = await serviceService.createService(serviceData);
      setService(newService);
      // Add to services list if it exists
      setServices(prev => [newService, ...prev]);
      return newService;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create service';
      setError(errorMessage);
      console.error('Failed to create service:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing service
   * Requirement: 32.2 - Manage services
   * 
   * @param serviceId - Service ID to update
   * @param serviceData - Updated service data
   * @returns Updated service
   * @throws Error if update fails
   */
  const updateService = async (
    serviceId: string,
    serviceData: Partial<CreateServiceRequest>
  ): Promise<Service> => {
    try {
      setLoading(true);
      setError(null);
      const updatedService = await serviceService.updateService(serviceId, serviceData);
      setService(updatedService);
      // Update in services list if it exists
      setServices(prev =>
        prev.map(s => (s._id === serviceId ? updatedService : s))
      );
      return updatedService;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update service';
      setError(errorMessage);
      console.error('Failed to update service:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a service
   * Requirement: 32.2 - Manage services
   * 
   * @param serviceId - Service ID to delete
   * @throws Error if deletion fails
   */
  const deleteService = async (serviceId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await serviceService.deleteService(serviceId);
      // Remove from services list
      setServices(prev => prev.filter(s => s._id !== serviceId));
      // Clear current service if it's the one being deleted
      if (service?._id === serviceId) {
        setService(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete service';
      setError(errorMessage);
      console.error('Failed to delete service:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle service active status
   * Requirement: 32.2 - Manage services
   * 
   * @param serviceId - Service ID to toggle status
   * @returns Updated service
   * @throws Error if toggle fails
   */
  const toggleServiceStatus = async (serviceId: string): Promise<Service> => {
    try {
      setLoading(true);
      setError(null);
      const updatedService = await serviceService.toggleServiceStatus(serviceId);
      setService(updatedService);
      // Update in services list if it exists
      setServices(prev =>
        prev.map(s => (s._id === serviceId ? updatedService : s))
      );
      return updatedService;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to toggle service status';
      setError(errorMessage);
      console.error('Failed to toggle service status:', err);
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
    services,
    service,
    loading,
    error,
    fetchServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    clearError,
  };
};

export default useServices;

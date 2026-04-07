/**
 * useServiceRequests Hook
 * Custom hook for service request state management
 * Requirements: 32.4, 32.9, 32.10
 */

import { useState } from 'react';
import * as serviceRequestService from '../services/serviceRequest.service';
import { ServiceRequest } from '../types/models';
import {
  CreateServiceRequestRequest,
  RespondToRequestRequest,
  DeclineRequestRequest,
} from '../types/api';

/**
 * Return type for useServiceRequests hook
 */
export interface UseServiceRequestsReturn {
  requests: ServiceRequest[];
  request: ServiceRequest | null;
  loading: boolean;
  error: string | null;
  fetchMyRequests: () => Promise<void>;
  fetchInbox: () => Promise<void>;
  fetchRequestById: (requestId: string) => Promise<void>;
  createRequest: (requestData: CreateServiceRequestRequest) => Promise<ServiceRequest>;
  acceptRequest: (requestId: string, responseData: RespondToRequestRequest) => Promise<ServiceRequest>;
  declineRequest: (requestId: string, reason: string) => Promise<ServiceRequest>;
  retractRequest: (requestId: string) => Promise<ServiceRequest>;
  clearError: () => void;
}

/**
 * Custom hook for service request operations
 * Manages service request state, loading states, and error handling
 * 
 * Requirements:
 * - 32.4: Provide useServiceRequests hook for fetching and managing service requests
 * - 32.9: Handle loading and error states within hooks
 * - 32.10: Return data, loading, and error states from all hooks
 * 
 * @returns Service request state and operations
 */
export const useServiceRequests = (): UseServiceRequestsReturn => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch customer's service requests
   * Requirement: 32.4 - Fetch and manage service requests
   * 
   * @throws Error if fetch fails
   */
  const fetchMyRequests = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const requestsData = await serviceRequestService.getMyRequests();
      setRequests(requestsData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch requests';
      setError(errorMessage);
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch artisan's service request inbox
   * Requirement: 32.4 - Fetch and manage service requests
   * 
   * @throws Error if fetch fails
   */
  const fetchInbox = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const inboxData = await serviceRequestService.getInbox();
      setRequests(inboxData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch inbox';
      setError(errorMessage);
      console.error('Failed to fetch inbox:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a single service request by ID
   * Requirement: 32.4 - Fetch and manage service requests
   * 
   * @param requestId - Service request ID to fetch
   * @throws Error if fetch fails
   */
  const fetchRequestById = async (requestId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const requestData = await serviceRequestService.getRequestById(requestId);
      setRequest(requestData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch request';
      setError(errorMessage);
      console.error('Failed to fetch request:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new service request
   * Requirement: 32.4 - Manage service requests
   * 
   * @param requestData - Service request creation data
   * @returns Created service request
   * @throws Error if creation fails
   */
  const createRequest = async (
    requestData: CreateServiceRequestRequest
  ): Promise<ServiceRequest> => {
    try {
      setLoading(true);
      setError(null);
      const newRequest = await serviceRequestService.createRequest(requestData);
      setRequest(newRequest);
      // Add to requests list if it exists
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create request';
      setError(errorMessage);
      console.error('Failed to create request:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Accept a service request (artisan)
   * Requirement: 32.4 - Manage service requests
   * 
   * @param requestId - Service request ID to accept
   * @param responseData - Optional message and proposed terms
   * @returns Updated service request
   * @throws Error if acceptance fails
   */
  const acceptRequest = async (
    requestId: string,
    responseData: RespondToRequestRequest
  ): Promise<ServiceRequest> => {
    try {
      setLoading(true);
      setError(null);
      const updatedRequest = await serviceRequestService.acceptRequest(requestId, responseData);
      setRequest(updatedRequest);
      // Update in requests list if it exists
      setRequests(prev =>
        prev.map(r => (r._id === requestId ? updatedRequest : r))
      );
      return updatedRequest;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to accept request';
      setError(errorMessage);
      console.error('Failed to accept request:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Decline a service request (artisan)
   * Requirement: 32.4 - Manage service requests
   * 
   * @param requestId - Service request ID to decline
   * @param reason - Decline reason
   * @returns Updated service request
   * @throws Error if decline fails
   */
  const declineRequest = async (
    requestId: string,
    reason: string
  ): Promise<ServiceRequest> => {
    try {
      setLoading(true);
      setError(null);
      const declineData: DeclineRequestRequest = { reason };
      const updatedRequest = await serviceRequestService.declineRequest(requestId, declineData);
      setRequest(updatedRequest);
      // Update in requests list if it exists
      setRequests(prev =>
        prev.map(r => (r._id === requestId ? updatedRequest : r))
      );
      return updatedRequest;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to decline request';
      setError(errorMessage);
      console.error('Failed to decline request:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retract a service request (customer)
   * Requirement: 32.4 - Manage service requests
   * 
   * @param requestId - Service request ID to retract
   * @returns Updated service request
   * @throws Error if retraction fails
   */
  const retractRequest = async (requestId: string): Promise<ServiceRequest> => {
    try {
      setLoading(true);
      setError(null);
      const updatedRequest = await serviceRequestService.retractRequest(requestId);
      setRequest(updatedRequest);
      // Update in requests list if it exists
      setRequests(prev =>
        prev.map(r => (r._id === requestId ? updatedRequest : r))
      );
      return updatedRequest;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to retract request';
      setError(errorMessage);
      console.error('Failed to retract request:', err);
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
    requests,
    request,
    loading,
    error,
    fetchMyRequests,
    fetchInbox,
    fetchRequestById,
    createRequest,
    acceptRequest,
    declineRequest,
    retractRequest,
    clearError,
  };
};

export default useServiceRequests;

/**
 * Booking Service
 * Handles all booking-related API calls
 * Requirements: 9.2, 12.2, 18.2, 19.2, 20.5, 59.4, 60.5, 40.5, 21.4, 21.5, 8.2
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../constants/api';
import {
  ApiResponse,
  CreateBookingRequest,
  BookingAnalytics,
} from '../types/api';
import { Booking } from '../types/models';

/**
 * Get customer's bookings
 * Requirement: 9.2 - GET request to /api/bookings/my-bookings
 * 
 * @returns Promise with array of customer bookings
 */
export const getMyBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<ApiResponse<Booking[]>>(
    API_ENDPOINTS.MY_BOOKINGS
  );
  return response.data.data;
};

/**
 * Get artisan's work (bookings)
 * Requirement: 12.2 - GET request to /api/bookings/my-work
 * 
 * @returns Promise with array of artisan bookings
 */
export const getMyWork = async (): Promise<Booking[]> => {
  const response = await apiClient.get<ApiResponse<Booking[]>>(
    API_ENDPOINTS.MY_WORK
  );
  return response.data.data;
};

/**
 * Get booking by ID
 * Requirement: 18.2 - GET request to /api/bookings/:id
 * 
 * @param bookingId - Booking ID
 * @returns Promise with booking details
 */
export const getBookingById = async (bookingId: string): Promise<Booking> => {
  const response = await apiClient.get<ApiResponse<Booking>>(
    `${API_ENDPOINTS.BOOKINGS}/${bookingId}`
  );
  return response.data.data;
};

/**
 * Create a new booking
 * Requirement: 59.4 - POST request to /api/bookings
 * 
 * @param bookingData - Booking creation data
 * @returns Promise with created booking
 */
export const createBooking = async (
  bookingData: CreateBookingRequest
): Promise<Booking> => {
  const response = await apiClient.post<ApiResponse<Booking>>(
    API_ENDPOINTS.BOOKINGS,
    bookingData
  );
  return response.data.data;
};

/**
 * Mark booking as completed
 * Requirement: 19.2 - PUT request to /api/bookings/:id/complete
 * 
 * @param bookingId - Booking ID to complete
 * @returns Promise with updated booking
 */
export const completeBooking = async (bookingId: string): Promise<Booking> => {
  const response = await apiClient.put<ApiResponse<Booking>>(
    `${API_ENDPOINTS.BOOKINGS}/${bookingId}/complete`
  );
  return response.data.data;
};

/**
 * Cancel a booking
 * Requirement: 20.5 - PUT request to /api/bookings/:id/cancel
 * 
 * @param bookingId - Booking ID to cancel
 * @param reason - Cancellation reason
 * @param description - Optional cancellation description
 * @returns Promise with updated booking
 */
export const cancelBooking = async (
  bookingId: string,
  reason: string,
  description?: string
): Promise<Booking> => {
  const response = await apiClient.put<ApiResponse<Booking>>(
    `${API_ENDPOINTS.BOOKINGS}/${bookingId}/cancel`,
    { reason, description }
  );
  return response.data.data;
};

/**
 * Accept booking contract
 * Requirement: 60.5 - PUT request to /api/bookings/:id/accept-contract
 * 
 * @param bookingId - Booking ID to accept contract
 * @returns Promise with updated booking
 */
export const acceptContract = async (bookingId: string): Promise<Booking> => {
  const response = await apiClient.put<ApiResponse<Booking>>(
    `${API_ENDPOINTS.BOOKINGS}/${bookingId}/accept-contract`
  );
  return response.data.data;
};

/**
 * File a dispute for a booking
 * Requirement: 40.5 - PUT request to /api/bookings/:id/dispute
 * 
 * @param bookingId - Booking ID to file dispute
 * @param reason - Dispute reason
 * @param description - Dispute description
 * @returns Promise with updated booking
 */
export const fileDispute = async (
  bookingId: string,
  reason: string,
  description: string
): Promise<Booking> => {
  const response = await apiClient.put<ApiResponse<Booking>>(
    `${API_ENDPOINTS.BOOKINGS}/${bookingId}/dispute`,
    { reason, description }
  );
  return response.data.data;
};

/**
 * Add a message to a booking
 * Requirement: 21.4 - POST request to /api/bookings/:id/messages
 * 
 * @param bookingId - Booking ID to add message
 * @param message - Message text
 * @returns Promise with updated booking
 */
export const addMessage = async (
  bookingId: string,
  message: string
): Promise<Booking> => {
  const response = await apiClient.post<ApiResponse<Booking>>(
    `${API_ENDPOINTS.BOOKINGS}/${bookingId}/messages`,
    { message }
  );
  return response.data.data;
};

/**
 * Get booking analytics
 * Requirement: 8.2 - GET request to /api/bookings/analytics
 * 
 * @returns Promise with booking analytics data
 */
export const getAnalytics = async (): Promise<BookingAnalytics> => {
  const response = await apiClient.get<ApiResponse<BookingAnalytics>>(
    API_ENDPOINTS.BOOKING_ANALYTICS
  );
  return response.data.data;
};

/**
 * Submit a review for a booking
 * Requirement: 21.5 - POST request to /api/bookings/:id/review
 * 
 * @param bookingId - Booking ID to review
 * @param rating - Rating from 1 to 5
 * @param comment - Optional review comment
 * @returns Promise with updated booking
 */
export const submitReview = async (
  bookingId: string,
  rating: number,
  comment?: string
): Promise<Booking> => {
  const response = await apiClient.post<ApiResponse<Booking>>(
    `${API_ENDPOINTS.BOOKINGS}/${bookingId}/review`,
    { rating, comment }
  );
  return response.data.data;
};

/**
 * useBookings Hook
 * Custom hook for booking state management
 * Requirements: 32.3, 32.9, 32.10
 */

import { useState } from 'react';
import * as bookingService from '../services/booking.service';
import { Booking } from '../types/models';
import { CreateBookingRequest } from '../types/api';

/**
 * Return type for useBookings hook
 */
export interface UseBookingsReturn {
  bookings: Booking[];
  booking: Booking | null;
  loading: boolean;
  error: string | null;
  fetchMyBookings: () => Promise<void>;
  fetchMyWork: () => Promise<void>;
  fetchBookingById: (bookingId: string) => Promise<void>;
  createBooking: (bookingData: CreateBookingRequest) => Promise<Booking>;
  completeBooking: (bookingId: string) => Promise<Booking>;
  cancelBooking: (bookingId: string, reason: string, description?: string) => Promise<Booking>;
  acceptContract: (bookingId: string) => Promise<Booking>;
  fileDispute: (bookingId: string, reason: string, description: string) => Promise<Booking>;
  addMessage: (bookingId: string, message: string) => Promise<Booking>;
  submitReview: (bookingId: string, rating: number, comment?: string) => Promise<Booking>;
  clearError: () => void;
}

/**
 * Custom hook for booking operations
 * Manages booking state, loading states, and error handling
 * 
 * Requirements:
 * - 32.3: Provide useBookings hook for fetching and managing bookings
 * - 32.9: Handle loading and error states within hooks
 * - 32.10: Return data, loading, and error states from all hooks
 * 
 * @returns Booking state and operations
 */
export const useBookings = (): UseBookingsReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch customer's bookings
   * Requirement: 32.3 - Fetch and manage bookings
   * 
   * @throws Error if fetch fails
   */
  const fetchMyBookings = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const bookingsData = await bookingService.getMyBookings();
      setBookings(bookingsData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch bookings';
      setError(errorMessage);
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch artisan's work (bookings)
   * Requirement: 32.3 - Fetch and manage bookings
   * 
   * @throws Error if fetch fails
   */
  const fetchMyWork = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const workData = await bookingService.getMyWork();
      setBookings(workData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch work';
      setError(errorMessage);
      console.error('Failed to fetch work:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a single booking by ID
   * Requirement: 32.3 - Fetch and manage bookings
   * 
   * @param bookingId - Booking ID to fetch
   * @throws Error if fetch fails
   */
  const fetchBookingById = async (bookingId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const bookingData = await bookingService.getBookingById(bookingId);
      setBooking(bookingData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch booking';
      setError(errorMessage);
      console.error('Failed to fetch booking:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new booking
   * Requirement: 32.3 - Manage bookings
   * 
   * @param bookingData - Booking creation data
   * @returns Created booking
   * @throws Error if creation fails
   */
  const createBooking = async (bookingData: CreateBookingRequest): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const newBooking = await bookingService.createBooking(bookingData);
      setBooking(newBooking);
      // Add to bookings list if it exists
      setBookings(prev => [newBooking, ...prev]);
      return newBooking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create booking';
      setError(errorMessage);
      console.error('Failed to create booking:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mark booking as completed
   * Requirement: 32.3 - Manage bookings
   * 
   * @param bookingId - Booking ID to complete
   * @returns Updated booking
   * @throws Error if completion fails
   */
  const completeBooking = async (bookingId: string): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await bookingService.completeBooking(bookingId);
      setBooking(updatedBooking);
      // Update in bookings list if it exists
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? updatedBooking : b))
      );
      return updatedBooking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to complete booking';
      setError(errorMessage);
      console.error('Failed to complete booking:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel a booking
   * Requirement: 32.3 - Manage bookings
   * 
   * @param bookingId - Booking ID to cancel
   * @param reason - Cancellation reason
   * @param description - Optional cancellation description
   * @returns Updated booking
   * @throws Error if cancellation fails
   */
  const cancelBooking = async (
    bookingId: string,
    reason: string,
    description?: string
  ): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await bookingService.cancelBooking(bookingId, reason, description);
      setBooking(updatedBooking);
      // Update in bookings list if it exists
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? updatedBooking : b))
      );
      return updatedBooking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to cancel booking';
      setError(errorMessage);
      console.error('Failed to cancel booking:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Accept booking contract
   * Requirement: 32.3 - Manage bookings
   * 
   * @param bookingId - Booking ID to accept contract
   * @returns Updated booking
   * @throws Error if acceptance fails
   */
  const acceptContract = async (bookingId: string): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await bookingService.acceptContract(bookingId);
      setBooking(updatedBooking);
      // Update in bookings list if it exists
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? updatedBooking : b))
      );
      return updatedBooking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to accept contract';
      setError(errorMessage);
      console.error('Failed to accept contract:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * File a dispute for a booking
   * Requirement: 32.3 - Manage bookings
   * 
   * @param bookingId - Booking ID to file dispute
   * @param reason - Dispute reason
   * @param description - Dispute description
   * @returns Updated booking
   * @throws Error if dispute filing fails
   */
  const fileDispute = async (
    bookingId: string,
    reason: string,
    description: string
  ): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await bookingService.fileDispute(bookingId, reason, description);
      setBooking(updatedBooking);
      // Update in bookings list if it exists
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? updatedBooking : b))
      );
      return updatedBooking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to file dispute';
      setError(errorMessage);
      console.error('Failed to file dispute:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a message to a booking
   * Requirement: 32.3 - Manage bookings
   * 
   * @param bookingId - Booking ID to add message
   * @param message - Message text
   * @returns Updated booking
   * @throws Error if adding message fails
   */
  const addMessage = async (bookingId: string, message: string): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await bookingService.addMessage(bookingId, message);
      setBooking(updatedBooking);
      // Update in bookings list if it exists
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? updatedBooking : b))
      );
      return updatedBooking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add message';
      setError(errorMessage);
      console.error('Failed to add message:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit a review for a booking
   * Requirement: 32.3 - Manage bookings
   * 
   * @param bookingId - Booking ID to review
   * @param rating - Rating from 1 to 5
   * @param comment - Optional review comment
   * @returns Updated booking
   * @throws Error if review submission fails
   */
  const submitReview = async (
    bookingId: string,
    rating: number,
    comment?: string
  ): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await bookingService.submitReview(bookingId, rating, comment);
      setBooking(updatedBooking);
      // Update in bookings list if it exists
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? updatedBooking : b))
      );
      return updatedBooking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit review';
      setError(errorMessage);
      console.error('Failed to submit review:', err);
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
    bookings,
    booking,
    loading,
    error,
    fetchMyBookings,
    fetchMyWork,
    fetchBookingById,
    createBooking,
    completeBooking,
    cancelBooking,
    acceptContract,
    fileDispute,
    addMessage,
    submitReview,
    clearError,
  };
};

export default useBookings;

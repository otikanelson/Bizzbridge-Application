/**
 * useSearch Hook
 * Custom hook for search state management with debouncing
 * Requirements: 32.6, 38.3, 38.4, 51.3
 */

import { useState, useEffect, useRef } from 'react';
import * as serviceService from '../services/service.service';
import { Service } from '../types/models';
import { SearchServicesParams } from '../types/api';
import { debounce } from '../utils/helpers';

/**
 * Search filters interface
 */
export interface SearchFilters {
  category?: string;
  lga?: string;
  pricingType?: string;
  sortBy?: 'newest' | 'rating' | 'reviews' | 'price_asc' | 'price_desc';
}

/**
 * Return type for useSearch hook
 */
export interface UseSearchReturn {
  results: Service[];
  query: string;
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  search: (params?: SearchServicesParams) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for search operations with debouncing
 * Manages search state, query, filters, and implements debounced search
 * 
 * Requirements:
 * - 32.6: Provide useSearch hook for search state management
 * - 38.3: Implement debounced search with 500ms delay
 * - 38.4: Support filtering by category, location, and pricing type
 * - 51.3: Debounce search input to reduce API calls
 * 
 * @returns Search state and operations
 */
export const useSearch = (): UseSearchReturn => {
  const [results, setResults] = useState<Service[]>([]);
  const [query, setQuery] = useState('');
  const [filters, setFiltersState] = useState<SearchFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Perform search with current query and filters
   * Requirement: 32.6 - Search state management
   * 
   * @param params - Optional search parameters to override current state
   * @throws Error if search fails
   */
  const search = async (params?: SearchServicesParams): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Build search parameters from current state or provided params
      const searchParams: SearchServicesParams = params || {
        query: query || undefined,
        category: filters.category,
        lga: filters.lga,
        pricingType: filters.pricingType,
        sortBy: filters.sortBy,
      };

      const response = await serviceService.searchServices(searchParams);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setResults(response.data);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to search services';
      if (isMounted.current) {
        setError(errorMessage);
      }
      console.error('Failed to search services:', err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  /**
   * Debounced search function
   * Requirement: 38.3, 51.3 - Implement debounced search with 500ms delay
   * Using useRef to maintain stable debounced function across renders
   */
  const debouncedSearchRef = useRef(
    debounce(() => {
      search();
    }, 500)
  );

  // Update the debounced function when search changes
  useEffect(() => {
    debouncedSearchRef.current = debounce(() => {
      search();
    }, 500);
  }, [query, filters]);

  /**
   * Set search query and trigger debounced search
   * Requirement: 38.3 - Debounced search with 500ms delay
   * 
   * @param newQuery - Search query string
   */
  const setSearchQuery = (newQuery: string): void => {
    setQuery(newQuery);
    // Trigger debounced search after query is updated
    // The actual search will happen after 500ms of no further changes
  };

  /**
   * Set search filters and trigger immediate search
   * Requirement: 38.4 - Support filtering by category, location, and pricing type
   * 
   * @param newFilters - Search filters object
   */
  const setFilters = (newFilters: SearchFilters): void => {
    setFiltersState(newFilters);
    // Trigger immediate search when filters change
    // Users expect instant results when applying filters
  };

  /**
   * Clear all filters and reset to default state
   * Requirement: 38.4 - Clear filters functionality
   */
  const clearFilters = (): void => {
    setFiltersState({});
    // Trigger search with cleared filters
  };

  /**
   * Clear error state
   * Useful for dismissing error messages
   */
  const clearError = (): void => {
    setError(null);
  };

  /**
   * Effect to trigger debounced search when query changes
   * Requirement: 38.3, 51.3 - Debounced search with 500ms delay
   */
  useEffect(() => {
    if (query) {
      debouncedSearchRef.current();
    } else if (query === '' && results.length > 0) {
      // If query is cleared, perform immediate search to show all results
      search();
    }
  }, [query]);

  /**
   * Effect to trigger immediate search when filters change
   * Requirement: 38.4 - Update results when filters change
   */
  useEffect(() => {
    // Only search if we have filters or a query
    if (Object.keys(filters).length > 0 || query) {
      search();
    }
  }, [filters]);

  return {
    results,
    query,
    filters,
    loading,
    error,
    setSearchQuery,
    setFilters,
    clearFilters,
    search,
    clearError,
  };
};

export default useSearch;

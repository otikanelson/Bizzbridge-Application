/**
 * Formatting utilities for displaying data
 * Requirements: 47.6, 47.7, 42.4, 42.5
 */

import { format, parseISO } from 'date-fns';

/**
 * Formats price in Nigerian Naira with thousand separators
 * Requirements: 47.6, 47.7
 * 
 * @param price - The price value to format
 * @returns Formatted price string with ₦ symbol (e.g., "₦50,000")
 */
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return '₦0';
  }
  
  // Format with thousand separators
  const formatted = numPrice.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return `₦${formatted}`;
};

/**
 * Formats price range for categorized pricing
 * 
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range (e.g., "₦20,000 - ₦100,000")
 */
export const formatPriceRange = (minPrice: number, maxPrice: number): string => {
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

/**
 * Formats date in user-friendly format
 * Requirement: 42.4
 * 
 * @param date - Date string or Date object
 * @param formatString - Optional format string (defaults to "MMM d, yyyy")
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatDate = (
  date: string | Date,
  formatString: string = 'MMM d, yyyy'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Formats date and time together
 * 
 * @param date - Date string or Date object
 * @returns Formatted date and time string (e.g., "Jan 15, 2024 at 2:30 PM")
 */
export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, "MMM d, yyyy 'at' h:mm a");
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Formats time in 12-hour format with AM/PM
 * Requirement: 42.5
 * 
 * @param date - Date string or Date object
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'h:mm a');
  } catch (error) {
    return 'Invalid time';
  }
};

/**
 * Formats relative date (e.g., "2 days ago", "in 3 hours")
 * 
 * @param date - Date string or Date object
 * @returns Relative date string
 */
export const formatRelativeDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
    } else {
      return formatDate(dateObj);
    }
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Formats phone number for display
 * Converts various formats to a consistent display format
 * 
 * @param phoneNumber - Phone number string
 * @returns Formatted phone number (e.g., "+234 801 234 5678")
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) {
    return '';
  }
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle different formats
  let formatted = cleaned;
  
  if (cleaned.startsWith('234')) {
    // Already has country code
    formatted = `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  } else if (cleaned.startsWith('0')) {
    // Local format, add country code
    formatted = `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } else {
    // Unknown format, return as is
    return phoneNumber;
  }
  
  return formatted.trim();
};

/**
 * Formats duration string
 * 
 * @param duration - Duration string (e.g., "2 hours", "3 days")
 * @returns Formatted duration
 */
export const formatDuration = (duration: string): string => {
  if (!duration) {
    return '';
  }
  
  return duration.trim();
};

/**
 * Formats location string
 * 
 * @param lga - LGA name
 * @param locality - Optional locality name
 * @returns Formatted location (e.g., "Ikeja, Lagos" or "Allen Avenue, Ikeja")
 */
export const formatLocation = (lga: string, locality?: string): string => {
  if (locality) {
    return `${locality}, ${lga}`;
  }
  return `${lga}, Lagos`;
};

/**
 * Formats rating display
 * 
 * @param rating - Rating value (1-5)
 * @param reviewCount - Number of reviews
 * @returns Formatted rating string (e.g., "4.5 (23 reviews)")
 */
export const formatRating = (rating: number, reviewCount: number): string => {
  const ratingStr = rating.toFixed(1);
  const reviewStr = reviewCount === 1 ? 'review' : 'reviews';
  return `${ratingStr} (${reviewCount} ${reviewStr})`;
};

/**
 * Formats file size
 * 
 * @param bytes - File size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncates text to specified length with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Capitalizes first letter of each word
 * 
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalizeWords = (text: string): string => {
  if (!text) {
    return '';
  }
  
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Formats status text for display
 * 
 * @param status - Status string (e.g., "in_progress")
 * @returns Formatted status (e.g., "In Progress")
 */
export const formatStatus = (status: string): string => {
  if (!status) {
    return '';
  }
  
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

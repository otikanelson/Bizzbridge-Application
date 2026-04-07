/**
 * Validation utilities for form inputs
 * Requirements: 34.1, 34.2, 34.3, 34.4, 34.5, 34.6, 34.7
 */

/**
 * Validates email format using regex pattern
 * Requirement: 34.1
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates password length (minimum 6 characters)
 * Requirement: 34.2
 */
export const validatePassword = (password: string): boolean => {
  if (!password || typeof password !== 'string') {
    return false;
  }
  
  return password.length >= 6;
};

/**
 * Validates phone number format for Nigerian numbers
 * Accepts formats: 08012345678, +2348012345678, 2348012345678
 * Requirement: 34.3
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return false;
  }
  
  const cleaned = phoneNumber.trim().replace(/\s+/g, '');
  
  // Nigerian phone number patterns
  const patterns = [
    /^0[789][01]\d{8}$/,           // 08012345678
    /^\+234[789][01]\d{8}$/,       // +2348012345678
    /^234[789][01]\d{8}$/,         // 2348012345678
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
};

/**
 * Validates that a required field is not empty
 * Requirement: 34.4
 */
export const validateRequired = (value: string | undefined | null): boolean => {
  if (value === undefined || value === null) {
    return false;
  }
  
  if (typeof value !== 'string') {
    return false;
  }
  
  return value.trim().length > 0;
};

/**
 * Validates that a string does not exceed maximum character limit
 * Requirement: 34.5
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  if (!value || typeof value !== 'string') {
    return true; // Empty values are valid for max length check
  }
  
  return value.length <= maxLength;
};

/**
 * Validates that a string meets minimum character requirement
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  return value.length >= minLength;
};

/**
 * Validates numeric fields for pricing inputs
 * Requirement: 34.6
 */
export const validateNumeric = (value: string | number): boolean => {
  if (value === undefined || value === null || value === '') {
    return false;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return !isNaN(numValue) && isFinite(numValue) && numValue >= 0;
};

/**
 * Validates that a numeric value is within a range
 */
export const validateNumericRange = (
  value: string | number,
  min: number,
  max: number
): boolean => {
  if (!validateNumeric(value)) {
    return false;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return numValue >= min && numValue <= max;
};

/**
 * Validates date fields for scheduling
 * Ensures date is not in the past
 * Requirement: 34.7
 */
export const validateDate = (date: Date | string): boolean => {
  if (!date) {
    return false;
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    return false;
  }
  
  // Check if date is not in the past (allow today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dateObj >= today;
};

/**
 * Validates that a date is in the future (not today)
 */
export const validateFutureDate = (date: Date | string): boolean => {
  if (!date) {
    return false;
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    return false;
  }
  
  // Check if date is in the future
  const now = new Date();
  
  return dateObj > now;
};

/**
 * Validates rating value (1-5)
 */
export const validateRating = (rating: number): boolean => {
  return validateNumericRange(rating, 1, 5);
};

/**
 * Get validation error message for email
 */
export const getEmailError = (email: string): string | null => {
  if (!validateRequired(email)) {
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Get validation error message for password
 */
export const getPasswordError = (password: string): string | null => {
  if (!validateRequired(password)) {
    return 'Password is required';
  }
  if (!validatePassword(password)) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

/**
 * Get validation error message for phone number
 */
export const getPhoneNumberError = (phoneNumber: string): string | null => {
  if (!validateRequired(phoneNumber)) {
    return 'Phone number is required';
  }
  if (!validatePhoneNumber(phoneNumber)) {
    return 'Please enter a valid Nigerian phone number';
  }
  return null;
};

/**
 * Get validation error message for required field
 */
export const getRequiredError = (fieldName: string): string => {
  return `${fieldName} is required`;
};

/**
 * Get validation error message for max length
 */
export const getMaxLengthError = (fieldName: string, maxLength: number): string => {
  return `${fieldName} must not exceed ${maxLength} characters`;
};

/**
 * Get validation error message for min length
 */
export const getMinLengthError = (fieldName: string, minLength: number): string => {
  return `${fieldName} must be at least ${minLength} characters`;
};

/**
 * Get validation error message for numeric field
 */
export const getNumericError = (fieldName: string): string => {
  return `${fieldName} must be a valid number`;
};

/**
 * Get validation error message for date field
 */
export const getDateError = (fieldName: string): string => {
  return `${fieldName} must be a valid date in the future`;
};

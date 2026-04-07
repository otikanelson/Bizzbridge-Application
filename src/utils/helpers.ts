/**
 * Helper utilities for general operations
 * Requirements: 51.5, 38.3
 * 
 * Note: expo-image-manipulator needs to be installed:
 * npm install expo-image-manipulator
 */

// Import will be available after installing expo-image-manipulator
// import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Debounces a function call
 * Requirement: 38.3
 * 
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Throttles a function call
 * 
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Compresses an image before upload
 * Requirement: 51.5
 * 
 * Note: Requires expo-image-manipulator to be installed
 * 
 * @param uri - Image URI
 * @param quality - Compression quality (0-1)
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @returns Promise that resolves with compressed image URI
 */
export const compressImage = async (
  uri: string,
  quality: number = 0.7,
  maxWidth: number = 1024,
  maxHeight: number = 1024
): Promise<string> => {
  try {
    // TODO: Uncomment after installing expo-image-manipulator
    // const manipResult = await ImageManipulator.manipulateAsync(
    //   uri,
    //   [{ resize: { width: maxWidth, height: maxHeight } }],
    //   { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    // );
    // return manipResult.uri;
    
    // Temporary: return original URI until expo-image-manipulator is installed
    console.warn('expo-image-manipulator not installed. Returning original image URI.');
    return uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
};

/**
 * Compresses multiple images
 * 
 * @param uris - Array of image URIs
 * @param quality - Compression quality (0-1)
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @returns Promise that resolves with array of compressed image URIs
 */
export const compressImages = async (
  uris: string[],
  quality: number = 0.7,
  maxWidth: number = 1024,
  maxHeight: number = 1024
): Promise<string[]> => {
  try {
    const compressedUris = await Promise.all(
      uris.map(uri => compressImage(uri, quality, maxWidth, maxHeight))
    );
    
    return compressedUris;
  } catch (error) {
    console.error('Error compressing images:', error);
    throw new Error('Failed to compress images');
  }
};

/**
 * Extracts error message from error object
 * Requirement: 38.3
 * 
 * @param error - Error object
 * @returns User-friendly error message
 */
export const extractErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'An unknown error occurred';
  }
  
  // Handle Axios errors
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    
    // Check for response error message
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    
    // Check for response error
    if (err.response?.data?.error) {
      return err.response.data.error;
    }
    
    // Check for network error
    if (err.message === 'Network Error') {
      return 'Network error. Please check your internet connection.';
    }
    
    // Check for timeout error
    if (err.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    
    // Check for standard error message
    if (err.message) {
      return err.message;
    }
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Generates a unique ID
 * 
 * @returns Unique ID string
 */
export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Delays execution for specified milliseconds
 * 
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retries a function with exponential backoff
 * 
 * @param func - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param delayMs - Initial delay in milliseconds
 * @returns Promise that resolves with function result
 */
export const retryWithBackoff = async <T>(
  func: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await func();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        const backoffDelay = delayMs * Math.pow(2, i);
        await delay(backoffDelay);
      }
    }
  }
  
  throw lastError;
};

/**
 * Checks if a value is empty
 * 
 * @param value - Value to check
 * @returns True if value is empty
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
};

/**
 * Deep clones an object
 * 
 * @param obj - Object to clone
 * @returns Cloned object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }
  
  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
};

/**
 * Merges multiple objects
 * 
 * @param objects - Objects to merge
 * @returns Merged object
 */
export const mergeObjects = <T extends object>(...objects: Partial<T>[]): Partial<T> => {
  return objects.reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {} as Partial<T>);
};

/**
 * Picks specific keys from an object
 * 
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with picked keys
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  
  return result;
};

/**
 * Omits specific keys from an object
 * 
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without omitted keys
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  
  keys.forEach(key => {
    delete result[key];
  });
  
  return result;
};

/**
 * Groups array items by a key
 * 
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Grouped object
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    
    result[groupKey].push(item);
    
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Sorts array by a key
 * 
 * @param array - Array to sort
 * @param key - Key to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export const sortBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) {
      return order === 'asc' ? -1 : 1;
    }
    
    if (aVal > bVal) {
      return order === 'asc' ? 1 : -1;
    }
    
    return 0;
  });
};

/**
 * Removes duplicate items from array
 * 
 * @param array - Array with potential duplicates
 * @param key - Optional key to check for uniqueness
 * @returns Array without duplicates
 */
export const unique = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return Array.from(new Set(array));
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Chunks array into smaller arrays
 * 
 * @param array - Array to chunk
 * @param size - Chunk size
 * @returns Array of chunks
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
};

/**
 * Flattens nested array
 * 
 * @param array - Nested array
 * @returns Flattened array
 */
export const flatten = <T>(array: any[]): T[] => {
  return array.reduce((acc, val) => {
    return Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val);
  }, []);
};

/**
 * Calculates percentage
 * 
 * @param value - Current value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) {
    return 0;
  }
  
  return Math.round((value / total) * 100);
};

/**
 * Clamps a number between min and max
 * 
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Generates a random number between min and max
 * 
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 */
export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Checks if app is running in development mode
 * 
 * @returns True if in development mode
 */
export const isDevelopment = (): boolean => {
  return __DEV__;
};

/**
 * Logs message only in development mode
 * 
 * @param message - Message to log
 * @param data - Optional data to log
 */
export const devLog = (message: string, data?: any): void => {
  if (isDevelopment()) {
    if (data !== undefined) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

export default {
  debounce,
  throttle,
  compressImage,
  compressImages,
  extractErrorMessage,
  generateUniqueId,
  delay,
  retryWithBackoff,
  isEmpty,
  deepClone,
  mergeObjects,
  pick,
  omit,
  groupBy,
  sortBy,
  unique,
  chunk,
  flatten,
  calculatePercentage,
  clamp,
  randomNumber,
  isDevelopment,
  devLog,
};

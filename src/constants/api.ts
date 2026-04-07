export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api' 
    : 'https://api.bizbridge.ng/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER_CUSTOMER: '/auth/register/customer',
  REGISTER_ARTISAN: '/auth/register/artisan',
  ME: '/auth/me',
  
  // Services
  SERVICES: '/services',
  SERVICES_SEARCH: '/services/search',
  SERVICES_FEATURED: '/services/featured',
  MY_SERVICES: '/services/my-services',
  
  // Bookings
  BOOKINGS: '/bookings',
  MY_BOOKINGS: '/bookings/my-bookings',
  MY_WORK: '/bookings/my-work',
  BOOKING_ANALYTICS: '/bookings/analytics',
  
  // Service Requests
  SERVICE_REQUESTS: '/service-requests',
  MY_REQUESTS: '/service-requests/my-requests',
  REQUEST_INBOX: '/service-requests/inbox',
  
  // Users
  USERS: '/users',
  PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  FEATURED_ARTISANS: '/users/featured',
  
  // Upload
  UPLOAD: '/upload',
} as const;

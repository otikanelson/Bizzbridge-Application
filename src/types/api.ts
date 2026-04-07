import { User, Service, Booking, ServiceRequest } from './models';
import { UserRole } from '../constants/statuses';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterCustomerRequest {
  fullName: string;
  email: string;
  password: string;
  location: {
    lga: string;
    locality?: string;
  };
}

export interface RegisterArtisanRequest {
  contactName: string;
  businessName: string;
  email: string;
  password: string;
  phoneNumber: string;
  location: {
    lga: string;
    locality?: string;
  };
}

// Services
export interface SearchServicesParams {
  query?: string;
  category?: string;
  lga?: string;
  pricingType?: string;
  sortBy?: 'newest' | 'rating' | 'reviews' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  category: string;
  images: string[];
  pricingType: string;
  basePrice?: number;
  baseDuration?: string;
  pricingCategories?: Array<{
    category: string;
    price: number;
    duration?: string;
    description?: string;
  }>;
  locations: Array<{
    lga: string;
    localities?: string[];
  }>;
  tags: string[];
}

// Bookings
export interface CreateBookingRequest {
  service: string;
  title: string;
  description: string;
  scheduledStartDate: string;
  scheduledEndDate?: string;
  agreedTerms: {
    price: number;
    duration: string;
    location: string;
    additionalTerms?: string;
  };
  serviceRequest?: string;
}

export interface BookingAnalytics {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  profileViews: number;
  totalServices?: number;
  pendingRequests?: number;
}

// Service Requests
export interface CreateServiceRequestRequest {
  service: string;
  title: string;
  description: string;
  preferredSchedule?: string;
  specialRequirements?: string;
  selectedCategory?: string;
}

export interface RespondToRequestRequest {
  message: string;
  proposedTerms?: string;
}

export interface DeclineRequestRequest {
  reason: string;
}

// Profile
export interface UpdateProfileRequest {
  fullName?: string;
  businessName?: string;
  contactName?: string;
  phoneNumber?: string;
  businessDescription?: string;
  location?: {
    lga: string;
    locality?: string;
  };
  specialties?: string[];
  experience?: number;
  cacRegistration?: string;
  yearEstablished?: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Upload
export interface UploadResponse {
  url: string;
  filename: string;
}

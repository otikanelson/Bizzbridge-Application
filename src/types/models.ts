import { PricingType, BookingStatus, ServiceRequestStatus, UserRole } from '../constants/statuses';

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  
  // Customer-specific fields
  fullName?: string;
  location?: {
    lga: string;
    locality?: string;
  };
  
  // Artisan-specific fields
  businessName?: string;
  contactName?: string;
  phoneNumber?: string;
  businessDescription?: string;
  specialties?: string[];
  experience?: number;
  cacRegistration?: string;
  yearEstablished?: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  ratings?: {
    average: number;
    count: number;
  };
  analytics?: {
    profileViews: number;
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    completionRate: number;
  };
}

export interface PricingCategory {
  category: string;
  price: number;
  duration?: string;
  description?: string;
}

export interface Service {
  _id: string;
  artisan: string | User;
  title: string;
  description: string;
  category: string;
  images: string[];
  pricingType: PricingType;
  basePrice?: number;
  baseDuration?: string;
  pricingCategories?: PricingCategory[];
  locations: {
    lga: string;
    localities?: string[];
  }[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingMessage {
  sender: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
}

export interface Booking {
  _id: string;
  customer: string | User;
  artisan: string | User;
  service: string | Service;
  title: string;
  description: string;
  status: BookingStatus;
  scheduledStartDate: string;
  scheduledEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  agreedTerms: {
    price: number;
    duration: string;
    location: string;
    additionalTerms?: string;
  };
  contractAcceptance: {
    customer: boolean;
    artisan: boolean;
  };
  messages: BookingMessage[];
  cancellation?: {
    cancelledBy: UserRole;
    reason: string;
    description?: string;
    cancelledAt: string;
  };
  dispute?: {
    filedBy: UserRole;
    reason: string;
    description: string;
    filedAt: string;
    status: 'open' | 'resolved';
  };
  review?: {
    rating: number;
    comment?: string;
    reviewedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  _id: string;
  customer: string | User;
  artisan: string | User;
  service: string | Service;
  title: string;
  description: string;
  status: ServiceRequestStatus;
  preferredSchedule?: string;
  specialRequirements?: string;
  selectedCategory?: string;
  response?: {
    message: string;
    proposedTerms?: string;
    respondedAt: string;
  };
  declineReason?: string;
  convertedBooking?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  booking: string;
  reviewer: string | User;
  reviewee: string | User;
  rating: number;
  comment?: string;
  createdAt: string;
}

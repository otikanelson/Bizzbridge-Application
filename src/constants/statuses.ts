export const PRICING_TYPES = ['fixed', 'negotiate', 'categorized'] as const;
export type PricingType = typeof PRICING_TYPES[number];

export const BOOKING_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
  'disputed',
] as const;
export type BookingStatus = typeof BOOKING_STATUSES[number];

export const SERVICE_REQUEST_STATUSES = [
  'pending',
  'viewed',
  'accepted',
  'declined',
  'converted',
  'retracted',
] as const;
export type ServiceRequestStatus = typeof SERVICE_REQUEST_STATUSES[number];

export const CANCELLATION_REASONS = [
  'Changed my mind',
  'Found another artisan',
  'Service no longer needed',
  'Price too high',
  'Scheduling conflict',
  'Other',
] as const;

export const DISPUTE_REASONS = [
  'Service not delivered',
  'Poor quality work',
  'Payment issue',
  'Communication problem',
  'Breach of agreement',
  'Other',
] as const;

export const USER_ROLES = ['customer', 'artisan'] as const;
export type UserRole = typeof USER_ROLES[number];

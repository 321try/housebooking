// User Types
export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: number;
  email: string;
  name: string;
  phone_number: string;
  role: UserRole;
  is_guest: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Location Types
export interface Location {
  id: number;
  name: string;
  description: string;
  sublocation_count?: number;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface SubLocation {
  id: number;
  name: string;
  description: string;
  location: number;
  created_at: string;
  updated_at: string;
}

// House Types
export type HouseType = 'HOUSE' | 'BNB';
export type HouseStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'UNAVAILABLE';
export type MediaType = 'IMAGE' | 'VIDEO';

export interface HouseImage {
  id: number;
  image_url: string;
  media_type: MediaType;
  is_primary: boolean;
  created_at: string;
}

export interface House {
  id: number;
  name: string;
  description: string;
  price: string;
  type: HouseType;
  status: HouseStatus;
  location: number;
  location_detail?: Location;
  sublocation?: number | null;
  sublocation_detail?: SubLocation;
  amenities: Record<string, any>;
  available_from?: string | null;
  available_to?: string | null;
  images?: HouseImage[];
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface HouseListItem {
  id: number;
  name: string;
  description: string;
  price: string;
  type: HouseType;
  status: HouseStatus;
  location_name: string;
  sublocation_name?: string;
  primary_image?: HouseImage;
  created_at: string;
}

// Booking Types
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'DONE' | 'POSTPONED' | 'CANCELLED';

export interface Booking {
  id: number;
  booking_code: string;
  house: number;
  house_detail?: HouseListItem;
  user?: number | null;
  guest_name?: string;
  guest_phone?: string;
  customer_name: string;
  customer_phone: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  notes?: string;
  managed_by?: number | null;
  created_at: string;
  updated_at: string;
}

export interface BookingDetail extends Booking {
  // This includes all Booking fields plus the expanded house_detail
  house_detail: HouseListItem;
}

export interface BookingListItem {
  id: number;
  booking_code: string;
  house_name: string;
  customer_name: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  created_at: string;
}

export interface CreateBookingData {
  house: number;
  guest_name?: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  notes?: string;
}

// API Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: any;
}

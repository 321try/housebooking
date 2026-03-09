import apiClient from './api-client';
import {
  Location,
  SubLocation,
  House,
  HouseListItem,
  Booking,
  BookingListItem,
  CreateBookingData,
  PaginatedResponse,
} from '@/types';

// Location API
export const locationApi = {
  getAll: () => apiClient.get<PaginatedResponse<Location>>('/api/locations/'),
  getById: (id: number) => apiClient.get<Location>(`/api/locations/${id}/`),
  create: (data: Partial<Location>) => apiClient.post<Location>('/api/locations/', data),
  update: (id: number, data: Partial<Location>) => apiClient.put<Location>(`/api/locations/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/api/locations/${id}/`),
  getSublocations: (id: number) => apiClient.get<SubLocation[]>(`/api/locations/${id}/sublocations/`),
};

// SubLocation API
export const sublocationApi = {
  getAll: () => apiClient.get<PaginatedResponse<SubLocation>>('/api/sublocations/'),
  getById: (id: number) => apiClient.get<SubLocation>(`/api/sublocations/${id}/`),
  create: (data: Partial<SubLocation>) => apiClient.post<SubLocation>('/api/sublocations/', data),
  update: (id: number, data: Partial<SubLocation>) => apiClient.put<SubLocation>(`/api/sublocations/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/api/sublocations/${id}/`),
};

// House API
export const houseApi = {
  getAll: (params?: Record<string, any>) => 
    apiClient.get<PaginatedResponse<HouseListItem>>('/api/houses/', { params }),
  getById: (id: number) => apiClient.get<House>(`/api/houses/${id}/`),
  create: (data: Partial<House>) => apiClient.post<House>('/api/houses/', data),
  update: (id: number, data: Partial<House>) => apiClient.put<House>(`/api/houses/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/api/houses/${id}/`),
  updateStatus: (id: number, status: string) => 
    apiClient.patch(`/api/houses/${id}/status/`, { status }),
  uploadImage: (id: number, formData: FormData) => 
    apiClient.post(`/api/houses/${id}/images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteImage: (imageId: number) => apiClient.delete(`/api/house-images/${imageId}/`),
};

// Booking API
export const bookingApi = {
  getAll: (params?: Record<string, any>) => 
    apiClient.get<PaginatedResponse<BookingListItem>>('/api/bookings/', { params }),
  getMyBookings: (params?: Record<string, any>) => 
    apiClient.get<PaginatedResponse<BookingListItem>>('/api/bookings/my/', { params }),
  getById: (id: number) => apiClient.get<Booking>(`/api/bookings/${id}/`),
  create: (data: CreateBookingData) => apiClient.post<Booking>('/api/bookings/', data),
  updateStatus: (id: number, status: string, notes?: string) => 
    apiClient.patch(`/api/bookings/${id}/status/`, { status, notes }),
};

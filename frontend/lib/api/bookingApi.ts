import apiClient from '../api-client';
import { Booking, BookingDetail, BookingListItem, CreateBookingData, PaginatedResponse } from '@/types';

export const bookingApi = {
  // Get all bookings (admin only)
  getAll: async (params?: {
    page?: number;
    status?: string;
    house?: number;
  }) => {
    const response = await apiClient.get<PaginatedResponse<BookingListItem>>('/api/bookings/', { params });
    return response.data;
  },

  // Get current user's bookings
  getUserBookings: async (params?: {
    status?: string;
    house?: number;
  }) => {
    const response = await apiClient.get<PaginatedResponse<BookingListItem>>('/api/bookings/my/', { params });
    return response.data;
  },

  // Get booking by ID
  getById: async (id: number | string) => {
    const response = await apiClient.get<BookingDetail>(`/api/bookings/${id}/`);
    return response.data;
  },

  // Create new booking
  create: async (data: CreateBookingData) => {
    const response = await apiClient.post<Booking>('/api/bookings/', data);
    return response.data;
  },

  // Update booking status
  updateStatus: async (id: number, status: string, notes?: string) => {
    const data: { status: string; notes?: string } = { status };
    if (notes !== undefined) {
      data.notes = notes;
    }
    const response = await apiClient.patch<Booking>(`/api/bookings/${id}/status/`, data);
    return response.data;
  },

  // Reschedule booking (admin only)
  reschedule: async (id: number, checkIn: string, checkOut: string, notes?: string) => {
    const data: { check_in: string; check_out: string; notes?: string } = {
      check_in: checkIn,
      check_out: checkOut,
    };
    if (notes !== undefined) {
      data.notes = notes;
    }
    const response = await apiClient.patch<Booking>(`/api/bookings/${id}/reschedule/`, data);
    return response.data;
  },

  // Delete booking
  delete: async (id: number) => {
    await apiClient.delete(`/api/bookings/${id}/`);
  },
};

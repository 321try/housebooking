'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { bookingApi } from '@/lib/api/bookingApi';
import { BookingListItem, BookingStatus } from '@/types';
import BookingCard from '@/components/BookingCard';
import { Filter, Loader2, Calendar } from 'lucide-react';

const statusOptions: { value: BookingStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Bookings' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'DONE', label: 'Completed' },
  { value: 'POSTPONED', label: 'Postponed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'ALL'>('ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchBookings();
  }, [isAuthenticated, selectedStatus, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = selectedStatus !== 'ALL' ? { status: selectedStatus } : {};
      const response = await bookingApi.getUserBookings(params);
      setBookings(response.results);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-dark-300">
            View and manage all your bookings
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500 dark:text-dark-400" />
            <span className="text-gray-600 dark:text-dark-300 font-medium">
              Filter by status:
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-dark-300 hover:bg-gray-300 dark:hover:bg-dark-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-dark-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {selectedStatus === 'ALL'
                ? 'No bookings found'
                : `No ${selectedStatus.toLowerCase()} bookings`}
            </h3>
            <p className="text-gray-600 dark:text-dark-300">
              {selectedStatus === 'ALL'
                ? 'Start exploring our properties and make your first booking'
                : 'Try selecting a different filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

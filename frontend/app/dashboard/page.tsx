'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { bookingApi } from '@/lib/api/bookingApi';
import { BookingListItem } from '@/types';
import BookingCard from '@/components/BookingCard';
import { Calendar, Home, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchBookings();
  }, [isAuthenticated, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getUserBookings();
      setBookings(response.results);

      // Calculate stats
      const total = response.count;
      const pending = response.results.filter((b: BookingListItem) => b.status === 'PENDING').length;
      const confirmed = response.results.filter((b: BookingListItem) => b.status === 'CONFIRMED').length;
      const completed = response.results.filter((b: BookingListItem) => b.status === 'DONE').length;

      setStats({ total, pending, confirmed, completed });
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
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-dark-300">
            Manage your bookings and track your stays
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-dark-400 text-sm">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.total}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-primary-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-dark-400 text-sm">
                  Pending
                </p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-dark-400 text-sm">
                  Confirmed
                </p>
                <p className="text-3xl font-bold text-green-500 mt-1">{stats.confirmed}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-dark-400 text-sm">
                  Completed
                </p>
                <p className="text-3xl font-bold text-blue-500 mt-1">{stats.completed}</p>
              </div>
              <Home className="w-10 h-10 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Bookings
          </h2>
          <Link
            href="/dashboard/bookings"
            className="text-primary-500 hover:text-primary-400 transition-colors"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-dark-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 dark:text-dark-300 mb-6">
              Start exploring our properties and make your first booking
            </p>
            <Link href="/houses" className="btn-primary inline-block">
              Browse Houses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
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

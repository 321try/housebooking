'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { bookingApi } from '@/lib/api/bookingApi';
import { BookingListItem, BookingStatus } from '@/types';
import { 
  Calendar, 
  Filter, 
  Eye, 
  Loader2,
  Search
} from 'lucide-react';
import { format } from 'date-fns';

const statusOptions: { value: BookingStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Bookings' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'DONE', label: 'Completed' },
  { value: 'POSTPONED', label: 'Postponed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const statusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  CONFIRMED: 'bg-green-500/20 text-green-500 border-green-500/30',
  DONE: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  POSTPONED: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  CANCELLED: 'bg-red-500/20 text-red-500 border-red-500/30',
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, user, selectedStatus, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = selectedStatus !== 'ALL' ? { status: selectedStatus } : {};
      const response = await bookingApi.getAll(params);
      setBookings(response.results);

      // Calculate stats from all bookings if filtering
      if (selectedStatus !== 'ALL') {
        const allResponse = await bookingApi.getAll({});
        const allBookings = allResponse.results;
        setStats({
          total: allResponse.count,
          pending: allBookings.filter((b: BookingListItem) => b.status === 'PENDING').length,
          confirmed: allBookings.filter((b: BookingListItem) => b.status === 'CONFIRMED').length,
          completed: allBookings.filter((b: BookingListItem) => b.status === 'DONE').length,
          cancelled: allBookings.filter((b: BookingListItem) => b.status === 'CANCELLED').length,
        });
      } else {
        setStats({
          total: response.count,
          pending: response.results.filter((b: BookingListItem) => b.status === 'PENDING').length,
          confirmed: response.results.filter((b: BookingListItem) => b.status === 'CONFIRMED').length,
          completed: response.results.filter((b: BookingListItem) => b.status === 'DONE').length,
          cancelled: response.results.filter((b: BookingListItem) => b.status === 'CANCELLED').length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      booking.booking_code.toLowerCase().includes(search) ||
      booking.house_name.toLowerCase().includes(search) ||
      booking.customer_name.toLowerCase().includes(search)
    );
  });

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Booking Management
            </h1>
            <button
              onClick={() => router.push('/admin/bookings/new')}
              className="btn-primary"
            >
              <Calendar className="w-4 h-4" />
              New Booking
            </button>
          </div>
          <p className="text-gray-600 dark:text-dark-300">
            Manage all customer bookings and reservations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="card p-4">
            <p className="text-gray-500 dark:text-dark-400 text-sm mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="card p-4">
            <p className="text-gray-500 dark:text-dark-400 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="card p-4">
            <p className="text-gray-500 dark:text-dark-400 text-sm mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-green-500">{stats.confirmed}</p>
          </div>
          <div className="card p-4">
            <p className="text-gray-500 dark:text-dark-400 text-sm mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-500">{stats.completed}</p>
          </div>
          <div className="card p-4">
            <p className="text-gray-500 dark:text-dark-400 text-sm mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-dark-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by booking code, house, or customer..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500 dark:text-dark-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as BookingStatus | 'ALL')}
                className="input-field min-w-[150px]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 dark:text-dark-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 dark:text-dark-300">
              {searchQuery ? 'Try adjusting your search or filters' : 'No bookings available yet'}
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">
                      Booking Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">
                      House
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">
                      Check-in
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">
                      Check-out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
                  {filteredBookings.map((booking) => (
                    <tr 
                      key={booking.id}
                      className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-medium text-gray-900 dark:text-white">
                          {booking.booking_code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 dark:text-white">{booking.house_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 dark:text-dark-300">{booking.customer_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600 dark:text-dark-300">{formatDate(booking.check_in)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600 dark:text-dark-300">{formatDate(booking.check_out)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                          className="text-primary-500 hover:text-primary-600 transition-colors"
                          title="View & Edit"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

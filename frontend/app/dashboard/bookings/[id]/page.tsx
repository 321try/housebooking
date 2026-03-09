'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { bookingApi } from '@/lib/api/bookingApi';
import { Booking } from '@/types';
import { 
  ArrowLeft, 
  Calendar, 
  Home, 
  User, 
  Phone, 
  Clock,
  MapPin,
  DollarSign,
  Tag,
  FileText,
  Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const statusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  CONFIRMED: 'bg-green-500/20 text-green-500 border-green-500/30',
  DONE: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  POSTPONED: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  CANCELLED: 'bg-red-500/20 text-red-500 border-red-500/30',
};

const statusLabels = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  DONE: 'Completed',
  POSTPONED: 'Postponed',
  CANCELLED: 'Cancelled',
};

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (params.id) {
      fetchBooking(Number(params.id));
    }
  }, [isAuthenticated, params.id, router]);

  const fetchBooking = async (id: number) => {
    try {
      setLoading(true);
      const data = await bookingApi.getById(id);
      setBooking(data);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      router.push('/dashboard/bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>

        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Booking Details
              </h1>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-500" />
                <span className="font-mono text-lg text-gray-900 dark:text-white">
                  {booking.booking_code}
                </span>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                statusColors[booking.status]
              }`}
            >
              {statusLabels[booking.status]}
            </span>
          </div>
        </div>

        {/* Booking Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* House Information */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Property Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 text-primary-500 mt-1" />
                <div>
                  <p className="text-gray-500 dark:text-dark-400 text-sm">
                    House Name
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {booking.house_detail?.name || `House #${booking.house}`}
                  </p>
                </div>
              </div>

              {booking.house_detail && (
                <>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-500 mt-1" />
                    <div>
                      <p className="text-gray-500 dark:text-dark-400 text-sm">
                        Location
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {booking.house_detail.location_name}
                        {booking.house_detail.sublocation_name &&
                          ` - ${booking.house_detail.sublocation_name}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-primary-500 mt-1" />
                    <div>
                      <p className="text-gray-500 dark:text-dark-400 text-sm">
                        Price per Night
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        ${booking.house_detail.price}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Guest Information */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Guest Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary-500 mt-1" />
                <div>
                  <p className="text-gray-500 dark:text-dark-400 text-sm">
                    Guest Name
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {booking.customer_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-500 mt-1" />
                <div>
                  <p className="text-gray-500 dark:text-dark-400 text-sm">
                    Phone Number
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {booking.customer_phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Check-in/Check-out */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Stay Duration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="text-gray-500 dark:text-dark-400 text-sm">
                  Check-in
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(booking.check_in)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <p className="text-gray-500 dark:text-dark-400 text-sm">
                  Check-out
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(booking.check_out)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="card p-6">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-primary-500 mt-1" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Additional Notes
                </h2>
                <p className="text-gray-600 dark:text-dark-300">
                  {booking.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View Property Button */}
        {booking.house_detail && (
          <div className="mt-6">
            <Link
              href={`/houses/${booking.house}`}
              className="btn-primary inline-block w-full text-center"
            >
              View Property Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

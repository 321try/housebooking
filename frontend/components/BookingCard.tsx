'use client';

import { BookingListItem } from '@/types';
import { Calendar, Home, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: BookingListItem;
  onClick?: () => void;
}

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

export default function BookingCard({ booking, onClick }: BookingCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div
      onClick={onClick}
      className="card p-6 hover:border-primary-500 transition-all cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left section */}
        <div className="flex-1 space-y-3">
          {/* Booking code & Status */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary-500" />
              <span className="font-mono font-semibold text-gray-900 dark:text-white">
                {booking.booking_code}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                statusColors[booking.status]
              }`}
            >
              {statusLabels[booking.status]}
            </span>
          </div>

          {/* House name */}
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-500 dark:text-dark-400" />
            <span className="text-gray-900 dark:text-white font-medium">
              {booking.house_name}
            </span>
          </div>

          {/* Customer name */}
          <div className="text-gray-600 dark:text-dark-300 text-sm">
            Guest: {booking.customer_name}
          </div>
        </div>

        {/* Right section - Dates */}
        <div className="flex items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-gray-500 dark:text-dark-400 text-xs">
                  Check-in
                </div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {formatDate(booking.check_in)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-red-500" />
              <div>
                <div className="text-gray-500 dark:text-dark-400 text-xs">
                  Check-out
                </div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {formatDate(booking.check_out)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

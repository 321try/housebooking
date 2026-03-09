'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { bookingApi } from '@/lib/api/bookingApi';
import { BookingDetail, BookingStatus } from '@/types';
import toast from 'react-hot-toast';
import { 
  ArrowLeft,
  Home,
  User,
  Calendar,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  Save,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

const statusOptions: { value: BookingStatus; label: string; description: string }[] = [
  { value: 'PENDING', label: 'Pending', description: 'Awaiting confirmation' },
  { value: 'CONFIRMED', label: 'Confirmed', description: 'Booking confirmed' },
  { value: 'DONE', label: 'Completed', description: 'Guest has checked out' },
  { value: 'POSTPONED', label: 'Postponed', description: 'Rescheduled to different dates' },
  { value: 'CANCELLED', label: 'Cancelled', description: 'Booking cancelled' },
];

const statusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  CONFIRMED: 'bg-green-500/20 text-green-500 border-green-500/30',
  DONE: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  POSTPONED: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  CANCELLED: 'bg-red-500/20 text-red-500 border-red-500/30',
};

export default function AdminBookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('PENDING');
  const [adminNote, setAdminNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  
  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchBooking();
  }, [isAuthenticated, user, params.id, router]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getById(params.id);
      setBooking(data);
      setSelectedStatus(data.status);
      setAdminNote('');
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      toast.error('Failed to load booking details');
      router.push('/admin/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!booking) return;

    if (selectedStatus === booking.status) {
      toast.error('Please select a different status');
      return;
    }

    try {
      setUpdating(true);
      await bookingApi.updateStatus(booking.id, selectedStatus);
      toast.success('Booking status updated successfully');
      await fetchBooking();
    } catch (error: any) {
      console.error('Failed to update status:', error);
      const message = error.response?.data?.detail || 'Failed to update booking status';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!booking || !adminNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      setSavingNote(true);
      // For now, we'll update the notes field in the booking
      // In the future, this should be a separate comments system
      const updatedNotes = booking.notes 
        ? `${booking.notes}\n\n[Admin ${format(new Date(), 'MMM dd, yyyy HH:mm')}]: ${adminNote}`
        : `[Admin ${format(new Date(), 'MMM dd, yyyy HH:mm')}]: ${adminNote}`;
      
      await bookingApi.updateStatus(booking.id, booking.status, updatedNotes);
      toast.success('Note added successfully');
      setAdminNote('');
      await fetchBooking();
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Failed to add note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleReschedule = async () => {
    if (!booking || !newCheckIn || !newCheckOut) {
      toast.error('Please select new dates');
      return;
    }

    if (new Date(newCheckIn) >= new Date(newCheckOut)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    try {
      setRescheduling(true);
      await bookingApi.reschedule(
        booking.id,
        new Date(newCheckIn).toISOString(),
        new Date(newCheckOut).toISOString(),
        booking.notes
      );
      toast.success('Booking rescheduled successfully');
      setIsRescheduling(false);
      setNewCheckIn('');
      setNewCheckOut('');
      await fetchBooking();
    } catch (error: any) {
      console.error('Failed to reschedule:', error);
      const message = error.response?.data?.detail || 'Failed to reschedule booking';
      toast.error(message);
    } finally {
      setRescheduling(false);
    }
  };

  const cancelReschedule = () => {
    setIsRescheduling(false);
    setNewCheckIn('');
    setNewCheckOut('');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/bookings')}
            className="flex items-center gap-2 text-gray-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Bookings
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Booking #{booking.booking_code}
              </h1>
              <p className="text-gray-600 dark:text-dark-300">
                Created on {formatDateTime(booking.created_at)}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Property Details</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">House Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{booking.house_detail?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 dark:text-dark-500" />
                    <p className="text-gray-900 dark:text-white">
                      {booking.house_detail?.location_name}
                      {booking.house_detail?.sublocation_name && ` - ${booking.house_detail.sublocation_name}`}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Property Type</p>
                  <p className="text-gray-600 dark:text-dark-300">{booking.house_detail?.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Price per Night</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <p className="text-gray-900 dark:text-white font-medium">
                      ${parseFloat(booking.house_detail?.price || '0').toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Guest Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Customer Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{booking.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Phone Number</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 dark:text-dark-500" />
                    <a 
                      href={`tel:${booking.customer_phone}`}
                      className="text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      {booking.customer_phone}
                    </a>
                  </div>
                </div>
                {booking.guest_name && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Guest Name (from form)</p>
                    <p className="text-gray-600 dark:text-dark-300">{booking.guest_name}</p>
                  </div>
                )}
                {booking.guest_phone && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Guest Contact</p>
                    <p className="text-gray-600 dark:text-dark-300">{booking.guest_phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Details */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Booking Details</h2>
                </div>
                {!isRescheduling && (
                  <button
                    onClick={() => setIsRescheduling(true)}
                    className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    Reschedule
                  </button>
                )}
              </div>
              
              {isRescheduling ? (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-400">
                      Select new dates for this booking.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        New Check-in Date
                      </label>
                      <input
                        type="date"
                        value={newCheckIn}
                        onChange={(e) => setNewCheckIn(e.target.value)}
                        className="input-field"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        New Check-out Date
                      </label>
                      <input
                        type="date"
                        value={newCheckOut}
                        onChange={(e) => setNewCheckOut(e.target.value)}
                        className="input-field"
                        min={newCheckIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleReschedule}
                      disabled={rescheduling || !newCheckIn || !newCheckOut}
                      className="btn-primary flex-1"
                    >
                      {rescheduling ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Rescheduling...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Confirm Reschedule
                        </>
                      )}
                    </button>
                    <button
                      onClick={cancelReschedule}
                      disabled={rescheduling}
                      className="btn-secondary px-6"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Check-in</p>
                    <p className="text-gray-900 dark:text-white font-medium">{formatDate(booking.check_in)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Check-out</p>
                    <p className="text-gray-900 dark:text-white font-medium">{formatDate(booking.check_out)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Duration</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400 dark:text-dark-500" />
                      <p className="text-gray-900 dark:text-white font-medium">
                        {Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24))} nights
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Estimated Total</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${(
                          parseFloat(booking.house_detail?.price || '0') * 
                          Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24))
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes & Comments */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notes & Comments</h2>
              </div>
              
              {booking.notes && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600">
                  <p className="text-sm text-gray-500 dark:text-dark-400 mb-2">Existing Notes:</p>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{booking.notes}</p>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-dark-400">Add admin note (visible to customer):</p>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Enter your note here..."
                  rows={4}
                  className="input-field resize-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={savingNote || !adminNote.trim()}
                  className="btn-primary w-full md:w-auto"
                >
                  {savingNote ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Add Note
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Update Status
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-dark-400 mb-2 block">
                    Select Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as BookingStatus)}
                    className="input-field"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Descriptions */}
                <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600">
                  <p className="text-xs text-gray-500 dark:text-dark-400 mb-1">Status Info:</p>
                  <p className="text-sm text-gray-700 dark:text-dark-200">
                    {statusOptions.find(opt => opt.value === selectedStatus)?.description}
                  </p>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || selectedStatus === booking.status}
                  className="btn-primary w-full"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Status
                    </>
                  )}
                </button>

                {selectedStatus === booking.status && (
                  <p className="text-xs text-gray-500 dark:text-dark-400 text-center">
                    Current status already selected
                  </p>
                )}
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-dark-400">Booking ID:</span>
                    <span className="text-gray-900 dark:text-white font-mono">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-dark-400">Created:</span>
                    <span className="text-gray-900 dark:text-white">{formatDateTime(booking.created_at)}</span>
                  </div>
                  {booking.managed_by && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-dark-400">Managed by:</span>
                      <span className="text-gray-900 dark:text-white">{booking.managed_by}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

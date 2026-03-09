'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { bookingApi } from '@/lib/api/bookingApi';
import { houseApi } from '@/lib/api';
import { HouseListItem } from '@/types';
import toast from 'react-hot-toast';
import { 
  ArrowLeft,
  Home,
  User,
  Phone,
  Calendar,
  AlertCircle,
  Save,
  Loader2,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function NewBookingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [houses, setHouses] = useState<HouseListItem[]>([]);
  const [loadingHouses, setLoadingHouses] = useState(true);
  const [creating, setCreating] = useState(false);
  const [checkingConflict, setCheckingConflict] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);

  // Form state
  const [selectedHouse, setSelectedHouse] = useState<number | ''>('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'PENDING' | 'CONFIRMED'>('PENDING');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchHouses();
  }, [isAuthenticated, user, router]);

  // Check for booking conflicts when dates or house change
  useEffect(() => {
    if (selectedHouse && checkIn && checkOut) {
      checkBookingConflict();
    } else {
      setHasConflict(false);
    }
  }, [selectedHouse, checkIn, checkOut]);

  const fetchHouses = async () => {
    try {
      setLoadingHouses(true);
      const response = await houseApi.getAll({ status: 'AVAILABLE' });
      setHouses(response.data.results);
    } catch (error) {
      console.error('Failed to fetch houses:', error);
      toast.error('Failed to load available houses');
    } finally {
      setLoadingHouses(false);
    }
  };

  const checkBookingConflict = async () => {
    if (!selectedHouse || !checkIn || !checkOut) return;

    try {
      setCheckingConflict(true);
      // Get all bookings for the selected house
      const response = await bookingApi.getAll({ house: Number(selectedHouse) });
      
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Check for overlapping bookings
      const conflict = response.results.some((booking) => {
        // Skip cancelled bookings
        if (booking.status === 'CANCELLED') return false;

        const bookingCheckIn = new Date(booking.check_in);
        const bookingCheckOut = new Date(booking.check_out);

        // Check for overlap
        return (
          (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
          (checkOutDate > bookingCheckIn && checkOutDate <= bookingCheckOut) ||
          (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
        );
      });

      setHasConflict(conflict);
      
      if (conflict) {
        toast.error('These dates conflict with an existing booking for this property');
      }
    } catch (error) {
      console.error('Failed to check conflicts:', error);
    } finally {
      setCheckingConflict(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedHouse || !guestName || !guestPhone || !checkIn || !checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (hasConflict) {
      toast.error('Cannot create booking due to date conflict');
      return;
    }

    try {
      setCreating(true);
      const bookingData = {
        house: Number(selectedHouse),
        guest_name: guestName,
        guest_phone: guestPhone,
        check_in: new Date(checkIn).toISOString(),
        check_out: new Date(checkOut).toISOString(),
        notes: notes || undefined,
      };

      const booking = await bookingApi.create(bookingData);
      
      // Update status if confirmed
      if (status === 'CONFIRMED') {
        await bookingApi.updateStatus(booking.id, 'CONFIRMED');
      }

      toast.success('Booking created successfully!');
      router.push(`/admin/bookings/${booking.id}`);
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      const message = error.response?.data?.detail || 'Failed to create booking';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    if (!selectedHouse || !checkIn || !checkOut) return 0;
    const house = houses.find(h => h.id === Number(selectedHouse));
    if (!house) return 0;
    return parseFloat(house.price) * calculateNights();
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  if (loadingHouses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/bookings"
            className="flex items-center gap-2 text-gray-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Bookings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Booking
          </h1>
          <p className="text-gray-600 dark:text-dark-300">
            Manually create a booking for a customer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* House Selection */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Property</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Select Property *
              </label>
              <select
                value={selectedHouse}
                onChange={(e) => setSelectedHouse(e.target.value ? Number(e.target.value) : '')}
                className="input-field"
                required
              >
                <option value="">Choose a property...</option>
                {houses.map((house) => (
                  <option key={house.id} value={house.id}>
                    {house.name} - ${house.price}/night ({house.location_name})
                  </option>
                ))}
              </select>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="input-field"
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-500" />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="input-field pl-10"
                    placeholder="+1234567890"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Dates */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Booking Dates</h2>
            </div>
            
            {/* Conflict Warning */}
            {checkingConflict && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <p className="text-sm text-blue-400">Checking for conflicts...</p>
              </div>
            )}
            
            {hasConflict && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">
                  These dates conflict with an existing booking. Please choose different dates.
                </p>
              </div>
            )}

            {!hasConflict && !checkingConflict && checkIn && checkOut && selectedHouse && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-sm text-green-400">Dates are available!</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Check-out Date *
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="input-field"
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* Price Summary */}
            {calculateNights() > 0 && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-dark-300">
                    {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
                  </span>
                  <span className="text-2xl font-bold text-primary-500">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Additional Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'PENDING' | 'CONFIRMED')}
                  className="input-field"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Add any special requests or notes..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={creating || hasConflict || !selectedHouse || !guestName || !guestPhone || !checkIn || !checkOut}
              className="btn-primary flex-1"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Booking
                </>
              )}
            </button>
            <Link href="/admin/bookings" className="btn-secondary px-6">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

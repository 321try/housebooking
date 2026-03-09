'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { houseApi } from '@/lib/api';
import { bookingApi } from '@/lib/api/bookingApi';
import { House } from '@/types';
import MediaCarousel from '@/components/MediaCarousel';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Home as HomeIcon, 
  Wifi, 
  Car, 
  Utensils, 
  Wind, 
  Flame, 
  Tv, 
  WashingMachine, 
  Waves,
  ArrowLeft,
  Calendar,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, getStatusBadgeColor } from '@/lib/utils';

export default function HouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const houseId = parseInt(params.id as string);
  const { user } = useAuthStore();

  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchHouse();
  }, [houseId]);

  const fetchHouse = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await houseApi.getById(houseId);
      setHouse(response.data);
    } catch (err: any) {
      console.error('Error fetching house:', err);
      setError(err.response?.status === 404 ? 'House not found' : 'Failed to load house details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    try {
      setBookingLoading(true);
      const bookingData = {
        house: houseId,
        check_in: new Date(checkIn).toISOString(),
        check_out: new Date(checkOut).toISOString(),
        notes: notes || undefined,
      };

      console.log('Creating booking with data:', bookingData);
      console.log('User:', user);
      
      await bookingApi.create(bookingData);
      toast.success('Booking created successfully!');
      router.push('/dashboard/bookings');
    } catch (err: any) {
      console.error('Booking error:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      
      let errorMessage = 'Failed to create booking';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle validation errors (object with field errors)
        if (typeof errorData === 'object' && !errorData.detail) {
          const errors = Object.entries(errorData)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgArray.join(', ')}`;
            })
            .join('; ');
          errorMessage = errors || errorMessage;
        } else {
          // Handle single error message
          errorMessage = errorData.detail 
            || errorData.message
            || (typeof errorData === 'string' ? errorData : errorMessage);
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const price = parseFloat(house?.price || '0');
    return nights * price;
  };

  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    parking: Car,
    kitchen: Utensils,
    air_conditioning: Wind,
    heating: Flame,
    tv: Tv,
    washer: WashingMachine,
    pool: Waves,
  };

  const amenityLabels: Record<string, string> = {
    wifi: 'WiFi',
    parking: 'Parking',
    kitchen: 'Kitchen',
    air_conditioning: 'Air Conditioning',
    heating: 'Heating',
    tv: 'TV',
    washer: 'Washer',
    pool: 'Pool',
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !house) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <HomeIcon className="w-20 h-20 text-dark-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">{error || 'House Not Found'}</h2>
            <p className="text-dark-400 mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Link href="/houses" className="btn-primary">
              Browse All Houses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const availableAmenities = Object.entries(house.amenities || {})
    .filter(([_, value]) => value === true)
    .map(([key]) => key);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/houses" 
          className="inline-flex items-center text-primary-500 hover:text-primary-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Houses
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <div className="card overflow-hidden p-0">
              <MediaCarousel 
                media={house.images || []} 
                className="h-[500px]"
                autoplay={true}
              />
            </div>

            {/* House Info */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{house.name}</h1>
                  <div className="flex items-center gap-4 text-dark-400">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>
                        {house.location_detail?.name}
                        {house.sublocation_detail && ` • ${house.sublocation_detail.name}`}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-dark-700 rounded-full text-sm">
                      {house.type}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadgeColor(house.status)}`}>
                  {house.status}
                </span>
              </div>

              <div className="border-t border-dark-700 pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-dark-300 leading-relaxed whitespace-pre-wrap">
                  {house.description}
                </p>
              </div>

              {/* Amenities */}
              {availableAmenities.length > 0 && (
                <div className="border-t border-dark-700 pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {availableAmenities.map((amenity) => {
                      const Icon = amenityIcons[amenity];
                      return (
                        <div key={amenity} className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                          {Icon && <Icon className="w-5 h-5 text-primary-500" />}
                          <span className="text-sm">{amenityLabels[amenity] || amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Location Details */}
              {house.location_detail && (
                <div className="border-t border-dark-700 pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-3">Location</h2>
                  <div className="bg-dark-800 p-4 rounded-lg">
                    <p className="font-semibold mb-2">{house.location_detail.name}</p>
                    {house.location_detail.description && (
                      <p className="text-dark-400 text-sm">{house.location_detail.description}</p>
                    )}
                    {house.sublocation_detail && (
                      <div className="mt-3 pt-3 border-t border-dark-700">
                        <p className="font-medium text-sm text-primary-500">{house.sublocation_detail.name}</p>
                        {house.sublocation_detail.description && (
                          <p className="text-dark-400 text-sm mt-1">{house.sublocation_detail.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary-500">
                    {formatCurrency(house.price)}
                  </span>
                  <span className="text-dark-400">/night</span>
                </div>
                <p className="text-sm text-dark-400">
                  {house.status === 'AVAILABLE' ? 'Available for booking' : `Currently ${house.status.toLowerCase()}`}
                </p>
              </div>

              {house.status === 'AVAILABLE' ? (
                <>
                  {user ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="input-field"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="input-field"
                          min={checkIn || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="input-field"
                          rows={3}
                          placeholder="Any special requests or notes..."
                        />
                      </div>
                      <button 
                        onClick={handleBooking}
                        disabled={bookingLoading || !checkIn || !checkOut}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {bookingLoading ? 'Processing...' : 'Reserve Now'}
                      </button>
                      <p className="text-xs text-dark-500 text-center">
                        You won't be charged yet
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-dark-400 mb-4">Sign in to book this property</p>
                      <Link href="/login" className="btn-primary w-full inline-block">
                        Sign In to Book
                      </Link>
                      <p className="text-sm text-dark-500 mt-3">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-primary-500 hover:text-primary-400">
                          Register
                        </Link>
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-dark-400 mb-4">
                    This property is currently not available for booking.
                  </p>
                  <Link href="/houses" className="btn-secondary w-full inline-block">
                    Browse Other Houses
                  </Link>
                </div>
              )}

              {/* Price Breakdown */}
              {house.status === 'AVAILABLE' && user && (
                <div className="mt-6 pt-6 border-t border-dark-700">
                  <h3 className="font-semibold mb-3">Price Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-dark-400">
                      <span>{formatCurrency(house.price)} x {calculateNights() || 1} night{calculateNights() !== 1 ? 's' : ''}</span>
                      <span>{formatCurrency(calculateTotal() || house.price)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-dark-700 font-semibold">
                      <span>Total</span>
                      <span className="text-primary-500">{formatCurrency(calculateTotal() || house.price)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

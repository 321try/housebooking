'use client';

import { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Building2, MapPin, Calendar, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-dark-400">Welcome back, {user?.name}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="w-8 h-8 text-primary-500" />
                <span className="text-3xl font-bold">--</span>
              </div>
              <h3 className="text-dark-400 text-sm">Total Houses</h3>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-blue-500" />
                <span className="text-3xl font-bold">--</span>
              </div>
              <h3 className="text-dark-400 text-sm">Total Bookings</h3>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <MapPin className="w-8 h-8 text-green-500" />
                <span className="text-3xl font-bold">--</span>
              </div>
              <h3 className="text-dark-400 text-sm">Locations</h3>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-yellow-500" />
                <span className="text-3xl font-bold">--</span>
              </div>
              <h3 className="text-dark-400 text-sm">Total Revenue</h3>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/admin/houses" className="card p-6 hover:shadow-xl transition-shadow group">
                <Building2 className="w-12 h-12 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-500 transition-colors">
                  Manage Houses
                </h3>
                <p className="text-dark-400 text-sm">
                  View, add, edit, and delete property listings
                </p>
              </Link>

              <Link href="/admin/locations" className="card p-6 hover:shadow-xl transition-shadow group">
                <MapPin className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-green-500 transition-colors">
                  Manage Locations
                </h3>
                <p className="text-dark-400 text-sm">
                  Add and organize locations and sublocations
                </p>
              </Link>

              <Link href="/admin/bookings" className="card p-6 hover:shadow-xl transition-shadow group">
                <Calendar className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                  Manage Bookings
                </h3>
                <p className="text-dark-400 text-sm">
                  View and manage all customer bookings
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

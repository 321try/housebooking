'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Calendar } from 'lucide-react';

export default function AdminBookingsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Manage Bookings</h1>
          <p className="text-dark-400 mb-8">View and manage all customer bookings</p>

          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-dark-400">
              Booking management interface will be available in the next phase
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

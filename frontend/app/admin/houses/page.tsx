'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import Image from 'next/image';
import { houseApi } from '@/lib/api';
import { House, HouseListItem } from '@/types';
import { formatCurrency, getStatusBadgeColor } from '@/lib/utils';
import { Plus, Edit, Trash2, MapPin, Home as HomeIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminHousesPage() {
  const [houses, setHouses] = useState<HouseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const response = await houseApi.getAll();
      setHouses(response.data.results || []);
    } catch (error) {
      console.error('Error fetching houses:', error);
      setHouses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this house?')) return;

    try {
      await houseApi.delete(id);
      setHouses(houses.filter(h => h.id !== id));
      toast.success('House deleted successfully!');
    } catch (error) {
      console.error('Error deleting house:', error);
      toast.error('Failed to delete house');
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Houses</h1>
              <p className="text-dark-400">Add, edit, or remove property listings</p>
            </div>
            <Link href="/admin/houses/new" className="btn-primary inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add New House
            </Link>
          </div>

          {/* Houses List */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="flex gap-6 p-6">
                    <div className="w-48 h-32 bg-dark-700 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-4">
                      <div className="h-6 bg-dark-700 rounded w-1/3" />
                      <div className="h-4 bg-dark-700 rounded w-2/3" />
                      <div className="h-4 bg-dark-700 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : houses.length === 0 ? (
            <div className="text-center py-20">
              <HomeIcon className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No houses yet</h3>
              <p className="text-dark-400 mb-6">Get started by adding your first property</p>
              <Link href="/admin/houses/new" className="btn-primary inline-flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add New House
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {houses.map((house) => (
                <div key={house.id} className="card hover:shadow-xl transition-shadow">
                  <div className="flex gap-6 p-6">
                    {/* Image */}
                    <div className="w-48 h-32 relative flex-shrink-0 rounded-lg overflow-hidden bg-dark-700">
                      {house.primary_image ? (
                        <Image
                          src={house.primary_image.image_url}
                          alt={house.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HomeIcon className="w-12 h-12 text-dark-600" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{house.name}</h3>
                          <div className="flex items-center text-dark-400 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {house.location_name}
                            {house.sublocation_name && ` • ${house.sublocation_name}`}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(house.status)}`}>
                          {house.status}
                        </span>
                      </div>

                      <p className="text-dark-300 text-sm mb-4 line-clamp-2">{house.description}</p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-primary-500">
                            {formatCurrency(house.price)}
                            <span className="text-sm text-dark-400">/night</span>
                          </span>
                          <span className="text-sm text-dark-400 px-3 py-1 bg-dark-700 rounded-full">
                            {house.type}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/admin/houses/${house.id}/edit`}
                            className="btn-secondary py-2 px-4 inline-flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(house.id)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-lg transition-colors inline-flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

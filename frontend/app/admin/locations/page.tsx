'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { locationApi, sublocationApi } from '@/lib/api';
import { Location, SubLocation } from '@/types';
import { Plus, Edit, Trash2, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [sublocations, setSublocations] = useState<SubLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLocations, setExpandedLocations] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [locationsRes, sublocationsRes] = await Promise.all([
        locationApi.getAll(),
        sublocationApi.getAll(),
      ]);
      setLocations(locationsRes.data.results || []);
      setSublocations(sublocationsRes.data.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLocations([]);
      setSublocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this location? All associated sublocations will also be deleted.')) return;

    try {
      await locationApi.delete(id);
      setLocations(locations.filter(l => l.id !== id));
      setSublocations(sublocations.filter(sl => sl.location !== id));
      toast.success('Location deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting location:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete location');
    }
  };

  const handleDeleteSublocation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sublocation?')) return;

    try {
      await sublocationApi.delete(id);
      setSublocations(sublocations.filter(sl => sl.id !== id));
      toast.success('Sublocation deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting sublocation:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete sublocation');
    }
  };

  const toggleLocation = (id: number) => {
    const newExpanded = new Set(expandedLocations);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLocations(newExpanded);
  };

  const getSublocationsForLocation = (locationId: number) => {
    return sublocations.filter(sl => sl.location === locationId);
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Locations</h1>
              <p className="text-dark-400">Add and manage locations and sublocations</p>
            </div>
            <Link href="/admin/locations/new" className="btn-primary inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Location
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : locations.length === 0 ? (
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-12 text-center">
              <MapPin className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Locations Yet</h3>
              <p className="text-dark-400 mb-6">Get started by adding your first location</p>
              <Link href="/admin/locations/new" className="btn-primary inline-flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add First Location
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {locations.map((location) => {
                const locationSublocations = getSublocationsForLocation(location.id);
                const isExpanded = expandedLocations.has(location.id);

                return (
                  <div key={location.id} className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
                    {/* Location Row */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <button
                          onClick={() => toggleLocation(location.id)}
                          className="mr-3 p-1 hover:bg-dark-700 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-primary-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-dark-400" />
                          )}
                        </button>
                        <MapPin className="w-5 h-5 text-primary-500 mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold">{location.name}</h3>
                          {location.description && (
                            <p className="text-sm text-dark-400">{location.description}</p>
                          )}
                          <p className="text-xs text-dark-500 mt-1">
                            {locationSublocations.length} sublocation{locationSublocations.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/locations/${location.id}/edit`}
                          className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-primary-500"
                          title="Edit Location"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteLocation(location.id)}
                          className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-red-500"
                          title="Delete Location"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Sublocations */}
                    {isExpanded && (
                      <div className="border-t border-dark-700 bg-dark-900 p-4">
                        {locationSublocations.length === 0 ? (
                          <p className="text-sm text-dark-500 italic">No sublocations yet</p>
                        ) : (
                          <div className="grid gap-2">
                            {locationSublocations.map((sublocation) => (
                              <div
                                key={sublocation.id}
                                className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-700"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{sublocation.name}</p>
                                  {sublocation.description && (
                                    <p className="text-sm text-dark-400">{sublocation.description}</p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Link
                                    href={`/admin/locations/${location.id}/sublocations/${sublocation.id}/edit`}
                                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-primary-500"
                                    title="Edit Sublocation"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteSublocation(sublocation.id)}
                                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-red-500"
                                    title="Delete Sublocation"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <Link
                          href={`/admin/locations/${location.id}/sublocations/new`}
                          className="mt-3 inline-flex items-center text-sm text-primary-500 hover:text-primary-400 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Sublocation
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}


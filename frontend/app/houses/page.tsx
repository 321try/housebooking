'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { HouseListItem, Location } from '@/types';
import { houseApi, locationApi } from '@/lib/api';
import { formatCurrency, getStatusBadgeColor } from '@/lib/utils';
import { MapPin, Filter, Home as HomeIcon } from 'lucide-react';

export default function HousesPage() {
  const [houses, setHouses] = useState<HouseListItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: '',
    search: '',
  });

  useEffect(() => {
    fetchLocations();
    fetchHouses();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await locationApi.getAll();
      setLocations(response.data.results || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    }
  };

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.location) params.location = filters.location;
      if (filters.search) params.search = filters.search;

      const response = await houseApi.getAll(params);
      setHouses(response.data.results || []);
    } catch (error) {
      console.error('Error fetching houses:', error);
      setHouses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchHouses();
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      location: '',
      search: '',
    });
    setTimeout(fetchHouses, 0);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Properties</h1>
          <p className="text-dark-300 text-lg">
            Find your perfect house or BnB from our collection
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-primary-500 mr-2" />
            <h2 className="text-xl font-semibold">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search houses..."
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="HOUSE">House</option>
                <option value="BNB">BnB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="input-field"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={applyFilters} className="btn-primary">
              Apply Filters
            </button>
            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-64 bg-dark-700" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-dark-700 rounded" />
                  <div className="h-4 bg-dark-700 rounded w-2/3" />
                  <div className="h-4 bg-dark-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : houses.length === 0 ? (
          <div className="text-center py-20">
            <HomeIcon className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
            <p className="text-dark-400 mb-6">Try adjusting your filters</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-dark-400">
              Found {houses.length} {houses.length === 1 ? 'property' : 'properties'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {houses.map((house, index) => (
                <motion.div
                  key={house.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/houses/${house.id}`} className="card group hover:shadow-xl transition-shadow">
                    {house.primary_image ? (
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={house.primary_image.image_url}
                          alt={house.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-64 bg-dark-700 flex items-center justify-center">
                        <HomeIcon className="w-16 h-16 text-dark-600" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary-500 transition-colors">
                          {house.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(house.status)}`}>
                          {house.status}
                        </span>
                      </div>

                      <div className="flex items-center text-dark-400 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        {house.location_name}
                        {house.sublocation_name && ` • ${house.sublocation_name}`}
                      </div>

                      <p className="text-dark-300 text-sm mb-4 line-clamp-2">{house.description}</p>

                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary-500">
                          {formatCurrency(house.price)}
                          <span className="text-sm text-dark-400">/night</span>
                        </span>
                        <span className="text-sm text-dark-400 px-3 py-1 bg-dark-700 rounded-full">
                          {house.type}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

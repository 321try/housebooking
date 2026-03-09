'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { HouseListItem } from '@/types';
import { houseApi } from '@/lib/api';
import { formatCurrency, getStatusBadgeColor } from '@/lib/utils';
import { MapPin, ArrowRight } from 'lucide-react';

export default function FeaturedHouses() {
  const [houses, setHouses] = useState<HouseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await houseApi.getAll({ status: 'AVAILABLE', page_size: 6 });
        setHouses(response.data.results);
      } catch (error) {
        console.error('Error fetching houses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Featured Properties</h2>
          <Link href="/houses" className="text-primary-500 hover:text-primary-400 flex items-center">
            View All
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {houses.map((house, index) => (
            <motion.div
              key={house.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    <span className="text-dark-400">No image available</span>
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
                    <span className="text-sm text-dark-400">{house.type}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

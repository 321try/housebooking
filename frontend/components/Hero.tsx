'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-900/20 to-transparent" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
        >
          Find Your Perfect
          <span className="text-primary-500"> Stay</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-dark-300 mb-12 max-w-3xl mx-auto"
        >
          Discover beautiful houses and cozy BnBs in your favorite locations.
          Book your dream accommodation today.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/houses" className="btn-primary inline-flex items-center justify-center">
            <Search className="w-5 h-5 mr-2" />
            Browse Properties
          </Link>
          <Link href="/houses" className="btn-secondary inline-flex items-center justify-center">
            <MapPin className="w-5 h-5 mr-2" />
            Explore Locations
          </Link>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
    </section>
  );
}

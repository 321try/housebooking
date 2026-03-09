import Link from 'next/link';
import Hero from '@/components/Hero';
import FeaturedHouses from '@/components/FeaturedHouses';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedHouses />
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Find Your Perfect Stay?
          </h2>
          <p className="text-gray-600 dark:text-dark-300 text-lg mb-8">
            Browse our collection of houses and BnBs in premium locations
          </p>
          <Link href="/houses" className="btn-primary inline-block">
            View All Properties
          </Link>
        </div>
      </section>
    </div>
  );
}

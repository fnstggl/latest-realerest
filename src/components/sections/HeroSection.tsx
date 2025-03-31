
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import FlatIllustration from '@/components/FlatIllustration';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col space-y-4 text-center md:text-left md:w-1/2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl">
              Find Your Dream Home At A Price You Can Actually Afford
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl">
              Browse affordable listings directly from homeowners, cutting out the middleman and saving you money.
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0 md:justify-start justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/search">Browse Homes</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/create-listing">List Your Property</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 w-full max-w-lg">
            <FlatIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

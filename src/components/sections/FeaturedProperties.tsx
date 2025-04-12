import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useListings } from '@/hooks/useListings';

// Animation variants
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 60
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};
const FeaturedProperties: React.FC = () => {
  const navigate = useNavigate();
  const {
    listings,
    loading,
    error
  } = useListings(6); // Get 6 featured properties

  return <motion.section className="py-16 bg-white border-t-4 border-black" initial="hidden" whileInView="visible" viewport={{
    once: true,
    amount: 0.2
  }} variants={fadeInUp}>
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="flex items-center mb-10">
          <div className="bg-[#d60013] inline-block px-3 py-1 -rotate-0 border-4 border-black">
            <h2 className="text-3xl font-bold text-white">Featured</h2>
          </div>
          <h2 className="text-3xl font-bold text-black ml-4">Properties</h2>
        </div>
        <p className="text-xl text-black mb-8">
          Discover properties below market value, exclusively available through DoneDeal.
        </p>
        
        {error ? <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-bold text-red-600 mb-4">{error}</h3>
            <Button className="neo-button" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div> : loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => <div key={index} className="border-4 border-black p-4 h-[400px]">
                <Skeleton className="h-[240px] w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex gap-4 mb-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>)}
          </div> : <>
            {listings.length > 0 ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((property, index) => <motion.div key={property.id} initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }}>
                    <PropertyCard id={property.id} price={property.price} marketPrice={property.marketPrice} image={property.image} location={property.location} address={property.title} beds={property.beds} baths={property.baths} sqft={property.sqft} belowMarket={property.belowMarket} />
                  </motion.div>)}
              </div> : <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-bold text-black mb-6">No properties have been listed yet.</h3>
                <Button className="neo-button-primary font-bold" onClick={() => navigate('/sell/create')}>
                  List Your Property
                </Button>
              </div>}
            
            <div className="mt-12 text-center">
              <Button onClick={() => navigate('/search')} className="neo-button font-bold">
                View All Properties
                <ArrowRight size={18} />
              </Button>
            </div>
          </>}
      </div>
    </motion.section>;
};
export default FeaturedProperties;
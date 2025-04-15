
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useListings } from '@/hooks/useListings';

// Remove scroll animations
const fadeInUp = {
  hidden: {
    opacity: 1,
    y: 0
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0
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

  return (
    <motion.section 
      className="py-16 relative overflow-hidden"
      initial="visible" 
      whileInView="visible" 
      viewport={{
        once: true,
        amount: 0.2
      }} 
      variants={fadeInUp}
    >
      <div className="container px-4 lg:px-8 mx-auto md:ml-64">
        <div className="flex items-center mb-8">
          <div className="glass-gradient-pink inline-block px-3 py-1 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-white">Featured</h2>
          </div>
          <h2 className="text-3xl font-bold text-foreground ml-4">Properties</h2>
        </div>
        
        <p className="text-xl text-foreground mb-8">
          Discover properties below market value, exclusively available through RealerEstate.
        </p>
        
        {error ? (
          <div className="glass-card p-12 text-center">
            <h3 className="text-xl font-bold text-red-600 mb-4">{error}</h3>
            <Button className="glass-button" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="glass-card p-4 h-[400px]">
                <Skeleton className="h-[240px] w-full mb-4 bg-white/10" />
                <Skeleton className="h-6 w-3/4 mb-2 bg-white/10" />
                <Skeleton className="h-4 w-1/2 mb-4 bg-white/10" />
                <div className="flex gap-4 mb-4">
                  <Skeleton className="h-4 w-16 bg-white/10" />
                  <Skeleton className="h-4 w-16 bg-white/10" />
                  <Skeleton className="h-4 w-16 bg-white/10" />
                </div>
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {listings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((property, index) => (
                  <motion.div 
                    key={property.id} 
                    initial={{
                      opacity: 1,
                      y: 0
                    }} 
                    whileInView={{
                      opacity: 1,
                      y: 0
                    }} 
                    viewport={{
                      once: true
                    }} 
                    transition={{
                      duration: 0,
                      delay: 0
                    }}
                  >
                    <PropertyCard 
                      id={property.id} 
                      price={property.price} 
                      marketPrice={property.marketPrice} 
                      image={property.image} 
                      location={property.location} 
                      address={property.title} 
                      beds={property.beds} 
                      baths={property.baths} 
                      sqft={property.sqft} 
                      belowMarket={property.belowMarket} 
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-6">No properties have been listed yet.</h3>
                <Button className="glass" onClick={() => navigate('/sell/create')}>
                  List Your Property
                </Button>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Button onClick={() => navigate('/search')} className="glass-button font-bold">
                View All Properties
                <ArrowRight size={18} />
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default FeaturedProperties;

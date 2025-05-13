
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import { useListings } from '@/hooks/useListings';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const FeaturedProperties: React.FC = () => {
  const navigate = useNavigate();
  const { listings, loading, error } = useListings(6);

  if (loading) {
    return (
      <section className="py-16 relative overflow-hidden perspective-container">
        <div className="container px-4 lg:px-8 mx-auto relative z-10">
          <div className="flex items-center mb-8">
            <h2 className="text-2xl sm:text-4xl font-editorial font-bold italic text-foreground tracking-tight">
              Featured homes
            </h2>
          </div>
          
          <p className="text-base sm:text-xl text-foreground mb-8 max-w-3xl">
            Real estate for <span className="font-editorial italic">real people</span>. We only offer below-market homes you can actually afford, because we know buying a home isn't cheap.
          </p>
          
          <div className="flex justify-center items-center min-h-[300px]">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden perspective-container">
      <div className="container px-4 lg:px-8 mx-auto relative z-10">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl sm:text-4xl font-editorial font-bold italic text-foreground tracking-tight">
            Featured homes
          </h2>
        </div>
        
        <p className="text-base sm:text-xl text-foreground mb-8 max-w-3xl">
          Real estate for <span className="font-editorial italic">real people</span>. We only offer below-market homes you can actually afford, because we know buying a home isn't cheap.
        </p>
        
        {error ? (
          <div className="glass-card p-12 text-center shadow-xl">
            <h3 className="text-xl font-bold text-red-600 mb-4">{error}</h3>
            <Button className="glass-button shadow-lg" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {listings.map((property) => (
                  <div key={property.id}>
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
                      reward={property.reward}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center shadow-xl">
                <h3 className="text-2xl font-bold text-foreground mb-6">No properties have been listed yet.</h3>
                <Button className="glass shadow-lg electric-blue-button" onClick={() => navigate('/sell/create')}>
                  List Your Property
                </Button>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Button 
                onClick={() => navigate('/search')} 
                className="glass-button font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 electric-blue-button"
              >
                View All Properties
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;

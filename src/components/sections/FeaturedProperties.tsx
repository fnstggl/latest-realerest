
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
          <div className="flex items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-polysans font-bold text-[#01204b] tracking-wide pl-[10px]">
              Featured homes
            </h2>
          </div>
          
          <p className="text-sm sm:text-base text-[#01204b] mb-8 max-w-3xl font-polysans-semibold pl-[10px]">
            Only homes priced <span className="font-polysans-semibold">below-market</span>. That's Realer Estate.
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
        <div className="flex items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-polysans font-bold text-[#01204b] tracking-wide pl-[10px]">
            Featured homes
          </h2>
        </div>
        
        <p className="text-sm sm:text-base text-[#01204b] mb-8 max-w-3xl font-polysans-semibold pl-[10px]">
          Only homes priced <span className="font-polysans-semibold">below-market</span>. That's Realer Estate.
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
                className="glass-button font-polysans font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 electric-blue-button"
              >
                View All Homes
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;

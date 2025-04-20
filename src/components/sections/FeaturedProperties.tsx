import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import { useListings } from '@/hooks/useListings';

const FeaturedProperties: React.FC = () => {
  const navigate = useNavigate();
  const { listings, loading, error } = useListings(6);

  if (loading) {
    return (
      <div className="min-h-[300px] flex justify-center items-center">
        <div className="loading-container">
          <div className="pulsing-circle" />
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden perspective-container">
      <div className="container px-4 lg:px-8 mx-auto relative z-10">
        <div className="flex items-center mb-8">
          <h2 className="text-4xl font-editorial font-bold italic text-foreground tracking-wide">
            Featured Homes
          </h2>
        </div>
        
        <p className="text-xl text-foreground mb-8 max-w-3xl">
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="font-bold text-xs sm:text-sm md:text-base shadow-lg bg-white hover:bg-white relative group overflow-hidden border border-transparent rounded-lg"
              >
                <span className="text-black relative z-10">View All Properties</span>
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    filter: "blur(2px)"
                  }}
                ></span>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;

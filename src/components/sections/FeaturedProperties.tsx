import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import { useListings } from '@/hooks/useListings';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const FeaturedProperties: React.FC = () => {
  const navigate = useNavigate();
  const { listings, loading, error } = useListings(6);

  if (loading) {
    return (
      <div className="min-h-[300px] flex justify-center items-center">
        <div className="gradient-blob"></div>
      </div>
    );
  }

  return (
    <motion.section 
      className="py-16 relative overflow-hidden perspective-container"
      initial="hidden" 
      whileInView="visible" 
      viewport={{
        once: true,
        amount: 0.2
      }} 
      variants={fadeInUp}
    >
      <div className="container px-4 lg:px-8 mx-auto relative z-10">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Featured Properties</h2>
        </div>
        
        <p className="text-xl text-foreground mb-8 max-w-3xl">
          Rethinking real estate, for real people. We only offer below-market priced homes, and we make them available for everyone
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
                {listings.map((property, index) => (
                  <motion.div 
                    key={property.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.4, delay: index * 0.1 }}
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
    </motion.section>
  );
};

export default FeaturedProperties;

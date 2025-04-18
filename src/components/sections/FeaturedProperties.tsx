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
  const { listings, loading, error } = useListings(3);

  if (loading) {
    return (
      <div className="min-h-[300px] flex justify-center items-center">
        <p className="text-lg font-medium text-gray-600">Loading properties...</p>
      </div>
    );
  }

  return (
    <motion.section 
      className="py-16 relative overflow-hidden perspective-container"
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <div className="container px-4 lg:px-8 mx-auto relative z-10">
        <div className="flex items-center mb-8">
          <h2 className="font-editorial font-bold italic text-4xl text-foreground tracking-wide">
            Featured Homes
          </h2>
        </div>
        
        <p className="text-xl text-foreground mb-8 max-w-3xl">
          Real estate for <span className="font-editorial italic">real people</span>. We only offer below-market homes you can actually afford.
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
                    <PropertyCard {...property} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center shadow-xl">
                <h3 className="text-2xl font-bold text-foreground mb-6">No properties listed yet</h3>
                <Button className="glass shadow-lg electric-blue-button" onClick={() => navigate('/sell/create')}>
                  List Your Property
                </Button>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Button 
                onClick={() => navigate('/search')} 
                variant="translucent"
                className="font-bold"
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

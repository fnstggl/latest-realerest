
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useListings } from '@/hooks/useListings';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
          <div className="apple-glow-text-small inline-block px-4 py-2 rounded-xl shadow-xl layer-2">
            <h2 className="text-3xl font-bold">Featured</h2>
          </div>
          <h2 className="text-3xl font-bold text-foreground ml-4 layer-1">Properties</h2>
        </div>
        
        <p className="text-xl text-foreground mb-8 max-w-3xl">
          Discover properties below market value, exclusively available through RealerEstate.
        </p>
        
        {error ? (
          <div className="glass-card p-12 text-center shadow-xl">
            <h3 className="text-xl font-bold text-red-600 mb-4">{error}</h3>
            <Button className="glass-button shadow-lg" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="glass-card p-4 h-[400px] shadow-xl">
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
                <Button className="glass shadow-lg search-glow" onClick={() => navigate('/sell/create')}>
                  List Your Property
                </Button>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Button 
                onClick={() => navigate('/search')} 
                className="glass-button font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 search-glow"
              >
                <span className="apple-glow-text-small">View All Properties</span>
                <div className="glass-button-icon w-8 h-8 rounded-full flex items-center justify-center shadow-lg bg-white/20 backdrop-blur-md border border-white/30 layer-3 search-glow">
                  <ArrowRight size={18} className="text-[#FF5C00]" />
                </div>
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default FeaturedProperties;

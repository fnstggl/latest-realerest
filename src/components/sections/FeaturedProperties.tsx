
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

interface Listing {
  id: string;
  title?: string;
  price: number;
  market_price: number;
  image: string;
  location: string;
  address?: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  images?: string[];
}

const FeaturedProperties: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data to match our component props
          const transformedListings = data.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            market_price: item.market_price,  // Changed from marketPrice to match Listing interface
            location: item.location,
            beds: item.beds,
            baths: item.baths,
            sqft: item.sqft,
            // Use the first image from the array if available
            image: item.images && item.images.length > 0 ? item.images[0] : 'https://source.unsplash.com/random/800x600?house',
            // Calculate below market percentage
            belowMarket: item.market_price > item.price 
              ? parseFloat(((item.market_price - item.price) / item.market_price * 100).toFixed(1)) 
              : 0
          }));
          
          setListings(transformedListings);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <motion.section 
      className="py-16 bg-white border-t-4 border-black"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="flex items-center mb-10">
          <div className="bg-[#d60013] inline-block px-3 py-1 -rotate-1 border-4 border-black">
            <h2 className="text-3xl font-bold text-white">Featured</h2>
          </div>
          <h2 className="text-3xl font-bold text-black ml-4">Properties</h2>
        </div>
        <p className="text-xl text-black mb-8">
          Discover properties below market value, exclusively available through DoneDeal.
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="border-4 border-black p-4 h-[400px] animate-pulse">
                <div className="bg-gray-200 h-[240px] w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
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
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PropertyCard
                      id={property.id}
                      price={property.price}
                      marketPrice={property.market_price}  // Changed from property.marketPrice
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
              <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-bold text-black mb-6">No properties have been listed yet.</h3>
                <Button
                  className="neo-button-primary font-bold"
                  onClick={() => navigate('/sell/create')}
                >
                  List Your Property
                </Button>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Button 
                onClick={() => navigate('/search')}
                className="neo-button font-bold"
              >
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

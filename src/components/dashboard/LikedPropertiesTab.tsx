
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Heart } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const LikedPropertiesTab = () => {
  const { user } = useAuth();

  const { data: likedProperties, isLoading } = useQuery({
    queryKey: ['likedProperties', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('liked_properties')
        .select(`
          property_id,
          property_listings (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      return data
        .filter(item => item.property_listings)
        .map(item => ({
          id: item.property_listings.id,
          title: item.property_listings.title,
          price: Number(item.property_listings.price),
          marketPrice: Number(item.property_listings.market_price),
          location: item.property_listings.location,
          reward: item.property_listings.reward,
          image: item.property_listings.images?.[0] || '/placeholder.svg',
          beds: item.property_listings.beds,
          baths: item.property_listings.baths,
          sqft: item.property_listings.sqft,
          belowMarket: calculateBelowMarket(
            Number(item.property_listings.market_price),
            Number(item.property_listings.price)
          )
        }));
    }
  });

  const calculateBelowMarket = (marketPrice: number, price: number) => {
    if (marketPrice > price) {
      return ((marketPrice - price) / marketPrice) * 100;
    }
    return 0;
  };

  if (isLoading) {
    return <div className="flex justify-center py-8 font-polysans-semibold text-[#01204b]">Loading...</div>;
  }

  if (!likedProperties || likedProperties.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Heart size={32} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-polysans-bold mb-2 text-[#01204b]">No liked properties</h3>
        <p className="text-gray-600 mb-6 font-polysans-semibold">
          When you like a property, it'll appear here for easy access.
        </p>
        <Button asChild variant="outline" className="font-polysans-bold">
          <Link to="/search">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {likedProperties.map(property => (
        <PropertyCard
          key={property.id}
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
      ))}
    </div>
  );
};

export default LikedPropertiesTab;

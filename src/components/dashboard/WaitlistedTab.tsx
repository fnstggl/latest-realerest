
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

const WaitlistedTab = () => {
  const { data: waitlistedProperties, isLoading } = useQuery({
    queryKey: ['waitlistedProperties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist_requests')
        .select(`
          id,
          status,
          property_listings (
            id,
            title,
            price,
            market_price,
            location,
            images,
            beds,
            baths,
            sqft
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  if (!waitlistedProperties?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <ClipboardList size={32} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No waitlisted properties</h3>
        <p className="text-gray-600 mb-6">Join property waitlists to see them here</p>
        <Button asChild variant="outline">
          <Link to="/search">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {waitlistedProperties.map((item) => (
        <PropertyCard
          key={item.property_listings.id}
          id={item.property_listings.id}
          price={item.property_listings.price}
          marketPrice={item.property_listings.market_price}
          image={item.property_listings.images[0]}
          location={item.property_listings.location}
          beds={item.property_listings.beds}
          baths={item.property_listings.baths}
          sqft={item.property_listings.sqft}
          belowMarket={Math.round(((item.property_listings.market_price - item.property_listings.price) / item.property_listings.market_price) * 100)}
          status={item.status}
        />
      ))}
    </div>
  );
};

export default WaitlistedTab;

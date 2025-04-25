
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const WaitlistedTab = () => {
  const { user } = useAuth();
  
  const { data: waitlistedProperties, isLoading } = useQuery({
    queryKey: ['waitlistedProperties', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('waitlist_requests')
        .select(`
          id,
          status,
          property_id,
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  if (!waitlistedProperties?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <ClipboardCheck size={32} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No waitlisted properties yet</h3>
        <p className="text-gray-600 mb-6">Join property waitlists to be notified about opportunities</p>
        <Button asChild variant="outline">
          <Link to="/search">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {waitlistedProperties.map((item: any) => {
        if (!item.property_listings) return null;
        
        const property = item.property_listings;
        const belowMarket = Math.round(((Number(property.market_price) - Number(property.price)) / Number(property.market_price)) * 100);
        
        return (
          <div key={item.id} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4">
                <img 
                  src={property.images?.[0] || "https://placehold.co/600x400?text=Property+Image"} 
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
              </div>
              <div className="p-4 md:p-6 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold">{property.title}</h3>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    item.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                    item.status === 'declined' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{property.location}</p>
                
                <div className="flex gap-4 mb-3">
                  <div className="font-bold">${property.price.toLocaleString()}</div>
                  <div className="text-gray-500 line-through">${property.market_price.toLocaleString()}</div>
                  <div className="text-green-600 font-medium">{belowMarket}% below market</div>
                </div>
                
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div>{property.beds} beds</div>
                  <div>{property.baths} baths</div>
                  <div>{property.sqft.toLocaleString()} sqft</div>
                </div>
                
                <Button asChild className="mt-2">
                  <Link to={`/property/${property.id}`}>View Property</Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WaitlistedTab;

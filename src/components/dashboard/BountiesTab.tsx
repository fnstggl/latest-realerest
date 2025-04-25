
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const BountiesTab = () => {
  const { user } = useAuth();
  
  const { data: bounties, isLoading } = useQuery({
    queryKey: ['bounties'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select(`
            id,
            title,
            bounty,
            location,
            images,
            price,
            market_price
          `)
          .gt('bounty', 0)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching bounties:", error);
        return [];
      }
    }
  });

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  if (!bounties?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Award size={32} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No available bounties</h3>
        <p className="text-gray-600 mb-6">Check back later for property bounties</p>
        <Button asChild variant="outline">
          <Link to="/search">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold mb-2">Available Bounties</h3>
        <p className="text-gray-600">Earn rewards by bringing cash buyers to these properties</p>
      </div>
      
      {bounties.map((bounty) => (
        <div key={bounty.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={bounty.images?.[0] || "https://placehold.co/600x400?text=Property+Image"} 
              alt={bounty.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{bounty.title}</h3>
              <p className="text-sm text-gray-600">{bounty.location}</p>
              <p className="text-sm font-medium mt-1">${bounty.price?.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 font-semibold">
              <DollarSign size={16} className="mr-1" />
              {bounty.bounty?.toLocaleString()} Bounty
            </div>
            <Button asChild className="mt-2" variant="outline" size="sm">
              <Link to={`/property/${bounty.id}`}>View Property</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BountiesTab;

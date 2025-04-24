
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BountiesTab = () => {
  const { data: bounties, isLoading } = useQuery({
    queryKey: ['bounties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bounty_claims')
        .select(`
          *,
          property_listings (
            id,
            title,
            bounty,
            location,
            images
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

  if (!bounties?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Award size={32} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No claimed bounties yet</h3>
        <p className="text-gray-600 mb-6">Claim property bounties to earn rewards</p>
        <Button asChild variant="outline">
          <Link to="/search">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bounties.map((bounty) => (
        <div key={bounty.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={bounty.property_listings.images[0]} 
              alt={bounty.property_listings.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{bounty.property_listings.title}</h3>
              <p className="text-sm text-gray-600">{bounty.property_listings.location}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 font-semibold">
              <DollarSign size={16} className="mr-1" />
              {bounty.property_listings.bounty}
            </div>
            <div className="text-sm text-gray-500 capitalize">{bounty.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BountiesTab;

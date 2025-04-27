import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RewardsTab = () => {
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['rewards'],
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

  if (!rewards?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Award size={32} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No claimed rewards yet</h3>
        <p className="text-gray-600 mb-6">Claim property rewards to earn commissions</p>
        <Button asChild variant="outline">
          <Link to="/search">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rewards.map((reward) => (
        <div key={reward.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={reward.property_listings.images[0]} 
              alt={reward.property_listings.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{reward.property_listings.title}</h3>
              <p className="text-sm text-gray-600">{reward.property_listings.location}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 font-semibold">
              <DollarSign size={16} className="mr-1" />
              {reward.property_listings.bounty}
            </div>
            <div className="text-sm text-gray-500 capitalize">{reward.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RewardsTab;

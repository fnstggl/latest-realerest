
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award } from 'lucide-react';

const RewardsTab = () => {
  const { data: totalRewards, isLoading } = useQuery({
    queryKey: ['totalRewards'],
    queryFn: async () => {
      const { data: claims, error } = await supabase
        .from('bounty_claims')
        .select(`
          property_listings (
            bounty
          )
        `)
        .eq('status', 'completed');

      if (error) throw error;
      
      return claims?.reduce((total, claim) => total + (claim.property_listings?.bounty || 0), 0) || 0;
    }
  });

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Total Rewards Earned</h3>
          <Award className="text-yellow-500" size={24} />
        </div>
        <p className="text-3xl font-bold">${totalRewards?.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default RewardsTab;

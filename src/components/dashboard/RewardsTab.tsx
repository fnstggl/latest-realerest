import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Gift, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
const PayoutsTab = () => {
  const {
    user
  } = useAuth();
  const {
    data: payouts,
    isLoading
  } = useQuery({
    queryKey: ['wholesalerPayouts'],
    queryFn: async () => {
      if (!user?.id) return {
        total: 0,
        claimed: []
      };
      const {
        data,
        error
      } = await supabase.from('bounty_claims').select(`
          *,
          property_listings (
            id,
            title,
            bounty,
            location,
            images
          )
        `).eq('user_id', user.id).eq('status', 'claimed').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      const totalPayout = data?.reduce((sum, item) => {
        return sum + (Number(item.property_listings?.bounty) || 0);
      }, 0);
      return {
        total: totalPayout,
        claimed: data || []
      };
    }
  });
  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }
  if (!payouts?.claimed.length) {
    return <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Gift size={32} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No rewards claimed yet</h3>
        <p className="text-gray-600 mb-6">Claim rewards from properties with finder's fees to get paid thousands.</p>
        <Button asChild variant="outline">
          <Link to="/search">Browse Properties</Link>
        </Button>
      </div>;
  }
  return <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Total Payouts Earned</h3>
          <div className="text-2xl font-bold text-green-600 flex items-center">
            <DollarSign size={24} />
            {payouts.total.toLocaleString()}
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold pt-4">Payout History</h3>
      
      <div className="grid gap-4">
        {payouts.claimed.map((reward: any) => <div key={reward.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={reward.property_listings?.images?.[0] || "https://placehold.co/600x400?text=Property+Image"} alt={reward.property_listings?.title} className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{reward.property_listings?.title}</h3>
                <p className="text-sm text-gray-600">{reward.property_listings?.location}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600 font-semibold">
                <DollarSign size={16} className="mr-1" />
                {reward.property_listings?.bounty}
              </div>
              <Button asChild className="mt-2" variant="outline" size="sm">
                <Link to={`/property/${reward.property_listings?.id}`}>View Property</Link>
              </Button>
            </div>
          </div>)}
      </div>
    </div>;
};
export default PayoutsTab;
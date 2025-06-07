
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Award, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import RewardProgress from "./RewardProgress";

interface RewardClaim {
  id: string;
  property_id: string;
  reward_amount: number;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
  property?: {
    title: string;
    address: string;
  };
}

const RewardsTab: React.FC = () => {
  const { user } = useAuth();
  const [rewardClaims, setRewardClaims] = useState<RewardClaim[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch reward claims
  const fetchRewardClaims = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // For now, we'll simulate some data since the bounty_claims table structure might be different
      // In a real implementation, this would fetch from the actual rewards/bounty system
      const mockClaims: RewardClaim[] = [
        {
          id: '1',
          property_id: 'mock-property-1',
          reward_amount: 1000,
          status: 'approved',
          created_at: new Date().toISOString(),
          property: {
            title: 'Beautiful Family Home',
            address: '123 Main St, Austin TX'
          }
        }
      ];

      setRewardClaims(mockClaims);
      
      // Calculate totals
      const total = mockClaims
        .filter(claim => claim.status === 'paid')
        .reduce((sum, claim) => sum + claim.reward_amount, 0);
      
      const pending = mockClaims
        .filter(claim => claim.status === 'pending' || claim.status === 'approved')
        .reduce((sum, claim) => sum + claim.reward_amount, 0);

      setTotalEarnings(total);
      setPendingRewards(pending);

    } catch (error) {
      console.error("Error fetching reward claims:", error);
      toast.error("Failed to load reward claims");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardClaims();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl p-12 text-center shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0892D0] mx-auto"></div>
        <p className="mt-4">Loading rewards...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rewards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">${totalEarnings.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Rewards</p>
              <p className="text-2xl font-bold text-orange-600">${pendingRewards.toLocaleString()}</p>
            </div>
            <Award className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Claims</p>
              <p className="text-2xl font-bold text-blue-600">{rewardClaims.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Reward Progress Example */}
      <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Current Property Rewards</h3>
        <RewardProgress 
          propertyId="example-property"
          reward={1000}
        />
      </div>

      {/* Rewards History */}
      <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-white/20 p-6 bg-white/30">
          <h2 className="text-xl font-bold">Reward Claims History</h2>
        </div>
        
        {rewardClaims.length > 0 ? (
          <div className="divide-y divide-white/10">
            {rewardClaims.map((claim) => (
              <div key={claim.id} className="p-6 hover:bg-white/20 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{claim.property?.title}</h3>
                    <p className="text-gray-600">{claim.property?.address}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Claimed on {new Date(claim.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      ${claim.reward_amount.toLocaleString()}
                    </p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      claim.status === 'paid' ? 'bg-green-100 text-green-800' :
                      claim.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {claim.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Gift size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">No Reward Claims Yet</h3>
            <p className="text-gray-500">Start earning rewards by helping connect buyers with sellers!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsTab;

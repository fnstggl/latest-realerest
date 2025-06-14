
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, TrendingUp, CheckCircle, Clock, Users, Home } from 'lucide-react';
import RewardProgress from './RewardProgress';
import type { RewardStatusDetails } from './RewardProgress';

interface BountyClaim {
  id: string;
  property_id: string;
  status: string;
  status_details: RewardStatusDetails;
  created_at: string;
  property: {
    title: string;
    location: string;
    price: number;
    reward: number;
    images: string[];
  };
}

interface RewardSummary {
  totalEarned: number;
  totalPending: number;
  activeBounties: number;
  completedDeals: number;
}

const RewardsTab: React.FC = () => {
  const { user } = useAuth();
  const [bountyClaims, setBountyClaims] = useState<BountyClaim[]>([]);
  const [rewardSummary, setRewardSummary] = useState<RewardSummary>({
    totalEarned: 0,
    totalPending: 0,
    activeBounties: 0,
    completedDeals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRewardsData();
    }
  }, [user]);

  const fetchRewardsData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch bounty claims with property details
      const { data: claims, error: claimsError } = await supabase
        .from('bounty_claims')
        .select(`
          id,
          property_id,
          status,
          status_details,
          created_at,
          property_listings!inner (
            title,
            location,
            price,
            reward,
            images
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (claimsError) {
        console.error('Error fetching bounty claims:', claimsError);
        return;
      }

      // Transform the data to match our interface
      const transformedClaims: BountyClaim[] = (claims || []).map(claim => ({
        id: claim.id,
        property_id: claim.property_id,
        status: claim.status,
        status_details: claim.status_details as RewardStatusDetails,
        created_at: claim.created_at,
        property: {
          title: claim.property_listings.title,
          location: claim.property_listings.location,
          price: Number(claim.property_listings.price),
          reward: Number(claim.property_listings.reward || 0),
          images: claim.property_listings.images || []
        }
      }));

      setBountyClaims(transformedClaims);

      // Calculate reward summary
      const summary = transformedClaims.reduce((acc, claim) => {
        const reward = claim.property.reward || 0;
        
        if (claim.status === 'completed' && claim.status_details?.dealClosed) {
          acc.totalEarned += reward;
          acc.completedDeals += 1;
        } else {
          acc.totalPending += reward;
          acc.activeBounties += 1;
        }
        
        return acc;
      }, {
        totalEarned: 0,
        totalPending: 0,
        activeBounties: 0,
        completedDeals: 0
      });

      setRewardSummary(summary);

    } catch (error) {
      console.error('Error fetching rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string, statusDetails: RewardStatusDetails) => {
    if (status === 'completed' && statusDetails?.dealClosed) return 'bg-green-500';
    if (statusDetails?.offerAccepted) return 'bg-blue-500';
    if (statusDetails?.submittedOffer) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getStatusText = (status: string, statusDetails: RewardStatusDetails) => {
    if (status === 'completed' && statusDetails?.dealClosed) return 'Deal Closed';
    if (statusDetails?.offerAccepted) return 'Offer Accepted';
    if (statusDetails?.submittedOffer) return 'Offer Submitted';
    if (statusDetails?.claimed) return 'Bounty Claimed';
    return 'In Progress';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reward Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold">${rewardSummary.totalEarned.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Rewards</p>
                <p className="text-2xl font-bold">${rewardSummary.totalPending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Bounties</p>
                <p className="text-2xl font-bold">{rewardSummary.activeBounties}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Deals</p>
                <p className="text-2xl font-bold">{rewardSummary.completedDeals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Bounty Claims */}
      <Card>
        <CardHeader>
          <CardTitle>Your Bounty Claims</CardTitle>
        </CardHeader>
        <CardContent>
          {bountyClaims.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No bounty claims yet</p>
              <p className="text-sm text-gray-500">Start by claiming bounties on properties you're interested in.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bountyClaims.map((claim) => (
                <div key={claim.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{claim.property.title}</h3>
                      <p className="text-gray-600">{claim.property.location}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                          Property Price: ${claim.property.price.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          Reward: ${claim.property.reward.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(claim.status, claim.status_details)}>
                        {getStatusText(claim.status, claim.status_details)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Claimed {new Date(claim.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <RewardProgress
                    propertyId={claim.property_id}
                    initialStatus={claim.status_details}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsTab;

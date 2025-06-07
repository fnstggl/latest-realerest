
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import RewardProgress from './RewardProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  city: string;
  state: string;
  price: number;
  reward_amount: number;
  status: string;
  created_at: string;
}

interface BountyClaim {
  id: string;
  property_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
  property_listings: Property;
}

const RewardsTab: React.FC = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState<BountyClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);

  useEffect(() => {
    if (user) {
      fetchRewards();
    }
  }, [user]);

  const fetchRewards = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: claimsData, error: claimsError } = await supabase
        .from('bounty_claims')
        .select(`
          *,
          property_listings (
            id,
            title,
            city,
            state,
            price,
            reward_amount,
            status,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (claimsError) {
        console.error('Error fetching claims:', claimsError);
        return;
      }

      setClaims(claimsData || []);

      // Calculate totals
      const total = claimsData?.reduce((sum, claim) => {
        return claim.status === 'paid' ? sum + claim.amount : sum;
      }, 0) || 0;

      const pending = claimsData?.reduce((sum, claim) => {
        return claim.status === 'pending' || claim.status === 'approved' ? sum + claim.amount : sum;
      }, 0) || 0;

      setTotalEarnings(total);
      setPendingEarnings(pending);

    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">${totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold text-yellow-600">${pendingEarnings.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Claims</p>
                <p className="text-2xl font-bold text-blue-600">{claims.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims List */}
      <Card>
        <CardHeader>
          <CardTitle>Reward Claims</CardTitle>
        </CardHeader>
        <CardContent>
          {claims.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No reward claims found.</p>
              <p className="text-sm text-gray-400 mt-2">Start by listing a property to earn rewards!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {claim.property_listings?.title || 'Property'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {claim.property_listings?.city}, {claim.property_listings?.state}
                      </p>
                      <p className="text-sm text-gray-500">
                        Listed on {new Date(claim.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${claim.amount.toLocaleString()}
                      </p>
                      {getStatusBadge(claim.status)}
                    </div>
                  </div>
                  
                  <RewardProgress 
                    propertyId={claim.property_id}
                    reward={claim.amount}
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

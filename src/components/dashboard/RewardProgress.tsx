
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface RewardStatusDetails {
  listingApproved: boolean;
  buyerFound: boolean;
  dealClosed: boolean;
  payoutSent: boolean;
}

const defaultStatus: RewardStatusDetails = {
  listingApproved: false,
  buyerFound: false,
  dealClosed: false,
  payoutSent: false,
};

interface RewardProgressProps {
  propertyId: string;
  reward?: number;
  initialStatus?: RewardStatusDetails;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ 
  propertyId, 
  reward = 0, 
  initialStatus = defaultStatus 
}) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<RewardStatusDetails>(initialStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchRewardStatus();
    }
  }, [user?.id, propertyId]);

  const fetchRewardStatus = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Check if property_rewards table exists, if not use default status
      const { data, error } = await supabase
        .from('bounty_claims')
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching reward status:', error);
        return;
      }

      if (data) {
        // Map bounty claim status to reward status
        setStatus({
          listingApproved: data.status !== 'pending',
          buyerFound: data.status === 'approved' || data.status === 'paid',
          dealClosed: data.status === 'paid',
          payoutSent: data.status === 'paid',
        });
      }
    } catch (error) {
      console.error('Error fetching reward status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRewardStatus = async (newStatus: Partial<RewardStatusDetails>) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Update local state
      setStatus(prev => ({ ...prev, ...newStatus }));
      
      // Update bounty claim status based on the new reward status
      let claimStatus = 'pending';
      const updatedStatus = { ...status, ...newStatus };
      
      if (updatedStatus.payoutSent) {
        claimStatus = 'paid';
      } else if (updatedStatus.dealClosed) {
        claimStatus = 'approved';
      } else if (updatedStatus.listingApproved) {
        claimStatus = 'pending';
      }

      const { error } = await supabase
        .from('bounty_claims')
        .upsert({
          property_id: propertyId,
          user_id: user.id,
          status: claimStatus,
          amount: reward,
        });

      if (error) {
        console.error('Error updating reward status:', error);
        // Revert local state on error
        setStatus(status);
      }
    } catch (error) {
      console.error('Error updating reward status:', error);
      setStatus(status);
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (completed: boolean, isLast: boolean = false) => {
    if (completed) {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    } else if (isLast) {
      return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    } else {
      return <Circle className="w-6 h-6 text-gray-300" />;
    }
  };

  const steps = [
    {
      title: "Listing Approved",
      description: "Your property listing has been reviewed and approved",
      completed: status.listingApproved,
      onClick: () => updateRewardStatus({ listingApproved: !status.listingApproved })
    },
    {
      title: "Buyer Found",
      description: "A qualified buyer has been found for your property",
      completed: status.buyerFound,
      onClick: () => updateRewardStatus({ buyerFound: !status.buyerFound })
    },
    {
      title: "Deal Closed",
      description: "The sale has been completed successfully",
      completed: status.dealClosed,
      onClick: () => updateRewardStatus({ dealClosed: !status.dealClosed })
    },
    {
      title: "Payout Sent",
      description: "Your reward has been processed and sent",
      completed: status.payoutSent,
      onClick: () => updateRewardStatus({ payoutSent: !status.payoutSent })
    }
  ];

  if (loading) {
    return <div className="animate-pulse">Loading reward progress...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Reward Progress</h3>
        <span className="text-2xl font-bold text-green-600">${reward.toLocaleString()}</span>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              {getStepIcon(step.completed, index === steps.length - 1)}
            </div>
            <div className="flex-1 min-w-0">
              <button
                onClick={step.onClick}
                disabled={loading}
                className="text-left w-full group hover:bg-gray-50 p-2 rounded transition-colors disabled:opacity-50"
              >
                <p className={`text-sm font-medium ${step.completed ? 'text-green-700' : 'text-gray-900'}`}>
                  {step.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardProgress;

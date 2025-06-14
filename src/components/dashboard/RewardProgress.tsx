
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, DollarSign, Users, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface RewardStatusDetails {
  claimed: boolean;
  submittedOffer: boolean;
  offerAccepted: boolean;
  foundBuyer: boolean;
  dealClosed: boolean;
}

interface RewardProgressProps {
  propertyId: string;
  initialStatus: RewardStatusDetails;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ propertyId, initialStatus }) => {
  const [statusDetails, setStatusDetails] = useState<RewardStatusDetails>(initialStatus);
  const [loading, setLoading] = useState(false);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const steps = [
      statusDetails.claimed,
      statusDetails.submittedOffer,
      statusDetails.offerAccepted,
      statusDetails.foundBuyer,
      statusDetails.dealClosed
    ];
    const completedSteps = steps.filter(Boolean).length;
    return (completedSteps / steps.length) * 100;
  };

  // Fetch updated status from bounty_claims table
  const fetchBountyStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bounty_claims')
        .select('status_details')
        .eq('property_id', propertyId)
        .single();

      if (error) {
        console.error('Error fetching bounty status:', error);
        return;
      }

      if (data?.status_details) {
        setStatusDetails(data.status_details as RewardStatusDetails);
      }
    } catch (error) {
      console.error('Error fetching bounty status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update status in database
  const updateBountyStatus = async (newStatus: Partial<RewardStatusDetails>) => {
    try {
      setLoading(true);
      const updatedStatus = { ...statusDetails, ...newStatus };
      
      const { error } = await supabase
        .from('bounty_claims')
        .update({ 
          status_details: updatedStatus,
          status: updatedStatus.dealClosed ? 'completed' : 'in_progress'
        })
        .eq('property_id', propertyId);

      if (error) {
        console.error('Error updating bounty status:', error);
        return;
      }

      setStatusDetails(updatedStatus);
    } catch (error) {
      console.error('Error updating bounty status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBountyStatus();
  }, [propertyId]);

  const progressSteps = [
    {
      key: 'claimed' as keyof RewardStatusDetails,
      label: 'Bounty Claimed',
      icon: Home,
      description: 'You claimed this property bounty'
    },
    {
      key: 'submittedOffer' as keyof RewardStatusDetails,
      label: 'Offer Submitted',
      icon: DollarSign,
      description: 'You submitted an offer to the seller'
    },
    {
      key: 'offerAccepted' as keyof RewardStatusDetails,
      label: 'Offer Accepted',
      icon: CheckCircle,
      description: 'Your offer was accepted by the seller'
    },
    {
      key: 'foundBuyer' as keyof RewardStatusDetails,
      label: 'Buyer Found',
      icon: Users,
      description: 'You found a qualified buyer for the property'
    },
    {
      key: 'dealClosed' as keyof RewardStatusDetails,
      label: 'Deal Closed',
      icon: CheckCircle,
      description: 'The deal was successfully closed'
    }
  ];

  const progressPercentage = getProgressPercentage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reward Progress</span>
          <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
            {Math.round(progressPercentage)}% Complete
          </Badge>
        </CardTitle>
        <Progress value={progressPercentage} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressSteps.map((step, index) => {
            const isCompleted = statusDetails[step.key];
            const IconComponent = step.icon;
            
            return (
              <div key={step.key} className="flex items-center space-x-3">
                <button
                  onClick={() => updateBountyStatus({ [step.key]: !isCompleted })}
                  disabled={loading}
                  className="flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4" />
                    <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                      {step.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardProgress;

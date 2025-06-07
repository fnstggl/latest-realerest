
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface RewardStatusDetails {
  listingCreated: boolean;
  waitlistJoined: boolean;
  buyerConnected: boolean;
  dealClosed: boolean;
}

interface RewardProgressProps {
  propertyId: string;
  reward?: number;
  initialStatus?: RewardStatusDetails;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ 
  propertyId, 
  reward = 1000, 
  initialStatus = {
    listingCreated: false,
    waitlistJoined: false,
    buyerConnected: false,
    dealClosed: false
  }
}) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<RewardStatusDetails>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate progress percentage
  const calculateProgress = () => {
    const completed = Object.values(status).filter(Boolean).length;
    return (completed / 4) * 100;
  };

  // Calculate current reward amount based on progress
  const getCurrentReward = () => {
    const progress = calculateProgress();
    return Math.round((progress / 100) * reward);
  };

  // Check current status from database
  const checkStatus = async () => {
    if (!user?.id || !propertyId) return;

    try {
      setIsLoading(true);

      // Check if listing exists and is created by user
      const { data: listing } = await supabase
        .from('property_listings')
        .select('id, user_id')
        .eq('id', propertyId)
        .eq('user_id', user.id)
        .single();

      // Check if there are waitlist entries
      const { data: waitlistEntries } = await supabase
        .from('waitlist_requests')
        .select('id')
        .eq('property_id', propertyId);

      // Check if there are any conversations (buyer connections)
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .contains('participants', [user.id]);

      // For now, deal closed status would need to be manually updated
      // This could be integrated with an offer acceptance system later

      setStatus({
        listingCreated: !!listing,
        waitlistJoined: (waitlistEntries?.length || 0) > 0,
        buyerConnected: (conversations?.length || 0) > 0,
        dealClosed: false // This would need additional logic
      });

    } catch (error) {
      console.error('Error checking reward status:', error);
      toast.error('Failed to check reward status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [propertyId, user?.id]);

  const steps = [
    {
      key: 'listingCreated',
      title: 'Create Listing',
      description: 'Property listing created and published',
      completed: status.listingCreated
    },
    {
      key: 'waitlistJoined',
      title: 'Buyer Interest',
      description: 'At least one buyer joined the waitlist',
      completed: status.waitlistJoined
    },
    {
      key: 'buyerConnected',
      title: 'Buyer Connected',
      description: 'Connected with interested buyers',
      completed: status.buyerConnected
    },
    {
      key: 'dealClosed',
      title: 'Deal Closed',
      description: 'Successfully closed the deal',
      completed: status.dealClosed
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Reward Progress</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            ${getCurrentReward().toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">of ${reward.toLocaleString()}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(calculateProgress())}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {step.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                {step.title}
              </div>
              <div className="text-sm text-gray-500">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={checkStatus}
        disabled={isLoading}
        className="w-full mt-6"
        variant="outline"
      >
        {isLoading ? 'Checking...' : 'Refresh Status'}
      </Button>
    </div>
  );
};

export default RewardProgress;

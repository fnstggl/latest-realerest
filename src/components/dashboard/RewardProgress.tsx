
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RewardStatusDetails } from '@/types/bounty';

interface RewardProgressProps {
  claimId: string;
  initialStatus: RewardStatusDetails;
  onStatusUpdate: () => void;
}

const RewardProgress = ({ claimId, initialStatus, onStatusUpdate }: RewardProgressProps) => {
  const [status, setStatus] = useState<RewardStatusDetails>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const steps = [
    { key: 'foundBuyer', label: 'Found Buyer' },
    { key: 'submittedOffer', label: 'Submitted Offer' },
    { key: 'offerAccepted', label: 'Offer Accepted' },
    { key: 'dealClosed', label: 'Deal Closed' }
  ];

  const handleStepToggle = async (step: keyof RewardStatusDetails) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    const newStatus = { ...status, [step]: !status[step] };
    
    try {
      const { error } = await supabase
        .from('bounty_claims')
        .update({ 
          status_details: newStatus,
          status: newStatus.dealClosed ? 'completed' : 'claimed'
        })
        .eq('id', claimId);
      
      if (error) {
        throw error;
      }
      
      setStatus(newStatus);
      onStatusUpdate();
      toast.success('Progress updated!');
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast.error(`Failed to update progress: ${error.message || "Please try again"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-2 mt-3">
      <h3 className="font-semibold mb-1">Track Your Progress</h3>
      
      <div className="space-y-2">
        {steps.map((step) => (
          <div 
            key={step.key} 
            className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => handleStepToggle(step.key as keyof RewardStatusDetails)}
          >
            <span>{step.label}</span>
            <div className={`w-6 h-6 flex items-center justify-center rounded-full ${status[step.key as keyof RewardStatusDetails] ? 'bg-green-500' : 'bg-gray-200'}`}>
              {status[step.key as keyof RewardStatusDetails] ? (
                <Check size={14} className="text-white" />
              ) : (
                <X size={14} className="text-gray-500" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        Click each step to mark it as complete when you reach that milestone
      </div>
    </div>
  );
};

export default RewardProgress;

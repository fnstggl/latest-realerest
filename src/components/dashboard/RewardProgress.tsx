
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Check } from 'lucide-react';
import { toast } from "sonner";

interface RewardProgressProps {
  rewardId: string;
  status: {
    claimed: boolean;
    foundBuyer: boolean;
    submittedOffer: boolean;
    offerAccepted: boolean;
    dealClosed: boolean;
  };
  rewardAmount?: number;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ rewardId, status: initialStatus, rewardAmount }) => {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const steps = [
    { id: 'claimed', label: 'Claimed reward', checked: status.claimed },
    { id: 'foundBuyer', label: 'Found interested buyer', checked: status.foundBuyer },
    { id: 'submittedOffer', label: 'Buyer submitted an offer', checked: status.submittedOffer },
    { id: 'offerAccepted', label: 'Offer accepted', checked: status.offerAccepted },
    { id: 'dealClosed', label: 'Deal Closed', checked: status.dealClosed }
  ];

  const handleCheckStep = async (stepId: string) => {
    if (stepId === 'claimed' || isUpdating) return; // Cannot uncheck the claimed step or if already updating
    
    setIsUpdating(true);
    const newStatus = { ...status };
    
    // Toggle the status
    switch (stepId) {
      case 'foundBuyer':
        newStatus.foundBuyer = !newStatus.foundBuyer;
        break;
      case 'submittedOffer':
        newStatus.submittedOffer = !newStatus.submittedOffer;
        break;
      case 'offerAccepted':
        newStatus.offerAccepted = !newStatus.offerAccepted;
        break;
      case 'dealClosed':
        newStatus.dealClosed = !newStatus.dealClosed;
        break;
      default:
        break;
    }
    
    // Update the status in Supabase
    try {
      const { error } = await supabase
        .from('bounty_claims')
        .update({
          status_details: newStatus
        })
        .eq('id', rewardId);
        
      if (error) throw error;
      
      setStatus(newStatus);
      toast.success("Progress updated successfully");
    } catch (error) {
      console.error("Error updating reward progress:", error);
      toast.error("Failed to update progress");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const completedSteps = Object.values(status).filter(Boolean).length;
  const progress = Math.round((completedSteps / steps.length) * 100);
  
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">Deal Progress</span>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">{progress}%</span>
          {rewardAmount && (
            <span className="text-sm font-bold text-green-600">
              ${rewardAmount.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-black h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center max-w-[100px] text-center">
            <button 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step.id === 'claimed' ? 'bg-black cursor-default' : 
                step.checked ? 'bg-black cursor-pointer' : 'bg-gray-200 cursor-pointer'
              } ${isUpdating ? 'opacity-50' : ''}`}
              onClick={() => handleCheckStep(step.id)}
              disabled={step.id === 'claimed' || isUpdating}
            >
              {step.checked && <Check size={20} className="text-white" />}
            </button>
            <span className="text-xs text-center">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardProgress;

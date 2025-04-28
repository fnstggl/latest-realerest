
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
}

const RewardProgress: React.FC<RewardProgressProps> = ({ rewardId, status: initialStatus }) => {
  const [status, setStatus] = useState(initialStatus);
  
  const steps = [
    { id: 'claimed', label: 'Claimed Reward', checked: status.claimed },
    { id: 'foundBuyer', label: 'Found Interested Buyer', checked: status.foundBuyer },
    { id: 'submittedOffer', label: 'Buyer Submitted an Offer', checked: status.submittedOffer },
    { id: 'offerAccepted', label: 'Offer Accepted', checked: status.offerAccepted },
    { id: 'dealClosed', label: 'Deal Closed', checked: status.dealClosed }
  ];

  const handleCheckStep = async (stepId: string) => {
    if (stepId === 'claimed') return; // Cannot uncheck the claimed step
    
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
          status_details: {
            claimed: newStatus.claimed,
            foundBuyer: newStatus.foundBuyer,
            submittedOffer: newStatus.submittedOffer,
            offerAccepted: newStatus.offerAccepted,
            dealClosed: newStatus.dealClosed
          }
        })
        .eq('id', rewardId);
        
      if (error) throw error;
      
      setStatus(newStatus);
      toast.success("Progress updated successfully");
    } catch (error) {
      console.error("Error updating reward progress:", error);
      toast.error("Failed to update progress");
    }
  };
  
  const completedSteps = Object.values(status).filter(Boolean).length;
  const progress = Math.round((completedSteps / steps.length) * 100);
  
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">Deal Progress</span>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="mt-3 space-y-2">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`flex items-center p-2 rounded-lg ${step.checked ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}
            onClick={() => step.id !== 'claimed' && handleCheckStep(step.id)}
          >
            <div 
              className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 cursor-pointer
                ${step.id === 'claimed' ? 'bg-green-500 cursor-default' : step.checked ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              {step.checked && <Check size={14} className="text-white" />}
            </div>
            <span className={`text-sm ${step.checked ? 'font-medium' : ''}`}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardProgress;

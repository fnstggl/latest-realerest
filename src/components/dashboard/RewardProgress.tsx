
import React, { useState } from 'react';
import { Check, X, Circle } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RewardStatusDetails } from '@/types/bounty';
import { format } from 'date-fns';
import { Progress } from '../ui/progress';

interface RewardProgressProps {
  claimId: string;
  initialStatus: RewardStatusDetails;
  onStatusUpdate: () => void;
  isSecondaryBuyer?: boolean;
}

const RewardProgress = ({ claimId, initialStatus, onStatusUpdate, isSecondaryBuyer = false }: RewardProgressProps) => {
  const [status, setStatus] = useState<RewardStatusDetails>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const steps = [
    { key: 'foundBuyer', label: 'Found interested buyer', dateKey: 'foundBuyerDate' },
    { key: 'submittedOffer', label: 'Buyer submitted an offer', dateKey: 'submittedOfferDate' },
    { key: 'offerAccepted', label: 'Offer accepted', dateKey: 'offerAcceptedDate' },
    { key: 'dealClosed', label: 'Deal Closed', dateKey: 'dealClosedDate' }
  ];

  const calculateProgress = () => {
    const completedSteps = steps.filter(step => status[step.key as keyof RewardStatusDetails]).length;
    return (completedSteps / steps.length) * 100;
  };

  const handleStepToggle = async (step: keyof RewardStatusDetails) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    const currentDate = new Date().toISOString();
    const dateKey = `${step}Date` as keyof RewardStatusDetails;
    
    // Toggle the step status and add/remove date
    const newStatus = { 
      ...status, 
      [step]: !status[step],
      [dateKey]: !status[step] ? currentDate : undefined
    };
    
    // Only mark as completed if the final step (dealClosed) is checked
    const newOverallStatus = newStatus.dealClosed ? 'completed' : 'claimed';
    
    try {
      // For secondary buyers, we only update the local state
      if (isSecondaryBuyer) {
        setStatus(newStatus);
        onStatusUpdate();
        toast.success('Progress updated!');
        setIsUpdating(false);
        return;
      }
      
      // For primary buyer, update in database
      const { error } = await supabase
        .from('bounty_claims')
        .update({ 
          status_details: newStatus,
          status: newOverallStatus
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return format(date, 'MM/dd/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-8 mt-2">
        {steps.map((step, index) => {
          const dateKey = step.dateKey as keyof RewardStatusDetails;
          const completionDate = status[dateKey] as string | undefined;
          const formattedDate = formatDate(completionDate);
          const isComplete = status[step.key as keyof RewardStatusDetails];
          
          return (
            <div key={step.key} className="relative">
              <div className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 border-2 ${
                    isComplete
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-300 border-gray-300'
                  }`}
                  onClick={() => handleStepToggle(step.key as keyof RewardStatusDetails)}
                >
                  {isComplete ? (
                    <Check size={20} />
                  ) : (
                    <Circle size={20} />
                  )}
                </div>
                
                <div className="flex-1">
                  <div 
                    className="flex justify-between cursor-pointer"
                    onClick={() => handleStepToggle(step.key as keyof RewardStatusDetails)}
                  >
                    <span className="font-medium">{step.label}</span>
                  </div>
                  
                  {formattedDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      Completed on: {formattedDate}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Add connecting line if not the last step */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute left-5 top-10 h-12 w-0.5 ${
                    isComplete ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardProgress;

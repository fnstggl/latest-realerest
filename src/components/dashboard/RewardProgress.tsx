
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RewardStatusDetails } from '@/types/bounty';
import { format } from 'date-fns';

interface RewardProgressProps {
  claimId: string;
  initialStatus: RewardStatusDetails;
  onStatusUpdate: () => void;
  isPrimaryBuyer?: boolean;
  buyerIndex?: number;
}

const RewardProgress = ({ 
  claimId, 
  initialStatus, 
  onStatusUpdate, 
  isPrimaryBuyer = false,
  buyerIndex 
}: RewardProgressProps) => {
  const [status, setStatus] = useState<RewardStatusDetails>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const steps = [
    { key: 'foundBuyer', label: 'Found Buyer', dateKey: 'foundBuyerDate' },
    { key: 'submittedOffer', label: 'Submitted Offer', dateKey: 'submittedOfferDate' },
    { key: 'offerAccepted', label: 'Offer Accepted', dateKey: 'offerAcceptedDate' },
    { key: 'dealClosed', label: 'Deal Closed', dateKey: 'dealClosedDate' }
  ];

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
      if (isPrimaryBuyer) {
        // Update the main status_details in the record
        const { error } = await supabase
          .from('bounty_claims')
          .update({ 
            status_details: newStatus,
            status: newOverallStatus
          })
          .eq('id', claimId);
        
        if (error) throw error;
      } else if (buyerIndex !== undefined) {
        // Get the current bounty claim
        const { data: currentClaim, error: fetchError } = await supabase
          .from('bounty_claims')
          .select('buyers')
          .eq('id', claimId)
          .single();
        
        if (fetchError) throw fetchError;
        
        // Update the specific buyer in the buyers array
        const updatedBuyers = [...(currentClaim.buyers || [])];
        updatedBuyers[buyerIndex] = newStatus;
        
        // Update the record
        const { error: updateError } = await supabase
          .from('bounty_claims')
          .update({ buyers: updatedBuyers })
          .eq('id', claimId);
        
        if (updateError) throw updateError;
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
    <div className="space-y-2">
      <div className="space-y-2">
        {steps.map((step) => {
          const dateKey = step.dateKey as keyof RewardStatusDetails;
          const completionDate = status[dateKey] as string | undefined;
          const formattedDate = formatDate(completionDate);
          
          return (
            <div key={step.key} className="space-y-1">
              <div 
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
              
              {formattedDate && (
                <div className="text-xs text-gray-500 pl-2">
                  Completed on: {formattedDate}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        Click each step to mark it as complete when you reach that milestone
      </div>
    </div>
  );
};

export default RewardProgress;

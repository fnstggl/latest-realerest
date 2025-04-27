
import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RewardProgressTrackerProps {
  claimId: string;
  initialStatus: string;
}

const RewardProgressTracker: React.FC<RewardProgressTrackerProps> = ({ claimId, initialStatus }) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  
  const steps = [
    { id: 'claimed', label: 'Claimed Reward' },
    { id: 'found_buyer', label: 'Found Interested Buyer' },
    { id: 'submitted_offer', label: 'Buyer Submitted Offer' },
    { id: 'accepted_offer', label: 'Offer Accepted' },
    { id: 'closed', label: 'Deal Closed' }
  ];
  
  const getCurrentStepIndex = () => {
    switch (currentStatus) {
      case 'claimed': return 0;
      case 'found_buyer': return 1;
      case 'submitted_offer': return 2;
      case 'accepted_offer': return 3;
      case 'closed': return 4;
      default: return 0;
    }
  };
  
  const updateStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bounty_claims')
        .update({ status: newStatus })
        .eq('id', claimId);
        
      if (error) throw error;
      
      setCurrentStatus(newStatus);
      toast.success(`Status updated to: ${newStatus.replace('_', ' ')}`);
      
    } catch (error) {
      console.error('Error updating reward status:', error);
      toast.error('Failed to update reward status');
    }
  };
  
  const currentStepIndex = getCurrentStepIndex();
  
  return (
    <div className="mt-4">
      <div className="relative">
        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        {/* Step markers */}
        <div className="flex justify-between mt-1">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex flex-col items-center ${index <= currentStepIndex ? 'text-green-600' : 'text-gray-400'}`}
              style={{ width: '20%' }}
            >
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  index < currentStepIndex 
                    ? 'bg-green-500 text-white' 
                    : index === currentStepIndex 
                    ? 'bg-green-100 border-2 border-green-500 text-green-500' 
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                {index < currentStepIndex ? (
                  <Check size={14} />
                ) : null}
              </div>
              <span className="text-xs text-center mt-1">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {currentStepIndex < steps.length - 1 && (
        <div className="mt-4">
          <Button 
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => updateStatus(steps[currentStepIndex + 1].id)}
          >
            Mark as "{steps[currentStepIndex + 1].label}"
          </Button>
        </div>
      )}
      
      {currentStepIndex === steps.length - 1 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <Check className="mr-2" size={16} />
            <span className="font-medium">Congratulations! Deal successfully closed.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardProgressTracker;


import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RewardStatusDetails, BuyerProgress } from '@/types/bounty';
import { format } from 'date-fns';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';

interface RewardProgressProps {
  claimId: string;
  initialStatus: RewardStatusDetails;
  onStatusUpdate: () => void;
}

const RewardProgress = ({ claimId, initialStatus, onStatusUpdate }: RewardProgressProps) => {
  const [status, setStatus] = useState<RewardStatusDetails>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNewBuyerInput, setShowNewBuyerInput] = useState(false);
  const [newBuyerName, setNewBuyerName] = useState('');

  const steps = [
    { key: 'foundBuyer', label: 'Found interested buyer', dateKey: 'foundBuyerDate' },
    { key: 'submittedOffer', label: 'Buyer submitted an offer', dateKey: 'submittedOfferDate' },
    { key: 'offerAccepted', label: 'Offer accepted', dateKey: 'offerAcceptedDate' },
    { key: 'dealClosed', label: 'Deal Closed', dateKey: 'dealClosedDate' }
  ];

  const handleStepToggle = async (buyerId: string, step: keyof BuyerProgress) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    const currentDate = new Date().toISOString();
    const dateKey = `${step}Date` as keyof BuyerProgress;
    
    // Create a deep copy of the status object to modify
    const newStatus = JSON.parse(JSON.stringify(status)) as RewardStatusDetails;
    
    // Find the buyer and toggle their step
    const buyerIndex = newStatus.buyers.findIndex(b => b.id === buyerId);
    if (buyerIndex !== -1) {
      newStatus.buyers[buyerIndex][step] = !newStatus.buyers[buyerIndex][step];
      newStatus.buyers[buyerIndex][dateKey] = newStatus.buyers[buyerIndex][step] ? currentDate : undefined;
    }
    
    // Check if any buyer has completed all steps
    const anyBuyerComplete = newStatus.buyers.some(buyer => buyer.dealClosed);
    const newOverallStatus = anyBuyerComplete ? 'completed' : 'claimed';
    
    try {
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

  const addNewBuyer = async () => {
    if (!newBuyerName.trim()) {
      toast.error("Please enter a buyer name");
      return;
    }

    setIsUpdating(true);

    // Create a new buyer object
    const newBuyer: BuyerProgress = {
      id: crypto.randomUUID(),
      name: newBuyerName.trim(),
      foundBuyer: true,  // Set first step to true automatically
      submittedOffer: false,
      offerAccepted: false,
      dealClosed: false,
      foundBuyerDate: new Date().toISOString()
    };

    // Create a deep copy of the status object to modify
    const newStatus = JSON.parse(JSON.stringify(status)) as RewardStatusDetails;
    newStatus.buyers.push(newBuyer);

    try {
      const { error } = await supabase
        .from('bounty_claims')
        .update({
          status_details: newStatus
        })
        .eq('id', claimId);

      if (error) {
        throw error;
      }

      setStatus(newStatus);
      setNewBuyerName('');
      setShowNewBuyerInput(false);
      onStatusUpdate();
      toast.success('New buyer added!');
    } catch (error: any) {
      console.error('Error adding new buyer:', error);
      toast.error(`Failed to add new buyer: ${error.message || "Please try again"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateProgress = (buyer: BuyerProgress): number => {
    const completedSteps = [
      buyer.foundBuyer,
      buyer.submittedOffer,
      buyer.offerAccepted,
      buyer.dealClosed
    ].filter(Boolean).length;
    
    return (completedSteps / 4) * 100;
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
    <div className="space-y-6 mt-3">
      {status.buyers && status.buyers.map(buyer => (
        <div key={buyer.id} className="space-y-4 mb-8 pt-4">
          {buyer.name && (
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{buyer.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Deal Progress {Math.round(calculateProgress(buyer))}%
                </span>
              </div>
            </div>
          )}
          
          <Progress value={calculateProgress(buyer)} className="h-2" />
          
          <div className="flex justify-between mt-4 relative">
            {steps.map((step, index) => {
              const key = step.key as keyof BuyerProgress;
              const dateKey = step.dateKey as keyof BuyerProgress;
              const completed = buyer[key];
              const formattedDate = formatDate(buyer[dateKey] as string | undefined);
              
              return (
                <div key={step.key} className="flex flex-col items-center text-center max-w-[150px]">
                  <div 
                    onClick={() => handleStepToggle(buyer.id, key)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-2 mb-2
                      ${completed ? 'bg-black text-white border-black' : 'bg-white border-gray-300'}`}
                  >
                    {completed ? (
                      <Check size={24} />
                    ) : (
                      <div className="w-8 h-8" />
                    )}
                  </div>
                  <span className="text-sm max-w-[100px]">{step.label}</span>
                  {formattedDate && (
                    <span className="text-xs text-gray-500 mt-1">{formattedDate}</span>
                  )}
                </div>
              );
            })}
            
            {/* Line connecting all circles */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
          </div>
        </div>
      ))}

      {showNewBuyerInput ? (
        <div className="flex items-center gap-2 mt-4">
          <Input
            placeholder="Enter buyer name"
            value={newBuyerName}
            onChange={(e) => setNewBuyerName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addNewBuyer} disabled={isUpdating || !newBuyerName.trim()}>
            Add
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowNewBuyerInput(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button 
          onClick={() => setShowNewBuyerInput(true)} 
          variant="outline"
          className="w-full mt-4"
        >
          Add New Buyer
        </Button>
      )}
    </div>
  );
};

export default RewardProgress;

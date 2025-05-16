
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar, Check, CheckCircle, Circle, UserPlus } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { RewardStatusDetails, BuyerProgress } from '@/types';

interface RewardProgressProps {
  claimId: string;
  initialStatus: RewardStatusDetails;
  onStatusUpdate: () => void;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ 
  claimId, 
  initialStatus, 
  onStatusUpdate 
}) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<RewardStatusDetails>(initialStatus || {
    claimed: true,
    foundBuyer: false,
    submittedOffer: false,
    offerAccepted: false,
    dealClosed: false,
    buyers: [{
      id: uuidv4(),
      name: "Primary Buyer",
      status: "Interested Buyer",
      foundBuyer: false,
      submittedOffer: false,
      offerAccepted: false,
      dealClosed: false
    }]
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(
    status.buyers && status.buyers.length > 0 ? status.buyers[0].id : null
  );

  const selectedBuyer = status.buyers?.find(buyer => buyer.id === selectedBuyerId) || null;

  const addNewBuyer = () => {
    const newBuyer: BuyerProgress = {
      id: uuidv4(),
      name: `Buyer ${(status.buyers?.length || 0) + 1}`,
      status: "Interested Buyer",
      foundBuyer: true,
      submittedOffer: false,
      offerAccepted: false,
      dealClosed: false,
      foundBuyerDate: new Date().toISOString()
    };
    
    const updatedBuyers = [...(status.buyers || []), newBuyer];
    const updatedStatus = { ...status, buyers: updatedBuyers };
    
    setStatus(updatedStatus);
    setSelectedBuyerId(newBuyer.id);
    
    updateStatusInDatabase(updatedStatus);
  };
  
  const updateBuyerStatus = (buyerId: string, step: keyof BuyerProgress, value: boolean) => {
    if (!status.buyers) return;
    
    const now = new Date().toISOString();
    const datePropName = `${step}Date` as keyof BuyerProgress;
    
    const updatedBuyers = status.buyers.map(buyer => {
      if (buyer.id === buyerId) {
        const updatedBuyer = { 
          ...buyer,
          [step]: value
        };
        
        // Add date if turning on, remove if turning off
        if (value) {
          updatedBuyer[datePropName] = now;
        } else {
          updatedBuyer[datePropName] = undefined;
        }
        
        return updatedBuyer;
      }
      return buyer;
    });
    
    // Also update the overall status based on any buyer having completed the step
    const anyBuyerCompleted = updatedBuyers.some(buyer => buyer[step] === true);
    
    const updatedStatus = { 
      ...status, 
      [step]: anyBuyerCompleted,
      buyers: updatedBuyers 
    };
    
    setStatus(updatedStatus);
    updateStatusInDatabase(updatedStatus);
  };
  
  const updateBuyerStatusType = (buyerId: string, statusType: BuyerProgress["status"]) => {
    if (!status.buyers) return;
    
    const updatedBuyers = status.buyers.map(buyer => {
      if (buyer.id === buyerId) {
        return { ...buyer, status: statusType };
      }
      return buyer;
    });
    
    const updatedStatus = { ...status, buyers: updatedBuyers };
    setStatus(updatedStatus);
    updateStatusInDatabase(updatedStatus);
  };
  
  const updateStatusInDatabase = async (newStatus: RewardStatusDetails) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('bounty_claims')
        .update({
          status_details: newStatus,
          // Update overall status based on progress
          status: newStatus.dealClosed ? 'completed' : 'claimed'
        })
        .eq('id', claimId);
        
      if (error) {
        console.error("Error updating status:", error);
        toast({
          title: "Error",
          description: "Failed to update progress status",
          variant: "destructive"
        });
        return;
      }
      
      onStatusUpdate();
      
      toast({
        title: "Success",
        description: "Progress updated successfully",
        variant: "success"
      });
    } catch (error) {
      console.error("Exception updating status:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const progressSteps = [
    { key: 'foundBuyer', label: 'Found Buyer', icon: UserPlus },
    { key: 'submittedOffer', label: 'Submitted Offer', icon: Check },
    { key: 'offerAccepted', label: 'Offer Accepted', icon: CheckCircle },
    { key: 'dealClosed', label: 'Deal Closed', icon: Check }
  ];

  if (!selectedBuyer) {
    return <div>No buyer information available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-medium text-lg">Reward Progress Tracking</h3>
          <p className="text-sm text-gray-500">Update the status of your bounty claim</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={addNewBuyer}
          disabled={isUpdating}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Buyer
        </Button>
      </div>
      
      {status.buyers && status.buyers.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-2 pb-4">
          {status.buyers.map(buyer => (
            <Button
              key={buyer.id}
              variant={selectedBuyerId === buyer.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBuyerId(buyer.id)}
              className="whitespace-nowrap"
            >
              {buyer.name}
              {buyer.dealClosed && <Check className="ml-2 h-4 w-4 text-green-500" />}
            </Button>
          ))}
        </div>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{selectedBuyer.name}</span>
            <div className="flex items-center gap-2">
              <select 
                className="text-sm bg-gray-100 border border-gray-200 rounded px-3 py-1"
                value={selectedBuyer.status || "Interested Buyer"}
                onChange={(e) => updateBuyerStatusType(
                  selectedBuyer.id, 
                  e.target.value as BuyerProgress["status"]
                )}
                disabled={isUpdating}
              >
                <option value="Interested Buyer">Interested Buyer</option>
                <option value="Considering Buyer">Considering Buyer</option>
                <option value="Uninterested Buyer">Uninterested Buyer</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {progressSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = selectedBuyer[step.key as keyof BuyerProgress] as boolean;
              const dateValue = selectedBuyer[`${step.key}Date` as keyof BuyerProgress] as string | undefined;
              
              return (
                <div key={step.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    
                    <div>
                      <p className="font-medium">{step.label}</p>
                      {dateValue && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(dateValue).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isCompleted ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateBuyerStatus(selectedBuyer.id, step.key as keyof BuyerProgress, !isCompleted)}
                      disabled={isUpdating}
                      className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Circle className="mr-1 h-4 w-4" />
                          Mark Done
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {selectedBuyer.dealClosed ? (
              <div className="mt-6 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-green-600" />
                <div>
                  <p className="font-bold">Deal Complete!</p>
                  <p className="text-sm">You have successfully closed this deal with the buyer.</p>
                </div>
              </div>
            ) : selectedBuyer.status === "Uninterested Buyer" ? (
              <div className="mt-6 bg-amber-50 text-amber-700 p-4 rounded-lg border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-bold">Buyer Marked as Uninterested</p>
                  <p className="text-sm">You can continue tracking other buyers for this property or add a new buyer.</p>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardProgress;

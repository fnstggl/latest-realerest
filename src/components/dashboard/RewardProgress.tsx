
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Note: We're importing interfaces directly as the file is properly set up now
// interface BuyerProgress, type BuyerStatus, and interface RewardStatusDetails are imported from types.d.ts

const RewardProgress = ({ 
  propertyId, 
  reward = 0, 
  initialStatus = { 
    claimed: false,
    foundBuyer: false,
    submittedOffer: false,
    offerAccepted: false,
    dealClosed: false,
    buyers: []
  }
}: {
  propertyId: string;
  reward?: number;
  initialStatus?: RewardStatusDetails;
}) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<RewardStatusDetails>(initialStatus);
  const [showAddBuyer, setShowAddBuyer] = useState(false);
  const [newBuyerName, setNewBuyerName] = useState('');
  const [loading, setLoading] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddBuyer = async () => {
    if (!newBuyerName.trim()) {
      toast.error("Please enter a buyer name");
      return;
    }

    setLoading(true);
    try {
      const newBuyer: BuyerProgress = {
        id: crypto.randomUUID(),
        name: newBuyerName.trim(),
        status: "Interested Buyer",
        foundBuyer: true,
        submittedOffer: false,
        offerAccepted: false,
        dealClosed: false,
        foundBuyerDate: new Date().toISOString()
      };

      // Update local state
      const updatedBuyers = [...status.buyers, newBuyer];
      const updatedStatus = { 
        ...status, 
        buyers: updatedBuyers,
        foundBuyer: true
      };
      setStatus(updatedStatus);

      // Update database
      const { error } = await supabase
        .from('property_rewards')
        .upsert({
          property_id: propertyId,
          user_id: user?.id,
          status_details: updatedStatus
        });

      if (error) throw error;
      
      setNewBuyerName('');
      setShowAddBuyer(false);
      toast.success("Buyer added successfully");
    } catch (error) {
      console.error("Error adding buyer:", error);
      toast.error("Failed to add buyer");
    } finally {
      setLoading(false);
    }
  };

  const updateBuyerStatus = async (buyerId: string, field: keyof BuyerProgress, value: boolean) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedBuyers = status.buyers.map(buyer => {
        if (buyer.id === buyerId) {
          const update = { ...buyer, [field]: value };
          
          // Add date stamp for the action
          const dateField = `${String(field)}Date`;
          if (value && !(buyer as any)[dateField]) {
            (update as any)[dateField] = new Date().toISOString();
          }
          
          return update;
        }
        return buyer;
      });

      // Check if we need to update overall status
      const anyTrueForThisStep = updatedBuyers.some(buyer => buyer[field] === true);
      
      // Update fields that depend on buyer progress
      const updatedStatus = { 
        ...status, 
        buyers: updatedBuyers,
        [field]: anyTrueForThisStep
      };

      setStatus(updatedStatus);

      // Update database
      const { error } = await supabase
        .from('property_rewards')
        .upsert({
          property_id: propertyId,
          user_id: user.id,
          status_details: updatedStatus
        });

      if (error) throw error;
      
      toast.success(`Progress updated: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update progress");
    } finally {
      setLoading(false);
    }
  };

  const renderBuyerList = () => {
    if (status.buyers.length === 0) {
      return (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p>No buyers added yet</p>
        </div>
      );
    }
    
    return status.buyers.map(buyer => (
      <div key={buyer.id} className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
        <h4 className="font-bold mb-3">
          {buyer.name}
        </h4>
        
        <div className="space-y-3">
          {/* Found Buyer - always true when added */}
          <div className="flex items-center">
            <CheckCircle2 className="text-green-500 mr-2" size={18} />
            <span>Found Buyer</span>
          </div>
          
          {/* Submitted Offer */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => updateBuyerStatus(buyer.id, 'submittedOffer', !buyer.submittedOffer)}
          >
            {buyer.submittedOffer ? (
              <CheckCircle2 className="text-green-500 mr-2" size={18} />
            ) : (
              <Circle className="text-gray-400 mr-2" size={18} />
            )}
            <span>Submitted Offer</span>
          </div>
          
          {/* Offer Accepted */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => buyer.submittedOffer && updateBuyerStatus(buyer.id, 'offerAccepted', !buyer.offerAccepted)}
          >
            {buyer.offerAccepted ? (
              <CheckCircle2 className="text-green-500 mr-2" size={18} />
            ) : buyer.submittedOffer ? (
              <Circle className="text-gray-400 mr-2" size={18} />
            ) : (
              <AlertCircle className="text-gray-300 mr-2" size={18} />
            )}
            <span className={!buyer.submittedOffer ? "text-gray-300" : ""}>Offer Accepted</span>
          </div>
          
          {/* Deal Closed */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => buyer.offerAccepted && updateBuyerStatus(buyer.id, 'dealClosed', !buyer.dealClosed)}
          >
            {buyer.dealClosed ? (
              <CheckCircle2 className="text-green-500 mr-2" size={18} />
            ) : buyer.offerAccepted ? (
              <Circle className="text-gray-400 mr-2" size={18} />
            ) : (
              <AlertCircle className="text-gray-300 mr-2" size={18} />
            )}
            <span className={!buyer.offerAccepted ? "text-gray-300" : ""}>Deal Closed</span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="mt-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
        <p className="text-gray-600">Complete these steps to earn your {formatCurrency(reward)} reward.</p>
      </div>
      
      <div className="mb-6">
        {renderBuyerList()}
      </div>
      
      {!showAddBuyer ? (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setShowAddBuyer(true)}
          disabled={loading}
        >
          Add Buyer
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="flex">
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2"
              placeholder="Enter buyer name"
              value={newBuyerName}
              onChange={(e) => setNewBuyerName(e.target.value)}
            />
            <Button 
              className="rounded-l-none"
              onClick={handleAddBuyer}
              disabled={loading}
            >
              Add
            </Button>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowAddBuyer(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default RewardProgress;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Clock, Edit, Info, Plus, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';
import { RewardStatusDetails, BuyerProgress, BuyerStatus } from '@/types/bounty';
import { v4 as uuidv4 } from 'uuid';

interface RewardProgressProps {
  id: string;
  statusDetails: RewardStatusDetails;
  onUpdate: () => void;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ id, statusDetails, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<RewardStatusDetails>(statusDetails || {
    claimed: true,
    foundBuyer: false,
    submittedOffer: false,
    offerAccepted: false,
    dealClosed: false,
    buyers: []
  });
  const [editingBuyerId, setEditingBuyerId] = useState<string | null>(null);
  const [editingBuyerName, setEditingBuyerName] = useState('');
  const [editingBuyerStatus, setEditingBuyerStatus] = useState<BuyerStatus>('Interested Buyer');
  
  const buyerStatuses: BuyerStatus[] = [
    'Interested Buyer',
    'Considering Buyer',
    'Uninterested Buyer'
  ];
  
  const handleSaveStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('bounty_claims')
        .update({ status_details: status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setIsEditing(false);
      onUpdate(); // Trigger refetch of data
      
    } catch (err) {
      console.error('Error updating reward status:', err);
    }
  };
  
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  const handleCancelEdit = () => {
    setStatus(statusDetails);
    setIsEditing(false);
    setEditingBuyerId(null);
  };
  
  const handleStepToggle = (buyerId: string, step: keyof BuyerProgress) => {
    // Only allow changes in edit mode
    if (!isEditing) return;
    
    // Find the specific buyer
    const updatedBuyers = status.buyers.map(buyer => {
      if (buyer.id === buyerId) {
        const now = new Date().toISOString();
        const dateField = `${step}Date` as keyof BuyerProgress;
        // Toggle the status and update timestamp
        return {
          ...buyer,
          [step]: !buyer[step],
          [dateField]: !buyer[step] ? now : undefined
        };
      }
      return buyer;
    });
    
    setStatus({ ...status, buyers: updatedBuyers });
  };
  
  const handleAddBuyer = () => {
    const newBuyer: BuyerProgress = {
      id: uuidv4(),
      name: 'New Buyer',
      status: 'Interested Buyer',
      foundBuyer: false,
      submittedOffer: false,
      offerAccepted: false,
      dealClosed: false
    };
    
    setStatus({ ...status, buyers: [...status.buyers, newBuyer] });
    setEditingBuyerId(newBuyer.id);
    setEditingBuyerName(newBuyer.name);
    setEditingBuyerStatus(newBuyer.status || 'Interested Buyer');
  };
  
  const handleRemoveBuyer = (buyerId: string) => {
    const updatedBuyers = status.buyers.filter(b => b.id !== buyerId);
    setStatus({ ...status, buyers: updatedBuyers });
  };
  
  const handleEditBuyer = (buyer: BuyerProgress) => {
    setEditingBuyerId(buyer.id);
    setEditingBuyerName(buyer.name);
    setEditingBuyerStatus(buyer.status || 'Interested Buyer');
  };
  
  const handleSaveBuyerEdit = () => {
    if (!editingBuyerId) return;
    
    const updatedBuyers = status.buyers.map(buyer => {
      if (buyer.id === editingBuyerId) {
        return {
          ...buyer,
          name: editingBuyerName,
          status: editingBuyerStatus
        };
      }
      return buyer;
    });
    
    setStatus({ ...status, buyers: updatedBuyers });
    setEditingBuyerId(null);
  };
  
  const calculateProgress = (buyer: BuyerProgress) => {
    const steps = [buyer.foundBuyer, buyer.submittedOffer, buyer.offerAccepted, buyer.dealClosed];
    return (steps.filter(Boolean).length / 4) * 100;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Reward Progress</h3>
        {isEditing ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              <X size={16} className="mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSaveStatus}>
              <Save size={16} className="mr-1" /> Save Changes
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={handleToggleEdit}>
            <Edit size={16} className="mr-1" /> Edit Progress
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {status.buyers && status.buyers.map(buyer => (
          <div key={buyer.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              {editingBuyerId === buyer.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingBuyerName}
                    onChange={e => setEditingBuyerName(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Buyer name"
                  />
                  <select
                    value={editingBuyerStatus}
                    onChange={e => setEditingBuyerStatus(e.target.value as BuyerStatus)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    {buyerStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <Button size="sm" variant="outline" onClick={handleSaveBuyerEdit}>
                    <Save size={14} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <h4 className="font-semibold">{buyer.name}</h4>
                  {buyer.status && (
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      buyer.status === 'Interested Buyer' ? 'bg-green-100 text-green-800' : 
                      buyer.status === 'Considering Buyer' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {buyer.status}
                    </span>
                  )}
                </div>
              )}
              
              {isEditing && editingBuyerId !== buyer.id && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0" 
                    onClick={() => handleEditBuyer(buyer)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600" 
                    onClick={() => handleRemoveBuyer(buyer.id)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${calculateProgress(buyer)}%` }}
              ></div>
            </div>
            
            {/* Progress steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {[
                { key: 'foundBuyer' as const, label: 'Found Buyer', dateKey: 'foundBuyerDate' as keyof BuyerProgress },
                { key: 'submittedOffer' as const, label: 'Submitted Offer', dateKey: 'submittedOfferDate' as keyof BuyerProgress },
                { key: 'offerAccepted' as const, label: 'Offer Accepted', dateKey: 'offerAcceptedDate' as keyof BuyerProgress },
                { key: 'dealClosed' as const, label: 'Deal Closed', dateKey: 'dealClosedDate' as keyof BuyerProgress }
              ].map((step) => (
                <div 
                  key={step.key}
                  className={`border rounded p-3 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    buyer[step.key] 
                      ? 'bg-blue-50 border-blue-200' 
                      : isEditing 
                        ? 'hover:bg-gray-50 border-gray-200' 
                        : 'border-gray-200'
                  }`}
                  onClick={() => handleStepToggle(buyer.id, step.key)}
                >
                  <div className="mb-2">
                    {buyer[step.key] ? (
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-center">{step.label}</div>
                  {buyer[step.dateKey] && (
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(buyer[step.dateKey] as string)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Add new buyer button */}
        {isEditing && (
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center border-dashed"
            onClick={handleAddBuyer}
          >
            <Plus size={16} className="mr-1" /> Add Buyer
          </Button>
        )}
        
        {/* Show help message if no buyers */}
        {(!status.buyers || status.buyers.length === 0) && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <Info size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">
              {isEditing ? 
                "Click 'Add Buyer' to start tracking your progress with interested buyers" : 
                "No buyers have been added yet. Click 'Edit Progress' to add buyers."
              }
            </p>
          </div>
        )}
      </div>
      
      <TooltipProvider>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start">
            <Info size={16} className="text-blue-500 mt-0.5 mr-2 shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">How rewards work:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Find an interested buyer for the property</li>
                <li>Help them submit an offer</li>
                <li>When their offer is accepted, track it here</li>
                <li>
                  After the deal closes, the bounty is yours!
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="inline ml-1 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[220px] text-xs">
                        Payment is processed within 5 business days after the deal closes
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default RewardProgress;


import React, { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle, CircleCheck } from 'lucide-react';
import { formatCurrency } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface RewardStatusDetails {
  claimed: boolean;
  foundBuyer: boolean;
  submittedOffer: boolean;
  offerAccepted: boolean;
  dealClosed: boolean;
}

interface JsonObject {
  [key: string]: Json;
}

type Json = string | number | boolean | null | JsonObject | Json[];

interface ExpandedJsonObject extends JsonObject {
  claimed?: boolean;
  foundBuyer?: boolean;
  submittedOffer?: boolean;
  offerAccepted?: boolean;
  dealClosed?: boolean;
}

interface RewardProgressProps {
  propertyId: string;
  propertyTitle: string;
  amount: number;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ propertyId, propertyTitle, amount }) => {
  const [status, setStatus] = useState<string>("claimed");
  const [statusDetails, setStatusDetails] = useState<RewardStatusDetails>({
    claimed: true,
    foundBuyer: false,
    submittedOffer: false,
    offerAccepted: false,
    dealClosed: false
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchRewardStatus = async () => {
      if (!user?.id || !propertyId) return;
      
      try {
        const { data, error } = await supabase
          .from('bounty_claims')
          .select('status, status_details')
          .eq('user_id', user.id)
          .eq('property_id', propertyId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching bounty status:", error);
          return;
        }
        
        if (data) {
          setStatus(data.status);
          
          // Safely convert JSON from database to our type
          const details = data.status_details as ExpandedJsonObject;
          if (details) {
            setStatusDetails({
              claimed: details.claimed === true,
              foundBuyer: details.foundBuyer === true,
              submittedOffer: details.submittedOffer === true, 
              offerAccepted: details.offerAccepted === true,
              dealClosed: details.dealClosed === true
            });
          }
        }
      } catch (error) {
        console.error("Error in fetchRewardStatus:", error);
      }
    };
    
    fetchRewardStatus();
  }, [user?.id, propertyId]);

  const updateStatusDetails = async (updatedDetails: Partial<RewardStatusDetails>) => {
    if (!user?.id || !propertyId) return;
    
    try {
      const newDetails: RewardStatusDetails = { ...statusDetails, ...updatedDetails };
      
      const { error } = await supabase
        .from('bounty_claims')
        .update({ 
          status_details: newDetails as unknown as JsonObject
        })
        .eq('user_id', user.id)
        .eq('property_id', propertyId);
      
      if (error) {
        console.error("Error updating bounty status:", error);
        return;
      }
      
      setStatusDetails(newDetails);
    } catch (error) {
      console.error("Error in updateStatusDetails:", error);
    }
  };

  const handleFoundBuyerClick = () => {
    updateStatusDetails({ foundBuyer: !statusDetails.foundBuyer });
  };
  
  const handleSubmittedOfferClick = () => {
    updateStatusDetails({ submittedOffer: !statusDetails.submittedOffer });
  };
  
  const handleOfferAcceptedClick = () => {
    updateStatusDetails({ offerAccepted: !statusDetails.offerAccepted });
  };
  
  const handleDealClosedClick = () => {
    updateStatusDetails({ 
      dealClosed: !statusDetails.dealClosed,
      offerAccepted: !statusDetails.dealClosed ? true : statusDetails.offerAccepted,
      submittedOffer: !statusDetails.dealClosed ? true : statusDetails.submittedOffer,
      foundBuyer: !statusDetails.dealClosed ? true : statusDetails.foundBuyer
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white/80 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold">{propertyTitle}</h4>
        <div className="text-green-600 font-bold">{formatCurrency(amount)}</div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <CheckCircle size={16} className="text-green-500 mr-2" />
          <span className="text-green-600 font-medium">Reward claimed</span>
        </div>
        
        <div 
          className={`flex items-center cursor-pointer ${statusDetails.foundBuyer ? 'text-green-600' : 'text-gray-500'}`}
          onClick={handleFoundBuyerClick}
        >
          {statusDetails.foundBuyer ? (
            <CheckCircle size={16} className="text-green-500 mr-2" />
          ) : (
            <CircleCheck size={16} className="text-gray-300 mr-2" />
          )}
          <span className={statusDetails.foundBuyer ? "font-medium" : ""}>Found a buyer</span>
        </div>
        
        <div 
          className={`flex items-center cursor-pointer ${statusDetails.submittedOffer ? 'text-green-600' : 'text-gray-500'}`}
          onClick={handleSubmittedOfferClick}
        >
          {statusDetails.submittedOffer ? (
            <CheckCircle size={16} className="text-green-500 mr-2" />
          ) : (
            <CircleCheck size={16} className="text-gray-300 mr-2" />
          )}
          <span className={statusDetails.submittedOffer ? "font-medium" : ""}>Submitted offer</span>
        </div>
        
        <div 
          className={`flex items-center cursor-pointer ${statusDetails.offerAccepted ? 'text-green-600' : 'text-gray-500'}`}
          onClick={handleOfferAcceptedClick}
        >
          {statusDetails.offerAccepted ? (
            <CheckCircle size={16} className="text-green-500 mr-2" />
          ) : (
            <CircleCheck size={16} className="text-gray-300 mr-2" />
          )}
          <span className={statusDetails.offerAccepted ? "font-medium" : ""}>Offer accepted</span>
        </div>
        
        <div 
          className={`flex items-center cursor-pointer ${statusDetails.dealClosed ? 'text-green-600' : 'text-gray-500'}`}
          onClick={handleDealClosedClick}
        >
          {statusDetails.dealClosed ? (
            <CheckCircle size={16} className="text-green-500 mr-2" />
          ) : (
            <CircleCheck size={16} className="text-gray-300 mr-2" />
          )}
          <span className={statusDetails.dealClosed ? "font-medium" : ""}>Deal closed!</span>
        </div>
      </div>
    </div>
  );
};

export default RewardProgress;

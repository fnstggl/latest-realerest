
// Fix the error by ensuring RewardStatusDetails is properly typed
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, XCircle, CircleDollarSign, DollarSign } from 'lucide-react';

interface RewardStatusDetails {
  claimed: boolean;
  foundBuyer: boolean;
  submittedOffer: boolean;
  offerAccepted: boolean;
  dealClosed: boolean;
}

// Define a proper type for the JSON structure
type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
type Json = { [key: string]: JsonValue };

// Convert RewardStatusDetails to Json type
const convertToJson = (details: RewardStatusDetails): Json => {
  return details as unknown as Json;
};

interface RewardProgressProps {
  status: 'claimed' | 'in_progress' | 'completed' | 'expired';
  statusDetails?: RewardStatusDetails;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ status, statusDetails }) => {
  const defaultDetails: RewardStatusDetails = {
    claimed: false,
    foundBuyer: false,
    submittedOffer: false,
    offerAccepted: false,
    dealClosed: false
  };
  
  const details = statusDetails || defaultDetails;

  const getProgressPercentage = () => {
    let steps = 0;
    let completedSteps = 0;
    
    if (details.claimed) completedSteps++;
    steps++;
    
    if (details.foundBuyer) completedSteps++;
    steps++;
    
    if (details.submittedOffer) completedSteps++;
    steps++;
    
    if (details.offerAccepted) completedSteps++;
    steps++;
    
    if (details.dealClosed) completedSteps++;
    steps++;
    
    return (completedSteps / steps) * 100;
  };

  if (status === 'expired') {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">Bounty Expired</h4>
          <XCircle className="h-5 w-5 text-red-500" />
        </div>
        <p className="text-sm text-gray-500 mb-2">This bounty has expired and is no longer active.</p>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="border border-green-200 rounded-lg p-4 bg-green-50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">Bounty Completed</h4>
          <DollarSign className="h-5 w-5 text-green-500" />
        </div>
        <p className="text-sm text-gray-500 mb-2">You've successfully completed this bounty!</p>
        <Progress value={100} className="bg-green-200 h-2" indicatorClassName="bg-green-500" />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">Bounty Progress</h4>
        <Clock className="h-5 w-5 text-blue-500" />
      </div>
      <Progress 
        value={getProgressPercentage()} 
        className="bg-gray-200 h-2 mb-4" 
        indicatorClassName="bg-blue-500" 
      />
      
      <div className="space-y-3">
        <ProgressStep 
          complete={details.claimed} 
          label="Claimed Bounty" 
          description="You've claimed this bounty" 
        />
        
        <ProgressStep 
          complete={details.foundBuyer} 
          label="Found Buyer" 
          description="You've found a potential buyer" 
          disabled={!details.claimed}
        />
        
        <ProgressStep 
          complete={details.submittedOffer} 
          label="Submitted Offer" 
          description="Offer has been submitted to seller" 
          disabled={!details.foundBuyer}
        />
        
        <ProgressStep 
          complete={details.offerAccepted} 
          label="Offer Accepted" 
          description="Seller accepted the offer" 
          disabled={!details.submittedOffer}
        />
        
        <ProgressStep 
          complete={details.dealClosed} 
          label="Deal Closed" 
          description="Transaction complete" 
          disabled={!details.offerAccepted}
        />
      </div>
    </div>
  );
};

interface ProgressStepProps {
  complete: boolean;
  label: string;
  description: string;
  disabled?: boolean;
}

const ProgressStep: React.FC<ProgressStepProps> = ({
  complete,
  label,
  description,
  disabled = false
}) => {
  return (
    <div className={`flex items-start ${disabled ? 'opacity-50' : ''}`}>
      {complete ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-gray-300 mt-0.5 mr-3 flex-shrink-0" />
      )}
      <div>
        <h5 className="text-sm font-medium text-gray-900">{label}</h5>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default RewardProgress;

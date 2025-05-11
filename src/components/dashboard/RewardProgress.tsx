
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { RewardStatusDetails } from '@/types/bounty-status';

interface RewardProgressProps {
  propertyId: string;
  claimId?: string;
  statusDetails?: RewardStatusDetails; // Primary prop for status details
  initialStatus?: RewardStatusDetails; // Added for backward compatibility
  updateStatusDetails?: (newDetails: RewardStatusDetails) => void;
  onStatusUpdate?: () => void; // Added for backward compatibility
  isEditable?: boolean;
}

const RewardProgress: React.FC<RewardProgressProps> = ({
  propertyId,
  claimId,
  statusDetails, // Primary prop
  initialStatus, // Support for backward compatibility
  updateStatusDetails,
  onStatusUpdate, // Support for backward compatibility
  isEditable = false
}) => {
  // Default status if none provided
  const defaultStatus: RewardStatusDetails = {
    claimed: true,
    foundBuyer: false,
    submittedOffer: false,
    offerAccepted: false,
    dealClosed: false
  };

  // Use provided status or default, supporting both prop naming patterns
  const currentStatus = statusDetails || initialStatus || defaultStatus;
  
  const handleStatusUpdate = (key: keyof RewardStatusDetails) => {
    if (!isEditable) return;
    
    // Create a new status object with the updated key
    const newStatus = { ...currentStatus, [key]: !currentStatus[key] };
    
    // Ensure logical progression (can't have later steps complete if earlier ones aren't)
    if (!newStatus.claimed) {
      newStatus.foundBuyer = false;
      newStatus.submittedOffer = false;
      newStatus.offerAccepted = false;
      newStatus.dealClosed = false;
    }
    
    if (!newStatus.foundBuyer) {
      newStatus.submittedOffer = false;
      newStatus.offerAccepted = false;
      newStatus.dealClosed = false;
    }
    
    if (!newStatus.submittedOffer) {
      newStatus.offerAccepted = false;
      newStatus.dealClosed = false;
    }
    
    if (!newStatus.offerAccepted) {
      newStatus.dealClosed = false;
    }
    
    // Call the update function with the new status
    if (updateStatusDetails) {
      updateStatusDetails(newStatus);
    }
    
    // Support for backward compatibility
    if (onStatusUpdate) {
      onStatusUpdate();
    }
  };
  
  const steps = [
    {
      key: 'claimed' as keyof RewardStatusDetails,
      label: 'Property Claimed',
      description: 'You\'ve claimed this property to earn the bounty reward.'
    },
    {
      key: 'foundBuyer' as keyof RewardStatusDetails,
      label: 'Found Buyer',
      description: 'You\'ve found a potential buyer for this property.'
    },
    {
      key: 'submittedOffer' as keyof RewardStatusDetails,
      label: 'Submitted Offer',
      description: 'Your buyer has submitted an offer to the property owner.'
    },
    {
      key: 'offerAccepted' as keyof RewardStatusDetails,
      label: 'Offer Accepted',
      description: 'The seller has accepted the offer from your buyer.'
    },
    {
      key: 'dealClosed' as keyof RewardStatusDetails,
      label: 'Deal Closed',
      description: 'The sale has been completed and you\'ve earned the bounty!'
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold">Bounty Progress</h3>
        <p className="text-sm text-gray-500">Track your progress toward earning this bounty</p>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={step.key} 
            className={`
              flex items-start p-4 rounded-lg transition-all
              ${currentStatus[step.key] ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}
              ${isEditable ? 'cursor-pointer hover:border-gray-300' : ''}
            `}
            onClick={() => isEditable && handleStatusUpdate(step.key)}
          >
            <div className="mr-3 mt-0.5">
              {currentStatus[step.key] ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div>
              <h4 className={`font-medium ${currentStatus[step.key] ? 'text-green-700' : 'text-gray-700'}`}>
                {step.label}
              </h4>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardProgress;

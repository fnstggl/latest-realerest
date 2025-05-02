
import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RewardBadge from './RewardBadge';
import RewardToolTip from './RewardToolTip';

interface PropertyHeaderProps {
  title?: string;
  belowMarket?: number;
  price?: number;
  marketPrice?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  location?: string;
  fullAddress?: string;
  showFullAddress?: boolean;
  onShowAddressClick?: () => void;
  userId?: string;
  propertyId?: string;
  reward?: number | null;
  sellerName?: string;
  waitlistStatus?: string | null;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title,
  belowMarket,
  price,
  marketPrice,
  beds,
  baths,
  sqft,
  location,
  fullAddress,
  showFullAddress,
  onShowAddressClick,
  userId,
  propertyId,
  reward,
  sellerName,
  waitlistStatus
}) => {
  // Only show the reward amount if it exists and is greater than 0
  const showReward = reward !== null && reward > 0;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {belowMarket && belowMarket > 0 && (
          <div className="glass-card backdrop-blur-sm py-1.5 px-3 rounded-full font-semibold text-sm flex items-center gap-1.5">
            {belowMarket}% Below Market {showReward && reward}
          </div>
        )}
        
        {showReward && <RewardBadge reward={reward} />}
        
        {reward !== null && reward > 0 && (
          <RewardToolTip 
            sellerName={sellerName || 'Property Owner'} 
            rewardAmount={reward}
          />
        )}
      </div>
      
      <h1 className="text-3xl font-bold">{title}</h1>
      
      {location && (
        <div className="flex items-center gap-1">
          <MapPin size={16} className="text-gray-600" />
          <div className="text-md text-gray-800">
            {showFullAddress ? fullAddress : location}
            {!showFullAddress && onShowAddressClick && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-600 ml-1 font-semibold hover:text-blue-800" 
                onClick={onShowAddressClick}
              >
                Join Waitlist For Address
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white border border-gray-200 p-4 rounded-xl">
          <div className="text-2xl font-bold">
            ${price?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Listing Price</div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-xl">
          <div className="text-2xl font-bold text-gray-500">
            ${marketPrice?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Market Value</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {beds && (
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-full">
            <span className="font-semibold">{beds} {beds === 1 ? 'Bed' : 'Beds'}</span>
          </div>
        )}
        {baths && (
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-full">
            <span className="font-semibold">{baths} {baths === 1 ? 'Bath' : 'Baths'}</span>
          </div>
        )}
        {sqft && (
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-full">
            <span className="font-semibold">{sqft.toLocaleString()} sqft</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyHeader;

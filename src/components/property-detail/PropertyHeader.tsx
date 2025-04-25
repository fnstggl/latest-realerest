
import React from 'react';
import { BountyBadge } from './BountyBadge';
import { User } from 'lucide-react';

export interface PropertyHeaderProps {
  title: string;
  price: number;
  marketPrice: number;
  belowMarket: number;
  location: string;
  fullAddress?: string;
  bounty?: number; // Make bounty optional
  userType?: string;
  userId?: string;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title,
  price,
  marketPrice,
  belowMarket,
  location,
  fullAddress,
  bounty = 0, // Default value
  userType,
  userId
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
          <p className="text-gray-600 mb-1">{location}</p>
          {fullAddress && <p className="text-gray-500 text-sm">{fullAddress}</p>}
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <div className="flex items-center gap-2 text-3xl sm:text-4xl font-bold">
            <span>${price.toLocaleString()}</span>
            
            {bounty > 0 && userType === 'wholesaler' && (
              <BountyBadge amount={bounty} />
            )}
          </div>
          
          <div className="flex flex-col sm:items-end mt-1">
            <span className="text-gray-500 line-through text-sm">
              ${marketPrice.toLocaleString()} (Market Value)
            </span>
            <span className="text-green-600 font-medium mt-1">
              {belowMarket}% below market
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;

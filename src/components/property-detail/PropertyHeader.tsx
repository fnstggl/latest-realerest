
import React from 'react';
import { MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PropertyHeaderProps {
  title: string;
  belowMarket: number;
  price: number;
  marketPrice: number;
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  fullAddress?: string;
  showFullAddress: boolean;
  onShowAddressClick: () => void;
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
  onShowAddressClick
}) => {
  const renderLocation = () => {
    if (showFullAddress && fullAddress) {
      return (
        <span className="font-medium text-sm sm:text-base break-words glass px-2 py-1 rounded-lg backdrop-blur-sm">
          {fullAddress}{location ? `, ${location}` : ''}
        </span>
      );
    }
    
    return (
      <span className="font-medium text-sm sm:text-base">
        <span 
          className="cursor-pointer rainbow-text font-bold hover:underline glass px-2 py-1 rounded-lg backdrop-blur-sm"
          onClick={onShowAddressClick}
        >
          Join Waitlist For Address
        </span>
        {location.includes(',') ? `, ${location.split(',').slice(1).join(',')}` : ''}
      </span>
    );
  };

  return (
    <div className="glass-card backdrop-blur-lg border border-white/30 shadow-lg p-4 sm:p-6 rounded-xl property-card-glow layer-1">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-white/30 backdrop-blur-md text-pink-600 px-2 sm:px-3 py-1 border border-white/30 font-bold inline-flex items-center text-xs sm:text-sm rounded-lg property-card-glow layer-2">
          {belowMarket}% BELOW MARKET
        </div>
      </div>
      
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words rainbow-text layer-2">{title}</h1>
      
      <div className="flex items-start sm:items-center mb-4 flex-wrap glass p-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-2">
        <MapPin size={16} className="mr-1 sm:mr-2 text-pink-500 mt-1 sm:mt-0" />
        {renderLocation()}
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="glass backdrop-blur-lg border border-white/30 p-2 sm:p-4 rounded-lg property-card-glow layer-2">
          <div className="text-lg sm:text-2xl font-bold rainbow-text">{formatCurrency(price)}</div>
          <div className="text-xs sm:text-sm">Listing Price</div>
        </div>
        <div className="glass backdrop-blur-lg border border-white/30 p-2 sm:p-4 rounded-lg layer-2">
          <div className="text-base sm:text-xl font-bold line-through text-gray-500">{formatCurrency(marketPrice)}</div>
          <div className="text-xs sm:text-sm">Market Value</div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 sm:pt-3 border-t border-white/30 mb-4 sm:mb-6 text-sm sm:text-base">
        <div className="flex items-center glass px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20 layer-2">
          <span className="font-bold rainbow-text">{beds}</span>
          <span className="ml-1">Beds</span>
        </div>
        <div className="flex items-center glass px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20 layer-2">
          <span className="font-bold rainbow-text">{baths}</span>
          <span className="ml-1">Baths</span>
        </div>
        <div className="flex items-center glass px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20 layer-2">
          <span className="font-bold rainbow-text">{sqft?.toLocaleString()}</span>
          <span className="ml-1">sqft</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;

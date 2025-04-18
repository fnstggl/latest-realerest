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
        <span className="font-medium text-sm sm:text-base break-words">
          {fullAddress}{location ? `, ${location}` : ''}
        </span>
      );
    }
    
    return (
      <span className="font-medium text-sm sm:text-base">
        <span 
          className="cursor-pointer text-black font-bold hover:underline"
          onClick={onShowAddressClick}
        >
          Join Waitlist For Address
        </span>
        {location.includes(',') ? `, ${location.split(',').slice(1).join(',')}` : ''}
      </span>
    );
  };

  return (
    <div className="glass-card backdrop-blur-lg border border-white/40 shadow-lg p-4 sm:p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-white/30 backdrop-blur-md text-black px-2 sm:px-3 py-1 border border-white/40 font-bold inline-flex items-center text-sm sm:text-base rounded-lg">
          <span className="text-black font-playfair font-bold italic mr-1">{belowMarket}%</span> 
          <span className="text-black font-playfair font-bold italic">Below Market</span>
        </div>
      </div>
      
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words text-black">{title}</h1>
      
      <div className="flex items-start sm:items-center mb-4 flex-wrap">
        <MapPin size={16} className="mr-1 sm:mr-2 text-black mt-1 sm:mt-0" />
        {renderLocation()}
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="backdrop-blur-lg border border-white/40 p-2 sm:p-4 rounded-lg">
          <div className="text-lg sm:text-2xl font-bold text-black">{formatCurrency(price)}</div>
          <div className="text-xs sm:text-sm text-black">Listing Price</div>
        </div>
        <div className="backdrop-blur-lg border border-white/40 p-2 sm:p-4 rounded-lg">
          <div className="text-base sm:text-xl font-bold line-through text-gray-500">{formatCurrency(marketPrice)}</div>
          <div className="text-xs sm:text-sm text-black">Market Value</div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 sm:pt-3 border-t border-white/40 mb-4 sm:mb-6 text-sm sm:text-base">
        <div className="px-3 py-1 rounded-lg backdrop-blur-sm border border-white/40">
          <span className="font-bold text-black">{beds}</span>
          <span className="ml-1 text-black">Beds</span>
        </div>
        <div className="px-3 py-1 rounded-lg backdrop-blur-sm border border-white/40">
          <span className="font-bold text-black">{baths}</span>
          <span className="ml-1 text-black">Baths</span>
        </div>
        <div className="px-3 py-1 rounded-lg backdrop-blur-sm border border-white/40">
          <span className="font-bold text-black">{sqft?.toLocaleString()}</span>
          <span className="ml-1 text-black">sqft</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;

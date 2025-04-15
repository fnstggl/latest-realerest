
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
          className="cursor-pointer text-black font-bold hover:underline bg-white/20 px-2 py-1 rounded-md backdrop-blur-md shadow-sm transform transition-all hover:translate-y-[-2px] duration-300 border border-white/20 inline-block"
          onClick={onShowAddressClick}
        >
          Join Waitlist For Address
        </span>
        {location.includes(',') ? `, ${location.split(',').slice(1).join(',')}` : ''}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="discount-badge-glow bg-white/70 text-black px-2 sm:px-3 py-1 font-bold inline-flex items-center text-xs sm:text-sm shadow-lg backdrop-blur-md rounded-md transform translate-z-10 layer-3">
          {belowMarket}% BELOW MARKET
        </div>
      </div>
      
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words">{title}</h1>
      
      <div className="flex items-start sm:items-center mb-4 flex-wrap">
        <MapPin size={16} className="mr-1 sm:mr-2 text-[var(--purple-primary)] mt-1 sm:mt-0" />
        {renderLocation()}
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white/20 border border-white/30 p-2 sm:p-4 shadow-md backdrop-blur-md rounded-lg layer-2">
          <div className="text-lg sm:text-2xl font-bold text-black price-outline-glow inline-block px-2 py-1">{formatCurrency(price)}</div>
          <div className="text-xs sm:text-sm">Listing Price</div>
        </div>
        <div className="bg-white/20 border border-white/30 p-2 sm:p-4 shadow-md backdrop-blur-md rounded-lg layer-2">
          <div className="text-base sm:text-xl font-bold line-through text-gray-500">{formatCurrency(marketPrice)}</div>
          <div className="text-xs sm:text-sm">Market Value</div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 sm:pt-3 border-t border-white/20 mb-4 sm:mb-6 text-sm sm:text-base">
        <div className="flex items-center glass-button-3d px-2 py-1 rounded-md shadow-md bg-white/20 backdrop-blur-sm border border-white/20 transform transition-all hover:translate-y-[-2px] duration-300">
          <span className="font-bold">{beds}</span>
          <span className="ml-1">Beds</span>
        </div>
        <div className="flex items-center glass-button-3d px-2 py-1 rounded-md shadow-md bg-white/20 backdrop-blur-sm border border-white/20 transform transition-all hover:translate-y-[-2px] duration-300">
          <span className="font-bold">{baths}</span>
          <span className="ml-1">Baths</span>
        </div>
        <div className="flex items-center glass-button-3d px-2 py-1 rounded-md shadow-md bg-white/20 backdrop-blur-sm border border-white/20 transform transition-all hover:translate-y-[-2px] duration-300">
          <span className="font-bold">{sqft?.toLocaleString()}</span>
          <span className="ml-1">sqft</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;

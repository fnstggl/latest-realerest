
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
        <span className="font-medium">
          {fullAddress}{location ? `, ${location}` : ''}
        </span>
      );
    }
    
    return (
      <span className="font-medium">
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
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-[#d60013] text-white px-3 py-1 border-2 border-black font-bold inline-flex items-center">
          {belowMarket}% BELOW MARKET
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      
      <div className="flex items-center mb-4">
        <MapPin size={18} className="mr-2 text-[#d60013]" />
        {renderLocation()}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border-2 border-black p-4">
          <div className="text-2xl font-bold text-[#d60013]">{formatCurrency(price)}</div>
          <div className="text-sm">Listing Price</div>
        </div>
        <div className="border-2 border-black p-4">
          <div className="text-xl font-bold line-through text-gray-500">{formatCurrency(marketPrice)}</div>
          <div className="text-sm">Market Value</div>
        </div>
      </div>
      
      <div className="flex justify-between pt-3 border-t-2 border-black mb-6">
        <div className="flex items-center">
          <span className="font-bold">{beds}</span>
          <span className="ml-1">Beds</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold">{baths}</span>
          <span className="ml-1">Baths</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold">{sqft?.toLocaleString()}</span>
          <span className="ml-1">sqft</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;

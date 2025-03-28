
import React from 'react';
import { Link } from 'react-router-dom';
import { BadgePercent, Bed, Bath, Square, ArrowRight, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PropertyCardProps {
  id: string;
  price: number;
  marketPrice: number;
  image: string;
  location: string;
  address?: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  price,
  marketPrice,
  image,
  location,
  address,
  beds,
  baths,
  sqft,
  belowMarket,
}) => {
  return (
    <Link to={`/property/${id}`} className="block">
      <div className="relative bg-white shadow-lg overflow-hidden border-4 border-black">
        {/* Main image */}
        <div className="relative">
          <img
            src={image}
            alt={location}
            className="h-[240px] w-full object-cover"
          />
          {/* Below Market Tag as bookmarker on upper left - adjusted position */}
          <div className="absolute top-8 left-0 bg-[#d60013] text-white py-2 px-4 font-bold border-r-3 border-b-3 border-black border-r-4 border-b-4">
            {belowMarket}% OFF
          </div>
        </div>
        
        <div className="p-6">
          {/* Location and price info */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold">{address || location.split(',')[0]}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(price)}</div>
              <div className="text-gray-500 line-through">{formatCurrency(marketPrice)}</div>
            </div>
          </div>
          
          {/* Address with icon */}
          <div className="flex items-center text-gray-700 mb-4">
            <MapPin size={18} className="mr-1" />
            <span>{location}</span>
          </div>
          
          <div className="border-t-2 border-gray-200 pt-4 mt-2">
            <div className="flex justify-between items-center">
              {/* Property details */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Bed size={18} className="mr-1" />
                  <span className="font-bold">{beds}</span>
                </div>
                <div className="flex items-center">
                  <Bath size={18} className="mr-1" />
                  <span className="font-bold">{baths}</span>
                </div>
                <div className="flex items-center">
                  <Square size={18} className="mr-1" />
                  <span className="font-bold">{sqft.toLocaleString()} sqft</span>
                </div>
              </div>
              
              {/* Arrow button */}
              <div className="bg-[#d60013] text-white w-12 h-12 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

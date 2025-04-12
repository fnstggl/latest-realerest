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
  belowMarket
}) => {
  const roundedBelowMarket = Math.round(belowMarket);
  const validImage = image || '/placeholder.svg';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/placeholder.svg';
  };

  return <Link 
    to={`/property/${id}`} 
    className="block hover:scale-[1.02] transition-transform duration-300 ease-in-out hover:shadow-lg"
  >
      <div className="relative bg-white shadow-lg overflow-hidden border-[6px] border-black">
        <div className="relative">
          <img src={validImage} alt={location} className="h-[240px] w-full object-cover" onError={handleImageError} loading="lazy" />
          {belowMarket > 0 && <div className="absolute top-12 left-0 bg-[#d60013] text-white py-2 px-4 font-bold border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
              {roundedBelowMarket}% OFF
            </div>}
          
          <div className="h-[6px] w-full bg-black"></div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl">{address || location.split(',')[0]}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(price)}</div>
              <div className="text-gray-500 line-through">{formatCurrency(marketPrice)}</div>
            </div>
          </div>
          
          <div className="flex items-center text-gray-700 mb-4">
            <MapPin size={18} className="mr-1" />
            <span>{location}</span>
          </div>
          
          <div className="border-t-2 border-gray-200 pt-4 mt-2">
            <div className="flex justify-between items-center">
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
              
              <div className="text-white w-12 h-12 flex items-center justify-center border-[6px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] bg-donedeal-navy transition-all duration-300 hover:bg-donedeal-navy/90 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>;
};

export default PropertyCard;

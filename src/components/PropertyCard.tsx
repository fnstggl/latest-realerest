
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { BadgePercent, Bed, Bath, Square } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import WaitlistButton from './WaitlistButton';

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  image: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  marketPrice,
  image,
  location,
  beds,
  baths,
  sqft,
  belowMarket,
}) => {
  const { accountType } = useAuth();
  const isBuyer = accountType === 'buyer';

  return (
    <div className="group transition-all border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="h-[240px] w-full object-cover border-b-4 border-black"
        />
        <div className="absolute top-3 right-3 bg-[#ea384c] text-white px-3 py-1 border-2 border-black font-bold flex items-center gap-1">
          <BadgePercent size={16} />
          <span>{belowMarket}% BELOW</span>
        </div>
      </div>
      
      <div className="p-5 bg-white">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-xl text-black">{title}</h3>
          </div>
          
          <p className="text-black font-medium">
            {/* Show redacted address for buyers who haven't been approved */}
            {isBuyer ? location.replace(/^[^,]+/, "123 XXXX Street") : location}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-black">{formatCurrency(price)}</div>
            <div className="text-gray-500 line-through text-sm">{formatCurrency(marketPrice)}</div>
          </div>
          
          <div className="flex justify-between pt-3 border-t-2 border-black">
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
          
          <div className="pt-2">
            {isBuyer ? (
              <WaitlistButton propertyId={id} propertyTitle={title} />
            ) : (
              <Link to={`/property/${id}`}>
                <button className="w-full bg-black text-white font-bold py-2 border-2 border-black hover:bg-gray-800 transition-colors">
                  View Details
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

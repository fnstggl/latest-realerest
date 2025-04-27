
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Bed, Bath, Maximize2, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RewardBadge from './property-detail/RewardBadge';

interface PropertyCardProps {
  id: string;
  price: number;
  marketPrice: number;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
  location: string;
  belowMarket: number;
  reward?: number;
  compact?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  price,
  marketPrice,
  image,
  beds,
  baths,
  sqft,
  address,
  location,
  belowMarket,
  reward,
  compact = false
}) => {
  const navigate = useNavigate();
  const roundedBelowMarket = Math.round(belowMarket);
  
  const handleClick = () => {
    navigate(`/property/${id}`);
  };
  
  return (
    <motion.div
      className="group relative rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm transition hover:shadow-md hover:-translate-y-1 h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        {/* Show reward badge if reward is >= 3000 */}
        {reward && reward >= 3000 && <RewardBadge amount={reward} inPropertyCard={true} />}
        
        <Link to={`/property/${id}`}>
          <img 
            src={image || '/placeholder.svg'}
            alt={address}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="text-white font-bold px-2 py-1 rounded-lg inline-flex items-center text-xs bg-black/40 backdrop-blur-sm">
              <span className="font-bold">{roundedBelowMarket}%</span> 
              <span className="ml-1">Below Market</span>
            </div>
          </div>
        </Link>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <div className="font-bold text-xl">{formatCurrency(price)}</div>
            <div className="text-gray-500 text-sm line-through">{formatCurrency(marketPrice)}</div>
          </div>
        </div>

        <Link to={`/property/${id}`} className="mt-2 block">
          <h3 className="font-bold text-lg text-black line-clamp-1 hover:underline">{address}</h3>
        </Link>
        
        <div className="flex items-center text-gray-700 text-sm mt-1 mb-3">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{location}</span>
        </div>
        
        <div className="flex justify-between mt-auto pt-3 border-t border-gray-200">
          <div className="flex items-center text-gray-700 text-sm">
            <Bed size={16} className="mr-1" />
            <span>{beds}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <Bath size={16} className="mr-1" />
            <span>{baths}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <Maximize2 size={16} className="mr-1" />
            <span>{sqft?.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;

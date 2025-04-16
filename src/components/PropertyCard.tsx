
import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, ArrowRight, MapPin } from 'lucide-react';
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

  return (
    <Link 
      to={`/property/${id}`} 
      className="block perspective-container"
    >
      <div className="glass-card h-full border border-white/30 shadow-lg overflow-hidden transform translate-z-5 relative z-10">
        <div className="relative layer-1 rounded-t-lg">
          <img 
            src={validImage} 
            alt={location} 
            className="h-[240px] w-full object-cover rounded-t-lg" 
            onError={handleImageError} 
            loading="lazy" 
          />
          
          {belowMarket > 0 && (
            <div className="absolute top-4 left-4 layer-3 py-1 px-3 font-bold text-foreground shadow-lg rounded-md backdrop-blur-md border border-white/30">
              {roundedBelowMarket}% OFF
            </div>
          )}
        </div>
        
        <div className="p-6 layer-2 rounded-b-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-foreground layer-1 py-1 px-2 rounded-md">{address || location.split(',')[0]}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold layer-3 px-3 py-1 rounded-lg">
                {formatCurrency(price)}
              </div>
              <div className="text-muted-foreground line-through layer-1 mt-1 px-2 py-1 rounded-md">{formatCurrency(marketPrice)}</div>
            </div>
          </div>
          
          <div className="flex items-center text-foreground/70 mb-4 layer-2 px-3 py-1 rounded-md backdrop-blur-sm shadow-sm inline-block">
            <MapPin size={18} className="mr-1" />
            <span>{location}</span>
          </div>
          
          <div className="border-t border-white/20 pt-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-foreground/80">
                <div className="flex items-center layer-1 px-2 py-1 rounded-lg shadow-sm backdrop-blur-sm border border-white/30">
                  <Bed size={18} className="mr-1" />
                  <span className="font-bold">{beds}</span>
                </div>
                <div className="flex items-center layer-1 px-2 py-1 rounded-lg shadow-sm backdrop-blur-sm border border-white/30">
                  <Bath size={18} className="mr-1" />
                  <span className="font-bold">{baths}</span>
                </div>
                <div className="flex items-center layer-1 px-2 py-1 rounded-lg shadow-sm backdrop-blur-sm border border-white/30">
                  <Square size={18} className="mr-1" />
                  <span className="font-bold">{sqft.toLocaleString()} sqft</span>
                </div>
              </div>
              
              <div className="layer-3 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 backdrop-blur-md">
                <ArrowRight size={20} className="text-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

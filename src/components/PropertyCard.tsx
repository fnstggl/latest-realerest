
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
      className="block perspective-container hover-property-card"
    >
      <div className="glass-card-3d h-full backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden transform translate-z-5 transition-all duration-300">
        <div className="relative layer-1">
          <img 
            src={validImage} 
            alt={location} 
            className="h-[240px] w-full object-cover rounded-t-lg" 
            onError={handleImageError} 
            loading="lazy" 
          />
          
          {belowMarket > 0 && (
            <div className="absolute top-4 left-4 discount-badge-glow bg-white/70 text-black py-1 px-3 font-bold shadow-lg rounded-md transform translate-z-10 layer-3 backdrop-blur-md">
              {roundedBelowMarket}% OFF
            </div>
          )}
        </div>
        
        <div className="p-6 layer-2 bg-white/20 backdrop-blur-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-foreground layer-1">{address || location.split(',')[0]}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-black layer-3 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/20 shadow-md price-outline-glow">
                {formatCurrency(price)}
              </div>
              <div className="text-muted-foreground line-through layer-1 mt-1">{formatCurrency(marketPrice)}</div>
            </div>
          </div>
          
          <div className="flex items-center text-foreground/70 mb-4 layer-2 glass px-3 py-1 rounded-md backdrop-blur-sm shadow-sm inline-block bg-white/20 border border-white/20">
            <MapPin size={18} className="mr-1" />
            <span>{location}</span>
          </div>
          
          <div className="border-t border-white/20 pt-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-foreground/80 layer-1">
                <div className="flex items-center glass-button-3d px-2 py-1 rounded-lg shadow-md backdrop-blur-sm bg-white/20 border border-white/20 transform transition-all hover:translate-y-[-2px] duration-300">
                  <Bed size={18} className="mr-1" />
                  <span className="font-bold">{beds}</span>
                </div>
                <div className="flex items-center glass-button-3d px-2 py-1 rounded-lg shadow-md backdrop-blur-sm bg-white/20 border border-white/20 transform transition-all hover:translate-y-[-2px] duration-300">
                  <Bath size={18} className="mr-1" />
                  <span className="font-bold">{baths}</span>
                </div>
                <div className="flex items-center glass-button-3d px-2 py-1 rounded-lg shadow-md backdrop-blur-sm bg-white/20 border border-white/20 transform transition-all hover:translate-y-[-2px] duration-300">
                  <Square size={18} className="mr-1" />
                  <span className="font-bold">{sqft.toLocaleString()} sqft</span>
                </div>
              </div>
              
              <div className="glass-button-3d bg-white/30 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 layer-3 transform translate-z-10 backdrop-blur-md border border-white/30 hover:translate-y-[-3px]">
                <ArrowRight size={20} className="text-[var(--purple-primary)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

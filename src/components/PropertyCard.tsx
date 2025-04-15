
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
      className="block hover:scale-[1.01] transition-transform duration-300 ease-in-out perspective-container rainbow-glow-card"
    >
      <div className="glass-card card-3d h-full backdrop-blur-lg border border-white/30 shadow-lg overflow-hidden">
        <div className="relative">
          <img 
            src={validImage} 
            alt={location} 
            className="h-[240px] w-full object-cover rounded-t-lg" 
            onError={handleImageError} 
            loading="lazy" 
          />
          
          {belowMarket > 0 && (
            <div className="absolute top-4 left-0 glass-discount-badge py-1 px-3 font-bold text-white shadow-lg rounded-lg layer-2">
              {roundedBelowMarket}% OFF
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-foreground">{address || location.split(',')[0]}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#FF5C00]">{formatCurrency(price)}</div>
              <div className="text-muted-foreground line-through">{formatCurrency(marketPrice)}</div>
            </div>
          </div>
          
          <div className="flex items-center text-foreground/70 mb-4">
            <MapPin size={18} className="mr-1" />
            <span>{location}</span>
          </div>
          
          <div className="border-t border-white/20 pt-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-foreground/80">
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
              
              <div className="text-white w-10 h-10 flex items-center justify-center bg-[#FF5C00] rounded-full shadow-lg transition-all duration-300 hover:opacity-90 layer-2">
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

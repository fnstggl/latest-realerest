
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
        <div className="relative rounded-t-lg">
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
        
        <div className="p-6 rounded-b-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-foreground py-1 px-2 rounded-md">{address || location.split(',')[0]}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold px-3 py-1 rounded-lg">
                {formatCurrency(price)}
              </div>
              <div className="text-muted-foreground line-through mt-1 px-2 py-1 rounded-md">{formatCurrency(marketPrice)}</div>
            </div>
          </div>
          
          <div className="flex items-center text-foreground/70 mb-4 px-3 py-1 rounded-md">
            <MapPin size={18} className="mr-1" />
            <span>{location}</span>
          </div>
          
          <div className="border-t border-white/20 pt-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-foreground/80">
                <div className="flex items-center px-2 py-1 rounded-lg border border-white/30">
                  <Bed size={18} className="mr-1" />
                  <span className="font-bold">{beds}</span>
                </div>
                <div className="flex items-center px-2 py-1 rounded-lg border border-white/30">
                  <Bath size={18} className="mr-1" />
                  <span className="font-bold">{baths}</span>
                </div>
                <div className="flex items-center px-2 py-1 rounded-lg border border-white/30">
                  <Square size={18} className="mr-1" />
                  <span className="font-bold">{sqft.toLocaleString()} sqft</span>
                </div>
              </div>
              
              <div className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 relative group overflow-hidden bg-white border border-transparent">
                <ArrowRight size={20} className="text-foreground relative z-10" />
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    boxShadow: "0 0 10px rgba(217, 70, 239, 0.5)",
                    filter: "blur(1px)"
                  }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

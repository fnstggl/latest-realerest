
import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, ArrowRight, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import RewardToolTip from '@/components/property-detail/RewardToolTip';
import { Award } from 'lucide-react';

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
  reward?: number;
  bounty?: number; // Accept both reward and bounty properties to ensure compatibility
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
  reward,
  bounty
}) => {
  const roundedBelowMarket = Math.round(belowMarket);
  const validImage = image || '/placeholder.svg';
  // Use reward or bounty field (bounty is the field name in the database)
  const rewardAmount = reward || bounty;
  
  const locationParts = location ? location.split(',') : ['Unknown', ''];
  const city = locationParts[0]?.trim() || 'Unknown';
  const stateZip = locationParts[1]?.trim() || '';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <Link 
      to={`/property/${id}`} 
      className="block perspective-container h-full property-card-glow rounded-xl"
    >
      <div className="h-full border border-white/30 shadow-lg overflow-hidden transform translate-z-5 relative z-10 flex flex-col rounded-xl">
        <div className="relative rounded-t-xl">
          <img 
            src={validImage} 
            alt={location || 'Property'} 
            className="h-[240px] w-full object-cover rounded-t-xl"
            onError={handleImageError} 
            loading="lazy" 
            decoding="async"
            width="400"
            height="240"
          />
          
          <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-start">
            {belowMarket > 0 && (
              <div className="py-1 px-3 font-bold text-foreground bg-white/90 rounded-full group overflow-hidden">
                <span className="relative z-10">{roundedBelowMarket}% OFF</span>
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
                  }}
                />
              </div>
            )}
            {rewardAmount && rewardAmount >= 3000 && (
              <div className="py-1 px-3 font-bold text-foreground bg-white/90 rounded-full flex items-center gap-2">
                <Award size={16} className="text-black" />
                <RewardToolTip amount={rewardAmount} inPropertyCard={true} className="text-black" />
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col rounded-b-xl bg-white/90">
          <h3 className="font-bold text-lg text-foreground mb-3 truncate">
            {address || (location ? location.split(',')[0] : 'Property Listing')}
          </h3>
          
          <div className="mb-2">
            <div className="text-lg text-muted-foreground line-through mb-1">
              {formatCurrency(marketPrice)}
            </div>
            <div className="text-xl font-bold">{formatCurrency(price)}</div>
          </div>
          
          <div className="flex items-center text-foreground/70 mb-4">
            <MapPin size={16} className="mr-1 shrink-0" />
            <span className="truncate">{location || 'Unknown location'}</span>
          </div>
          
          <div className="border-t border-white/20 pt-4 mt-auto">
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

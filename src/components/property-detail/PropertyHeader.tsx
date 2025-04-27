import React from 'react';
import { Bed, Bath, Square, MapPin, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PropertyHeaderProps {
  title?: string;
  belowMarket?: number;
  price?: number;
  marketPrice?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  location?: string;
  fullAddress?: string;
  showFullAddress?: boolean;
  onShowAddressClick?: () => void;
  userId?: string;
  propertyId?: string;
  bounty?: number;
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
  onShowAddressClick,
  bounty
}) => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
        {title || 'Property Details'}
      </h1>

      <div className="flex flex-wrap gap-2">
        {belowMarket && belowMarket > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
            <span className="text-sm font-medium text-black">{Math.round(belowMarket)}% Below Market</span>
          </div>
        )}

        {bounty && bounty > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
                  <span className="text-sm font-medium text-black">{formatCurrency(bounty)} Reward</span>
                  <Info size={16} className="text-black/70" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm max-w-xs">
                  Connect the seller with an interested buyer and get paid {formatCurrency(bounty)} if the deal closes. Join the waitlist to claim this reward.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="mb-2">
        <div className="text-lg text-muted-foreground line-through mb-1">
          {formatCurrency(marketPrice || 0)}
        </div>
        <div className="text-3xl font-bold">{formatCurrency(price || 0)}</div>
      </div>

      <div className="flex items-center text-foreground/70 mb-4">
        <MapPin size={16} className="mr-1 shrink-0" />
        <span className="truncate">{location || 'Unknown location'}</span>
      </div>

      {showFullAddress && fullAddress ? (
        <div className="text-foreground/90 font-bold cursor-pointer hover:underline" onClick={onShowAddressClick}>
          {fullAddress}
        </div>
      ) : (
        <button onClick={onShowAddressClick} className="text-sm text-blue-500 hover:underline">
          Show Full Address
        </button>
      )}

      <div className="border-t border-white/20 pt-4">
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
              <span className="font-bold">{sqft?.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;

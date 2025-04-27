import React from 'react';
import { MapPin, MessageSquare } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import LikeButton from './LikeButton';
import RewardToolTip from './RewardToolTip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface PropertyHeaderProps {
  title: string;
  belowMarket: number;
  price: number;
  marketPrice: number;
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  fullAddress?: string;
  showFullAddress: boolean;
  onShowAddressClick: () => void;
  userId?: string;
  propertyId?: string;
  bounty?: number;
  sellerName?: string;
  waitlistStatus?: string | null;
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
  userId,
  propertyId,
  bounty,
  sellerName = "Seller",
  waitlistStatus
}) => {
  const [showRewardDialog, setShowRewardDialog] = React.useState(false);
  const roundedBelowMarket = Math.round(belowMarket);

  const renderLocation = () => {
    if (showFullAddress && fullAddress) {
      return <span className="font-medium text-sm sm:text-base break-words">
          {fullAddress}{location ? `, ${location}` : ''}
        </span>;
    }
    return <span className="font-medium text-sm sm:text-base">
        <span className="cursor-pointer text-black font-bold hover:underline" onClick={onShowAddressClick}>
          Join Waitlist For Address
        </span>
        {location.includes(',') ? `, ${location.split(',').slice(1).join(',')}` : ''}
      </span>;
  };

  return <div className="bg-white p-4 sm:p-6 rounded-xl my-[30px]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-white text-black px-2 sm:px-3 py-1 border border-gray-200 font-bold inline-flex items-center text-sm sm:text-base rounded-lg">
            <span className="text-black font-playfair font-bold italic mr-1">{roundedBelowMarket}%</span> 
            <span className="text-black font-playfair font-bold italic">Below Market</span>
          </div>
          {bounty && bounty >= 3000 && <div className="bg-white text-black px-2 sm:px-3 py-1 border border-gray-200 font-bold inline-flex items-center text-sm sm:text-base rounded-lg">
              <span className="font-futura font-extrabold mr-1 text-sky-600">{formatCurrency(bounty)}</span> 
              <span className="font-futura font-extrabold mr-1 text-sky-600">Reward</span>
              <RewardToolTip amount={bounty} />
            </div>}
        </div>
        {propertyId && <LikeButton propertyId={propertyId} sellerId={userId || ''} />}
      </div>
      
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words text-black">{title}</h1>
      
      <div className="flex items-start sm:items-center mb-4 flex-wrap">
        <MapPin size={16} className="mr-1 sm:mr-2 text-black mt-1 sm:mt-0" />
        {renderLocation()}
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-2 sm:p-4 rounded-lg border border-gray-200">
          <div className="text-lg sm:text-2xl font-bold text-black">{formatCurrency(price)}</div>
          <div className="text-xs sm:text-sm text-black">Listing Price</div>
        </div>
        <div className="p-2 sm:p-4 rounded-lg border border-gray-200">
          <div className="text-base sm:text-xl font-bold line-through text-gray-500">{formatCurrency(marketPrice)}</div>
          <div className="text-xs sm:text-sm text-black">Market Value</div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 sm:pt-3 border-t border-gray-200">
        <div className="px-3 py-1 rounded-lg border border-gray-200">
          <span className="font-bold text-black">{beds}</span>
          <span className="ml-1 text-black">Beds</span>
        </div>
        <div className="px-3 py-1 rounded-lg border border-gray-200">
          <span className="font-bold text-black">{baths}</span>
          <span className="ml-1 text-black">Baths</span>
        </div>
        <div className="px-3 py-1 rounded-lg border border-gray-200">
          <span className="font-bold text-black">{sqft?.toLocaleString()}</span>
          <span className="ml-1 text-black">sqft</span>
        </div>
      </div>

      {waitlistStatus === 'pending' && <div className="mt-4 space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-black font-medium">Waitlist Request Pending</p>
          </div>
          
          <Link to={`/messages?seller=${userId}`} className="block w-full">
            <Button variant="glass" className="w-full bg-white hover:bg-white relative group overflow-hidden">
              <MessageSquare className="mr-2" />
              <span className="text-black font-bold relative z-10">
                Message {sellerName} Directly
              </span>
              <span className="absolute inset-0 opacity-100 rounded-lg pointer-events-none" style={{
                background: "transparent",
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                backgroundOrigin: "border-box",
                backgroundClip: "border-box",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude"
              }} />
            </Button>
          </Link>
          
          <Button variant="default" className="w-full bg-black hover:bg-black/90 text-white" onClick={() => setShowRewardDialog(true)}>
            Claim {formatCurrency(bounty || 0)} Reward
          </Button>
        </div>}

      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reward Claim</DialogTitle>
            <DialogDescription>
              You've just accepted the {formatCurrency(bounty || 0)} reward for {title}. Find a buyer for the seller, get an assignment of contract agreement signed (download from "How to Wholesale" in guides) and get paid.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowRewardDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};

export default PropertyHeader;

import React from 'react';
import { formatCurrency } from '@/lib/utils';
interface PropertyOffersProps {
  propertyId: string;
  realOffers: {
    id: string;
    amount: number;
    buyerName: string;
  }[];
}

// Only render offers with actual data (already filtered from parent!)
const PropertyOffers: React.FC<PropertyOffersProps> = ({
  realOffers = []
}) => {
  if (!realOffers || realOffers.length === 0) return null;
  return <div className="border border-gray-200 bg-white p-4 rounded-lg mt-6">
      <h3 className="text-lg font-bold mb-3 text-black">Top Bids</h3>
      <div className="space-y-2">
        {realOffers.map(offer => <div key={offer.id} className="flex justify-between items-center p-2 rounded-lg border border-white-0 bg-white">
            <div className="text-black">{offer.buyerName}</div>
            <div className="font-bold text-black">{formatCurrency(offer.amount)}</div>
          </div>)}
      </div>
    </div>;
};
export default PropertyOffers;
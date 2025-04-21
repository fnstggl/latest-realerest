
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface PropertyOffersProps {
  propertyId: string;
  realOffers: {
    id: string;
    amount: number;
    buyerName: string;
    withdrawn?: boolean; // new
  }[];
}

const PropertyOffers: React.FC<PropertyOffersProps> = ({ realOffers = [] }) => {
  // Only offers that are NOT withdrawn
  const shownOffers = realOffers.filter(offer => offer.withdrawn !== true);

  if (!shownOffers || shownOffers.length === 0) return null;

  return (
    <div className="border border-black bg-white p-4 rounded-lg mt-6">
      <h3 className="text-lg font-bold mb-3 text-black">Top Bids</h3>
      <div className="space-y-2">
        {shownOffers.map((offer) => (
          <div key={offer.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-black">
            <div className="text-black">{offer.buyerName}</div>
            <div className="font-bold text-black">{formatCurrency(offer.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyOffers;

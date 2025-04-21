
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface PropertyOffersProps {
  propertyId: string;
  realOffers: {
    id: string;
    amount: number;
    buyerName: string;
    status?: string;
  }[];
}

const PropertyOffers: React.FC<PropertyOffersProps> = ({ realOffers = [] }) => {
  // Filter out withdrawn offers
  const activeOffers = realOffers.filter(offer => offer.status !== 'withdrawn');
  
  if (!activeOffers || activeOffers.length === 0) return null;

  return (
    <div className="border border-gray-200 bg-white p-4 rounded-lg mt-6">
      <h3 className="text-lg font-bold mb-3 text-black">Top Bids</h3>
      
      <div className="space-y-2">
        {activeOffers.map((offer) => (
          <div key={offer.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-200">
            <div className="text-black">{offer.buyerName}</div>
            <div className="font-bold text-black">{formatCurrency(offer.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyOffers;

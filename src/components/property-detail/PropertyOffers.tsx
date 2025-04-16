import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';

interface PropertyOffersProps {
  propertyId: string;
  propertyPrice: number;
  realOffers: {
    id: string;
    amount: number;
    buyerName: string;
  }[];
}

const PropertyOffers: React.FC<PropertyOffersProps> = ({ propertyId, propertyPrice, realOffers = [] }) => {
  // Generate some fake offers if there are no real offers
  const [offers, setOffers] = useState<{id: string; amount: number; buyerName: string}[]>([]);

  useEffect(() => {
    // If there are real offers, use them
    if (realOffers && realOffers.length > 0) {
      setOffers(realOffers);
      return;
    }

    // Otherwise generate fake offers
    const basePrice = propertyPrice;
    const fakeBuyers = ["Sample Buyer", "Interested Investor", "Potential Buyer"];
    
    const fakeOffers = fakeBuyers.map((name, index) => {
      const discount = Math.random() * 0.1 + 0.01; // 1-11% discount
      return {
        id: `fake-${index}`,
        amount: Math.floor(basePrice * (1 - discount)),
        buyerName: name
      };
    });
    
    // Sort by amount in descending order
    fakeOffers.sort((a, b) => b.amount - a.amount);
    setOffers(fakeOffers);
  }, [propertyPrice, realOffers]);

  if (!offers || offers.length === 0) return null;

  return (
    <div className="glass-card backdrop-blur-lg border border-white/30 shadow-lg p-4 rounded-xl property-card-glow mt-6">
      <h3 className="text-lg font-bold mb-3 purple-text">Top Bids</h3>
      
      <div className="space-y-2">
        {offers.map((offer) => (
          <div key={offer.id} className="flex justify-between items-center glass p-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">
            <div>{offer.buyerName}</div>
            <div className="font-bold purple-text">{formatCurrency(offer.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyOffers;

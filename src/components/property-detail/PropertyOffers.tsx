
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

  // Helper function to round bid amounts to nearest thousand or 500
  const roundBidAmount = (amount: number): number => {
    // First round to nearest 500
    const roundedTo500 = Math.round(amount / 500) * 500;
    
    // If it's above 10000, round to nearest thousand instead
    if (amount > 10000) {
      return Math.round(amount / 1000) * 1000;
    }
    
    return roundedTo500;
  };

  useEffect(() => {
    // If there are real offers, use them but with rounded amounts
    if (realOffers && realOffers.length > 0) {
      const processedOffers = realOffers.map(offer => ({
        id: offer.id,
        amount: roundBidAmount(offer.amount),
        buyerName: "Anonymous buyer"
      }));
      setOffers(processedOffers);
      return;
    }

    // Otherwise generate fake offers
    const basePrice = propertyPrice;
    const fakeBuyers = Array(3).fill("Anonymous buyer");
    
    const fakeOffers = fakeBuyers.map((name, index) => {
      const discount = Math.random() * 0.1 + 0.01; // 1-11% discount
      const rawAmount = Math.floor(basePrice * (1 - discount));
      return {
        id: `fake-${index}`,
        amount: roundBidAmount(rawAmount),
        buyerName: name
      };
    });
    
    // Sort by amount in descending order
    fakeOffers.sort((a, b) => b.amount - a.amount);
    setOffers(fakeOffers);
  }, [propertyPrice, realOffers]);

  if (!offers || offers.length === 0) return null;

  return (
    <div className="backdrop-blur-lg border border-white/20 shadow-lg p-4 rounded-xl mt-6">
      <h3 className="text-lg font-bold mb-3 text-black">Top Bids</h3>
      
      <div className="space-y-2">
        {offers.map((offer) => (
          <div key={offer.id} className="flex justify-between items-center p-2 rounded-lg backdrop-blur-sm border border-white/30 shadow-sm">
            <div className="text-black">{offer.buyerName}</div>
            <div className="font-bold text-black">{formatCurrency(offer.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyOffers;

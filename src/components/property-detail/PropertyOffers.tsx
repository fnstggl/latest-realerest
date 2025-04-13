import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface Offer {
  id: string;
  amount: number;
  buyerName: string;
  isReal?: boolean;
}

interface PropertyOffersProps {
  propertyId: string;
  propertyPrice: number;
  realOffers?: Array<{
    id: string;
    amount: number;
    buyerName: string;
  }>;
}

const PropertyOffers: React.FC<PropertyOffersProps> = ({
  propertyId,
  propertyPrice,
  realOffers = []
}) => {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  
  React.useEffect(() => {
    // First, try to get saved offers from localStorage
    const storageKey = `property_offers_${propertyId}`;
    const savedOffers = localStorage.getItem(storageKey);
    
    if (savedOffers) {
      // If we have saved offers, use them
      const parsedOffers = JSON.parse(savedOffers);
      setOffers(parsedOffers);
    } else {
      // Otherwise generate new mock offers
      const generateMockOffers = () => {
        // Generate between 0-3 mock offers
        const numOffers = Math.floor(Math.random() * 4); // 0-3 offers
        const mockOffers: Offer[] = [];
        
        for (let i = 0; i < numOffers; i++) {
          // Create random discount between 0-8k below listing price
          // Round to either thousands (1000) or five hundreds (500)
          const maxDiscount = 8000;
          const rawDiscount = Math.floor(Math.random() * (maxDiscount + 1));
          
          // Round to nearest 500 or 1000
          let discount;
          if (Math.random() > 0.5) {
            // Round to nearest 1000
            discount = Math.round(rawDiscount / 1000) * 1000;
          } else {
            // Round to nearest 500
            discount = Math.round(rawDiscount / 500) * 500;
          }
          
          const offerAmount = propertyPrice - discount;
          
          mockOffers.push({
            id: `mock-${i}-${propertyId}`,
            amount: offerAmount,
            buyerName: "Anonymous Buyer",
            isReal: false
          });
        }

        // Combine real and mock offers
        const combinedOffers = [
          ...realOffers.map(offer => ({
            ...offer,
            isReal: true
          })), 
          ...mockOffers
        ];

        // Sort by highest offer amount
        const sortedOffers = combinedOffers.sort((a, b) => b.amount - a.amount);

        // Take only top 3 offers
        const topOffers = sortedOffers.slice(0, 3);
        
        // Save to localStorage to persist between visits
        localStorage.setItem(storageKey, JSON.stringify(topOffers));
        
        setOffers(topOffers);
      };
      
      generateMockOffers();
    }
  }, [propertyId, propertyPrice, realOffers]);

  if (offers.length === 0) return null;
  
  return (
    <div className="border-2 border-black p-4 mt-4 neo-shadow">
      <h3 className="font-bold text-lg mb-3">Top Bids</h3>
      <div className="space-y-2">
        {offers.map(offer => (
          <div 
            key={offer.id} 
            className="flex justify-between items-center border-b border-gray-200 pb-2"
          >
            <div className="flex items-center">
              <span className="text-base font-semibold">{offer.buyerName}</span>
              {offer.isReal && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Verified Offer
                </span>
              )}
            </div>
            <span className="font-bold">{formatCurrency(offer.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyOffers;

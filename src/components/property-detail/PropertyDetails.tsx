
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface PropertyDetailsProps {
  afterRepairValue?: number;
  estimatedRehab?: number;
  propertyType?: string;
  yearBuilt?: string;
  lotSize?: string;
  parking?: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ 
  afterRepairValue, 
  estimatedRehab,
  propertyType = "Single Family",
  yearBuilt = "2005",
  lotSize = "0.25 acres",
  parking = "2-Car Garage"
}) => {
  return (
    <div className="layer-2 h-full border border-white/20 shadow-lg p-4 sm:p-6 rounded-xl perspective-container">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">The Numbers</h2>
      
      <div className="space-y-4 text-sm sm:text-base">
        <div className="flex justify-between layer-1 p-2 rounded-lg backdrop-blur-sm border border-white/30 shadow-sm">
          <span className="font-bold text-black">Property Type:</span>
          <span className="text-black">{propertyType}</span>
        </div>
        <div className="flex justify-between layer-1 p-2 rounded-lg backdrop-blur-sm border border-white/30 shadow-sm">
          <span className="font-bold text-black">Year Built:</span>
          <span className="text-black">{yearBuilt}</span>
        </div>
        <div className="flex justify-between layer-1 p-2 rounded-lg backdrop-blur-sm border border-white/30 shadow-sm">
          <span className="font-bold text-black">Lot Size:</span>
          <span className="text-black">{lotSize}</span>
        </div>
        <div className="flex justify-between layer-1 p-2 rounded-lg backdrop-blur-sm border border-white/30 shadow-sm">
          <span className="font-bold text-black">Parking:</span>
          <span className="text-black">{parking}</span>
        </div>
        
        {afterRepairValue !== undefined && (
          <div className="flex justify-between layer-3 p-3 rounded-lg backdrop-blur-md border border-white/40 shadow-md">
            <span className="font-bold text-black">ARV:</span>
            <span className="rainbow-text">{formatCurrency(afterRepairValue)}</span>
          </div>
        )}
        
        {estimatedRehab !== undefined && (
          <div className="flex justify-between layer-3 p-3 rounded-lg backdrop-blur-md border border-white/40 shadow-md">
            <span className="font-bold text-black">Est. Rehab Cost:</span>
            <span className="rainbow-text">{formatCurrency(estimatedRehab)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;

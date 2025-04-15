
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
    <div className="glass-card-3d h-full backdrop-blur-lg border border-white/20 shadow-xl p-4 sm:p-6 rounded-xl perspective-container hover-property-card">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 purple-text layer-1">The Numbers</h2>
      
      <div className="space-y-4 text-sm sm:text-base">
        <div className="flex justify-between bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/20 shadow-md layer-2">
          <span className="font-bold">Property Type:</span>
          <span>{propertyType}</span>
        </div>
        <div className="flex justify-between bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/20 shadow-md layer-2">
          <span className="font-bold">Year Built:</span>
          <span>{yearBuilt}</span>
        </div>
        <div className="flex justify-between bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/20 shadow-md layer-2">
          <span className="font-bold">Lot Size:</span>
          <span>{lotSize}</span>
        </div>
        <div className="flex justify-between bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/20 shadow-md layer-2">
          <span className="font-bold">Parking:</span>
          <span>{parking}</span>
        </div>
        
        {afterRepairValue !== undefined && (
          <div className="flex justify-between bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/20 shadow-md layer-3">
            <span className="font-bold">ARV:</span>
            <span className="purple-text">{formatCurrency(afterRepairValue)}</span>
          </div>
        )}
        
        {estimatedRehab !== undefined && (
          <div className="flex justify-between bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/20 shadow-md layer-3">
            <span className="font-bold">Est. Rehab Cost:</span>
            <span className="purple-text">{formatCurrency(estimatedRehab)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;

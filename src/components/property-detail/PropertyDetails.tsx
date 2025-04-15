
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
    <div className="glass-card shadow-lg p-4 sm:p-6 transform transition-all duration-300 perspective-container">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 apple-glow-text-small inline-block px-3 py-1 rounded-lg">The Numbers</h2>
      
      <div className="space-y-4 text-sm sm:text-base mt-4">
        <div className="flex justify-between">
          <span className="font-bold">Property Type:</span>
          <span>{propertyType}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Year Built:</span>
          <span>{yearBuilt}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Lot Size:</span>
          <span>{lotSize}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Parking:</span>
          <span>{parking}</span>
        </div>
        
        {afterRepairValue !== undefined && (
          <div className="flex justify-between p-2 glass-card mt-2 layer-1">
            <span className="font-bold">ARV:</span>
            <span>{formatCurrency(afterRepairValue)}</span>
          </div>
        )}
        
        {estimatedRehab !== undefined && (
          <div className="flex justify-between p-2 glass-card mt-2 layer-1">
            <span className="font-bold">Est. Rehab Cost:</span>
            <span>{formatCurrency(estimatedRehab)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;

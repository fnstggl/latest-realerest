
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
    <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="text-2xl font-bold mb-4">Property Details</h2>
      
      <div className="space-y-4">
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
          <div className="flex justify-between">
            <span className="font-bold">ARV:</span>
            <span>{formatCurrency(afterRepairValue)}</span>
          </div>
        )}
        
        {estimatedRehab !== undefined && (
          <div className="flex justify-between">
            <span className="font-bold">Est. Rehab Cost:</span>
            <span>{formatCurrency(estimatedRehab)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;

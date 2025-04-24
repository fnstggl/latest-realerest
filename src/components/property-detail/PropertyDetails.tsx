
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
  afterRepairValue = 0,
  estimatedRehab = 0,
  propertyType = "Single Family",
  yearBuilt = "2005",
  lotSize = "0.25 acres",
  parking = "2-Car Garage"
}) => {
  return (
    <div className="h-full border border-white/40 shadow-lg p-4 sm:p-6 rounded-xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">Property Details</h2>
      
      <div className="space-y-4 text-sm sm:text-base">
        <div className="flex justify-between p-2 rounded-lg backdrop-blur-sm border border-white/40 shadow-sm">
          <span className="font-bold text-black">Property Type:</span>
          <span className="text-black">{propertyType}</span>
        </div>
        <div className="flex justify-between p-2 rounded-lg backdrop-blur-sm border border-white/40 shadow-sm">
          <span className="font-bold text-black">Year Built:</span>
          <span className="text-black">{yearBuilt}</span>
        </div>
        <div className="flex justify-between p-2 rounded-lg backdrop-blur-sm border border-white/40 shadow-sm">
          <span className="font-bold text-black">Lot Size:</span>
          <span className="text-black">{lotSize}</span>
        </div>
        <div className="flex justify-between p-2 rounded-lg backdrop-blur-sm border border-white/40 shadow-sm">
          <span className="font-bold text-black">Parking:</span>
          <span className="text-black">{parking}</span>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex flex-col p-2 rounded-lg backdrop-blur-sm border border-white/40 shadow-sm">
            <span className="text-xs text-gray-600">After Repair Value</span>
            <span className="font-bold text-black">{formatCurrency(afterRepairValue)}</span>
          </div>
          <div className="flex flex-col p-2 rounded-lg backdrop-blur-sm border border-white/40 shadow-sm">
            <span className="text-xs text-gray-600">Est. Rehab Cost</span>
            <span className="font-bold text-black">{formatCurrency(estimatedRehab)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

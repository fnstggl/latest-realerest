
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface PropertyDetailsProps {
  afterRepairValue?: number;
  estimatedRehab?: number;
  propertyType?: string;
  yearBuilt?: number;
  lotSize?: number;
  parking?: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  afterRepairValue,
  estimatedRehab,
  propertyType,
  yearBuilt,
  lotSize,
  parking
}) => {
  if (!afterRepairValue && !estimatedRehab && !propertyType && !yearBuilt && !lotSize && !parking) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-4">Property Details</h3>
      
      <div className="grid grid-cols-2 gap-y-4">
        {propertyType && (
          <div>
            <div className="text-sm text-gray-500">Property Type</div>
            <div className="font-medium">{propertyType}</div>
          </div>
        )}
        
        {yearBuilt && (
          <div>
            <div className="text-sm text-gray-500">Year Built</div>
            <div className="font-medium">{yearBuilt}</div>
          </div>
        )}
        
        {lotSize && (
          <div>
            <div className="text-sm text-gray-500">Lot Size</div>
            <div className="font-medium">
              {lotSize.toLocaleString()} sqft
            </div>
          </div>
        )}
        
        {parking && (
          <div>
            <div className="text-sm text-gray-500">Parking</div>
            <div className="font-medium">{parking}</div>
          </div>
        )}
        
        {afterRepairValue && (
          <div>
            <div className="text-sm text-gray-500">After Repair Value (ARV)</div>
            <div className="font-medium text-green-600">
              {formatCurrency(afterRepairValue)}
            </div>
          </div>
        )}
        
        {estimatedRehab && (
          <div>
            <div className="text-sm text-gray-500">Estimated Rehab</div>
            <div className="font-medium">
              {formatCurrency(estimatedRehab)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;

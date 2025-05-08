
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface PropertyDetailsProps {
  afterRepairValue?: number;
  estimatedRehab?: number;
  propertyType?: string;
  yearBuilt?: number | null;
  lotSize?: number | null;
  parking?: string | null;
  additionalImages?: string | null;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  afterRepairValue,
  estimatedRehab,
  propertyType,
  yearBuilt,
  lotSize,
  parking,
  additionalImages
}) => {
  if (!afterRepairValue && !estimatedRehab && !propertyType && !yearBuilt && !lotSize && !parking && !additionalImages) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
      <h2 className="text-xl font-bold mb-4 text-black">Property Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {afterRepairValue !== undefined && (
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-gray-600">After Repair Value:</span>
            <span className="font-bold text-black">{formatCurrency(afterRepairValue)}</span>
          </div>
        )}
        {estimatedRehab !== undefined && (
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-gray-600">Estimated Rehab Cost:</span>
            <span className="font-bold text-black">{formatCurrency(estimatedRehab)}</span>
          </div>
        )}
        {propertyType && (
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-gray-600">Property Type:</span>
            <span className="font-bold text-black">{propertyType}</span>
          </div>
        )}
        {yearBuilt !== undefined && yearBuilt !== null && (
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-gray-600">Year Built:</span>
            <span className="font-bold text-black">{yearBuilt}</span>
          </div>
        )}
        {lotSize !== undefined && lotSize !== null && (
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-gray-600">Lot Size:</span>
            <span className="font-bold text-black">{lotSize} sqft</span>
          </div>
        )}
        {parking !== undefined && parking !== null && (
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-gray-600">Parking:</span>
            <span className="font-bold text-black">{parking}</span>
          </div>
        )}
      </div>
      
      {additionalImages && (
        <div className="mt-6">
          <a 
            href={additionalImages}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={18} className="mr-2" />
            <span className="text-gray-800">View Additional Images</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;

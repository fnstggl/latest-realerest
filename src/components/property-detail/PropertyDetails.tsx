
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface PropertyDetailsProps {
  afterRepairValue?: number;
  estimatedRehab?: number;
  propertyType?: string;
  additionalImages?: string | null;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  afterRepairValue,
  estimatedRehab,
  propertyType,
  additionalImages
}) => {
  if (!afterRepairValue && !estimatedRehab && !propertyType && !additionalImages) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
      <h2 className="text-xl font-polysans font-bold mb-4 text-[#01204b]">Property Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {afterRepairValue !== undefined && (
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-gray-600 font-polysans-semibold">After Repair Value:</span>
            <span className="font-polysans font-bold text-[#01204b]">{formatCurrency(afterRepairValue)}</span>
          </div>
        )}
        {estimatedRehab !== undefined && (
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-gray-600 font-polysans-semibold">Estimated Rehab Cost:</span>
            <span className="font-polysans font-bold text-[#01204b]">{formatCurrency(estimatedRehab)}</span>
          </div>
        )}
        {propertyType && (
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-gray-600 font-polysans-semibold">Property Type:</span>
            <span className="font-polysans font-bold text-[#01204b]">{propertyType}</span>
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
            <span className="text-gray-800 font-polysans">View Additional Images</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;

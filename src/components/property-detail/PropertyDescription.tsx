import React from 'react';
import { ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import PropertyDetails from './PropertyDetails';

interface PropertyDescriptionProps {
  description?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  belowMarket?: number;
  comparables?: string[];
  afterRepairValue?: number;
  estimatedRehab?: number;
  propertyType?: string;
  additionalImagesLink?: string | null;
}

const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description,
  beds,
  baths,
  sqft,
  belowMarket,
  comparables,
  afterRepairValue,
  estimatedRehab,
  propertyType,
  additionalImagesLink
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-polysans font-bold mb-4 text-[#01204b]">Property Description</h2>
        <p className="text-gray-700 leading-relaxed mb-6 font-polysans-semibold text-[#01204b]">
          {description || `Beautiful ${beds} bedroom, ${baths} bathroom property with ${sqft?.toLocaleString()} square feet of living space. This property is priced below market value, offering excellent investment potential.`}
        </p>
        
        {/* Removed ARV, Est Rehab and Property Type for mobile - keeping only on desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold mb-3 text-[#01204b]">Property Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Bedrooms:</span>
                <span className="font-medium text-[#01204b]">{beds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bathrooms:</span>
                <span className="font-medium text-[#01204b]">{baths}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Square Feet:</span>
                <span className="font-medium text-[#01204b]">{sqft?.toLocaleString()}</span>
              </div>
              {propertyType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium text-[#01204b]">{propertyType}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-[#01204b]">Investment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Below Market:</span>
                <span className="font-medium text-green-600">{belowMarket?.toFixed(1)}%</span>
              </div>
              {afterRepairValue && (
                <div className="flex justify-between">
                  <span className="text-gray-600">After Repair Value:</span>
                  <span className="font-medium text-[#01204b]">{formatCurrency(afterRepairValue)}</span>
                </div>
              )}
              {estimatedRehab && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Rehab Cost:</span>
                  <span className="font-medium text-[#01204b]">{formatCurrency(estimatedRehab)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile version - removed ARV, Est Rehab, Property Type */}
        <div className="md:hidden space-y-4 mb-6">
          <div>
            <h3 className="font-semibold mb-3 text-[#01204b]">Property Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Bedrooms:</span>
                <span className="font-medium text-[#01204b]">{beds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bathrooms:</span>
                <span className="font-medium text-[#01204b]">{baths}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Square Feet:</span>
                <span className="font-medium text-[#01204b]">{sqft?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Below Market:</span>
                <span className="font-medium text-green-600">{belowMarket?.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {comparables && comparables.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3 text-[#01204b]">Comparable Properties</h3>
            <div className="space-y-2">
              {comparables.map((address, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm text-[#01204b]">
                  {address}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PropertyDetails
        afterRepairValue={afterRepairValue}
        estimatedRehab={estimatedRehab}
        propertyType={propertyType}
        additionalImages={additionalImagesLink}
      />
    </div>
  );
};

export default PropertyDescription;

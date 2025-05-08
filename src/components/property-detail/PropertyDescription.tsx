import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
interface PropertyDescriptionProps {
  description?: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  comparables?: string[];
  afterRepairValue?: number;
  estimatedRehab?: number;
  propertyType?: string;
  yearBuilt?: number | null;
  lotSize?: number | null;
  parking?: string | null;
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
  yearBuilt,
  lotSize,
  parking,
  additionalImagesLink
}) => {
  const defaultDescription = `This beautiful property offers great value at ${belowMarket}% below market price. 
  With ${beds} bedrooms and ${baths} bathrooms across ${sqft.toLocaleString()} square feet, 
  it's perfect for families looking for their dream home.
  
  Located in a desirable neighborhood, this property won't last long at this price!`;
  const hasPropertyDetails = afterRepairValue !== undefined || estimatedRehab !== undefined || propertyType || yearBuilt !== undefined || lotSize !== undefined || parking !== undefined;
  return <div className="p-4 sm:p-6 rounded-xl bg-white my-0">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">Property Description</h2>
      <p className="whitespace-pre-line text-sm sm:text-base p-4 bg-white rounded-lg text-black">
        {description || defaultDescription}
      </p>
      
      {hasPropertyDetails && <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg">
            {afterRepairValue !== undefined && <div className="flex justify-between p-3 border rounded-lg bg-white">
                <span className="text-gray-600">After Repair Value:</span>
                <span className="font-bold text-black">{formatCurrency(afterRepairValue)}</span>
              </div>}
            {estimatedRehab !== undefined && <div className="flex justify-between p-3 border rounded-lg bg-white">
                <span className="text-gray-600">Estimated Rehab Cost:</span>
                <span className="font-bold text-black">{formatCurrency(estimatedRehab)}</span>
              </div>}
            {propertyType && <div className="flex justify-between p-3 border rounded-lg bg-white">
                <span className="text-gray-600">Property Type:</span>
                <span className="font-bold text-black">{propertyType}</span>
              </div>}
            {yearBuilt !== undefined && yearBuilt !== null && <div className="flex justify-between p-3 border rounded-lg bg-white">
                <span className="text-gray-600">Year Built:</span>
                <span className="font-bold text-black">{yearBuilt}</span>
              </div>}
            {lotSize !== undefined && lotSize !== null && <div className="flex justify-between p-3 border rounded-lg bg-white">
                <span className="text-gray-600">Lot Size:</span>
                <span className="font-bold text-black">{lotSize} sqft</span>
              </div>}
            {parking !== undefined && parking !== null && <div className="flex justify-between p-3 border rounded-lg bg-white">
                <span className="text-gray-600">Parking:</span>
                <span className="font-bold text-black">{parking}</span>
              </div>}
          </div>
        </div>}
      
      {comparables && comparables.length > 0 && <div className="mt-6 p-4 bg-white rounded-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-black inline-block px-3 py-1">Comparable Properties</h3>
          <ul className="list-disc pl-5 text-sm sm:text-base mt-4 space-y-2 text-black">
            {comparables.map((address, index) => <li key={index} className="mb-1 break-words p-2 bg-white rounded-md">{address}</li>)}
          </ul>
        </div>}
      
      {additionalImagesLink && <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2 text-black">Additional Images</h3>
          <a href={additionalImagesLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-black hover:text-black transition-colors">
            <ExternalLink size={16} className="mr-1" />
            View more images
          </a>
        </div>}
    </div>;
};
export default PropertyDescription;
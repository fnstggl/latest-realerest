
import React from 'react';

interface PropertyDescriptionProps {
  description?: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  comparables?: string[];
}

const PropertyDescription: React.FC<PropertyDescriptionProps> = ({ 
  description, 
  beds, 
  baths, 
  sqft, 
  belowMarket,
  comparables
}) => {
  const defaultDescription = `This beautiful property offers great value at ${belowMarket}% below market price. 
  With ${beds} bedrooms and ${baths} bathrooms across ${sqft.toLocaleString()} square feet, 
  it's perfect for families looking for their dream home.
  
  Located in a desirable neighborhood, this property won't last long at this price!`;

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-white">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">Property Description</h2>
      <p className="whitespace-pre-line text-sm sm:text-base p-4 bg-[#FCFBF8] rounded-lg text-black">
        {description || defaultDescription}
      </p>
      
      {comparables && comparables.length > 0 && (
        <div className="mt-6 p-4 bg-[#FCFBF8] rounded-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-black inline-block px-3 py-1">Comparable Properties</h3>
          <ul className="list-disc pl-5 text-sm sm:text-base mt-4 space-y-2 text-black">
            {comparables.map((address, index) => (
              <li key={index} className="mb-1 break-words p-2 bg-white rounded-md">{address}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PropertyDescription;



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
    <div className="layer-2 border border-white/20 shadow-lg p-4 sm:p-6 transform transition-all duration-300 perspective-container rounded-xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">Property Description</h2>
      <p className="whitespace-pre-line text-sm sm:text-base layer-1 p-4 rounded-lg backdrop-blur-sm border border-white/30 shadow-sm text-black">
        {description || defaultDescription}
      </p>
      
      {comparables && comparables.length > 0 && (
        <div className="mt-6 layer-1 p-4 rounded-lg backdrop-blur-sm border border-white/30 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold mb-2 rainbow-text inline-block px-3 py-1 rounded-lg layer-3 backdrop-blur-md border border-white/30 shadow-lg">Comparable Properties</h3>
          <ul className="list-disc pl-5 text-sm sm:text-base mt-4 space-y-2 text-black">
            {comparables.map((address, index) => (
              <li key={index} className="mb-1 break-words layer-1 p-2 backdrop-blur-sm border border-white/30 shadow-sm rounded-md">{address}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PropertyDescription;

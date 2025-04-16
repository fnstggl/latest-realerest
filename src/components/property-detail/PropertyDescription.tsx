
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
    <div className="glass-card backdrop-blur-lg border border-white/30 shadow-lg p-4 sm:p-6 transform transition-all duration-300 perspective-container property-card-glow layer-1">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 rainbow-text layer-1">Property Description</h2>
      <p className="whitespace-pre-line text-sm sm:text-base glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-2">
        {description || defaultDescription}
      </p>
      
      {comparables && comparables.length > 0 && (
        <div className="mt-6 glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-2">
          <h3 className="text-lg sm:text-xl font-bold mb-2 rainbow-text inline-block px-3 py-1 rounded-lg glass backdrop-blur-md border border-white/30 shadow-lg layer-3">Comparable Properties</h3>
          <ul className="list-disc pl-5 text-sm sm:text-base mt-4 space-y-2">
            {comparables.map((address, index) => (
              <li key={index} className="mb-1 break-words glass-card p-2 backdrop-blur-sm border border-white/20 shadow-sm rounded-md layer-3">{address}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PropertyDescription;

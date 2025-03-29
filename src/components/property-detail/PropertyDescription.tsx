
import React from 'react';

interface PropertyDescriptionProps {
  description?: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
}

const PropertyDescription: React.FC<PropertyDescriptionProps> = ({ 
  description, 
  beds, 
  baths, 
  sqft, 
  belowMarket 
}) => {
  const defaultDescription = `This beautiful property offers great value at ${belowMarket}% below market price. 
  With ${beds} bedrooms and ${baths} bathrooms across ${sqft.toLocaleString()} square feet, 
  it's perfect for families looking for their dream home.
  
  Located in a desirable neighborhood, this property won't last long at this price!`;

  return (
    <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="text-2xl font-bold mb-4">Property Description</h2>
      <p className="whitespace-pre-line">
        {description || defaultDescription}
      </p>
    </div>
  );
};

export default PropertyDescription;

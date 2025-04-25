
import React from 'react';

export interface PropertyDescriptionProps {
  description: string;
  beds?: number; // Make these properties optional
  baths?: number;
  sqft?: number;
  belowMarket?: number;
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({ 
  description,
  beds = 0,
  baths = 0,
  sqft = 0,
  belowMarket = 0
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Description</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{description}</p>
    </div>
  );
};

export default PropertyDescription;

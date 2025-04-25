
import React from 'react';
import { 
  Home, 
  Bed, 
  Bath, 
  Ruler, 
  Calendar, 
  Tag, 
  TrendingUp, 
  Wrench 
} from 'lucide-react';

export interface PropertyDetailsProps {
  beds?: number; // Make all these fields optional with default values
  baths?: number;
  sqft?: number;
  propertyType?: string;
  afterRepairValue?: number;
  estimatedRehab?: number;
  yearBuilt?: number;
  lotSize?: string;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  beds = 0,
  baths = 0,
  sqft = 0,
  propertyType = 'House',
  afterRepairValue = 0,
  estimatedRehab = 0,
  yearBuilt,
  lotSize
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Property Details</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
          <Bed className="w-5 h-5 text-gray-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Beds</p>
            <p className="font-medium">{beds}</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
          <Bath className="w-5 h-5 text-gray-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Baths</p>
            <p className="font-medium">{baths}</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
          <Ruler className="w-5 h-5 text-gray-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Sq Ft</p>
            <p className="font-medium">{sqft.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
          <Home className="w-5 h-5 text-gray-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Property Type</p>
            <p className="font-medium">{propertyType}</p>
          </div>
        </div>
        
        {yearBuilt && (
          <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
            <Calendar className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Year Built</p>
              <p className="font-medium">{yearBuilt}</p>
            </div>
          </div>
        )}
        
        {lotSize && (
          <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
            <Tag className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Lot Size</p>
              <p className="font-medium">{lotSize}</p>
            </div>
          </div>
        )}
        
        {afterRepairValue > 0 && (
          <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
            <TrendingUp className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">After Repair Value</p>
              <p className="font-medium">${afterRepairValue.toLocaleString()}</p>
            </div>
          </div>
        )}
        
        {estimatedRehab > 0 && (
          <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
            <Wrench className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Est. Rehab Cost</p>
              <p className="font-medium">${estimatedRehab.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;

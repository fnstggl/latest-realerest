import React from 'react';
import { formatCurrency } from '@/lib/utils';
interface PropertyDetailsProps {
  afterRepairValue?: number;
  estimatedRehab?: number;
  propertyType?: string;
  yearBuilt?: number;
  lotSize?: number;
  parking?: string;
}
const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  afterRepairValue,
  estimatedRehab,
  propertyType,
  yearBuilt,
  lotSize,
  parking
}) => {
  if (!afterRepairValue && !estimatedRehab && !propertyType && !yearBuilt && !lotSize && !parking) {
    return null;
  }
  return;
};
export default PropertyDetails;
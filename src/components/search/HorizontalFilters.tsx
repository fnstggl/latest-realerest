
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Home, Bed, Bath, DollarSign } from 'lucide-react';

interface HorizontalFiltersProps {
  onFilterChange: (filters: any) => void;
  isFiltersCollapsed: boolean;
  setIsFiltersCollapsed: (collapsed: boolean) => void;
}

const HorizontalFilters: React.FC<HorizontalFiltersProps> = ({
  onFilterChange,
  isFiltersCollapsed,
  setIsFiltersCollapsed
}) => {
  const priceRanges = [
    { label: 'Any', value: [0, 5000000] },
    { label: 'Under $100k', value: [0, 100000] },
    { label: '$100k-$250k', value: [100000, 250000] },
    { label: '$250k-$500k', value: [250000, 500000] },
    { label: '$500k-$1M', value: [500000, 1000000] },
    { label: 'Over $1M', value: [1000000, 5000000] },
  ];
  
  const bedOptions = [
    { label: 'Any', value: '0' },
    { label: '1+', value: '1' },
    { label: '2+', value: '2' },
    { label: '3+', value: '3' },
    { label: '4+', value: '4' },
    { label: '5+', value: '5' },
  ];
  
  const bathOptions = [
    { label: 'Any', value: '0' },
    { label: '1+', value: '1' },
    { label: '2+', value: '2' },
    { label: '3+', value: '3' },
    { label: '4+', value: '4' },
  ];
  
  const propertyTypes = [
    { label: 'Any', value: 'any' },
    { label: 'House', value: 'house' },
    { label: 'Condo', value: 'condo' },
    { label: 'Townhouse', value: 'townhouse' },
    { label: 'Multi-family', value: 'multi-family' },
  ];
  
  const handlePriceClick = (range: number[]) => {
    onFilterChange({
      minPrice: range[0],
      maxPrice: range[1],
      bedrooms: '0',
      bathrooms: '0',
      propertyType: 'any',
      belowMarket: 0
    });
  };
  
  const handleBedsClick = (beds: string) => {
    onFilterChange({
      minPrice: 0,
      maxPrice: 5000000,
      bedrooms: beds,
      bathrooms: '0',
      propertyType: 'any',
      belowMarket: 0
    });
  };
  
  const handleBathsClick = (baths: string) => {
    onFilterChange({
      minPrice: 0,
      maxPrice: 5000000,
      bedrooms: '0',
      bathrooms: baths,
      propertyType: 'any',
      belowMarket: 0
    });
  };
  
  const handleTypeClick = (type: string) => {
    onFilterChange({
      minPrice: 0,
      maxPrice: 5000000,
      bedrooms: '0',
      bathrooms: '0',
      propertyType: type,
      belowMarket: 0
    });
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {/* Price Filter */}
      <div className="relative group">
        <Button variant="outline" className="flex items-center">
          <DollarSign size={16} className="mr-1" /> Price
          <ChevronDown size={14} className="ml-1" />
        </Button>
        <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 p-2 w-48 hidden group-hover:block">
          {priceRanges.map((range) => (
            <Button
              key={range.label}
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => handlePriceClick(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Beds Filter */}
      <div className="relative group">
        <Button variant="outline" className="flex items-center">
          <Bed size={16} className="mr-1" /> Beds
          <ChevronDown size={14} className="ml-1" />
        </Button>
        <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 p-2 w-32 hidden group-hover:block">
          {bedOptions.map((option) => (
            <Button
              key={option.label}
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => handleBedsClick(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Baths Filter */}
      <div className="relative group">
        <Button variant="outline" className="flex items-center">
          <Bath size={16} className="mr-1" /> Baths
          <ChevronDown size={14} className="ml-1" />
        </Button>
        <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 p-2 w-32 hidden group-hover:block">
          {bathOptions.map((option) => (
            <Button
              key={option.label}
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => handleBathsClick(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Property Type Filter */}
      <div className="relative group">
        <Button variant="outline" className="flex items-center">
          <Home size={16} className="mr-1" /> Property Type
          <ChevronDown size={14} className="ml-1" />
        </Button>
        <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 p-2 w-40 hidden group-hover:block">
          {propertyTypes.map((type) => (
            <Button
              key={type.label}
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => handleTypeClick(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalFilters;

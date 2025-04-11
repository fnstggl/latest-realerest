import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  propertyType: string;
  priceRange: [number, number];
  bedrooms: string;
  bathrooms: string;
  belowMarket: number;
}

const PropertyFilters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "any",
    priceRange: [100000, 1000000],
    bedrooms: "any",
    bathrooms: "any",
    belowMarket: 0,
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-6 neo-container">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Property Type</h3>
          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-2">
            {["Any", "House", "Apartment", "Condo", "Duplex"].map((type) => (
              <Button
                key={type}
                variant={filters.propertyType === type.toLowerCase() ? "default" : "outline"}
                className={filters.propertyType === type.toLowerCase() 
                  ? "neo-button-primary" 
                  : "neo-button"}
                onClick={() => handleFilterChange("propertyType", type.toLowerCase())}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Price Range</h3>
          <div className="mt-2 px-2">
            <Slider
              defaultValue={[100000, 1000000]}
              min={0}
              max={2000000}
              step={10000}
              onValueChange={(value) => handleFilterChange("priceRange", value)}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <div>${filters.priceRange[0].toLocaleString()}</div>
              <div>${filters.priceRange[1].toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Below Market Value</h3>
          <div className="px-2">
            <Slider
              defaultValue={[0]}
              min={0}
              max={50}
              step={5}
              onValueChange={(value) => handleFilterChange("belowMarket", value[0])}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <div>0%</div>
              <div>At least {filters.belowMarket}% below</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-semibold mb-2">Bedrooms</h3>
            <Select
              value={filters.bedrooms}
              onValueChange={(value) => handleFilterChange("bedrooms", value)}
            >
              <SelectTrigger className="neo-input">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">Bathrooms</h3>
            <Select
              value={filters.bathrooms}
              onValueChange={(value) => handleFilterChange("bathrooms", value)}
            >
              <SelectTrigger className="neo-input">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={() => {
            setFilters({
              propertyType: "any",
              priceRange: [100000, 1000000],
              bedrooms: "any",
              bathrooms: "any",
              belowMarket: 0,
            });
            onFilterChange({
              propertyType: "any",
              priceRange: [100000, 1000000],
              bedrooms: "any",
              bathrooms: "any",
              belowMarket: 0,
            });
          }}
          variant="link"
          className="w-full text-primary neo-button-primary"
        >
          Reset Filters
        </Button>
        
        <Button
          onClick={() => onFilterChange(filters)}
          className="w-full neo-button-primary"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;

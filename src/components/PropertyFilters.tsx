import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  belowMarket: number;
}

const PropertyFilters: React.FC<FiltersProps> = ({
  onFilterChange
}) => {
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "any",
    minPrice: 100000,
    maxPrice: 1000000,
    bedrooms: "any",
    bathrooms: "any",
    belowMarket: 0
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const priceOptions = [
    5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
    100000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000
  ];

  const belowMarketOptions = Array.from({ length: 21 }, (_, i) => i * 5);

  return (
    <div className="bg-white p-6 neo-container">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Property Type</h3>
          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-2">
            {["Any", "House", "Apartment", "Condo", "Duplex"].map(type => (
              <Button
                key={type}
                variant="outline"
                className={`relative bg-white hover:bg-white ${
                  filters.propertyType === type.toLowerCase()
                    ? "border-transparent"
                    : "hover:border-transparent"
                }`}
                onClick={() => handleFilterChange("propertyType", type.toLowerCase())}
              >
                <span className="relative z-10">{type}</span>
                {filters.propertyType === type.toLowerCase() && (
                  <span
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      padding: '1px',
                      background: 'linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude'
                    }}
                  />
                )}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Price Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select 
                value={filters.minPrice.toString()} 
                onValueChange={(value) => handleFilterChange("minPrice", parseInt(value))}
              >
                <SelectTrigger className="neo-input relative">
                  <SelectValue placeholder="Min Price" />
                </SelectTrigger>
                <SelectContent>
                  {priceOptions.map((price) => (
                    <SelectItem 
                      key={price} 
                      value={price.toString()}
                      className={`relative ${
                        filters.minPrice === price ? "border-transparent" : ""
                      }`}
                    >
                      ${price.toLocaleString()}
                      {filters.minPrice === price && (
                        <span
                          className="absolute inset-0 rounded-lg pointer-events-none"
                          style={{
                            padding: '1px',
                            background: 'linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude'
                          }}
                        />
                      )}
                    </SelectItem>
                  ))}
                  <SelectItem value="2000001">$2,000,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select 
                value={filters.maxPrice.toString()} 
                onValueChange={(value) => handleFilterChange("maxPrice", parseInt(value))}
              >
                <SelectTrigger className="neo-input relative">
                  <SelectValue placeholder="Max Price" />
                </SelectTrigger>
                <SelectContent>
                  {priceOptions.map((price) => (
                    <SelectItem 
                      key={price} 
                      value={price.toString()}
                      className={`relative ${
                        filters.maxPrice === price ? "border-transparent" : ""
                      }`}
                    >
                      ${price.toLocaleString()}
                      {filters.maxPrice === price && (
                        <span
                          className="absolute inset-0 rounded-lg pointer-events-none"
                          style={{
                            padding: '1px',
                            background: 'linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude'
                          }}
                        />
                      )}
                    </SelectItem>
                  ))}
                  <SelectItem value="2000001">$2,000,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Below Market Value</h3>
          <Select 
            value={filters.belowMarket.toString()} 
            onValueChange={(value) => handleFilterChange("belowMarket", parseInt(value))}
          >
            <SelectTrigger className="neo-input relative">
              <SelectValue placeholder="Select discount" />
            </SelectTrigger>
            <SelectContent>
              {belowMarketOptions.map((percentage) => (
                <SelectItem 
                  key={percentage} 
                  value={percentage.toString()}
                  className={`relative ${
                    filters.belowMarket === percentage ? "border-transparent" : ""
                  }`}
                >
                  {percentage}% below market
                  {filters.belowMarket === percentage && (
                    <span
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        padding: '1px',
                        background: 'linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude'
                      }}
                    />
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-semibold mb-2">Bedrooms</h3>
            <Select value={filters.bedrooms} onValueChange={value => handleFilterChange("bedrooms", value)}>
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
            <Select value={filters.bathrooms} onValueChange={value => handleFilterChange("bathrooms", value)}>
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

        <Button onClick={() => {
          const defaultFilters = {
            propertyType: "any",
            minPrice: 100000,
            maxPrice: 1000000,
            bedrooms: "any",
            bathrooms: "any",
            belowMarket: 0
          };
          setFilters(defaultFilters);
          onFilterChange(defaultFilters);
        }} variant="link" className="w-full neo-button-primary text-black">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;

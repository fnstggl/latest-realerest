
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, DollarSign, Home, Bed, Bath } from "lucide-react";

interface FilterState {
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  belowMarket: number;
}

interface HorizontalFiltersProps {
  onFilterChange: (filters: any) => void;
}

const HorizontalFilters: React.FC<HorizontalFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('price');
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "any",
    minPrice: 0,
    maxPrice: 2000001,
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

  const resetFilters = () => {
    const defaultFilters = {
      propertyType: "any",
      minPrice: 0,
      maxPrice: 2000001,
      bedrooms: "any",
      bathrooms: "any",
      belowMarket: 0
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const priceOptions = [0, 5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000];
  const belowMarketOptions = [0, ...Array.from({ length: 20 }, (_, i) => (i + 1) * 5)];
  const bedroomOptions = ["any", "1", "2", "3", "4", "5", "5+"];
  const bathroomOptions = ["any", "1", "2", "3", "4", "5+"];
  const propertyTypeOptions = ["any", "house", "apartment", "condo", "duplex"];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 10V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 21V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 21V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 16H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Filter
            </div>
            <ChevronDown className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-gray-100">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b">
                <TabsList className="flex w-full bg-transparent p-0">
                  <TabsTrigger 
                    value="price" 
                    className="flex-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none"
                  >
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Price
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="beds-baths" 
                    className="flex-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none"
                  >
                    <span className="flex items-center gap-2">
                      <Bed className="h-5 w-5" />
                      Beds and Baths
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="type" 
                    className="flex-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none"
                  >
                    <span className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Type
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="below-market" 
                    className="flex-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none"
                  >
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Below Market
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="price" className="p-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select 
                        value={filters.minPrice.toString()} 
                        onValueChange={value => handleFilterChange("minPrice", parseInt(value))}
                      >
                        <SelectTrigger className="neo-input">
                          <SelectValue placeholder="Min Price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Any</SelectItem>
                          {priceOptions.slice(1).map(price => (
                            <SelectItem key={price} value={price.toString()}>
                              ${price.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select 
                        value={filters.maxPrice.toString()} 
                        onValueChange={value => handleFilterChange("maxPrice", parseInt(value))}
                      >
                        <SelectTrigger className="neo-input">
                          <SelectValue placeholder="Max Price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2000001">Any</SelectItem>
                          {priceOptions.map(price => (
                            <SelectItem key={price} value={price.toString()}>
                              ${price.toLocaleString()}
                            </SelectItem>
                          ))}
                          <SelectItem value="2000001">$2,000,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="beds-baths" className="p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Bedrooms</h3>
                    <div className="flex flex-wrap gap-2">
                      {bedroomOptions.map(value => (
                        <Button 
                          key={value} 
                          variant={filters.bedrooms === value ? "default" : "outline"} 
                          onClick={() => handleFilterChange("bedrooms", value)}
                          className="px-4 py-2 rounded-full"
                        >
                          {value === "any" ? "Any" : value}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Bathrooms</h3>
                    <div className="flex flex-wrap gap-2">
                      {bathroomOptions.map(value => (
                        <Button 
                          key={value} 
                          variant={filters.bathrooms === value ? "default" : "outline"} 
                          onClick={() => handleFilterChange("bathrooms", value)}
                          className="px-4 py-2 rounded-full"
                        >
                          {value === "any" ? "Any" : value}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="type" className="p-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Property Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypeOptions.map(type => (
                      <Button 
                        key={type} 
                        variant={filters.propertyType === type ? "default" : "outline"} 
                        onClick={() => handleFilterChange("propertyType", type)}
                        className="px-4 py-2 rounded-full"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="below-market" className="p-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Below Market Value</h3>
                  <Select 
                    value={filters.belowMarket.toString()} 
                    onValueChange={value => handleFilterChange("belowMarket", parseInt(value))}
                  >
                    <SelectTrigger className="neo-input">
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                    <SelectContent>
                      {belowMarketOptions.map(percentage => (
                        <SelectItem key={percentage} value={percentage.toString()}>
                          {percentage === 0 ? 'Any' : `${percentage}% below market`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <div className="p-4 border-t border-gray-100 flex justify-between">
              <Button 
                onClick={resetFilters} 
                variant="outline" 
                className="px-8"
              >
                Reset
              </Button>
              <Button 
                onClick={() => setIsOpen(false)} 
                variant="default" 
                className="px-8"
              >
                Find Results
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default HorizontalFilters;

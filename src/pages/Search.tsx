import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import { Button } from "@/components/ui/button";
import { Sliders, Grid, List, ChevronDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock data
const mockProperties = [
  {
    id: "prop1",
    title: "Modern Craftsman Home",
    price: 425000,
    marketPrice: 520000,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=roam-in-color-z3QZ6gjGKOA-unsplash.jpg",
    location: "Portland, OR",
    beds: 3,
    baths: 2,
    sqft: 1850,
    belowMarket: 18,
  },
  {
    id: "prop2",
    title: "Downtown Luxury Condo",
    price: 610000,
    marketPrice: 750000,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=scott-webb-167099-unsplash.jpg",
    location: "Seattle, WA",
    beds: 2,
    baths: 2,
    sqft: 1200,
    belowMarket: 19,
  },
  {
    id: "prop3",
    title: "Renovated Victorian",
    price: 750000,
    marketPrice: 900000,
    image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=todd-kent-178j8tJrNlc-unsplash.jpg",
    location: "San Francisco, CA",
    beds: 4,
    baths: 3,
    sqft: 2400,
    belowMarket: 17,
  },
  {
    id: "prop4",
    title: "Cozy Suburban Ranch",
    price: 320000,
    marketPrice: 380000,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=mike-b-SEZ1yh0I5Oo-unsplash.jpg",
    location: "Denver, CO",
    beds: 3,
    baths: 2,
    sqft: 1650,
    belowMarket: 16,
  },
  {
    id: "prop5",
    title: "Urban Loft Apartment",
    price: 520000,
    marketPrice: 650000,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=jon-nathon-stebbe-payless-images-UUZ-sg0sl_k-unsplash.jpg",
    location: "Chicago, IL",
    beds: 1,
    baths: 1,
    sqft: 950,
    belowMarket: 20,
  },
  {
    id: "prop6",
    title: "Lakefront Cottage",
    price: 485000,
    marketPrice: 580000,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=levi-guzman-1081236-unsplash.jpg",
    location: "Minneapolis, MN",
    beds: 2,
    baths: 1,
    sqft: 1100,
    belowMarket: 16,
  },
];

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [isGridView, setIsGridView] = useState(true);
  const [properties, setProperties] = useState(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [sortOption, setSortOption] = useState("recommended");
  
  // Demo filter function
  const handleFilterChange = (filters: any) => {
    // In a real app, this would fetch from an API
    const filtered = properties.filter(property => {
      // Apply price filter
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }
      
      // Apply below market filter
      if (property.belowMarket < filters.belowMarket) {
        return false;
      }
      
      // Apply property type filter
      if (filters.propertyType !== "any") {
        // This is mock filtering - would need real property type data
        if (filters.propertyType === "house" && !property.title.toLowerCase().includes("home")) {
          return false;
        }
        if (filters.propertyType === "apartment" && !property.title.toLowerCase().includes("apartment")) {
          return false;
        }
        if (filters.propertyType === "condo" && !property.title.toLowerCase().includes("condo")) {
          return false;
        }
      }
      
      // Apply bedrooms filter
      if (filters.bedrooms !== "any") {
        if (property.beds < parseInt(filters.bedrooms)) {
          return false;
        }
      }
      
      // Apply bathrooms filter
      if (filters.bathrooms !== "any") {
        if (property.baths < parseInt(filters.bathrooms)) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredProperties(filtered);
  };
  
  // Demo sort function
  const handleSortChange = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredProperties];
    
    switch (option) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "below-market":
        sorted.sort((a, b) => b.belowMarket - a.belowMarket);
        break;
      case "newest":
        // In a real app, this would sort by date added
        break;
      default:
        // Keep current order for "recommended"
        break;
    }
    
    setFilteredProperties(sorted);
  };
  
  useEffect(() => {
    // This simulates a search filter
    if (searchQuery) {
      const results = mockProperties.filter(property => 
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProperties(results);
      setFilteredProperties(results);
    } else {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
    }
  }, [searchQuery]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="max-w-3xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container px-4 lg:px-8 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-8">
              <PropertyFilters onFilterChange={handleFilterChange} />
            </div>
          </div>
          
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <div className="flex items-center">
                    <Sliders size={18} className="mr-2" />
                    Filters
                  </div>
                  <ChevronDown size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] pt-8">
                <PropertyFilters onFilterChange={handleFilterChange} />
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Results */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-donedeal-navy">
                    {filteredProperties.length} properties
                    {searchQuery ? ` for "${searchQuery}"` : ''}
                  </h1>
                  {filteredProperties.length !== properties.length && (
                    <p className="text-sm text-gray-500">
                      Filtered from {properties.length} total properties
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <select
                    className="flex-1 sm:flex-none border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-donedeal-orange"
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="below-market">Highest Discount</option>
                    <option value="newest">Newest</option>
                  </select>
                  
                  <div className="hidden sm:flex border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-r-none ${isGridView ? 'bg-gray-100' : ''}`}
                      onClick={() => setIsGridView(true)}
                    >
                      <Grid size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-l-none ${!isGridView ? 'bg-gray-100' : ''}`}
                      onClick={() => setIsGridView(false)}
                    >
                      <List size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {filteredProperties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-donedeal-navy mb-2">No properties found</h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                <Button onClick={() => handleFilterChange({
                  propertyType: "any",
                  priceRange: [0, 2000000],
                  bedrooms: "any",
                  bathrooms: "any",
                  belowMarket: 0,
                  furnished: "any",
                })}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className={isGridView 
                ? "grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white py-10 border-t border-gray-200 mt-8">
        <div className="container px-4 lg:px-8 mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} DoneDeal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Search;

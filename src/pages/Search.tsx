import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import { Button } from "@/components/ui/button";
import { Sliders, Grid, List, ChevronDown } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [isGridView, setIsGridView] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState<Listing[]>([]);
  const [sortOption, setSortOption] = useState("recommended");
  const {
    listings: properties,
    loading,
    error
  } = useListings();

  useEffect(() => {
    if (searchQuery) {
      const results = properties.filter(property => 
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProperties(results);
    } else {
      setFilteredProperties(properties);
    }
  }, [properties, searchQuery]);

  const handleFilterChange = (filters: any) => {
    const filtered = properties.filter(property => {
      if (property.price < filters.minPrice || property.price > filters.maxPrice) {
        return false;
      }
      // Changed to minimum below market value check
      if (property.belowMarket < filters.belowMarket) {
        return false;
      }
      if (filters.propertyType !== "any") {
        if (filters.propertyType === "house" && !property.title?.toLowerCase().includes("home")) {
          return false;
        }
        if (filters.propertyType === "apartment" && !property.title?.toLowerCase().includes("apartment")) {
          return false;
        }
        if (filters.propertyType === "condo" && !property.title?.toLowerCase().includes("condo")) {
          return false;
        }
      }
      if (filters.bedrooms !== "any") {
        if (property.beds < parseInt(filters.bedrooms)) {
          return false;
        }
      }
      if (filters.bathrooms !== "any") {
        if (property.baths < parseInt(filters.bathrooms)) {
          return false;
        }
      }
      return true;
    });
    setFilteredProperties(filtered);
  };

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
        break;
      default:
        break;
    }
    setFilteredProperties(sorted);
  };

  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const ITEMS_PER_ROW = isGridView ? (isMobile ? 1 : 3) : 1;

  // Calculate indices for the last full row
  const totalItems = filteredProperties.length;
  const totalFullRows = Math.floor(totalItems / ITEMS_PER_ROW);
  const lastFullRowStartIndex = (totalFullRows - 1) * ITEMS_PER_ROW;
  const lastFullRowEndIndex = lastFullRowStartIndex + ITEMS_PER_ROW;

  // For non-authenticated users, only show up to the last full row
  const visibleProperties = !isAuthenticated 
    ? filteredProperties.slice(0, lastFullRowEndIndex) 
    : filteredProperties;

  const renderPropertyGrid = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="loading-container">
            <div className="pulsing-circle" />
          </div>
        </div>
      );
    }

    if (filteredProperties.length === 0 && searchQuery) {
      const skeletonCount = isMobile ? 1 : 3;
      
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="relative">
              <div className="w-full h-[400px] bg-white rounded-xl overflow-hidden">
                <Skeleton className="w-full h-[200px]" />
                <div className="p-4 space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 z-10">
                <div 
                  className="absolute inset-0 rounded-xl"
                  style={{ 
                    backdropFilter: 'blur(3px)',
                    background: 'linear-gradient(to bottom, transparent 30%, rgba(255, 255, 255, 0.95) 100%)'
                  }}
                />
              </div>
            </div>
          ))}
          
          <div 
            className="absolute z-20" 
            style={{
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              marginTop: 0
            }}
          >
            <Button 
              className="relative bg-white text-black px-8 py-6 rounded-lg shadow-xl font-bold border-2 border-transparent gradient-border-button hover:bg-white/95"
              onClick={() => window.location.href = '/signin'}
            >
              Sign in to view more properties
            </Button>
          </div>
        </div>
      );
    }

    if (filteredProperties.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-xl neo-container">
          <h2 className="text-xl font-semibold mb-2">No properties found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
          <Button 
            onClick={() => handleFilterChange({
              propertyType: "any",
              minPrice: 0,
              maxPrice: 2000000,
              bedrooms: "any",
              bathrooms: "any",
              belowMarket: 0
            })} 
            className="font-bold text-xs sm:text-sm md:text-base shadow-sm backdrop-blur-xl bg-white hover:bg-white text-black relative group overflow-hidden border border-transparent rounded-lg"
          >
            <span className="relative z-10">Reset Filters</span>
            <span 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
              style={{
                background: "transparent",
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                backgroundOrigin: "border-box",
                backgroundClip: "border-box",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                boxShadow: "0 0 25px rgba(217, 70, 239, 0.9), 0 0 45px rgba(108, 66, 245, 0.7), 0 0 65px rgba(255, 92, 0, 0.5), 0 0 85px rgba(255, 60, 172, 0.4)",
                filter: "blur(6px)"
              }}
            />
          </Button>
        </div>
      );
    }

    return (
      <div className={isGridView ? "grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative" : "space-y-6 relative"}>
        {visibleProperties.map((property, index) => (
          <div 
            key={property.id} 
            className={`relative ${index >= lastFullRowStartIndex && !isAuthenticated ? 'pointer-events-none' : ''}`}
          >
            <PropertyCard {...property} />
            
            {/* Apply blur overlay to the last full row when user is not authenticated */}
            {!isAuthenticated && index >= lastFullRowStartIndex && index < lastFullRowEndIndex && (
              <div className="absolute inset-0 z-10">
                <div 
                  className="absolute inset-0 rounded-b-xl"
                  style={{ 
                    backdropFilter: 'blur(3px)',
                    background: 'linear-gradient(to bottom, transparent 30%, rgba(255, 255, 255, 0.95) 100%)'
                  }}
                />
              </div>
            )}
          </div>
        ))}
        
        {/* Sign-in CTA Button */}
        {!isAuthenticated && visibleProperties.length > 0 && lastFullRowStartIndex >= 0 && !searchQuery && (
          <div 
            className="absolute z-20" 
            style={{
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              marginTop: isGridView ? (isMobile ? 3900 : 1100) : 1100
            }}
          >
            <Button 
              className="relative bg-white text-black px-8 py-6 rounded-lg shadow-xl font-bold border-2 border-transparent gradient-border-button hover:bg-white/95"
              onClick={() => window.location.href = '/signin'}
            >
              Sign in to view more properties
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <SearchBar />
      </div>
      
      <div className="container px-4 lg:px-8 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between items-center neo-button">
                  <div className="flex items-center font-semibold">
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
          
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-8">
              <PropertyFilters onFilterChange={handleFilterChange} />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="bg-white rounded-xl p-4 mb-6 neo-container">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="font-editorial font-bold italic text-lg">
                  Below-market homes you can buy today.
                </h1>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <select className="flex-1 sm:flex-none border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary neo-input" value={sortOption} onChange={e => handleSortChange(e.target.value)}>
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="below-market">Highest Discount</option>
                    <option value="newest">Newest</option>
                  </select>
                  
                  <div className="hidden sm:flex border rounded-md neo-border">
                    <Button variant="ghost" size="icon" className={`rounded-r-none ${isGridView ? 'bg-gray-100' : ''}`} onClick={() => setIsGridView(true)}>
                      <Grid size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className={`rounded-l-none ${!isGridView ? 'bg-gray-100' : ''}`} onClick={() => setIsGridView(false)}>
                      <List size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {renderPropertyGrid()}
          </div>
        </div>
      </div>
      
      <footer className="bg-white py-10 border-t border-gray-200 mt-8">
        <div className="container px-4 lg:px-8 mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} DoneDeal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Search;

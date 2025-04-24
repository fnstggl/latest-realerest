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
import { useListings, Listing } from '@/hooks/useListings';
import LocationAlertForm from '@/components/LocationAlertForm';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [isGridView, setIsGridView] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState<Listing[]>([]);
  const [sortOption, setSortOption] = useState("recommended");
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const {
    listings: properties,
    loading,
    error
  } = useListings();
  const [activePropertyType, setActivePropertyType] = useState<string>("any");

  useEffect(() => {
    if (properties.length > 0) {
      let results = [...properties];
      
      if (searchQuery) {
        results = properties.filter(property => 
          property.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      sortProperties(results, sortOption);
    }
  }, [properties, searchQuery]);

  const sortProperties = (propList: Listing[], option: string) => {
    let sorted = [...propList];
    
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

  const handleFilterChange = (filters: any) => {
    setActivePropertyType(filters.propertyType);

    const filtered = properties.filter(property => {
      if (property.price < filters.minPrice || property.price > filters.maxPrice) {
        return false;
      }
      if (property.belowMarket < filters.belowMarket) {
        return false;
      }
      if (filters.propertyType !== "any") {
        if (filters.propertyType === "house" && property.propertyType !== "House") {
          return false;
        }
        if (filters.propertyType === "apartment" && property.propertyType !== "Apartment") {
          return false;
        }
        if (filters.propertyType === "condo" && property.propertyType !== "Condo") {
          return false;
        }
        if (filters.propertyType === "duplex" && property.propertyType !== "Duplex") {
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
    
    sortProperties(filtered, sortOption);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    sortProperties(filteredProperties, option);
  };

  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const ITEMS_PER_ROW = isGridView ? (isMobile ? 1 : 3) : 1;

  const totalItems = filteredProperties.length;
  const totalFullRows = Math.floor(totalItems / ITEMS_PER_ROW);
  const lastFullRowStartIndex = (totalFullRows - 1) * ITEMS_PER_ROW;
  const lastFullRowEndIndex = lastFullRowStartIndex + ITEMS_PER_ROW;

  const visibleProperties = !isAuthenticated && !searchQuery
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

    const showTypeSkeleton =
      (activePropertyType === "condo" ||
        activePropertyType === "apartment" ||
        activePropertyType === "duplex") &&
      filteredProperties.length === 0 &&
      !searchQuery;

    if (showTypeSkeleton) {
      const skeletonCount = isMobile ? 1 : 3;
      return (
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
                      backdropFilter: "blur(3px)",
                      background:
                        "linear-gradient(to bottom, transparent 30%, rgba(255, 255, 255, 0.95) 100%)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div
            className="absolute z-20 flex items-center justify-center w-full h-full pointer-events-none"
            style={{
              top: 0,
              left: 0,
            }}
          >
            <Button
              className="pointer-events-auto relative bg-white text-black px-8 py-6 rounded-lg shadow-xl font-bold border-2 border-transparent gradient-border-button hover:bg-white/95"
              onClick={() => window.location.href = '/signin'}
            >
              Sign in to view more properties
            </Button>
          </div>
        </div>
      );
    }

    if (filteredProperties.length === 0 && searchQuery) {
      if (isAuthenticated) {
        return (
          <div className="w-full">
            <LocationAlertForm />
          </div>
        );
      }

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
            className={`relative ${index >= lastFullRowStartIndex && !isAuthenticated && !searchQuery ? 'pointer-events-none' : ''}`}
          >
            <PropertyCard {...property} />
            
            {!isAuthenticated && !searchQuery && index >= lastFullRowStartIndex && index < lastFullRowEndIndex && (
              <div className="absolute inset-0 z-10">
                <div 
                  className="absolute inset-0 rounded-xl"
                  style={{ 
                    backdropFilter: 'blur(3px)',
                    background: 'linear-gradient(to bottom, transparent 30%, rgba(255, 255, 255, 0.95) 100%)'
                  }}
                />
              </div>
            )}
          </div>
        ))}
        
        {!isAuthenticated && !searchQuery && lastFullRowStartIndex >= 0 && (
          <div 
            className={`absolute z-20 pointer-events-auto transition-all duration-300 ${
              isMobile ? 'w-[90%] left-[5%] bottom-[15%]' : 'left-1/2 -translate-x-1/2'
            }`}
            style={{
              bottom: isMobile ? '15%' : lastFullRowStartIndex >= 3 ? '25%' : '35%'
            }}
          >
            <Button 
              className="relative w-full sm:w-auto bg-white text-black px-8 py-6 rounded-lg shadow-xl font-bold border-2 border-transparent gradient-border-button hover:bg-white/95 cursor-pointer"
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
    <div className="min-h-screen bg-[#FCFBF8] pt-24">
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
          
          <div className={`hidden lg:block transition-all duration-300 ${isFiltersCollapsed ? 'w-12' : 'w-72'} shrink-0`}>
            <div className="sticky top-8">
              <Button 
                variant="ghost" 
                onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                className="mb-4 w-full flex justify-between items-center"
              >
                <span className={isFiltersCollapsed ? 'hidden' : 'block'}>Filters</span>
                <ChevronDown className={`transform transition-transform ${isFiltersCollapsed ? 'rotate-90' : ''}`} />
              </Button>
              <div className={`overflow-hidden transition-all duration-300 ${isFiltersCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
                <PropertyFilters onFilterChange={handleFilterChange} />
              </div>
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
            
            <div className={`grid gap-6 relative ${isFiltersCollapsed ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'}`}>
              {visibleProperties.map((property, index) => (
                <div 
                  key={property.id} 
                  className={`relative ${index >= lastFullRowStartIndex && !isAuthenticated && !searchQuery ? 'pointer-events-none' : ''}`}
                >
                  <PropertyCard {...property} />
                  
                  {!isAuthenticated && !searchQuery && index >= lastFullRowStartIndex && index < lastFullRowEndIndex && (
                    <div className="absolute inset-0 z-10">
                      <div 
                        className="absolute inset-0 rounded-xl"
                        style={{ 
                          backdropFilter: 'blur(3px)',
                          background: 'linear-gradient(to bottom, transparent 30%, rgba(255, 255, 255, 0.95) 100%)'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {!isAuthenticated && !searchQuery && lastFullRowStartIndex >= 0 && (
                <div 
                  className="absolute z-20"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '25%',
                    width: 'auto',
                    pointerEvents: 'auto'
                  }}
                >
                  <Button 
                    className="relative bg-white text-black px-8 py-6 rounded-lg shadow-xl font-bold border-2 border-transparent gradient-border-button hover:bg-white/95 cursor-pointer"
                    onClick={() => window.location.href = '/signin'}
                  >
                    Sign in to view more properties
                  </Button>
                </div>
              )}
            </div>
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

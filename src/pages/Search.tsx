
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SearchHeader from '@/components/search/SearchHeader';
import SearchResults from '@/components/search/SearchResults';
import HorizontalFilters from '@/components/search/HorizontalFilters';
import SearchFilters from '@/components/search/SearchFilters';
import SearchFooter from '@/components/search/SearchFooter';
import { useListings } from '@/hooks/useListings';
import SEO from '@/components/SEO';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Slider
} from "@/components/ui/slider"; // Fix the import - use slider instead of range
import { Filter, CheckSquare } from "lucide-react";
import { motion } from 'framer-motion';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const initialMinPrice = queryParams.get('minPrice') ? parseInt(queryParams.get('minPrice') || '0') : 0;
  const initialMaxPrice = queryParams.get('maxPrice') ? parseInt(queryParams.get('maxPrice') || '5000000') : 5000000;
  const initialMinBeds = queryParams.get('minBeds') ? parseInt(queryParams.get('minBeds') || '0') : 0;
  const initialMinBaths = queryParams.get('minBaths') ? parseInt(queryParams.get('minBaths') || '0') : 0;
  const initialPropertyType = queryParams.get('propertyType') || 'Any';
  
  const [query, setQuery] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
  const [minBeds, setMinBeds] = useState(initialMinBeds);
  const [minBaths, setMinBaths] = useState(initialMinBaths);
  const [propertyType, setPropertyType] = useState(initialPropertyType);
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    properties,
    loading,
    error,
    fetchProperties,
    totalCount
  } = useListings();

  // Apply filters when they change
  useEffect(() => {
    // Build query params object
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 5000000) params.set('maxPrice', priceRange[1].toString());
    if (minBeds > 0) params.set('minBeds', minBeds.toString());
    if (minBaths > 0) params.set('minBaths', minBaths.toString());
    if (propertyType !== 'Any') params.set('propertyType', propertyType);
    
    // Update URL with filters
    navigate({
      pathname: '/search',
      search: params.toString()
    }, { replace: true });
    
    // Fetch properties with filters
    fetchProperties({
      query,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minBeds,
      minBaths,
      propertyType: propertyType !== 'Any' ? propertyType : undefined
    });
  }, [query, priceRange, minBeds, minBaths, propertyType]);

  // Handle filter reset
  const handleFilterReset = () => {
    setQuery(initialQuery);
    setPriceRange([0, 5000000]);
    setMinBeds(0);
    setMinBaths(0);
    setPropertyType('Any');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30">
      <SEO 
        title="Search Properties | Realer Estate"
        description="Search for below market real estate deals and investment opportunities. Filter by price, beds, baths, and property type."
        canonical="/search"
      />
      
      <SearchHeader />
      
      <div className="container mx-auto px-4 pb-24">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                {loading ? 'Searching...' : `${totalCount} Properties Found`}
              </h2>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline"
                  onClick={() => setShowFilters(true)} 
                  className="flex items-center gap-2"
                >
                  <Filter size={16} />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Search Filters</SheetTitle>
                  <SheetDescription>
                    Filter properties to find exactly what you're looking for
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <SearchFilters
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    minBeds={minBeds}
                    setMinBeds={setMinBeds}
                    minBaths={minBaths}
                    setMinBaths={setMinBaths}
                    propertyType={propertyType}
                    setPropertyType={setPropertyType}
                    onReset={handleFilterReset}
                    mobile
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-72 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-24">
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleFilterReset}
                className="mb-4 text-xs w-full flex items-center"
              >
                <CheckSquare size={14} className="mr-1" /> 
                Reset Filters
              </Button>
            </div>
            
            <SearchFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minBeds={minBeds}
              setMinBeds={setMinBeds}
              minBaths={minBaths}
              setMinBaths={setMinBaths}
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              onReset={handleFilterReset}
            />
          </div>
          
          {/* Search Results */}
          <div className="flex-1">
            {/* Desktop Horizontal Quick Filters */}
            <div className="hidden lg:block mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{loading ? 'Searching...' : `${totalCount} Properties Found`}</h1>
              </div>
              
              <HorizontalFilters 
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minBeds={minBeds}
                setMinBeds={setMinBeds}
                minBaths={minBaths}
                setMinBaths={setMinBaths}
                propertyType={propertyType}
                setPropertyType={setPropertyType}
              />
            </div>
            
            {/* Search Results Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SearchResults 
                properties={properties} 
                loading={loading} 
                error={error} 
                searchQuery={query}
              />
            </motion.div>
            
            {/* Pagination/Infinite Scroll would go here */}
            
            <SearchFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

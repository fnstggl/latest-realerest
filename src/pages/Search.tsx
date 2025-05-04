import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SearchHeader from '@/components/search/SearchHeader';
import SearchResults from '@/components/search/SearchResults';
import SearchFooter from '@/components/search/SearchFooter';
import LocationAlertForm from '@/components/LocationAlertForm';
import HorizontalFilters from '@/components/search/HorizontalFilters';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [isGridView, setIsGridView] = useState(true);
  const [sortOption, setSortOption] = useState("recommended");
  const { isAuthenticated } = useAuth();
  
  // Filter states
  const [location, setLocation] = useState(searchQuery);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [propertyType, setPropertyType] = useState('');
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [belowMarket, setBelowMarket] = useState(false);
  const [includeRental, setIncludeRental] = useState(true);
  const [withPhotosOnly, setWithPhotosOnly] = useState(false);

  useEffect(() => {
    setLocation(searchQuery);
  }, [searchQuery]);

  const handleFilterChange = (filters: any) => {
    // Handle location separately to avoid overwriting search query
    if (filters.location) {
      setLocation(filters.location);
    }
    
    setMinPrice(filters.minPrice ?? 0);
    setMaxPrice(filters.maxPrice ?? 10000000);
    
    // Handle beds and baths properly
    setMinBeds(filters.bedrooms === 'any' ? 0 : parseInt(filters.bedrooms) || 0);
    setMinBaths(filters.bathrooms === 'any' ? 0 : parseInt(filters.bathrooms) || 0);
    
    // Handle property type
    setPropertyType(filters.propertyType || '');
    
    // Other filters
    setNearbyOnly(filters.nearbyOnly || false);
    setBelowMarket(filters.belowMarket > 0);
    setIncludeRental(filters.includeRental !== false); // Default to true
    setWithPhotosOnly(filters.withPhotosOnly || false);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] pt-24">
      <SearchHeader />
      
      <div className="container px-4 lg:px-8 mx-auto py-8">
        {/* Horizontal filters component */}
        <HorizontalFilters onFilterChange={handleFilterChange} />
        
        {/* Search results */}
        <SearchResults
          location={location}
          minPrice={minPrice}
          maxPrice={maxPrice}
          minBeds={minBeds}
          minBaths={minBaths}
          propertyType={propertyType}
          nearbyOnly={nearbyOnly}
          belowMarket={belowMarket}
          sort={sortOption}
          includeRental={includeRental}
          withPhotosOnly={withPhotosOnly}
        />
      </div>
      
      <div className="w-full">
        <LocationAlertForm />
      </div>
      
      <SearchFooter />
    </div>
  );
};

export default Search;

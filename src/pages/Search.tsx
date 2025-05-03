
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SearchHeader from '@/components/search/SearchHeader';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import SearchFooter from '@/components/search/SearchFooter';
import LocationAlertForm from '@/components/LocationAlertForm';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [isGridView, setIsGridView] = useState(true);
  const [sortOption, setSortOption] = useState("recommended");
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
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
    setLocation(filters.location || '');
    setMinPrice(filters.minPrice || 0);
    setMaxPrice(filters.maxPrice || 10000000);
    setMinBeds(filters.minBeds || 0);
    setMinBaths(filters.minBaths || 0);
    setPropertyType(filters.propertyType || '');
    setNearbyOnly(filters.nearbyOnly || false);
    setBelowMarket(filters.belowMarket || false);
    setIncludeRental(filters.includeRental || true);
    setWithPhotosOnly(filters.withPhotosOnly || false);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] pt-24">
      <SearchHeader />
      
      <div className="container px-4 lg:px-8 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <SearchFilters
            onFilterChange={handleFilterChange}
            isFiltersCollapsed={isFiltersCollapsed}
            setIsFiltersCollapsed={setIsFiltersCollapsed}
          />
          
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
      </div>
      
      <div className="w-full">
        <LocationAlertForm />
      </div>
      
      <SearchFooter />
    </div>
  );
};

export default Search;

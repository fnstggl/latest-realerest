
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchHeader from '@/components/search/SearchHeader';
import SearchResults from '@/components/search/SearchResults';
import HorizontalFilters from '@/components/search/HorizontalFilters';
import SearchFooter from '@/components/search/SearchFooter';
import { useListings } from '@/hooks/useListings';
import SEO from '@/components/SEO';

interface Filters {
  minPrice: number;
  maxPrice: number;
  beds: number;
  baths: number;
  propertyType: string;
  location: string;
  sortBy: string;
}

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 1000000,
    beds: 0,
    baths: 0,
    propertyType: '',
    location: searchParams.get('location') || '',
    sortBy: 'newest'
  });

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');

  // Use the useListings hook to fetch properties
  const { 
    properties, 
    isLoading, 
    error, 
    totalCount,
    fetchProperties 
  } = useListings();

  useEffect(() => {
    // Update location from URL params
    const location = searchParams.get('location');
    if (location) {
      setSearchQuery(location);
      setFilters(prev => ({ ...prev, location }));
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch properties when filters change
    fetchProperties({
      location: filters.location,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      beds: filters.beds,
      baths: filters.baths,
      propertyType: filters.propertyType,
      sortBy: filters.sortBy
    });
  }, [filters, fetchProperties]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, location: query }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const resultCount = totalCount || properties.length;

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <SEO
        title={`Real Estate Search Results ${filters.location ? `in ${filters.location}` : ''} - Realer Estate`}
        description={`Find below market real estate deals ${filters.location ? `in ${filters.location}` : ''}. Browse properties from motivated sellers at discounted prices.`}
        canonical="/search"
      />
      
      <Navbar />
      
      <div className="pt-20">
        <SearchHeader 
          onSearch={handleSearch}
          initialQuery={searchQuery}
          onToggleFilters={() => setFiltersVisible(!filtersVisible)}
          filtersVisible={filtersVisible}
          resultCount={resultCount}
        />
        
        <HorizontalFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
        />
        
        <SearchResults 
          properties={properties}
          isLoading={isLoading}
          error={error}
        />
        
        <SearchFooter />
      </div>
    </div>
  );
};

export default Search;

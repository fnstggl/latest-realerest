import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useListings } from '@/hooks/useListings';
import SearchHeader from '@/components/search/SearchHeader';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import SearchFooter from '@/components/search/SearchFooter';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LocationAlertForm from '@/components/LocationAlertForm';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [isGridView, setIsGridView] = useState(true);
  const [sortOption, setSortOption] = useState("recommended");
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const {
    listings: properties,
    loading,
    error
  } = useListings(undefined, searchQuery);

  const handleFilterChange = (filters: any) => {
    let results = [...properties];
    
    // Filter logic
    results = results.filter(property => {
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
    
    sortProperties(results, sortOption);
  };

  const sortProperties = (properties: any[], option: string) => {
    switch (option) {
      case "price-low":
        properties.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        properties.sort((a, b) => b.price - a.price);
        break;
      case "below-market":
        properties.sort((a, b) => b.belowMarket - a.belowMarket);
        break;
      case "newest":
        break;
      default:
        break;
    }
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (properties.length === 0 && searchQuery) {
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
              properties={[]}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              isGridView={isGridView}
              setIsGridView={setIsGridView}
              isAuthenticated={isAuthenticated}
              searchQuery={searchQuery}
            />
          </div>
        </div>
        <div className="w-full">
          <LocationAlertForm />
        </div>
      </div>
    );
  }

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
            properties={properties}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            isGridView={isGridView}
            setIsGridView={setIsGridView}
            isAuthenticated={isAuthenticated}
            searchQuery={searchQuery}
          />
        </div>
      </div>
      
      <SearchFooter />
    </div>
  );
};

export default Search;


import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchHeader from '@/components/search/SearchHeader';
import SearchResults from '@/components/search/SearchResults';
import SearchFooter from '@/components/search/SearchFooter';
import { useProperties } from '@/hooks/useProperties';
import SEO from '@/components/SEO';

export interface PropertyFilters {
  minPrice: number;
  maxPrice: number;
  beds: number;
  baths: number;
  propertyType: string;
  listingType: string;
  city: string;
  state: string;
  sortBy: string;
  hasReward: boolean;
}

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState<PropertyFilters>({
    minPrice: 0,
    maxPrice: 5000000,
    beds: 0,
    baths: 0,
    propertyType: 'all',
    listingType: 'all',
    city: '',
    state: '',
    sortBy: 'newest',
    hasReward: false,
  });

  const { properties, loading, error } = useProperties();

  // Filter properties based on search query and filters
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties.filter(property => {
      // Text search
      if (query) {
        const searchText = query.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(searchText) ||
          property.city.toLowerCase().includes(searchText) ||
          property.state.toLowerCase().includes(searchText) ||
          property.address.toLowerCase().includes(searchText) ||
          property.zip_code.includes(searchText);
        
        if (!matchesSearch) return false;
      }

      // Price range
      if (property.price < filters.minPrice || property.price > filters.maxPrice) {
        return false;
      }

      // Beds
      if (filters.beds > 0 && property.beds < filters.beds) {
        return false;
      }

      // Baths
      if (filters.baths > 0 && property.baths < filters.baths) {
        return false;
      }

      // Property type
      if (filters.propertyType !== 'all' && property.property_type !== filters.propertyType) {
        return false;
      }

      // Listing type
      if (filters.listingType !== 'all' && property.listing_type !== filters.listingType) {
        return false;
      }

      // City
      if (filters.city && !property.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }

      // State
      if (filters.state && !property.state.toLowerCase().includes(filters.state.toLowerCase())) {
        return false;
      }

      // Has reward
      if (filters.hasReward && (!property.reward_amount || property.reward_amount <= 0)) {
        return false;
      }

      return true;
    });
  }, [properties, query, filters]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    
    switch (filters.sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'reward-high':
        return sorted.sort((a, b) => (b.reward_amount || 0) - (a.reward_amount || 0));
      default:
        return sorted;
    }
  }, [filteredProperties, filters.sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`Search Results${query ? ` for "${query}"` : ''} - Realer Estate`}
        description={`Browse ${sortedProperties.length} properties${query ? ` matching "${query}"` : ''}. Find below market real estate deals and investment opportunities.`}
        canonical={`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`}
      />
      
      <Navbar />
      
      <main className="pt-20">
        <SearchHeader 
          query={query}
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={sortedProperties.length}
        />
        
        <SearchResults 
          properties={sortedProperties}
          loading={loading}
          error={error}
        />
        
        <SearchFooter />
      </main>
    </div>
  );
};

export default Search;

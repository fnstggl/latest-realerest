import React, { useRef, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Button } from "@/components/ui/button";
import { Grid, List } from 'lucide-react';
import { Listing } from '@/hooks/useListings';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResultsProps {
  properties: Listing[];
  sortOption: string;
  onSortChange: (option: string) => void;
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
  isAuthenticated: boolean;
  searchQuery: string | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  properties,
  sortOption,
  onSortChange,
  isGridView,
  setIsGridView,
  isAuthenticated,
  searchQuery
}) => {
  const isMobile = useIsMobile();
  const ITEMS_PER_ROW = isGridView ? (isMobile ? 1 : 3) : 1;

  // If user is not authenticated and there's a search with no results,
  // show skeleton listings
  const shouldShowSkeletons = !isAuthenticated && searchQuery && properties.length === 0;
  const totalItems = shouldShowSkeletons ? ITEMS_PER_ROW : properties.length;
  const totalFullRows = Math.floor(totalItems / ITEMS_PER_ROW);
  const lastFullRowStartIndex = Math.max(0, (totalFullRows - 1) * ITEMS_PER_ROW);
  const lastFullRowEndIndex = lastFullRowStartIndex + ITEMS_PER_ROW;

  // Make sure we show property placeholders even if properties array is empty
  const visibleProperties = isAuthenticated || searchQuery 
    ? properties 
    : properties.length > 0 
      ? properties.slice(0, lastFullRowEndIndex)
      : [];

  const generatePlaceholderProperties = () => {
    if (shouldShowSkeletons) {
      return Array(ITEMS_PER_ROW).fill(null);
    }
    if (isAuthenticated || searchQuery || properties.length > 0) return [];
    return Array(ITEMS_PER_ROW).fill(null).map((_, index) => ({
      id: `placeholder-${index}`,
      isPlaceholder: true
    }));
  };

  const placeholderProperties = generatePlaceholderProperties();

  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl p-4 mb-6 neo-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="font-editorial font-bold italic text-lg">
            Below-market homes you can buy today.
          </h1>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select 
              className="flex-1 sm:flex-none border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary neo-input" 
              value={sortOption} 
              onChange={e => onSortChange(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="below-market">Highest Discount</option>
              <option value="newest">Newest</option>
            </select>
            
            <div className="hidden sm:flex border rounded-md neo-border">
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
      
      <div className={`grid gap-6 relative ${isGridView ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' : 'space-y-6'}`}>
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

        {shouldShowSkeletons && placeholderProperties.map((_, index) => (
          <div key={`skeleton-${index}`} className="relative">
            <div className="h-full border border-white/30 shadow-lg overflow-hidden transform translate-z-5 relative z-10 flex flex-col rounded-xl">
              <Skeleton className="h-[240px] w-full rounded-t-xl" />
              <div className="p-6 flex-1 flex flex-col rounded-b-xl bg-white/90">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                
                <div className="border-t border-white/20 pt-4 mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-8 w-12 rounded-lg" />
                      <Skeleton className="h-8 w-12 rounded-lg" />
                      <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
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
          </div>
        ))}
        
        {(!isAuthenticated && (shouldShowSkeletons || (!searchQuery && properties.length > 0))) && (
          <div 
            className="absolute z-20"
            style={{
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bottom: '0',
              width: 'auto',
              pointerEvents: 'auto',
              marginBottom: isMobile ? '25%' : '12%'
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
  );
};

export default SearchResults;

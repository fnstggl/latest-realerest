
import React from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Button } from "@/components/ui/button";
import { Grid, List } from 'lucide-react';
import { Listing } from '@/hooks/useListings';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const totalItems = properties.length;
  const totalFullRows = Math.floor(totalItems / ITEMS_PER_ROW);
  const lastFullRowStartIndex = (totalFullRows - 1) * ITEMS_PER_ROW;
  const lastFullRowEndIndex = lastFullRowStartIndex + ITEMS_PER_ROW;

  const visibleProperties = !isAuthenticated && !searchQuery
    ? properties.slice(0, lastFullRowEndIndex) 
    : properties;

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
  );
};

export default SearchResults;

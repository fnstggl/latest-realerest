
import React, { useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { useListings } from '@/hooks/useListings';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Search, Ghost } from 'lucide-react';

interface SearchResultsProps {
  location: string;
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minBaths: number;
  propertyType: string;
  nearbyOnly: boolean;
  belowMarket: boolean;
  sort: string;
  includeRental: boolean;
  withPhotosOnly: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  location,
  minPrice,
  maxPrice,
  minBeds,
  minBaths,
  propertyType,
  nearbyOnly,
  belowMarket,
  sort,
  includeRental,
  withPhotosOnly
}) => {
  const { listings, isLoading, error, fetchListings } = useListings();
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchListings({
        location,
        minPrice,
        maxPrice,
        minBeds,
        minBaths,
        propertyType,
        nearbyOnly,
        belowMarket,
        sort,
        includeRental,
        withPhotosOnly
      });
    };
    
    fetchData();
  }, [
    location,
    minPrice,
    maxPrice,
    minBeds,
    minBaths,
    propertyType,
    nearbyOnly,
    belowMarket,
    sort,
    includeRental,
    withPhotosOnly
  ]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center">
          <div className="p-4 bg-red-50 rounded-full mb-4">
            <Search className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Search Error</h3>
        <p className="text-gray-600 mb-4">
          There was a problem with your search. Please try again.
        </p>
        <Button onClick={() => fetchListings({
          location,
          minPrice,
          maxPrice,
          minBeds,
          minBaths,
          propertyType,
          nearbyOnly,
          belowMarket,
          sort,
          includeRental,
          withPhotosOnly
        })}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center">
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <Ghost className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
        <p className="text-gray-600 mb-4">
          We couldn't find any properties matching your criteria.
        </p>
        <Button onClick={() => fetchListings({
          location: '',
          minPrice: 0,
          maxPrice: 10000000,
          minBeds: 0,
          minBaths: 0,
          propertyType: '',
          nearbyOnly: false,
          belowMarket: false,
          sort: 'newest',
          includeRental: true,
          withPhotosOnly: false
        })}>
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          price={Number(property.price)}
          marketPrice={Number(property.market_price)}
          location={property.location}
          address={property.title}
          image={property.images?.[0] || '/placeholder.svg'}
          beds={property.beds || 0}
          baths={property.baths || 0}
          sqft={property.sqft || 0}
          belowMarket={((Number(property.market_price) - Number(property.price)) / Number(property.market_price)) * 100}
          reward={property.reward}
        />
      ))}
    </div>
  );
};

export default SearchResults;


import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import { useListings } from '@/hooks/useListings';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Search, Ghost } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

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
  const { listings, loading: isLoading, error, fetchListings } = useListings();
  const { isAuthenticated } = useAuth();
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  
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
        <LoadingSpinner />
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
    // Show skeleton preview for non-authenticated users
    if (!isAuthenticated) {
      // Determine the number of skeleton cards based on screen width
      const getSkeletonCount = () => {
        if (window.innerWidth >= 1024) return 3; // lg: grid-cols-3
        if (window.innerWidth >= 768) return 2;  // md: grid-cols-2
        return 1; // default for mobile: grid-cols-1
      };
      
      const skeletonCount = getSkeletonCount();
      
      return (
        <div className="relative flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(skeletonCount).fill(0).map((_, i) => (
              <div key={i} className="relative">
                <div className="border border-white/30 shadow-lg overflow-hidden rounded-xl">
                  <Skeleton className="h-[240px] w-full rounded-t-xl" />
                  <div className="p-6 flex-1 flex flex-col bg-white/90 rounded-b-xl">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-5 w-1/3 mb-1" />
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-5 w-2/3 mb-4" />
                    <div className="border-t border-white/20 pt-4 mt-auto">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-8 w-12" />
                          <Skeleton className="h-8 w-12" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 w-full flex items-center justify-center" style={{ height: '150px' }}>
            <Link to="/signin">
              <Button 
                variant="gradient" 
                className="text-black bg-white hover:bg-white relative group overflow-hidden px-8 py-2 rounded-xl z-10"
              >
                Sign in to view more properties
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)"
                  }}
                ></span>
              </Button>
            </Link>
          </div>
        </div>
      );
    }
    
    // For authenticated users, show the regular "No Properties Found" message
    return (
      <div className="text-center py-16">
        <div className="flex justify-center">
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <Ghost className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
        <p className="text-gray-600 mb-4">
          {location ? `Can't find a below-market home in ${location}? Be the first to know when one gets listed.` : 
          `We couldn't find any properties matching your criteria.`}
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

  // Determine the number of items per row based on screen width
  // (This is an approximation that matches the grid layout)
  const getItemsPerRow = () => {
    if (window.innerWidth >= 1024) return 3; // lg: grid-cols-3
    if (window.innerWidth >= 768) return 2;  // md: grid-cols-2
    return 1; // default for mobile: grid-cols-1
  };

  const itemsPerRow = getItemsPerRow();
  const shouldBlurLastRow = !isAuthenticated && listings.length > itemsPerRow;
  
  // Calculate the start index for the blurred items
  // We want to blur the last full row of items
  const blurStartIndex = shouldBlurLastRow 
    ? Math.max(0, listings.length - (listings.length % itemsPerRow || itemsPerRow))
    : listings.length;

  return (
    <div ref={resultsContainerRef} className="relative flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((property, index) => (
          <div 
            key={property.id}
            className={`relative ${index >= blurStartIndex && shouldBlurLastRow ? 'blur-sm' : ''}`}
          >
            <PropertyCard
              id={property.id}
              price={property.price}
              marketPrice={property.marketPrice}
              location={property.location}
              address={property.title}
              image={property.image || '/placeholder.svg'}
              beds={property.beds || 0}
              baths={property.baths || 0}
              sqft={property.sqft || 0}
              belowMarket={property.belowMarket}
              reward={property.reward}
            />
          </div>
        ))}
      </div>
      
      {shouldBlurLastRow && (
        <div className="absolute bottom-0 left-0 w-full flex items-center justify-center" style={{ height: '150px' }}>
          <Link to="/signin">
            <Button 
              variant="gradient" 
              className="text-black bg-white hover:bg-white relative group overflow-hidden px-8 py-2 rounded-xl z-10"
            >
              Sign in to view more properties
              <span 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
                style={{
                  background: "transparent",
                  border: "2px solid transparent",
                  backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)"
                }}
              ></span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

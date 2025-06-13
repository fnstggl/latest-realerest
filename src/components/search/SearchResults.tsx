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
        <div className="flex-1 relative">
          {/* Container for skeleton cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
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
          
          {/* Sign in button positioned in the center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
            <Link to="/signin">
              <Button 
                variant="gradient" 
className="text-white bg-[#fd4801] hover:bg-[#fd4801] relative font-polysans overflow-hidden px-8 py-3 rounded-full z-10"
              >
                Sign in to view more properties
                <span 
className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
  background: "transparent",
  border: "3px solid #01204b",
  borderRadius: "9999px",
  boxShadow: "0 0 15px rgba(1, 32, 75, 0.3)"
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
  const getItemsPerRow = () => {
    if (window.innerWidth >= 1024) return 3; // lg: grid-cols-3
    if (window.innerWidth >= 768) return 2;  // md: grid-cols-2
    return 1; // default for mobile: grid-cols-1
  };
  
  const itemsPerRow = getItemsPerRow();
  
  // For non-authenticated users, determine what to show
  const shouldProcessForNonAuth = !isAuthenticated && listings.length > itemsPerRow;
  
  // Calculate the last full row information
  const getLastFullRowInfo = () => {
    if (!shouldProcessForNonAuth) {
      return {
        blurStartIndex: listings.length,
        blurEndIndex: listings.length,
        displayCount: listings.length,
        rowPosition: 0
      };
    }
    
    const totalItems = listings.length;
    const remainder = totalItems % itemsPerRow;
    const lastFullRowStart = remainder === 0 
      ? totalItems - itemsPerRow 
      : totalItems - remainder - itemsPerRow;
    
    // For mobile view (1 item per row), we want to blur only the last item
    if (itemsPerRow === 1) {
      return {
        blurStartIndex: totalItems - 1, // Last item for mobile
        blurEndIndex: totalItems,
        displayCount: totalItems,
        rowPosition: totalItems - 1 // Position for the last row
      };
    }
    
    return {
      blurStartIndex: lastFullRowStart,
      blurEndIndex: lastFullRowStart + itemsPerRow,
      // For non-auth users, only show up to the last full row (hide incomplete row)
      displayCount: remainder === 0 ? totalItems : totalItems - remainder,
      // Calculate the row position for the button (corresponds to the last full row)
      rowPosition: Math.floor(lastFullRowStart / itemsPerRow)
    };
  };
  
  const { blurStartIndex, blurEndIndex, displayCount, rowPosition } = getLastFullRowInfo();

  // Calculate button positioning based on device type
  const getButtonPosition = () => {
    // For mobile (1 item per row)
    if (itemsPerRow === 1) {
      return {
        // Use position: 'absolute', bottom: 0 on the container and relative positioning here
        // This will ensure the button stays attached to the blurred card
        position: 'relative' as const,
        top: 'auto' as const,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
      };
    }
    
    // For desktop and tablet - keep exactly the same as before
    return {
      top: `${rowPosition * 500 + 320}px`,
      left: '50%',
      transform: 'translateX(-50%)',
    };
  };
  
  const buttonPosition = getButtonPosition();

  return (
    <div ref={resultsContainerRef} className="relative flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.slice(0, displayCount).map((property, index) => (
          <div 
            key={property.id}
            className={`relative ${index >= blurStartIndex && index < blurEndIndex ? 'blur-sm' : ''}`}
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
      
      {shouldProcessForNonAuth && (
        itemsPerRow === 1 ? (
          // Mobile layout: position the button within the blurred card
          <div className="relative">
            {/* Create an element for the button that's positioned over the last card */}
            <div 
              className="absolute left-0 right-0 flex justify-center items-center"
              style={{
                bottom: '50%', // Position in the middle of the card vertically
                zIndex: 20,
              }}
            >
              <Link to="/signin">
                <Button 
                  variant="gradient" 
className="text-white bg-[#fd4801] hover:bg-[#fd4801] font-polysans relative overflow-hidden px-8 py-3 rounded-full z-10"
                >
                  Sign in to view more properties
                  <span 
className="absolute inset-0 rounded-full pointer-events-none"
                style={{
  background: "transparent",
  border: "3px solid #01204b",
  borderRadius: "9999px",
  boxShadow: "0 0 15px rgba(1, 32, 75, 0.3)"
}}

                  ></span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Desktop layout: use the pixel-based positioning (unchanged)
          <div 
            className="absolute flex items-center justify-center"
            style={{
              top: buttonPosition.top,
              left: buttonPosition.left,
              transform: buttonPosition.transform,
              width: 'fit-content',
              zIndex: 10
            }}
          >
            <Link to="/signin">
              <Button 
                variant="gradient" 
className="text-white bg-[#fd4801] hover:bg-[#fd4801] relative overflow-hidden font-polysans px-8 py-3 rounded-full z-10"
              >
                Sign in to view more properties
                <span 
className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
  background: "transparent",
  border: "3px solid #01204b",
  borderRadius: "9999px",
  boxShadow: "0 0 15px rgba(1, 32, 75, 0.3)"
}}
                ></span>
              </Button>
            </Link>
          </div>
        )
      )}
    </div>
  );
};

export default SearchResults;

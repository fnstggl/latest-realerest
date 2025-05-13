
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SEO from "@/components/SEO";
import SearchHeader from "@/components/search/SearchHeader";
import SearchResults from "@/components/search/SearchResults";
import SearchFooter from "@/components/search/SearchFooter";
import SearchFilters from "@/components/search/SearchFilters";

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Default search parameters
  const defaultParams = {
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    beds: searchParams.get("beds") || "",
    baths: searchParams.get("baths") || "",
    type: searchParams.get("type") || "",
    sort: searchParams.get("sort") || "newest"
  };
  
  // State for search parameters
  const [searchLocation, setSearchLocation] = useState(defaultParams.location);
  const [minPrice, setMinPrice] = useState(defaultParams.minPrice);
  const [maxPrice, setMaxPrice] = useState(defaultParams.maxPrice);
  const [beds, setBeds] = useState(defaultParams.beds);
  const [baths, setBaths] = useState(defaultParams.baths);
  const [propertyType, setPropertyType] = useState(defaultParams.type);
  const [sortOption, setSortOption] = useState(defaultParams.sort);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<number>(0); // Explicitly typed as number
  
  // Get listings based on search parameters
  const { 
    listings,
    loading, // Use loading instead of isLoading to match hook
    error: listingsError, // Use listingsError to avoid conflict
    fetchListings
  } = useListings();

  // Adapt to the available hook methods
  useEffect(() => {
    const filters = {
      location: searchLocation,
      minPrice: minPrice !== "" ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice !== "" ? parseFloat(maxPrice) : undefined,
      beds: beds !== "" ? parseInt(beds) : undefined,
      baths: baths !== "" ? parseInt(baths) : undefined,
      propertyType: propertyType || undefined,
      sortBy: sortOption
    };
    
    fetchListings(filters);
  }, [searchLocation, minPrice, maxPrice, beds, baths, propertyType, sortOption, fetchListings]);

  // Function to handle search
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set("location", searchLocation);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds) params.set("beds", beds);
    if (baths) params.set("baths", baths);
    if (propertyType) params.set("type", propertyType);
    if (sortOption) params.set("sort", sortOption);
    setSearchParams(params);
  };

  // Function to update search parameters
  const updateSearchParam = (param: string, value: string) => {
    switch (param) {
      case "location":
        setSearchLocation(value);
        break;
      case "minPrice":
        setMinPrice(value);
        break;
      case "maxPrice":
        setMaxPrice(value);
        break;
      case "beds":
        setBeds(value);
        break;
      case "baths":
        setBaths(value);
        break;
      case "type":
        setPropertyType(value);
        break;
      case "sort":
        setSortOption(value);
        break;
      default:
        break;
    }
  };

  // Function to toggle mobile filters
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(mobileFiltersOpen === 0 ? 1 : 0);
  };

  // Function to close mobile filters
  const closeMobileFilters = () => {
    setMobileFiltersOpen(0);
  };

  // useEffect to handle initial search and URL parameter changes
  useEffect(() => {
    handleSearch();
  }, [searchLocation, minPrice, maxPrice, beds, baths, propertyType, sortOption]);

  // Create a horizontal filters component
  const HorizontalFilters = ({ toggleMobileFilters }: { toggleMobileFilters: () => void }) => (
    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-4">
      <button 
        onClick={toggleMobileFilters}
        className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium"
      >
        Filters
      </button>
      <div className="flex items-center space-x-2">
        <select 
          value={sortOption} 
          onChange={(e) => updateSearchParam("sort", e.target.value)}
          className="px-2 py-1 bg-gray-100 rounded-lg text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FCFBF8] min-h-screen">
      <SEO title="Search Properties" description="Search for properties" />

      <SearchHeader 
        location={searchLocation}
        updateSearchParam={updateSearchParam}
      />

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Filters Section (Hidden on Mobile) */}
        <div className="w-full md:w-1/4 lg:w-1/5 hidden md:block">
          <SearchFilters
            location={searchLocation}
            minPrice={minPrice}
            maxPrice={maxPrice}
            beds={beds}
            baths={baths}
            propertyType={propertyType}
            sortOption={sortOption}
            updateSearchParam={updateSearchParam}
          />
        </div>

        {/* Main Content Section */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          {/* Horizontal Filters (Visible on Mobile) */}
          <div className="md:hidden mb-4">
            <HorizontalFilters
              toggleMobileFilters={toggleMobileFilters}
            />
          </div>

          {/* Search Results */}
          {loading ? (
            <LoadingSpinner />
          ) : listingsError ? (
            <div className="text-red-500">Error: {listingsError}</div>
          ) : (
            <SearchResults
              listings={listings}
              totalListings={listings.length}
              currentPage={1}
              totalPages={1}
              setCurrentPage={() => {}}
            />
          )}
        </div>
      </div>

      <SearchFooter />

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen === 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={closeMobileFilters} className="text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>
            <SearchFilters
              location={searchLocation}
              minPrice={minPrice}
              maxPrice={maxPrice}
              beds={beds}
              baths={baths}
              propertyType={propertyType}
              sortOption={sortOption}
              updateSearchParam={updateSearchParam}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

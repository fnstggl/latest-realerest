
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import { Button } from "@/components/ui/button";
import { Sliders, Grid, List, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

// Interface for property
interface Property {
  id: string;
  title?: string;
  price: number;
  marketPrice: number;
  image: string;
  location: string;
  address?: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
}

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [isGridView, setIsGridView] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [sortOption, setSortOption] = useState("recommended");
  const [loading, setLoading] = useState(true);
  
  // Demo filter function
  const handleFilterChange = (filters: any) => {
    // In a real app, this would fetch from an API
    const filtered = properties.filter(property => {
      // Apply price filter
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }
      
      // Apply below market filter
      if (property.belowMarket < filters.belowMarket) {
        return false;
      }
      
      // Apply property type filter
      if (filters.propertyType !== "any") {
        // This is mock filtering - would need real property type data
        if (filters.propertyType === "house" && !property.title?.toLowerCase().includes("home")) {
          return false;
        }
        if (filters.propertyType === "apartment" && !property.title?.toLowerCase().includes("apartment")) {
          return false;
        }
        if (filters.propertyType === "condo" && !property.title?.toLowerCase().includes("condo")) {
          return false;
        }
      }
      
      // Apply bedrooms filter
      if (filters.bedrooms !== "any") {
        if (property.beds < parseInt(filters.bedrooms)) {
          return false;
        }
      }
      
      // Apply bathrooms filter
      if (filters.bathrooms !== "any") {
        if (property.baths < parseInt(filters.bathrooms)) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredProperties(filtered);
  };
  
  // Demo sort function
  const handleSortChange = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredProperties];
    
    switch (option) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "below-market":
        sorted.sort((a, b) => b.belowMarket - a.belowMarket);
        break;
      case "newest":
        // In a real app, this would sort by date added
        break;
      default:
        // Keep current order for "recommended"
        break;
    }
    
    setFilteredProperties(sorted);
  };
  
  // Function to transform Supabase data to our Property interface
  const transformProperty = (listing: any): Property => {
    const marketPrice = parseFloat(listing.market_price);
    const price = parseFloat(listing.price);
    const belowMarket = Math.round(((marketPrice - price) / marketPrice) * 100);
    
    return {
      id: listing.id,
      title: listing.title,
      price: price,
      marketPrice: marketPrice,
      image: listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.svg',
      location: listing.location,
      beds: listing.beds || 0,
      baths: listing.baths || 0,
      sqft: listing.sqft || 0,
      belowMarket: belowMarket
    };
  };
  
  useEffect(() => {
    // Fetch properties from Supabase first, and fall back to localStorage if that fails
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Try to fetch from Supabase first
        const { data: supabaseListings, error } = await supabase
          .from('property_listings')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        if (supabaseListings && supabaseListings.length > 0) {
          // Transform Supabase data
          const transformedListings = supabaseListings.map(transformProperty);
          setProperties(transformedListings);
          
          // Apply search filter if search query exists
          if (searchQuery) {
            const results = transformedListings.filter(property => 
              property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredProperties(results);
          } else {
            setFilteredProperties(transformedListings);
          }
        } else {
          // Fallback to localStorage if no data in Supabase
          fallbackToLocalStorage();
        }
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
        // Fallback to localStorage
        fallbackToLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    const fallbackToLocalStorage = () => {
      try {
        const storedProperties = localStorage.getItem('propertyListings');
        let loadedProperties: Property[] = [];
        
        if (storedProperties) {
          loadedProperties = JSON.parse(storedProperties);
          
          // Make sure each property has the required fields
          loadedProperties = loadedProperties.map(p => ({
            id: p.id,
            title: p.title || 'Property Listing',
            price: p.price || 0,
            marketPrice: p.marketPrice || 0,
            image: p.image || '/placeholder.svg',
            location: p.location || 'Unknown location',
            beds: p.beds || 0,
            baths: p.baths || 0,
            sqft: p.sqft || 0,
            belowMarket: p.belowMarket || 0
          }));
        }
        
        setProperties(loadedProperties);
        
        // Apply search filter if search query exists
        if (searchQuery) {
          const results = loadedProperties.filter(property => 
            property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          setFilteredProperties(results);
        } else {
          setFilteredProperties(loadedProperties);
        }
      } catch (err) {
        console.error("Error loading from localStorage:", err);
        toast.error("Unable to load property listings");
        setProperties([]);
        setFilteredProperties([]);
      }
    };

    fetchProperties();
  }, [searchQuery]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="max-w-3xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container px-4 lg:px-8 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-8">
              <PropertyFilters onFilterChange={handleFilterChange} />
            </div>
          </div>
          
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <div className="flex items-center">
                    <Sliders size={18} className="mr-2" />
                    Filters
                  </div>
                  <ChevronDown size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] pt-8">
                <PropertyFilters onFilterChange={handleFilterChange} />
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Results */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-donedeal-navy">
                    {filteredProperties.length} properties
                    {searchQuery ? ` for "${searchQuery}"` : ''}
                  </h1>
                  {filteredProperties.length !== properties.length && (
                    <p className="text-sm text-gray-500">
                      Filtered from {properties.length} total properties
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <select
                    className="flex-1 sm:flex-none border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-donedeal-orange"
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="below-market">Highest Discount</option>
                    <option value="newest">Newest</option>
                  </select>
                  
                  <div className="hidden sm:flex border rounded-md">
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
            
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-t-[#d60013] border-r-[#d60013] border-b-transparent border-l-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                  <p className="text-lg font-medium text-gray-700">Loading properties...</p>
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-donedeal-navy mb-2">No properties found</h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                <Button onClick={() => handleFilterChange({
                  propertyType: "any",
                  priceRange: [0, 2000000],
                  bedrooms: "any",
                  bathrooms: "any",
                  belowMarket: 0,
                  furnished: "any",
                })}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className={isGridView 
                ? "grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "space-y-6"
              }>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white py-10 border-t border-gray-200 mt-8">
        <div className="container px-4 lg:px-8 mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} DoneDeal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Search;

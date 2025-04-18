
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import { Button } from "@/components/ui/button";
import { Sliders, Grid, List, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useListings, Listing } from '@/hooks/useListings';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [isGridView, setIsGridView] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState<Listing[]>([]);
  const [sortOption, setSortOption] = useState("recommended");
  const {
    listings: properties,
    loading,
    error
  } = useListings();

  useEffect(() => {
    if (searchQuery && properties.length > 0) {
      const results = properties.filter(property => property.location.toLowerCase().includes(searchQuery.toLowerCase()) || property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredProperties(results);
    } else {
      setFilteredProperties(properties);
    }
  }, [properties, searchQuery]);

  const handleFilterChange = (filters: any) => {
    const filtered = properties.filter(property => {
      if (property.price < filters.minPrice || property.price > filters.maxPrice) {
        return false;
      }
      // Changed to minimum below market value check
      if (property.belowMarket < filters.belowMarket) {
        return false;
      }
      if (filters.propertyType !== "any") {
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
    setFilteredProperties(filtered);
  };

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
        break;
      default:
        break;
    }
    setFilteredProperties(sorted);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="py-8 bg-white border-b">
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="max-w-3xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>
      
      <div className="container px-4 lg:px-8 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-8">
              <PropertyFilters onFilterChange={handleFilterChange} />
            </div>
          </div>
          
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between items-center neo-button">
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
          
          <div className="flex-1">
            <div className="bg-white rounded-xl p-4 mb-6 neo-container">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-semibold text-base">
                    {filteredProperties.length} properties
                    {searchQuery ? ` for "${searchQuery}"` : ''}
                  </h1>
                  {filteredProperties.length !== properties.length && <p className="text-sm text-gray-500">
                      Filtered from {properties.length} total properties
                    </p>}
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <select className="flex-1 sm:flex-none border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary neo-input" value={sortOption} onChange={e => handleSortChange(e.target.value)}>
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="below-market">Highest Discount</option>
                    <option value="newest">Newest</option>
                  </select>
                  
                  <div className="hidden sm:flex border rounded-md neo-border">
                    <Button variant="ghost" size="icon" className={`rounded-r-none ${isGridView ? 'bg-gray-100' : ''}`} onClick={() => setIsGridView(true)}>
                      <Grid size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className={`rounded-l-none ${!isGridView ? 'bg-gray-100' : ''}`} onClick={() => setIsGridView(false)}>
                      <List size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {loading ? <div className="flex justify-center items-center py-16">
                <div className="loading-container">
                  <div className="gradient-blob"></div>
                </div>
              </div> : filteredProperties.length === 0 ? <div className="text-center py-16 bg-white rounded-xl neo-container">
                <h2 className="text-xl font-semibold mb-2">No properties found</h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                <Button onClick={() => handleFilterChange({
              propertyType: "any",
              minPrice: 0,
              maxPrice: 2000000,
              bedrooms: "any",
              bathrooms: "any",
              belowMarket: 0
            })} className="neo-button-primary">
                  Reset Filters
                </Button>
              </div> : <div className={isGridView ? "grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
                {filteredProperties.map(property => <PropertyCard key={property.id} {...property} />)}
              </div>}
          </div>
        </div>
      </div>
      
      <footer className="bg-white py-10 border-t border-gray-200 mt-8">
        <div className="container px-4 lg:px-8 mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} DoneDeal. All rights reserved.
        </div>
      </footer>
    </div>;
};

export default Search;

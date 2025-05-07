import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import { Property } from '@/hooks/useProperties';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

const Search = () => {
  const [results, setResults] = useState<Property[]>([]);
  const [filteredResults, setFilteredResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('term') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();
  const { toast } = useToast()

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams({ term });
  };

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('property_listings')
        .select('*');
        
      if (debouncedSearchTerm) {
        query = query.ilike('title', `%${debouncedSearchTerm}%`);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
        })
      }

      if (data) {
        const formattedProperties = data.map(prop => ({
          id: prop.id,
          title: prop.title,
          price: Number(prop.price),
          marketPrice: Number(prop.market_price),
          image: prop.images && prop.images.length > 0 ? prop.images[0] : "https://placehold.co/600x400?text=Property+Image",
          location: prop.location,
          beds: prop.beds || 0,
          baths: prop.baths || 0,
          sqft: prop.sqft || 0,
          belowMarket: Math.round(((Number(prop.market_price) - Number(prop.price)) / Number(prop.market_price)) * 100),
          waitlistCount: 0,
          reward: Number(prop.reward || 0)
        }));
        setResults(formattedProperties);
      }
    } catch (error) {
      console.error("Exception fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to load properties. Please refresh and try again.",
      })
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, toast]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filtered = results.filter(property =>
        property.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(results);
    }
  }, [results, debouncedSearchTerm]);

  // Fix TypeScript boolean vs number type
  const isFilteredResults: boolean = filteredResults.length > 0;

  return (
    <div className="min-h-screen bg-[#F9F8F7] transition-all duration-300">
      <Navbar />
      
      <div className="bg-white py-6 md:py-8 border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <SearchBar onSearch={handleSearch} initialTerm={searchTerm} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 pb-12 mt-4">
        {isFilteredResults ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredResults.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="w-[80%] mx-auto h-5" />
                <Skeleton className="w-[60%] mx-auto h-5" />
                <Skeleton className="w-[40%] mx-auto h-5" />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">No properties found</h2>
                <p className="text-gray-600">Please try a different search term.</p>
              </>
            )}
          </div>
        )}
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default Search;

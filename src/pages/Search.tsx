import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { MapPin, Search as SearchIcon, Heart, ChevronDown, Filter, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from '@/components/PropertyCard';
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Range } from "@/components/ui/range"
import { formatCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import SEO from '@/components/SEO';

interface Property {
  id: string;
  price: number;
  market_price: number;
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  images: string[];
  belowMarket?: number;
  property_type?: string;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperty, setFeaturedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
  const [propertyType, setPropertyType] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<string>('price');
  const [isMounted, setIsMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const isMobile = useIsMobile();

  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('property_listings')
          .select('*');

        if (searchTerm) {
          query = query.ilike('location', `%${searchTerm}%`);
        }

        if (propertyType) {
          query = query.eq('property_type', propertyType);
        }

        query = query.gte('price', priceRange[0]);
        query = query.lte('price', priceRange[1]);

        query = query.order(sortBy, {
          ascending: sortOrder === 'asc'
        });

        const {
          data,
          error
        } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          const formattedProperties = data.map(property => ({
            ...property,
            belowMarket: Math.round((Number(property.market_price) - Number(property.price)) / Number(property.market_price) * 100) || 0
          }));
          setProperties(formattedProperties);

          // Select a featured property (e.g., the first property)
          if (formattedProperties.length > 0) {
            const firstProperty = formattedProperties[0];
            setFeaturedProperty({
              ...firstProperty,
              belowMarket: Math.round((Number(firstProperty.market_price) - Number(firstProperty.price)) / Number(firstProperty.market_price) * 100) || 0
            });
          } else {
            setFeaturedProperty(null);
          }
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load properties",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchTerm, priceRange, propertyType, sortOrder, sortBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handlePropertyTypeChange = (type: string | undefined) => {
    setPropertyType(type);
  };

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
  };

  const handleSortByChange = (sortByOption: string) => {
    setSortBy(sortByOption);
  };

  const toggleLike = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to like properties",
      });
      navigate('/signin');
      return;
    }

    const isCurrentlyLiked = likedProperties.has(propertyId);
    const newLikedProperties = new Set(likedProperties);

    if (isCurrentlyLiked) {
      newLikedProperties.delete(propertyId);
    } else {
      newLikedProperties.add(propertyId);
    }

    setLikedProperties(newLikedProperties);
    setIsLiked(!isCurrentlyLiked);

    try {
      const {
        error
      } = await supabase
        .from('liked_properties')
        .upsert(
          [{
            user_id: user.id,
            property_id: propertyId
          }], {
            onConflict: 'user_id, property_id',
            ignoreDuplicates: false
          }
        );

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error liking property:", error);
      toast({
        title: "Error",
        description: "Failed to like property",
        variant: "destructive"
      });
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 1000000]);
    setPropertyType(undefined);
    setSortOrder('asc');
    setSortBy('price');
  };

  const featuredPropertySchema = featuredProperty ? {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": featuredProperty.title,
    "description": `Check out this amazing property in ${featuredProperty.location} with ${featuredProperty.beds} beds and ${featuredProperty.baths} baths.`,
    "url": `${window.location.origin}/property/${featuredProperty.id}`,
    "image": featuredProperty.images && featuredProperty.images.length > 0 ? featuredProperty.images[0] : undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": featuredProperty.location,
      "addressLocality": featuredProperty.location.split(',')[0],
      "addressRegion": featuredProperty.location.split(',')[1],
      "postalCode": "90210",
      "addressCountry": "US"
    },
    "price": featuredProperty.price,
    "numberOfRooms": featuredProperty.beds,
    "numberOfBathroomsTotal": featuredProperty.baths,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": featuredProperty.sqft,
      "unitCode": "FTK"
    }
  } : undefined;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <SEO
        title="Search Properties | Realer Estate"
        description="Find your dream property with our advanced search tools. Browse listings, filter by price, location, and more."
        canonical="/search"
        schema={featuredPropertySchema}
      />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-4xl font-bold">Find Your Dream Property</h1>
              <p className="text-lg text-gray-600">Explore our listings and discover your next home or investment.</p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <Input type="text" placeholder="Enter a location..." className="pl-12 border border-gray-300 rounded-full focus:ring-black focus:border-black" value={searchTerm} onChange={handleSearchChange} aria-label="Search properties" />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="relative bg-white text-black border border-gray-200 hover:bg-white transition-all rounded-xl text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2" onClick={() => setIsMobileFiltersOpen(true)}>
                <Filter size={16} className="mr-1 sm:mr-2" />
                <span>Filters</span>
                <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" style={{
                  background: "transparent",
                  border: "2px solid transparent",
                  backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude"
                }} />
              </Button>
              
              <Dialog open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                    <DialogDescription>
                      Adjust your search criteria to find the perfect property.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div>
                      <label htmlFor="price" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        Price Range
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 text-sm">{formatCurrency(priceRange[0])}</span>
                        <span>-</span>
                        <span className="text-gray-500 text-sm">{formatCurrency(priceRange[1])}</span>
                      </div>
                      <Range
                        min={0}
                        max={1000000}
                        step={10000}
                        defaultValue={[0, 1000000]}
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        id="price"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="propertyType" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        Property Type
                      </label>
                      <Select onValueChange={handlePropertyTypeChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={undefined}>All Types</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Condo">Condo</SelectItem>
                          <SelectItem value="Townhouse">Townhouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="secondary" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                    <Button type="button" onClick={() => setIsMobileFiltersOpen(false)}>
                      Apply Filters
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium">Sort by:</label>
                <Select onValueChange={handleSortByChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="beds">Beds</SelectItem>
                    <SelectItem value="baths">Baths</SelectItem>
                    <SelectItem value="sqft">Sqft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center">
                <label htmlFor="order" className="mr-2 text-sm font-medium">Order:</label>
                <Select onValueChange={handleSortOrderChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Ascending" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {featuredProperty && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:w-1/2 relative">
                  <img src={featuredProperty.images[0]} alt={featuredProperty.location} className="w-full h-64 object-cover" loading="lazy" />
                  <div className="absolute top-4 left-4 bg-primary text-white text-sm py-1 px-2 rounded-md">
                    Featured
                  </div>
                </div>
                
                <div className="md:w-1/2 p-6">
                  <h2 className="text-2xl font-bold mb-2">{featuredProperty.location}</h2>
                  <p className="text-gray-700 mb-4">
                    {featuredProperty.beds} beds | {featuredProperty.baths} baths | {featuredProperty.sqft} sqft
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xl font-bold">{formatCurrency(featuredProperty.price)}</span>
                      <span className="text-gray-500 ml-2">
                        {featuredProperty.belowMarket}% below market
                      </span>
                    </div>
                    
                    <Button asChild variant="default" className="bg-black hover:bg-gray-800 text-white">
                      <Link to={`/property/${featuredProperty.id}`}>View Property</Link>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {featuredProperty.location}
                      </span>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => toggleLike(featuredProperty.id)}>
                      <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500' : 'text-gray-500'}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-container">
                <div className="gradient-blob"></div>
                <p className="relative z-10 font-medium">Loading properties...</p>
              </div>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  price={property.price}
                  marketPrice={property.market_price}
                  image={property.images[0]}
                  location={property.location}
                  address={property.location}
                  beds={property.beds}
                  baths={property.baths}
                  sqft={property.sqft}
                  belowMarket={property.belowMarket}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">No properties found</h3>
              <p className="text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                Adjust your search criteria or explore other locations.
              </p>
              <Button asChild className="bg-black hover:bg-gray-800 text-white">
                <Link to="/">Return to Homepage</Link>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default Search;

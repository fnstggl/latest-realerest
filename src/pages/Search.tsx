import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import PropertyCard from '@/components/PropertyCard';
import { BeatLoader } from 'react-spinners';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';

const Search = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .textSearch('full_address', searchQuery)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching properties:', error);
        }

        setProperties(data || []);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchProperties();
    } else {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleCardClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const sortedProperties = properties.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <SearchBar />
        </div>
        <h1 className="text-2xl font-bold mb-4">
          Search Results for "{searchQuery}"
        </h1>
        {loading ? (
          <div className="flex justify-center">
            <BeatLoader color="#d60013" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => handleCardClick(property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No properties found for "{searchQuery}".</div>
        )}
      </div>
    </div>
  );
};

export default Search;

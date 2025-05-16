import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PropertyCard from '@/components/PropertyCard';

interface PropertyFormatted {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  image: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
}

const SellerProfile = () => {
  const {
    sellerId
  } = useParams();
  const [sellerName, setSellerName] = useState<string>('Seller');
  const [properties, setProperties] = useState<PropertyFormatted[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch seller properties
  useEffect(() => {
    const fetchSellerProperties = async () => {
      if (!sellerId) return;
      setLoading(true);
      try {
        // Get seller properties - order by created_at DESC to get newest first
        const {
          data,
          error
        } = await supabase
          .from('property_listings')
          .select('*')
          .eq('user_id', sellerId)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching seller properties:", error);
          return;
        }

        // Get seller name
        const {
          data: sellerData,
          error: sellerError
        } = await supabase.from('profiles').select('name').eq('id', sellerId).maybeSingle();
        if (!sellerError && sellerData?.name) {
          setSellerName(sellerData.name);
        } else {
          // Fallback to email
          const {
            data: userData,
            error: userError
          } = await supabase.rpc('get_user_email', {
            user_id_param: sellerId
          });
          if (!userError && userData) {
            const emailName = userData.split('@')[0];
            setSellerName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
          }
        }

        // Format property data
        if (data && data.length > 0) {
          const formattedProperties = data.map(prop => ({
            id: prop.id,
            title: prop.title || 'Property Listing',
            price: Number(prop.price) || 0,
            marketPrice: Number(prop.market_price) || 0,
            image: prop.images && prop.images.length > 0 ? prop.images[0] : '/placeholder.svg',
            location: prop.location || 'Unknown location',
            beds: prop.beds || 0,
            baths: prop.baths || 0,
            sqft: prop.sqft || 0,
            belowMarket: Math.round((Number(prop.market_price) - Number(prop.price)) / Number(prop.market_price) * 100)
          }));
          
          // Set formatted properties to state - using the correct type
          setProperties(formattedProperties);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerProperties();
  }, [sellerId]);
  
  return <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8 p-6 bg-white border border-gray-200 rounded-xl">
            <div className="p-3 rounded-full bg-white mr-4">
              <User size={32} className="text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black my-[35px]">{sellerName}'s Properties</h1>
              <p className="text-gray-600">Browse all properties from this seller</p>
            </div>
          </div>

          {loading ? <div className="text-center py-12">Loading properties...</div> : properties && properties.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => <PropertyCard key={property.id} id={property.id} price={property.price} marketPrice={property.marketPrice} image={property.image || '/placeholder.svg'} location={property.location} address={property.title} beds={property.beds} baths={property.baths} sqft={property.sqft} belowMarket={property.belowMarket} />)}
            </div> : <div className="text-center py-12">
              <p className="text-gray-600">No properties found for this seller.</p>
            </div>}
        </div>
      </div>
      
      <SiteFooter />
    </div>;
};

export default SellerProfile;

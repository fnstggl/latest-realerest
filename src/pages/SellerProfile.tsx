
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import SiteFooter from '@/components/sections/SiteFooter';
import { User } from 'lucide-react';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const { properties, loading } = useProperties({ sellerId });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8 p-6 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="p-3 rounded-full bg-white/80 mr-4">
              <User size={32} className="text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Seller's Properties</h1>
              <p className="text-gray-600">Browse all properties from this seller</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading properties...</div>
          ) : properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties found for this seller.</p>
            </div>
          )}
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default SellerProfile;

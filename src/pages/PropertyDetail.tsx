import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cog, Home } from 'lucide-react';
import WaitlistButton from '@/components/WaitlistButton';
import { usePropertyDetail } from '@/hooks/usePropertyDetail';
import PropertyImages from '@/components/property-detail/PropertyImages';
import PropertyHeader from '@/components/property-detail/PropertyHeader';
import SellerContactInfo from '@/components/property-detail/SellerContactInfo';
import PropertyDescription from '@/components/property-detail/PropertyDescription';
import PropertyDetails from '@/components/property-detail/PropertyDetails';
import MakeOfferButton from '@/components/property-detail/MakeOfferButton';
import OfferStatusBanner from '@/components/property-detail/OfferStatusBanner';
import SiteFooter from '@/components/sections/SiteFooter';

const PropertyDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const {
    property,
    loading,
    isOwner,
    isApproved,
    shouldShowSellerInfo
  } = usePropertyDetail(id);

  const handleAddressClick = () => {
    setShowWaitlistDialog(true);
  };

  if (loading) {
    return <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 w-full mb-6"></div>
            <div className="h-6 bg-gray-200 w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 w-1/4 mb-6"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-gray-200"></div>
              <div className="h-20 bg-gray-200"></div>
              <div className="h-20 bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>;
  }

  if (!property) {
    return <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <p className="mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="neo-button">
            <Link to="/search">Browse Other Properties</Link>
          </Button>
        </div>
      </div>;
  }

  return <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/search" className="flex items-center text-black hover:text-[#d0161a] font-bold transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            Back to Search
          </Link>
        </div>
        
        {!isOwner && isApproved && <OfferStatusBanner propertyId={property.id} sellerName={property.sellerName || 'Property Owner'} sellerEmail={property.sellerEmail} sellerPhone={property.sellerPhone} />}
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <PropertyImages mainImage={property?.image} images={property?.images} />
          
          <div className="flex flex-col justify-between">
            <div>
              <PropertyHeader title={property?.title} belowMarket={property?.belowMarket} price={property?.price} marketPrice={property?.marketPrice} beds={property?.beds} baths={property?.baths} sqft={property?.sqft} location={property?.location} fullAddress={property?.full_address} showFullAddress={isOwner || isApproved} onShowAddressClick={handleAddressClick} />
              
              {isOwner ? <Link to={`/property/${property?.id}/edit`}>
                  <Button className="w-full bg-black text-white font-bold py-2 border-2 border-black hover:bg-gray-800 neo-shadow-sm transition-colors">
                    <Cog size={18} className="mr-2" />
                    Edit Listing
                  </Button>
                </Link> : isApproved ? <div className="space-y-4">
                    <div className="border-2 border-[#0d2f72] p-4 mb-2">
                      <div className="font-bold text-[#d0161a] mb-2 bg-transparent">Your waitlist request has been approved!</div>
                      <p>You now have access to view the full property details and contact the seller directly.</p>
                    </div>
                  </div> : <WaitlistButton propertyId={property?.id || ''} propertyTitle={property?.title || ''} open={showWaitlistDialog} onOpenChange={setShowWaitlistDialog} />}
              
              {property?.afterRepairValue !== undefined && property?.estimatedRehab !== undefined && <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="border-2 border-black p-3">
                    <div className="text-lg font-bold text-black">{property?.afterRepairValue.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}</div>
                    <div className="text-xs">After Repair Value</div>
                  </div>
                  <div className="border-2 border-black p-3">
                    <div className="text-lg font-bold text-black">{property?.estimatedRehab.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}</div>
                    <div className="text-xs">Est. Rehab Cost</div>
                  </div>
                </div>}
            </div>
            
            <SellerContactInfo name={property?.sellerName} phone={property?.sellerPhone} email={property?.sellerEmail} showContact={shouldShowSellerInfo} sellerId={property?.sellerId} />
            
            {isApproved && property && <div className="mt-3">
                <MakeOfferButton propertyId={property.id} propertyTitle={property.title} sellerName={property.sellerName || 'Property Owner'} sellerEmail={property.sellerEmail || ''} sellerPhone={property.sellerPhone || ''} sellerId={property.sellerId || ''} currentPrice={property.price} />
              </div>}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <PropertyDescription 
              description={property?.description} 
              beds={property?.beds} 
              baths={property?.baths} 
              sqft={property?.sqft} 
              belowMarket={property?.belowMarket}
              comparables={shouldShowSellerInfo ? property?.comparables : undefined}
            />
          </div>
          
          <div>
            <PropertyDetails 
              afterRepairValue={property?.afterRepairValue} 
              estimatedRehab={property?.estimatedRehab} 
            />
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>;
};

export default PropertyDetail;

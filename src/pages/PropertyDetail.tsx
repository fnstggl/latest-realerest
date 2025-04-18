
import React, { useState, useEffect } from 'react';
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
import PropertyOffers from '@/components/property-detail/PropertyOffers';
import MakeOfferButton from '@/components/property-detail/MakeOfferButton';
import OfferStatusBanner from '@/components/property-detail/OfferStatusBanner';
import SiteFooter from '@/components/sections/SiteFooter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PropertyDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const [realOffers, setRealOffers] = useState<Array<{
    id: string;
    amount: number;
    buyerName: string;
  }>>([]);
  
  const {
    property,
    loading,
    isOwner,
    isApproved,
    shouldShowSellerInfo
  } = usePropertyDetail(id);

  // Log values for debugging
  useEffect(() => {
    console.log("PropertyDetail - isOwner:", isOwner);
    console.log("PropertyDetail - isApproved:", isApproved);
    console.log("PropertyDetail - shouldShowSellerInfo:", shouldShowSellerInfo);
    console.log("PropertyDetail - property:", property);
  }, [property, isOwner, isApproved, shouldShowSellerInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddressClick = () => {
    setShowWaitlistDialog(true);
  };

  useEffect(() => {
    if (!id) return;
    
    const fetchRealOffers = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('property_offers').select('id, offer_amount, user_id').eq('property_id', id).eq('is_interested', true).order('offer_amount', {
          ascending: false
        }).limit(3);
        
        if (error) {
          console.error("Error fetching real offers:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const formattedOffers = data.map(offer => ({
            id: offer.id,
            amount: Number(offer.offer_amount),
            buyerName: "Anonymous buyer"
          }));
          setRealOffers(formattedOffers);
        } else {
          console.log("No real offers found for this property");
          setRealOffers([]);
        }
      } catch (error) {
        console.error("Error in fetchRealOffers:", error);
      }
    };
    
    fetchRealOffers();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-lg font-semibold">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-black">Property Not Found</h1>
          <p className="mb-8 glass p-4 rounded-lg backdrop-blur-md inline-block">The property you're looking for doesn't exist or has been removed.</p>
          <Button asChild variant="translucent" className="layer-hover layer-2">
            <Link to="/search">Browse Other Properties</Link>
          </Button>
        </div>
      </div>;
  }

  const showPropertyDetails = property?.afterRepairValue !== undefined || property?.estimatedRehab !== undefined;

  return <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/40 rounded-full filter blur-3xl"></div>
      <div className="absolute top-60 -right-20 w-80 h-80 bg-purple-100/40 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 left-60 w-72 h-72 bg-pink-100/30 rounded-full filter blur-3xl"></div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <Button asChild variant="glass" className="flex items-center text-black hover:bg-white/40 font-bold transition-colors layer-hover layer-2">
            <Link to="/search" className="bg-white text-glass-blue">
              <ArrowLeft size={18} className="mr-2" />
              Back to Search
            </Link>
          </Button>
        </div>
        
        {!isOwner && isApproved && <OfferStatusBanner propertyId={property.id} sellerName={property.sellerName || 'Property Owner'} sellerEmail={property.sellerEmail} sellerPhone={property.sellerPhone} />}
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <PropertyImages mainImage={property?.image} images={property?.images} />
          
          <div className="flex flex-col justify-between space-y-4">
            <PropertyHeader 
              title={property?.title} 
              belowMarket={property?.belowMarket} 
              price={property?.price} 
              marketPrice={property?.marketPrice} 
              beds={property?.beds} 
              baths={property?.baths} 
              sqft={property?.sqft} 
              location={property?.location} 
              fullAddress={property?.full_address} 
              showFullAddress={isOwner || isApproved} 
              onShowAddressClick={handleAddressClick} 
            />

            {/* Show Seller Contact Info - Prominently displayed */}
            {shouldShowSellerInfo && property && (
              <SellerContactInfo 
                name={property.sellerName} 
                phone={property.sellerPhone} 
                email={property.sellerEmail} 
                showContact={true} 
                sellerId={property.sellerId}
              />
            )}
            
            {isOwner ? (
              <Link to={`/property/${property?.id}/edit`} className="w-full">
                <Button className="w-full bg-white hover:bg-white text-black font-bold py-2 relative group overflow-hidden rounded-xl">
                  <Cog size={18} className="mr-2" />
                  <span className="text-gradient-static relative z-10">Edit Listing</span>
                  
                  <span 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
                    style={{
                      background: "transparent",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "border-box",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)"
                    }}
                  ></span>
                </Button>
              </Link>
            ) : isApproved ? (
              <div className="glass-card backdrop-blur-lg border border-white/40 shadow-lg p-4 rounded-xl layer-2">
                <div className="font-bold text-black mb-2">Your waitlist request has been approved!</div>
                <p>You now have access to view the full property details and contact the seller directly.</p>
              </div> 
            ) : (
              <WaitlistButton 
                propertyId={property?.id || ''} 
                propertyTitle={property?.title || ''} 
                open={showWaitlistDialog} 
                onOpenChange={setShowWaitlistDialog} 
              />
            )}
            
            {realOffers.length > 0 && property && (
              <PropertyOffers propertyId={property.id} realOffers={realOffers} />
            )}
            
            {property?.afterRepairValue !== undefined && property?.estimatedRehab !== undefined && (
              <div className="grid grid-cols-2 gap-4">
                <div className="glass backdrop-blur-lg border border-white/40 p-3 rounded-lg layer-2">
                  <div className="text-lg font-bold text-black">
                    {property?.afterRepairValue.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </div>
                  <div className="text-xs">After Repair Value</div>
                </div>
                <div className="glass backdrop-blur-lg border border-white/40 p-3 rounded-lg layer-2">
                  <div className="text-lg font-bold text-black">
                    {property?.estimatedRehab.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </div>
                  <div className="text-xs">Est. Rehab Cost</div>
                </div>
              </div>
            )}
            
            {isApproved && property && (
              <div className="mt-3">
                <MakeOfferButton 
                  propertyId={property.id} 
                  propertyTitle={property.title} 
                  sellerName={property.sellerName || 'Property Owner'} 
                  sellerEmail={property.sellerEmail || ''} 
                  sellerPhone={property.sellerPhone || ''} 
                  sellerId={property.sellerId || ''} 
                  currentPrice={property.price} 
                />
              </div>
            )}
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
          
          {showPropertyDetails && (
            <div>
              <PropertyDetails 
                afterRepairValue={property?.afterRepairValue} 
                estimatedRehab={property?.estimatedRehab} 
              />
            </div>
          )}
        </div>
      </div>
      
      <SiteFooter />
    </div>;
};

export default PropertyDetail;

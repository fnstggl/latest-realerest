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
import PropertyOffers from '@/components/property-detail/PropertyOffers';
import MakeOfferButton from '@/components/property-detail/MakeOfferButton';
import OfferStatusBanner from '@/components/property-detail/OfferStatusBanner';
import SiteFooter from '@/components/sections/SiteFooter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import RewardBadge from '@/components/property-detail/RewardBadge';
import { formatCurrency } from '@/lib/utils';
import SEO from '@/components/SEO';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [realOffers, setRealOffers] = useState<Array<{
    id: string;
    amount: number;
    buyerName: string;
  }>>([]);
  const isMobile = useIsMobile();
  
  const {
    property,
    isLoading,
    error,
    sellerInfo,
    waitlistStatus,
    isOwner,
    isApproved,
    shouldShowSellerInfo,
    refreshProperty
  } = usePropertyDetail(id);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchRealOffers = async () => {
      try {
        const { data, error } = await supabase
          .from('property_offers')
          .select('id, offer_amount, user_id, status')
          .eq('property_id', id)
          .eq('is_interested', true)
          .order('offer_amount', { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching real offers:", error);
          return;
        }

        if (data && data.length > 0) {
          const filteredOffers = data
            .filter(offer => offer.status !== 'withdrawn')
            .slice(0, 3);
          const formattedOffers = filteredOffers.map(offer => ({
            id: offer.id,
            amount: Number(offer.offer_amount),
            buyerName: "Anonymous buyer"
          }));
          setRealOffers(formattedOffers);
        } else {
          setRealOffers([]);
        }
      } catch (error) {
        console.error("Error in fetchRealOffers:", error);
      }
    };

    fetchRealOffers();
  }, [id]);

  const handleOfferSubmitted = () => {
    refreshProperty();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-lg font-semibold">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-black">Property Not Found</h1>
          <p className="mb-8 glass p-4 rounded-lg backdrop-blur-md inline-block">The property you're looking for doesn't exist or has been removed.</p>
          <Button asChild variant="translucent" className="layer-hover layer-2">
            <Link to="/search">Browse Other Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Add this utility function to safely access property fields
  const getSellerName = () => {
    return property?.seller_name || property?.userName || 'Property Owner';
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      {property && (
        <SEO
          title={`${property.title} | Realer Estate`}
          description={property.description ? 
            (property.description.length > 155 ? 
              `${property.description.substring(0, 152)}...` : property.description) : 
            `${property.beds} bed, ${property.baths} bath, ${property.sqft} sqft property in ${property.location}. Below market price: ${formatCurrency(property.price)}`}
          image={property.images && property.images.length > 0 ? property.images[0] : '/lovable-uploads/7c808a82-7af5-43f9-ada8-82e9817c464d.png'}
          canonical={`/property/${property.id}`}
          type="article"
          schema={{
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": property.title,
            "description": property.description,
            "url": window.location.href,
            "datePosted": property.createdAt,
            "image": property.images && property.images.length > 0 ? property.images[0] : undefined,
            "numberOfRooms": property.beds,
            "numberOfBathroomsTotal": property.baths,
            "floorSize": {
              "@type": "QuantitativeValue",
              "value": property.sqft,
              "unitCode": "FTK"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": property.location,
              "addressCountry": "US"
            },
            "offers": {
              "@type": "Offer",
              "price": property.price,
              "priceCurrency": "USD"
            }
          }}
        />
      )}
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {isMobile && (
          <div className="mt-10 mb-2 md:mt-0 md:mb-8">
            <Button asChild variant="glass" 
              className="flex items-center hover:bg-white/40 font-bold transition-colors layer-hover layer-2
              text-[10px] px-1.5 py-0.5 w-auto rounded-md">
              <Link to="/search" className="text-black">
                <ArrowLeft size={12} className="mr-0.5" />
                Back to Search
              </Link>
            </Button>
          </div>
        )}
        
        {!isOwner && isApproved && property && (
          <OfferStatusBanner 
            propertyId={property.id} 
            sellerName={property.seller_name || getSellerName()} 
            sellerEmail={property.seller_email || property.userEmail} 
            sellerPhone={property.seller_phone} 
          />
        )}
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <PropertyImages mainImage={property?.images[0]} images={property?.images} />
          </div>
          
          <div className="flex flex-col space-y-4">
            <PropertyHeader 
              title={property?.title || ''} 
              belowMarket={property?.belowMarket || 0} 
              price={property?.price || 0} 
              marketPrice={property?.marketPrice || 0} 
              beds={property?.beds || 0} 
              baths={property?.baths || 0} 
              sqft={property?.sqft || 0} 
              location={property?.location || ''} 
              fullAddress={property?.fullAddress} 
              showFullAddress={isOwner || isApproved} 
              onShowAddressClick={() => {}}
              userId={property?.userId}
              propertyId={property?.id}
              reward={property?.reward || 0}
              sellerName={getSellerName()}
              waitlistStatus={waitlistStatus}
            />

            {property && shouldShowSellerInfo && (
              <SellerContactInfo 
                name={property.seller_name || getSellerName()} 
                phone={property.seller_phone || sellerInfo?.phone || ''} 
                email={property.seller_email || property.userEmail || ''} 
                showContact={true}
                sellerId={property.seller_id || property.userId || ''}
                waitlistStatus={waitlistStatus}
                propertyId={property.id}
                propertyTitle={property.title}
              />
            )}

            {isOwner && property && (
              <Link to={`/property/${property.id}/edit`} className="w-full">
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
            )}
            
            {realOffers.length > 0 && property && (
              <PropertyOffers propertyId={property.id} realOffers={realOffers} />
            )}
            
            {property?.afterRepairValue !== undefined && property?.estimatedRehab !== undefined && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="text-lg font-bold text-black">
                    {formatCurrency(property?.afterRepairValue)}
                  </div>
                  <div className="text-xs">After Repair Value</div>
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="text-lg font-bold text-black">
                    {formatCurrency(property?.estimatedRehab)}
                  </div>
                  <div className="text-xs">Est. Rehab Cost</div>
                </div>
              </div>
            )}
            
            {property && !isOwner && (
              <div className="mt-3">
                <MakeOfferButton 
                  propertyId={property.id} 
                  propertyTitle={property.title} 
                  sellerName={property.seller_name || getSellerName()} 
                  sellerEmail={property.seller_email || property.userEmail || ''} 
                  sellerPhone={property.seller_phone || sellerInfo?.phone || ''} 
                  sellerId={property.seller_id || property.userId || ''} 
                  currentPrice={property.price}
                  onOfferSubmitted={handleOfferSubmitted}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <PropertyDescription 
            description={property?.description} 
            beds={property?.beds} 
            baths={property?.baths} 
            sqft={property?.sqft} 
            belowMarket={property?.belowMarket} 
            comparables={shouldShowSellerInfo ? property?.comparable_addresses : undefined}
            afterRepairValue={property?.afterRepairValue}
            estimatedRehab={property?.estimatedRehab}
            propertyType={property?.propertyType}
            yearBuilt={property?.yearBuilt}
            lotSize={property?.lotSize}
            parking={property?.parking}
            additionalImagesLink={property?.additionalImagesLink}
          />
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default PropertyDetail;

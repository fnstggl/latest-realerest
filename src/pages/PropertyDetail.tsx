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
            "datePosted": property.created_at,
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
            sellerName={property.seller_name || 'Property Owner'} 
            sellerEmail={property.seller_email} 
            sellerPhone={property.seller_phone} 
          />
        )}
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <PropertyImages mainImage={property?.images[0]} images={property?.images} />
          </div>
          
          <div className="flex flex-col space-y-4">
            <PropertyHeader 
              title={property?.title} 
              belowMarket={property?.below_market} 
              price={property?.price} 
              marketPrice={property?.market_price} 
              beds={property?.beds} 
              baths={property?.baths} 
              sqft={property?.sqft} 
              location={property?.location} 
              fullAddress={property?.full_address} 
              showFullAddress={isOwner || isApproved} 
              onShowAddressClick={() => {}}
              userId={property?.user_id}
              propertyId={property?.id}
              reward={property?.reward}
              sellerName={property?.seller_name}
              waitlistStatus={waitlistStatus}
            />

            {property && shouldShowSellerInfo && (
              <SellerContactInfo 
                name={property.seller_name} 
                phone={property.seller_phone} 
                email={property.seller_email}
                showContact={true}
                sellerId={property.seller_id}
                waitlistStatus={waitlistStatus}
                propertyId={property.id}
                propertyTitle={property.title}
              />
            )}

            {isOwner && (
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
            )}
            
            {realOffers.length > 0 && property && (
              <PropertyOffers propertyId={property.id} realOffers={realOffers} />
            )}
            
            {property?.after_repair_value !== undefined && property?.estimated_rehab !== undefined && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="text-lg font-bold text-black">
                    {formatCurrency(property?.after_repair_value)}
                  </div>
                  <div className="text-xs">After Repair Value</div>
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="text-lg font-bold text-black">
                    {formatCurrency(property?.estimated_rehab)}
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
                  sellerName={property.seller_name || 'Property Owner'} 
                  sellerEmail={property.seller_email || ''} 
                  sellerPhone={property.seller_phone || ''} 
                  sellerId={property.seller_id || ''} 
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
            belowMarket={property?.below_market} 
            comparables={shouldShowSellerInfo ? property?.comparable_addresses : undefined}
            afterRepairValue={property?.after_repair_value}
            estimatedRehab={property?.estimated_rehab}
            propertyType={property?.property_type}
            yearBuilt={property?.year_built}
            lotSize={property?.lot_size}
            parking={property?.parking}
            additionalImagesLink={property?.additional_images_link}
          />
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default PropertyDetail;

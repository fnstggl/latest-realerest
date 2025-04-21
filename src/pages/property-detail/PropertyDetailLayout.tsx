
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/sections/SiteFooter";
import PropertyImages from "@/components/property-detail/PropertyImages";
import PropertyDescription from "@/components/property-detail/PropertyDescription";
import PropertyDetails from "@/components/property-detail/PropertyDetails";
import OfferStatusBanner from "@/components/property-detail/OfferStatusBanner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePropertyDetail } from "@/hooks/usePropertyDetail";
import { useRealOffers } from "@/hooks/useRealOffers";
import PropertySidebar from "./PropertySidebar";

const PropertyDetailLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const [wasOfferSuccessful, setWasOfferSuccessful] = useState(false);

  const {
    property,
    isLoading,
    error,
    sellerInfo,
    waitlistStatus,
    isOwner,
    isApproved,
    shouldShowSellerInfo,
    refreshProperty,
  } = usePropertyDetail(id);
  const realOffers = useRealOffers(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddressClick = () => setShowWaitlistDialog(true);

  const refreshAfterDelay = () => {
    setTimeout(() => {
      refreshProperty();
    }, 800);
  };

  const handleOfferSubmitted = () => {
    setWasOfferSuccessful(true);
    refreshAfterDelay();
  };
  const handleOfferWithdrawn = () => {
    setWasOfferSuccessful(false);
    refreshAfterDelay();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-lg font-semibold">
          Loading property details...
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-black">
            Property Not Found
          </h1>
          <p className="mb-8 glass p-4 rounded-lg backdrop-blur-md inline-block">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button
            asChild
            variant="translucent"
            className="layer-hover layer-2"
          >
            <Link to="/search">Browse Other Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  const showPropertyDetails =
    property?.afterRepairValue !== undefined ||
    property?.estimatedRehab !== undefined;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <Button
            asChild
            variant="glass"
            className="flex items-center text-black hover:bg-white/40 font-bold transition-colors layer-hover layer-2"
          >
            <Link to="/search" className="bg-white text-glass-blue">
              <ArrowLeft size={18} className="mr-2" />
              Back to Search
            </Link>
          </Button>
        </div>
        {!isOwner && isApproved && property && (
          <OfferStatusBanner
            propertyId={property.id}
            sellerName={property.sellerName || "Property Owner"}
            sellerEmail={property.sellerEmail}
            sellerPhone={property.sellerPhone}
            onOfferWithdrawn={handleOfferWithdrawn}
          />
        )}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <PropertyImages mainImage={property?.images[0]} images={property?.images} />
          </div>
          <PropertySidebar
            property={property}
            isOwner={isOwner}
            isApproved={isApproved}
            waitlistStatus={waitlistStatus}
            shouldShowSellerInfo={shouldShowSellerInfo}
            showWaitlistDialog={showWaitlistDialog}
            setShowWaitlistDialog={setShowWaitlistDialog}
            handleAddressClick={handleAddressClick}
            refreshProperty={refreshProperty}
            handleOfferWithdrawn={handleOfferWithdrawn}
            handleOfferSubmitted={handleOfferSubmitted}
            realOffers={realOffers}
          />
        </div>
        <div className="mt-6">
          <PropertyDescription
            description={property?.description}
            beds={property?.beds}
            baths={property?.baths}
            sqft={property?.sqft}
            belowMarket={property?.belowMarket}
            comparables={
              shouldShowSellerInfo ? property?.comparableAddresses : undefined
            }
          />
        </div>
        {showPropertyDetails && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <PropertyDetails
                afterRepairValue={property?.afterRepairValue}
                estimatedRehab={property?.estimatedRehab}
              />
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
};

export default PropertyDetailLayout;

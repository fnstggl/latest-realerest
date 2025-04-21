
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cog, ArrowLeft } from "lucide-react";
import WaitlistButton from "@/components/WaitlistButton";
import OfferStatusBanner from "@/components/property-detail/OfferStatusBanner";
import MakeOfferButton from "@/components/property-detail/MakeOfferButton";
import SellerContactInfo from "@/components/property-detail/SellerContactInfo";
import PropertyHeader from "@/components/property-detail/PropertyHeader";
import PropertyOffers from "@/components/property-detail/PropertyOffers";

interface Props {
  property: any;
  isOwner: boolean;
  isApproved: boolean;
  waitlistStatus: string | null;
  shouldShowSellerInfo: boolean;
  showWaitlistDialog: boolean;
  setShowWaitlistDialog: (open: boolean) => void;
  handleAddressClick: () => void;
  refreshProperty: () => void;
  handleOfferWithdrawn: () => void;
  handleOfferSubmitted: () => void;
  realOffers: any[];
}

const PropertySidebar: React.FC<Props> = ({
  property,
  isOwner,
  isApproved,
  waitlistStatus,
  shouldShowSellerInfo,
  showWaitlistDialog,
  setShowWaitlistDialog,
  handleAddressClick,
  refreshProperty,
  handleOfferWithdrawn,
  handleOfferSubmitted,
  realOffers,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <PropertyHeader 
        title={property?.title} 
        belowMarket={property?.belowMarket} 
        price={property?.price} 
        marketPrice={property?.marketPrice} 
        beds={property?.beds} 
        baths={property?.baths} 
        sqft={property?.sqft} 
        location={property?.location} 
        fullAddress={property?.fullAddress} 
        showFullAddress={isOwner || isApproved} 
        onShowAddressClick={handleAddressClick} 
      />

      {!isOwner && !isApproved && waitlistStatus !== "pending" && (
        <WaitlistButton 
          propertyId={property?.id || ""} 
          propertyTitle={property?.title || ""} 
          open={showWaitlistDialog} 
          onOpenChange={setShowWaitlistDialog}
          refreshProperty={refreshProperty}
        />
      )}

      {property && shouldShowSellerInfo && (
        <SellerContactInfo 
          name={property.sellerName} 
          phone={property.sellerPhone} 
          email={property.sellerEmail}
          showContact={true}
          sellerId={property.sellerId}
          waitlistStatus={waitlistStatus}
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

      {isApproved ? (
        <div className="glass-card backdrop-blur-lg border border-white/40 shadow-lg p-4 rounded-xl layer-2">
          <div className="font-bold text-black mb-2">Your waitlist request has been approved!</div>
          <p>You now have access to view the full property details and contact the seller directly.</p>
        </div> 
      ) : waitlistStatus === "pending" ? (
        <div className="glass-card backdrop-blur-lg border border-white/40 shadow-lg p-4 rounded-xl layer-2">
          <div className="font-bold text-black mb-2">Waitlist Request Pending</div>
          <p>You've joined the waitlist for this property. The seller will review your request soon.</p>
        </div>
      ) : null}

      {realOffers.length > 0 && property && (
        <PropertyOffers propertyId={property.id} realOffers={realOffers} />
      )}

      {isApproved && property && (
        <div className="mt-3">
          <MakeOfferButton 
            propertyId={property.id} 
            propertyTitle={property.title} 
            sellerName={property.sellerName || "Property Owner"} 
            sellerEmail={property.sellerEmail || ""} 
            sellerPhone={property.sellerPhone || ""} 
            sellerId={property.sellerId || ""} 
            currentPrice={property.price}
            onOfferSubmitted={handleOfferSubmitted}
          />
        </div>
      )}
    </div>
  );
};

export default PropertySidebar;

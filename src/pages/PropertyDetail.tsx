
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PropertyHeader from '@/components/property-detail/PropertyHeader';
import PropertyImages from '@/components/property-detail/PropertyImages';
import PropertyDetails from '@/components/property-detail/PropertyDetails';
import PropertyDescription from '@/components/property-detail/PropertyDescription';
import { WaitlistButton } from '@/components/WaitlistButton';
import { useAuth } from '@/context/AuthContext';
import { BountyBadge } from '@/components/property-detail/BountyBadge';
import LikeButton from '@/components/property-detail/LikeButton';
import MakeOfferButton from '@/components/property-detail/MakeOfferButton';
import OfferStatusBanner from '@/components/property-detail/OfferStatusBanner';
import SellerContactInfo from '@/components/property-detail/SellerContactInfo';
import { usePropertyDetail } from '@/hooks/usePropertyDetail';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showContactInfo, setShowContactInfo] = useState(false);
  
  // Fix: Get all the properties from usePropertyDetail hook
  const { 
    property, 
    isLoading, 
    error, 
    isLiked, 
    toggleLike,
    sellerInfo,
    waitlistStatus,
    isOwner,
    isApproved,
    shouldShowSellerInfo,
    refreshProperty
  } = usePropertyDetail(id || '', user?.id);

  // Calculate percentage below market
  const belowMarket = property ? 
    Math.round(((Number(property.market_price) - Number(property.price)) / Number(property.market_price)) * 100)
    : 0;

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Could not load property details. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-2/3 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property || error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/search">Browse Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save properties",
        variant: "default"
      });
      navigate("/signin", { state: { from: `/property/${id}` } });
      return;
    }
    
    await toggleLike();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Property link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] pt-20">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </Button>
          
          <div className="flex-1">
            <div className="text-sm text-gray-500">
              <MapPin size={14} className="inline mr-1" />
              {property.location}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
            >
              <Share2 size={18} className="mr-2" /> Share
            </Button>
            
            <LikeButton 
              propertyId={property.id}
              isLiked={isLiked}
              onClick={handleToggleLike} 
            />
          </div>
        </div>
        
        {waitlistStatus === 'accepted' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">Your waitlist request has been approved!</h3>
                <p className="text-green-700 text-sm">
                  You can now contact the seller directly for more information.
                </p>
              </div>
              <Button 
                onClick={() => setShowContactInfo(true)} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                View Contact Info
              </Button>
            </div>
          </div>
        )}
        
        <PropertyHeader 
          title={property.title}
          price={property.price}
          marketPrice={property.market_price}
          belowMarket={belowMarket}
          location={property.location}
          fullAddress={property.full_address}
          bounty={property.bounty}
          userType={user?.accountType || 'buyer'}
          userId={property.user_id}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <PropertyImages images={property.images || []} />
            
            <div className="mt-8">
              <PropertyDescription 
                description={property.description} 
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                belowMarket={belowMarket}
              />
            </div>
            
            <div className="mt-8">
              <PropertyDetails 
                beds={property.beds} 
                baths={property.baths} 
                sqft={property.sqft}
                propertyType={property.property_type}
                afterRepairValue={property.after_repair_value}
                estimatedRehab={property.estimated_rehab}
              />
            </div>
            
            {isOwner && (
              <div className="mt-8 flex space-x-4">
                <Button asChild className="flex-1">
                  <Link to={`/property/${id}/edit`}>Edit Property</Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            {property.bounty > 0 && user?.accountType === 'wholesaler' && (
              <BountyBadge amount={property.bounty} propertyId={property.id} userId={user?.id} />
            )}
            
            {!isOwner && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg mb-4">Interested in this property?</h3>
                
                {shouldShowSellerInfo ? (
                  <SellerContactInfo
                    name={property.seller_name}
                    phone={property.seller_phone}
                    email={property.seller_email}
                    propertyId={property.id}
                    sellerId={property.seller}
                    refreshProperty={refreshProperty}
                  />
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-gray-600">Contact the seller for more information</p>
                    </div>
                    
                    <div className="space-y-3">
                      <MakeOfferButton propertyId={property.id} />
                      <WaitlistButton 
                        propertyId={property.id}
                        status={waitlistStatus}
                        onSuccess={refreshProperty}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            
            {showContactInfo && waitlistStatus === 'accepted' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg mb-4">Seller Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {property.seller_name}</p>
                  <p><span className="font-medium">Email:</span> {property.seller_email}</p>
                  <p><span className="font-medium">Phone:</span> {property.seller_phone}</p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate(`/conversation/${property.seller}`)}
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;

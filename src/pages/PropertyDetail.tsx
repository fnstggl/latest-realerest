
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Bed, Bath, Square, ArrowLeft, MapPin, Phone, Mail, Home, Cog, Hammer } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import WaitlistButton from '@/components/WaitlistButton';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  description?: string;
  image: string;
  images?: string[];
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  sellerId?: string;
  sellerName?: string;
  afterRepairValue?: number;
  estimatedRehab?: number;
  comparables?: string[];
  createdAt?: string;
  sellerPhone?: string;
  sellerEmail?: string;
}

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const { user } = useAuth();
  
  // User role flags
  const [isOwner, setIsOwner] = useState(false);
  
  // Check if this buyer has been approved to view this property
  const [isApproved, setIsApproved] = useState(false);
  
  // Dialog state for waitlist
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  
  useEffect(() => {
    if (user?.id && id) {
      // Check if this buyer has been approved to view this property
      const checkWaitlistStatus = async () => {
        try {
          const { data, error } = await supabase
            .from('waitlist_requests')
            .select('status')
            .eq('property_id', id)
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            console.error("Error checking waitlist status:", error);
            return;
          }
          
          if (data) {
            setIsApproved(data.status === 'accepted');
          }
        } catch (error) {
          console.error("Error checking waitlist approval:", error);
        }
      };
      
      checkWaitlistStatus();
    }
  }, [user?.id, id]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // First try to fetch property data from Supabase
        const { data: propertyData, error: propertyError } = await supabase
          .from('property_listings')
          .select('*')
          .eq('id', id)
          .single();
          
        if (propertyError) {
          console.error("Error fetching property:", propertyError);
          throw propertyError;
        }
        
        // Separately fetch seller profile data to avoid type issues
        const { data: sellerData, error: sellerError } = await supabase
          .from('profiles')
          .select('name, email, phone')
          .eq('id', propertyData.user_id)
          .single();
        
        if (sellerError && sellerError.code !== 'PGRST116') {
          console.error("Error fetching seller profile:", sellerError);
          // Continue without seller data
        }
        
        if (propertyData) {
          // Transform the property data
          const transformedProperty: Property = {
            id: propertyData.id,
            title: propertyData.title || 'Property Listing',
            price: Number(propertyData.price) || 0,
            marketPrice: Number(propertyData.market_price) || 0,
            description: propertyData.description,
            image: propertyData.images && propertyData.images.length > 0 
              ? propertyData.images[0] 
              : '/placeholder.svg',
            images: propertyData.images || [],
            location: propertyData.location || 'Unknown location',
            beds: propertyData.beds || 0,
            baths: propertyData.baths || 0,
            sqft: propertyData.sqft || 0,
            belowMarket: calculateBelowMarket(Number(propertyData.market_price), Number(propertyData.price)),
            sellerId: propertyData.user_id,
            sellerName: sellerData?.name || 'Property Owner',
            sellerPhone: sellerData?.phone || 'No phone number provided',
            sellerEmail: sellerData?.email,
            // Use actual ARV and rehab values if provided, otherwise calculate defaults
            afterRepairValue: propertyData.after_repair_value 
              ? Number(propertyData.after_repair_value) 
              : Number(propertyData.market_price) * 1.2,
            estimatedRehab: propertyData.estimated_rehab 
              ? Number(propertyData.estimated_rehab) 
              : Number(propertyData.market_price) * 0.1
          };
          
          setProperty(transformedProperty);
          
          // Check if user is the owner
          if (user?.id && user.id === propertyData.user_id) {
            setIsOwner(true);
          }
          
          // Set the active image
          if (transformedProperty.images && transformedProperty.images.length > 0) {
            setActiveImage(transformedProperty.images[0]);
          } else {
            setActiveImage(transformedProperty.image);
          }
        } else {
          // Fallback to localStorage if not found in Supabase
          fallbackToLocalStorage();
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        // Fallback to localStorage
        fallbackToLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    const fallbackToLocalStorage = () => {
      try {
        // Get from localStorage
        const allListingsJSON = localStorage.getItem('propertyListings');
        if (allListingsJSON) {
          const allListings = JSON.parse(allListingsJSON);
          const foundProperty = allListings.find((p: Property) => p.id === id);
          
          if (foundProperty) {
            setProperty(foundProperty);
            
            // Check if user is the owner
            if (user?.id && foundProperty.sellerId === user.id) {
              setIsOwner(true);
            }
            
            if (foundProperty.images && foundProperty.images.length > 0) {
              setActiveImage(foundProperty.images[0]);
            } else {
              setActiveImage(foundProperty.image);
            }
          } else {
            toast.error("Property not found");
          }
        } else {
          toast.error("No property listings found");
        }
      } catch (error) {
        console.error("Error fetching property from localStorage:", error);
        toast.error("Failed to load property details");
      }
    };
    
    const calculateBelowMarket = (marketPrice: number, listingPrice: number): number => {
      if (!marketPrice || !listingPrice || marketPrice <= 0) return 0;
      return Math.round(((marketPrice - listingPrice) / marketPrice) * 100);
    };

    fetchProperty();
  }, [id, user?.id]);

  // Helper function to mask the address for users who aren't approved
  const getDisplayLocation = () => {
    if (isOwner || isApproved) {
      return property?.location;
    }
    // Create a clickable masked location that opens the waitlist dialog
    return property?.location.replace(
      /^[^,]+/, 
      "<span class='cursor-pointer text-blue-600 hover:underline' onClick={() => setShowWaitlistDialog(true)}>[Join Waitlist For Address]</span>"
    );
  };

  // Function to handle the address click for non-approved users
  const handleAddressClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowWaitlistDialog(true);
  };

  // This will safely render HTML or plain text based on whether the user is approved
  const renderLocation = () => {
    if (!property) return null;
    
    if (isOwner || isApproved) {
      return (
        <span className="font-medium">{property.location}</span>
      );
    }
    
    // Extract the address part for masking
    const parts = property.location.split(',');
    const maskedAddress = "[Join Waitlist For Address]";
    const restOfAddress = parts.slice(1).join(',');
    
    return (
      <span className="font-medium">
        <span 
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={handleAddressClick}
        >
          {maskedAddress}
        </span>
        {restOfAddress ? `,${restOfAddress}` : ''}
      </span>
    );
  };

  // Helper function to determine if user should see detailed property info
  const canSeeDetailedInfo = () => {
    return isOwner || isApproved || (user && user.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
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
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <p className="mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="neo-button">
            <Link to="/search">Browse Other Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/search" className="flex items-center text-black hover:text-[#d60013] font-bold transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            Back to Search
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4">
              <img 
                src={activeImage || property?.image} 
                alt={property?.title} 
                className="w-full h-[400px] object-cover"
              />
            </div>
            
            {property?.images && property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`border-2 cursor-pointer ${activeImage === img ? 'border-[#d60013]' : 'border-black'}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img 
                      src={img} 
                      alt={`${property.title} ${index + 1}`} 
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#d60013] text-white px-3 py-1 border-2 border-black font-bold inline-flex items-center">
                  {property?.belowMarket}% BELOW MARKET
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{property?.title}</h1>
              
              <div className="flex items-center mb-4">
                <MapPin size={18} className="mr-2 text-[#d60013]" />
                {renderLocation()}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-black p-4">
                  <div className="text-2xl font-bold text-[#d60013]">{property && formatCurrency(property.price)}</div>
                  <div className="text-sm">Listing Price</div>
                </div>
                <div className="border-2 border-black p-4">
                  <div className="text-xl font-bold line-through text-gray-500">{property && formatCurrency(property.marketPrice)}</div>
                  <div className="text-sm">Market Value</div>
                </div>
              </div>
              
              <div className="flex justify-between pt-3 border-t-2 border-black mb-6">
                <div className="flex items-center">
                  <Bed size={18} className="mr-1" />
                  <span className="font-bold">{property?.beds}</span>
                </div>
                <div className="flex items-center">
                  <Bath size={18} className="mr-1" />
                  <span className="font-bold">{property?.baths}</span>
                </div>
                <div className="flex items-center">
                  <Square size={18} className="mr-1" />
                  <span className="font-bold">{property?.sqft?.toLocaleString()} sqft</span>
                </div>
              </div>
              
              {property && isOwner ? (
                <Link to={`/property/${property.id}/edit`}>
                  <Button className="w-full bg-black text-white font-bold py-2 border-2 border-black hover:bg-gray-800 neo-shadow-sm transition-colors">
                    <Cog size={18} className="mr-2" />
                    Edit Listing
                  </Button>
                </Link>
              ) : (
                property && (isApproved ? (
                  <div className="border-2 border-green-600 p-4 mb-6">
                    <div className="font-bold text-green-600 mb-2">Your waitlist request has been approved!</div>
                    <p>You now have access to view the full property details and contact the seller directly.</p>
                  </div>
                ) : (
                  property && (
                    <>
                      <WaitlistButton 
                        propertyId={property.id} 
                        propertyTitle={property.title} 
                        open={showWaitlistDialog}
                        onOpenChange={setShowWaitlistDialog}
                      />
                      
                      {/* Show ARV and Rehab boxes for signed-in users or the owner */}
                      {canSeeDetailedInfo() && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="border-2 border-black p-3">
                            <div className="text-lg font-bold text-black">{property.afterRepairValue && formatCurrency(property.afterRepairValue)}</div>
                            <div className="text-xs">After Repair Value</div>
                          </div>
                          <div className="border-2 border-black p-3">
                            <div className="text-lg font-bold text-black">{property.estimatedRehab && formatCurrency(property.estimatedRehab)}</div>
                            <div className="text-xs">Est. Rehab Cost</div>
                          </div>
                        </div>
                      )}
                    </>
                  )
                ))
              )}
            </div>
            
            {property && (isOwner || isApproved) && property.sellerName && (
              <div className="border-2 border-black p-4 mt-6">
                <h3 className="font-bold mb-2">Contact Seller</h3>
                <p className="mb-1">{property.sellerName}</p>
                {property.sellerPhone && (
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2" />
                    <span>{property.sellerPhone}</span>
                  </div>
                )}
                {property.sellerEmail && (
                  <div className="flex items-center mt-1">
                    <Mail size={16} className="mr-2" />
                    <span>{property.sellerEmail}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <h2 className="text-2xl font-bold mb-4">Property Description</h2>
              <p className="whitespace-pre-line">
                {property?.description || 
                  property && `This beautiful property offers great value at ${property.belowMarket}% below market price. 
                  With ${property.beds} bedrooms and ${property.baths} bathrooms across ${property.sqft.toLocaleString()} square feet, 
                  it's perfect for families looking for their dream home.
                  
                  Located in a desirable neighborhood, this property won't last long at this price!`
                }
              </p>
            </div>
          </div>
          
          <div>
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-bold">Property Type:</span>
                  <span>Single Family</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Year Built:</span>
                  <span>2005</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Lot Size:</span>
                  <span>0.25 acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Parking:</span>
                  <span>2-Car Garage</span>
                </div>
                
                {/* Show ARV and rehab estimates to all signed-in users */}
                {canSeeDetailedInfo() && property?.afterRepairValue && (
                  <div className="flex justify-between">
                    <span className="font-bold">ARV:</span>
                    <span>{formatCurrency(property.afterRepairValue)}</span>
                  </div>
                )}
                
                {canSeeDetailedInfo() && property?.estimatedRehab && (
                  <div className="flex justify-between">
                    <span className="font-bold">Est. Rehab Cost:</span>
                    <span>{formatCurrency(property.estimatedRehab)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {property && (isOwner || isApproved) && property.comparables && property.comparables.length > 0 && (
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-12">
            <h2 className="text-2xl font-bold mb-4">Comparable Properties</h2>
            <ul className="space-y-2">
              {property.comparables.map((address, index) => (
                <li key={index} className="flex items-start">
                  <Home size={18} className="mr-2 mt-1 text-[#d60013]" />
                  <span>{address}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Bed, Bath, SquareFoot, CheckCircle, Heart, Home, Edit, Share2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { Helmet } from 'react-helmet-async';

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  created_at: string;
  user_id: string;
  belowMarket: number;
  amenities: string[];
  yearBuilt: number;
  propertyType: string;
  parking: string;
  heating: string;
  cooling: string;
  mlsNumber: string;
  lotSize: number;
  taxes: number;
  hoa: number;
  status: string;
  views: number;
}

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setProperty(data);
        
        // Increment views
        await supabase
          .from('property_listings')
          .update({ views: (data?.views || 0) + 1 })
          .eq('id', id);

      } catch (error: any) {
        console.error('Error fetching property:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load property",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, toast]);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user || !id) return;
      try {
        const { data, error } = await supabase
          .from('likes')
          .select('*')
          .eq('user_id', user.id)
          .eq('property_id', id)
          .single();

        if (error && error.code !== '404') throw error;

        setIsLiked(!!data);
      } catch (error: any) {
        console.error('Error checking like status:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to check like status",
          variant: "destructive"
        });
      }
    };

    checkLikeStatus();
  }, [user, id, toast]);

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      if (!property) return;
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .eq('location', property.location)
          .neq('id', property.id)
          .limit(3);

        if (error) throw error;

        setSimilarProperties(data || []);
      } catch (error: any) {
        console.error('Error fetching similar properties:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load similar properties",
          variant: "destructive"
        });
      }
    };

    fetchSimilarProperties();
  }, [property, toast]);

  const toggleLike = async () => {
    if (!user || !id) {
      navigate('/signin');
      return;
    }

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', id);

        if (error) throw error;

        setIsLiked(false);
        toast({
          title: "Unliked",
          description: "Property removed from your favorites."
        });
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ user_id: user.id, property_id: id }]);

        if (error) throw error;

        setIsLiked(true);
        toast({
          title: "Liked",
          description: "Property added to your favorites."
        });
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || 'Check out this property!',
        text: property?.description || 'A great property you might be interested in.',
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.error('Error sharing', error));
    } else {
      toast({
        title: "Sharing not supported",
        description: "Please copy the link and share it manually.",
        variant: "warning"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="space-y-4">
            <div className="h-12 bg-gray-100 animate-pulse rounded-xl w-3/4"></div>
            <div className="h-96 bg-gray-100 animate-pulse rounded-xl"></div>
            <div className="h-8 bg-gray-100 animate-pulse rounded-xl w-1/2"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
              <div className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
              <div className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Property not found</h2>
            <p className="mb-6">Sorry, the property you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <Helmet>
        <title>{property.title} | Realer Estate</title>
        <meta name="description" content={property.description} />
        <meta property="og:title" content={property.title} />
        <meta property="og:description" content={`Check out this property in ${property.location} for ${Number(property.price).toLocaleString()}!`} />
        <meta property="og:image" content={property.images[0]} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={window.location.href} />
        
        {/* Property-specific structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": property.title,
            "description": property.description,
            "image": property.images,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": property.location
            },
            "price": property.price,
            "numberOfBedrooms": property.beds,
            "numberOfBathroomsTotal": property.baths,
            "propertyArea": {
              "@type": "QuantitativeValue",
              "value": property.sqft,
              "unitCode": "FTK"
            },
            "url": window.location.href
          })}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Button 
            variant="outline" 
            asChild 
            className="mb-6 border-gray-200 hover:bg-gray-50"
          >
            <Link to="/search" className="flex items-center gap-2">
              <ChevronLeft size={16} />
              Back to Search
            </Link>
          </Button>
          
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent className="-ml-1 pl-1">
                {property.images.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={image}
                          alt={`${property.title} - Image ${index + 1}`}
                          className="object-cover rounded-md"
                        />
                      </AspectRatio>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
            
            <div className="absolute top-4 right-4 flex gap-2">
              {user?.id === property.user_id && (
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={() => navigate(`/property/${id}/edit`)}
                  aria-label="Edit property"
                >
                  <Edit size={16} />
                </Button>
              )}
              
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={shareProperty}
                aria-label="Share property"
              >
                <Share2 size={16} />
              </Button>
              
              <Button 
                variant={isLiked ? "default" : "outline"} 
                size="icon" 
                onClick={toggleLike}
                aria-label="Like property"
              >
                <Heart size={16} className={isLiked ? "text-white" : "text-black"} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">{property.title}</CardTitle>
                  <Badge className="bg-green-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                    {property.status}
                  </Badge>
                </div>
                <p className="text-gray-500">
                  <MapPin className="inline-block mr-1 h-4 w-4" />
                  {property.location} - Listed {formatDate(property.created_at)}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Bed className="mr-1 h-5 w-5" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="mr-1 h-5 w-5" />
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <SquareFoot className="mr-1 h-5 w-5" />
                    <span>{property.sqft} SqFt</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Property Description</h3>
                  <p className="text-gray-700">{property.description}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Key Features</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Year Built: {property.yearBuilt}</li>
                    <li>Property Type: {property.propertyType}</li>
                    <li>Parking: {property.parking}</li>
                    <li>Heating: {property.heating}</li>
                    <li>Cooling: {property.cooling}</li>
                    <li>MLS Number: {property.mlsNumber}</li>
                    <li>Lot Size: {property.lotSize} sqft</li>
                    <li>Taxes: ${Number(property.taxes).toLocaleString()}</li>
                    <li>HOA: ${Number(property.hoa).toLocaleString()}</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} className="bg-gray-100 text-gray-700 border-none">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Price Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Listing Price</h3>
                  <div className="text-3xl font-bold">${Number(property.price).toLocaleString()}</div>
                  <Badge className="bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-medium">
                    {property.belowMarket}% Below Market Value
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Estimated Mortgage</h3>
                  <p className="text-gray-700">Calculate your estimated monthly mortgage payment with our mortgage calculator.</p>
                  <Button asChild variant="secondary">
                    <Link to="/#mortgage-calculator">
                      Mortgage Calculator
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-8 shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Similar Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {similarProperties.length > 0 ? (
                  similarProperties.map(similarProperty => (
                    <div key={similarProperty.id} className="flex items-center gap-4">
                      <div className="w-24 h-20 overflow-hidden rounded-md">
                        <img
                          src={similarProperty.images[0]}
                          alt={similarProperty.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-1">
                        <Link to={`/property/${similarProperty.id}`} className="font-medium hover:underline">
                          {similarProperty.title}
                        </Link>
                        <p className="text-sm text-gray-500">{similarProperty.location}</p>
                        <p className="text-sm font-bold">${Number(similarProperty.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No similar properties found in this location.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button className="bg-black hover:bg-gray-800 text-white">
            <a href={`mailto:info@realerestate.org?subject=Inquiry about ${property.title}`} className="flex items-center gap-2">
              <Home size={16} />
              Contact Us About This Property
            </a>
          </Button>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default PropertyDetail;


import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { deletePropertyImages } from "@/components/create-listing/UploadService";

interface Property {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  image?: string;
  images?: string[];
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  waitlistCount?: number;
}

interface PropertiesTabProps {
  myProperties: Property[];
  setMyProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  waitlistUsers: any[];
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
}

const PropertiesTab: React.FC<PropertiesTabProps> = ({
  myProperties,
  setMyProperties,
  waitlistUsers,
  showAddForm,
  setShowAddForm,
  isLoading,
  setIsLoading,
  user
}) => {
  const handleUnlistProperty = async (propertyId: string) => {
    if (!user) return;
    
    try {
      // Find the property to get its images before deletion
      const property = myProperties.find(p => p.id === propertyId);
      const propertyImages = property?.images || [];
      
      // First delete from database
      const { error } = await supabase
        .from('property_listings')
        .delete()
        .eq('id', propertyId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error deleting property:", error);
        toast.error("Failed to unlist property");
        return;
      }
      
      // Update local state
      const updatedProperties = myProperties.filter(property => property.id !== propertyId);
      setMyProperties(updatedProperties);
      
      // After database deletion succeeds, clean up storage
      // We do this after database deletion to ensure we don't have orphaned records
      if (propertyImages.length > 0) {
        toast.loading("Cleaning up property images...", { id: "cleanup-toast" });
        
        const cleanupResult = await deletePropertyImages(propertyId);
        
        if (cleanupResult) {
          toast.dismiss("cleanup-toast");
          toast.success("Property unlisted successfully and images cleaned up");
        } else {
          toast.dismiss("cleanup-toast");
          toast.success("Property unlisted successfully, but some images couldn't be cleaned up");
        }
      } else {
        toast.success("Property unlisted successfully");
      }
    } catch (error) {
      console.error("Exception unlisting property:", error);
      toast.error("Failed to unlist property");
    }
  };

  return <>
      {isLoading ? <div className="layer-2 backdrop-blur-lg p-12 text-center rounded-xl border border-white/40">
          <p className="mb-6">Loading your properties...</p>
        </div> : myProperties.length > 0 ? <div className="grid md:grid-cols-1 gap-6">
          {myProperties.map(property => <div key={property.id} className="backdrop-blur-lg border border-white/40 rounded-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3">
                  <img src={property.image} alt={property.title} className="h-64 w-full object-cover" />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-black">{property.title}</h3>
                    <div className="relative bg-white text-black px-3 py-1 font-bold inline-flex items-center text-sm rounded-lg group transition-colors">
                      <span>{Math.round(property.belowMarket)}% BELOW MARKET</span>
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" style={{
                  background: "transparent",
                  border: "2px solid transparent",
                  backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude"
                }} />
                    </div>
                  </div>
                  
                  <p className="text-lg mb-4 text-black">{property.location}</p>
                  
                  <div className="flex gap-6 mb-6">
                    <div className="text-2xl font-bold text-black">${property.price.toLocaleString()}</div>
                    <div className="text-gray-500 line-through">${property.marketPrice.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex gap-6 mb-6">
                    <div className="font-bold text-black">{property.beds} Beds</div>
                    <div className="font-bold text-black">{property.baths} Baths</div>
                    <div className="font-bold text-black">{property.sqft.toLocaleString()} sqft</div>
                  </div>
                  
                  <div className="flex gap-4 flex-wrap md:flex-nowrap">
                    <Button asChild className="relative bg-white text-black border border-gray-200 group hover:bg-white transition-all text-xs md:text-sm px-2 md:px-4">
                      <Link to={`/property/${property.id}`}>
                        View Listing
                        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }} />
                      </Link>
                    </Button>
                    <Button asChild className="relative bg-white border border-gray-200 group hover:bg-white transition-all text-xs md:text-sm px-2 md:px-4">
                      <Link to={`/property/${property.id}/edit`} style={{ color: "#000000" }}>
                        Edit Listing
                        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }} />
                      </Link>
                    </Button>
                    <Button 
                      className="relative bg-white text-black border border-gray-200 group hover:bg-white transition-all text-xs md:text-sm px-2 md:px-4" 
                      onClick={() => handleUnlistProperty(property.id)}
                    >
                      <Trash2 size={16} className="mr-1 md:mr-2 md:size-[18px]" />
                      Unlist
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/20 p-4 bg-white/30 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <div className="text-black">
                    <span className="font-bold mr-2">Waitlist:</span>
                    {waitlistUsers.filter(user => user.propertyId === property.id).length} interested buyers
                  </div>
                  <Button asChild className="relative bg-white text-black border border-gray-200 group hover:bg-white transition-all">
                    
                  </Button>
                </div>
              </div>
            </div>)}
        </div> : <div className="backdrop-blur-lg p-12 text-center rounded-xl border border-white/40">
          <Building2 size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4 text-black">No Properties Listed</h3>
          <p className="mb-6 text-black">You haven't listed any properties yet.</p>
          <Button asChild variant="glass" className="relative bg-white text-black border border-gray-200 group hover:bg-white transition-all text-xs md:text-sm px-2 md:px-4">
            <Link to="/sell/create">
              <Plus size={16} className="mr-1 md:mr-2 md:size-[18px]" />
              Add Your First Property
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" style={{
            background: "transparent",
            border: "2px solid transparent",
            backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF3CAC 80%)",
            backgroundOrigin: "border-box",
            backgroundClip: "border-box",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude"
          }} />
            </Link>
          </Button>
        </div>}
    </>;
};

export default PropertiesTab;


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
      const {
        error
      } = await supabase.from('property_listings').delete().eq('id', propertyId).eq('user_id', user.id);
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
        toast.loading("Cleaning up property images...", {
          id: "cleanup-toast"
        });
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
      {isLoading ? <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
          <p className="mb-6">Loading your properties...</p>
        </div> : myProperties.length > 0 ? <div className="grid md:grid-cols-1 gap-6">
          {myProperties.map(property => <div key={property.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 rounded-tl-xl rounded-bl-xl overflow-hidden">
                  <img src={property.image} alt={property.title} className="h-64 w-full object-cover" />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-polysans text-black">{property.title}</h3>
                    <div className="bg-white text-[#01204b] px-3 py-1 font-polysans inline-flex items-center text-sm rounded-lg">
                      <span>{Math.round(property.belowMarket)}% BELOW MARKET</span>
                    </div>
                  </div>
                  
                  <p className="text-lg mb-4 font-polysans-semibold text-[#01204b]">{property.location}</p>
                  
                  <div className="flex gap-6 mb-6">
                    <div className="text-2xl font-polysans text-[#01204b]">${property.price.toLocaleString()}</div>
                    <div className="text-gray-500 font-polysans-semibold line-through">${property.marketPrice.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex gap-6 mb-6">
                    <div className="font-polysans-semibold text-[#01204b]">{property.beds} Beds</div>
                    <div className="font-polysans-semibold text-[#01204b]">{property.baths} Baths</div>
                    <div className="font-polysans-semibold text-[#01204b]">{property.sqft.toLocaleString()} sqft</div>
                  </div>
                  
                  <div className="flex gap-4 flex-wrap md:flex-nowrap">
                    <Button asChild className="bg-white text-[#01204b] font-polysans border border-gray-200 text-xs md:text-sm px-2 md:px-4 hover:bg-white">
                      <Link to={`/property/${property.id}`}>
                        View Listing
                      </Link>
                    </Button>
                    <Button asChild className="bg-white border border-gray-200 font-polysans text-xs md:text-sm px-2 md:px-4 hover:bg-white">
                      <Link to={`/property/${property.id}/edit`} style={{
                  color: "#01204b"
                }}>
                        Edit Listing
                      </Link>
                    </Button>
                    <Button className="bg-white text-[#01204b] font-polysans border border-gray-200 text-xs md:text-sm px-2 md:px-4 hover:bg-white" onClick={() => handleUnlistProperty(property.id)}>
                      <Trash2 size={16} className="mr-1 md:mr-2 md:size-[18px]" />
                      Unlist
                    </Button>
                  </div>
                </div>
              </div>
            </div>)}
        </div> : <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
          <Building2 size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-polysans mb-4 text-[#01204b]">No Properties Listed</h3>
          <p className="mb-6 font-polysans-semibold text-[#01204b]">You haven't listed any properties yet.</p>
          <Button asChild variant="glass" className="bg-white text-[#01204b] font-polysans border border-gray-200 text-xs md:text-sm px-2 md:px-4 hover:bg-white">
            <Link to="/sell/create">
              <Plus size={16} className="mr-1 md:mr-2 md:size-[18px]" />
              Add Your First Property
            </Link>
          </Button>
        </div>}
    </>;
};
export default PropertiesTab;

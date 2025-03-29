import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  image?: string;
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
      
      // Update UI
      const updatedProperties = myProperties.filter(property => property.id !== propertyId);
      setMyProperties(updatedProperties);
      
      // Show success message
      toast.success("Property unlisted successfully");
    } catch (error) {
      console.error("Exception unlisting property:", error);
      toast.error("Failed to unlist property");
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-6">Loading your properties...</p>
        </div>
      ) : myProperties.length > 0 ? (
        <div className="grid md:grid-cols-1 gap-6">
          {myProperties.map((property) => (
            <div key={property.id} className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3">
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        className="h-64 w-full object-cover border-b-4 md:border-b-0 md:border-r-4 border-black"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold">{property.title}</h3>
                        <div className="bg-[#d60013] text-white px-3 py-1 border-2 border-black font-bold">
                          {property.belowMarket}% BELOW MARKET
                        </div>
                      </div>
                      <p className="text-lg mb-4">{property.location}</p>
                      
                      <div className="flex gap-6 mb-6">
                        <div className="text-2xl font-bold">${property.price.toLocaleString()}</div>
                        <div className="text-gray-500 line-through">${property.marketPrice.toLocaleString()}</div>
                      </div>
                      
                      <div className="flex gap-6 mb-6">
                        <div className="font-bold">{property.beds} Beds</div>
                        <div className="font-bold">{property.baths} Baths</div>
                        <div className="font-bold">{property.sqft.toLocaleString()} sqft</div>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button asChild className="neo-button" variant="outline">
                          <Link to={`/property/${property.id}`}>View Listing</Link>
                        </Button>
                        <Button asChild className="neo-button-primary">
                          <Link to={`/property/${property.id}/edit`}>Edit</Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          onClick={() => handleUnlistProperty(property.id)}
                        >
                          <Trash2 size={18} className="mr-2" />
                          Unlist
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t-4 border-black p-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold mr-2">Waitlist:</span>
                        {waitlistUsers.filter(user => user.propertyId === property.id).length} interested buyers
                      </div>
                      <Button asChild className="neo-button" variant="outline">
                        <Link to={`/dashboard?tab=waitlist&propertyId=${property.id}`}>
                          Manage Waitlist
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
          ))}
        </div>
      ) : (
        <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Building2 size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">No Properties Listed</h3>
          <p className="mb-6">You haven't listed any properties yet.</p>
          <Button 
            asChild
            className="neo-button-primary"
          >
            <Link to="/sell/create">
              <Plus size={18} className="mr-2" />
              Add Your First Property
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default PropertiesTab;

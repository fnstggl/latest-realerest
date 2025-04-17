
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
      
      const updatedProperties = myProperties.filter(property => property.id !== propertyId);
      setMyProperties(updatedProperties);
      
      toast.success("Property unlisted successfully");
    } catch (error) {
      console.error("Exception unlisting property:", error);
      toast.error("Failed to unlist property");
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="layer-2 glass-card backdrop-blur-lg p-12 text-center rounded-xl border border-white/40 shadow-lg">
          <p className="mb-6">Loading your properties...</p>
        </div>
      ) : myProperties.length > 0 ? (
        <div className="grid md:grid-cols-1 gap-6">
          {myProperties.map((property) => (
            <div key={property.id} className="layer-2 glass-card backdrop-blur-lg border border-white/40 rounded-xl overflow-hidden shadow-lg hover:translate-y-[-5px] transition-all hover:shadow-[0_0_15px_rgba(8,146,208,0.6)] hover:border-[#0892D0]">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="h-64 w-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold">{property.title}</h3>
                    <div className="bg-[#0892D0] text-white px-3 py-1 rounded-lg font-bold">
                      {Math.round(property.belowMarket)}% BELOW MARKET
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
                    <Button asChild variant="glass" className="shadow-lg hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)]">
                      <Link to={`/property/${property.id}`}>View Listing</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="bg-white border border-transparent relative group overflow-hidden"
                    >
                      <Link to={`/property/${property.id}/edit`}>
                        <span className="text-gradient-static">Edit Listing</span>
                        
                        {/* Rainbow gradient border on hover */}
                        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" style={{
                          background: "transparent",
                          padding: "1px",
                          border: "2px solid transparent",
                          backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                          backgroundOrigin: "border-box",
                          backgroundClip: "padding-box, border-box",
                          boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)",
                          filter: "blur(0.5px)"
                        }}></span>
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="bg-white/50 text-black border border-white/40 shadow-lg hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)] hover:text-[#0892D0]"
                      onClick={() => handleUnlistProperty(property.id)}
                    >
                      <Trash2 size={18} className="mr-2" />
                      Unlist
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/20 p-4 bg-white/30 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold mr-2">Waitlist:</span>
                    {waitlistUsers.filter(user => user.propertyId === property.id).length} interested buyers
                  </div>
                  <Button asChild variant="glass" className="shadow-lg hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)]">
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
        <div className="layer-2 glass-card backdrop-blur-lg p-12 text-center rounded-xl border border-white/40 shadow-lg">
          <Building2 size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">No Properties Listed</h3>
          <p className="mb-6">You haven't listed any properties yet.</p>
          <Button 
            asChild
            variant="glass"
            className="bg-white shadow-lg hover:translate-y-[-5px] transition-all hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)]"
          >
            <Link to="/sell/create">
              <Plus size={18} className="mr-2" />
              <span className="electric-blue-glow">Add Your First Property</span>
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default PropertiesTab;

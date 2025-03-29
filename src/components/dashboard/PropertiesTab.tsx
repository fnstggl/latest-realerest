
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [newProperty, setNewProperty] = useState({
    title: "",
    price: "",
    marketPrice: "",
    location: "",
    beds: "",
    baths: "",
    sqft: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProperty({
      ...newProperty,
      [name]: value,
    });
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to add a property");
      return;
    }
    
    // Validate form
    if (!newProperty.title || !newProperty.price || !newProperty.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create new property
      const price = parseFloat(newProperty.price);
      const marketPrice = parseFloat(newProperty.marketPrice) || price * 1.2;
      
      const { data, error } = await supabase
        .from('property_listings')
        .insert([
          {
            title: newProperty.title,
            price: price,
            market_price: marketPrice,
            location: newProperty.location,
            beds: parseInt(newProperty.beds) || 0,
            baths: parseInt(newProperty.baths) || 0,
            sqft: parseInt(newProperty.sqft) || 0,
            user_id: user.id,
            images: ["https://placehold.co/600x400?text=New+Property"]
          }
        ])
        .select();
        
      if (error) {
        console.error("Error adding property:", error);
        toast.error("Failed to add property");
        return;
      }
      
      if (data && data.length > 0) {
        // Calculate below market percentage
        const belowMarket = Math.round(((marketPrice - price) / marketPrice) * 100);
        
        // Add to the UI
        const newPropertyObj: Property = {
          id: data[0].id,
          title: newProperty.title,
          price: price,
          marketPrice: marketPrice,
          image: "https://placehold.co/600x400?text=New+Property",
          location: newProperty.location,
          beds: parseInt(newProperty.beds) || 0,
          baths: parseInt(newProperty.baths) || 0,
          sqft: parseInt(newProperty.sqft) || 0,
          belowMarket: belowMarket,
          waitlistCount: 0
        };
        
        setMyProperties([...myProperties, newPropertyObj]);
        
        // Reset form
        setNewProperty({
          title: "",
          price: "",
          marketPrice: "",
          location: "",
          beds: "",
          baths: "",
          sqft: "",
        });
        
        setShowAddForm(false);
        toast.success("Property added successfully!");
      }
    } catch (error) {
      console.error("Exception adding property:", error);
      toast.error("Failed to add property");
    } finally {
      setIsLoading(false);
    }
  };

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
      {showAddForm ? (
        <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New Property</h2>
            <Button 
              variant="ghost" 
              onClick={() => setShowAddForm(false)}
              className="neo-button"
            >
              Cancel
            </Button>
          </div>
          
          <form onSubmit={handleAddProperty} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="font-bold">Property Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newProperty.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Modern Townhouse"
                  className="mt-2 border-2 border-black"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="location" className="font-bold">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={newProperty.location}
                  onChange={handleInputChange}
                  placeholder="e.g. 123 Main St, San Francisco, CA"
                  className="mt-2 border-2 border-black"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price" className="font-bold">Asking Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={newProperty.price}
                  onChange={handleInputChange}
                  placeholder="e.g. 350000"
                  className="mt-2 border-2 border-black"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="marketPrice" className="font-bold">Market Value ($)</Label>
                <Input
                  id="marketPrice"
                  name="marketPrice"
                  type="number"
                  value={newProperty.marketPrice}
                  onChange={handleInputChange}
                  placeholder="e.g. 420000"
                  className="mt-2 border-2 border-black"
                />
              </div>
              
              <div>
                <Label htmlFor="beds" className="font-bold">Bedrooms</Label>
                <Input
                  id="beds"
                  name="beds"
                  type="number"
                  value={newProperty.beds}
                  onChange={handleInputChange}
                  placeholder="e.g. 3"
                  className="mt-2 border-2 border-black"
                />
              </div>
              
              <div>
                <Label htmlFor="baths" className="font-bold">Bathrooms</Label>
                <Input
                  id="baths"
                  name="baths"
                  type="number"
                  value={newProperty.baths}
                  onChange={handleInputChange}
                  placeholder="e.g. 2"
                  className="mt-2 border-2 border-black"
                />
              </div>
              
              <div>
                <Label htmlFor="sqft" className="font-bold">Square Footage</Label>
                <Input
                  id="sqft"
                  name="sqft"
                  type="number"
                  value={newProperty.sqft}
                  onChange={handleInputChange}
                  placeholder="e.g. 1800"
                  className="mt-2 border-2 border-black"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="neo-button-primary"
              disabled={isLoading}
            >
              {isLoading ? "Adding Property..." : "Add Property"}
            </Button>
          </form>
        </div>
      ) : (
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
      )}
    </>
  );
};

export default PropertiesTab;

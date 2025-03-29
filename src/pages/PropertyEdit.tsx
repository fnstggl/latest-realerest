import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  description?: string;
  image: string;
  images?: string[];
  location: string;
  full_address?: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
  afterRepairValue?: number;
  estimatedRehab?: number;
}

const PropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    marketPrice: "",
    location: "",
    full_address: "",
    beds: "",
    baths: "",
    sqft: "",
    description: "",
    afterRepairValue: "",
    estimatedRehab: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const allListingsJSON = localStorage.getItem('propertyListings');
        if (allListingsJSON) {
          const allListings = JSON.parse(allListingsJSON);
          const foundProperty = allListings.find((p: Property) => p.id === id);
          
          if (foundProperty) {
            setProperty(foundProperty);
            setFormData({
              title: foundProperty.title,
              price: foundProperty.price.toString(),
              marketPrice: foundProperty.marketPrice.toString(),
              location: foundProperty.location,
              full_address: foundProperty.full_address || foundProperty.location,
              beds: foundProperty.beds.toString(),
              baths: foundProperty.baths.toString(),
              sqft: foundProperty.sqft.toString(),
              description: foundProperty.description || "",
              afterRepairValue: foundProperty.afterRepairValue?.toString() || "",
              estimatedRehab: foundProperty.estimatedRehab?.toString() || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to edit a property");
      return;
    }
    
    setSaving(true);
    
    try {
      const price = parseFloat(formData.price);
      const marketPrice = parseFloat(formData.marketPrice) || price * 1.2;
      const belowMarket = Math.round(((marketPrice - price) / marketPrice) * 100);
      const afterRepairValue = parseFloat(formData.afterRepairValue) || marketPrice * 1.2;
      const estimatedRehab = parseFloat(formData.estimatedRehab) || marketPrice * 0.1;
      
      const updatedProperty = {
        ...property,
        title: formData.title,
        price: price,
        marketPrice: marketPrice,
        location: formData.location,
        full_address: formData.full_address,
        beds: parseInt(formData.beds) || 0,
        baths: parseInt(formData.baths) || 0,
        sqft: parseInt(formData.sqft) || 0,
        belowMarket: belowMarket,
        description: formData.description,
        afterRepairValue: afterRepairValue,
        estimatedRehab: estimatedRehab,
      };
      
      const allListingsJSON = localStorage.getItem('propertyListings');
      if (allListingsJSON) {
        const allListings = JSON.parse(allListingsJSON);
        const updatedListings = allListings.map((p: Property) => 
          p.id === id ? updatedProperty : p
        );
        
        localStorage.setItem("propertyListings", JSON.stringify(updatedListings));
      }
      
      const { error } = await supabase
        .from('property_listings')
        .update({
          title: formData.title,
          price: price,
          market_price: marketPrice,
          location: formData.location,
          full_address: formData.full_address,
          beds: parseInt(formData.beds) || 0,
          baths: parseInt(formData.baths) || 0,
          sqft: parseInt(formData.sqft) || 0,
          description: formData.description,
          after_repair_value: afterRepairValue,
          estimated_rehab: estimatedRehab,
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Property updated successfully!");
      navigate(`/property/${id}`);
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 w-full mb-6"></div>
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
          <p className="mb-8">The property you're trying to edit doesn't exist or has been removed.</p>
          <Button className="neo-button" onClick={() => navigate(-1)}>
            Go Back
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
          <Button 
            variant="ghost" 
            className="flex items-center text-black hover:text-[#d60013] font-bold transition-colors"
            onClick={() => navigate(`/property/${id}`)}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Property
          </Button>
        </div>
        
        <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-12">
          <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="font-bold">Property Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-2 border-2 border-black"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="full_address" className="font-bold">Full Address</Label>
                <Input
                  id="full_address"
                  name="full_address"
                  value={formData.full_address}
                  onChange={handleInputChange}
                  className="mt-2 border-2 border-black"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="location" className="font-bold">Display Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
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
                  value={formData.price}
                  onChange={handleInputChange}
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
                  value={formData.marketPrice}
                  onChange={handleInputChange}
                  className="mt-2 border-2 border-black"
                />
              </div>
              
              <div>
                <Label htmlFor="beds" className="font-bold">Bedrooms</Label>
                <Input
                  id="beds"
                  name="beds"
                  type="number"
                  value={formData.beds}
                  onChange={handleInputChange}
                  className="mt-2 border-2 border-black"
                />
              </div>
              
              <div>
                <Label htmlFor="baths" className="font-bold">Bathrooms</Label>
                <Input
                  id="baths"
                  name="baths"
                  type="number"
                  value={formData.baths}
                  onChange={handleInputChange}
                  className="mt-2 border-2 border-black"
                />
              </div>
              
              <div>
                <Label htmlFor="sqft" className="font-bold">Square Footage</Label>
                <Input
                  id="sqft"
                  name="sqft"
                  type="number"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  className="mt-2 border-2 border-black"
                />
              </div>
              
              <div>
                <Label htmlFor="afterRepairValue" className="font-bold">After Repair Value ($)</Label>
                <Input
                  id="afterRepairValue"
                  name="afterRepairValue"
                  type="number"
                  value={formData.afterRepairValue}
                  onChange={handleInputChange}
                  className="mt-2 border-2 border-black"
                />
              </div>
              
              <div>
                <Label htmlFor="estimatedRehab" className="font-bold">Estimated Rehab Cost ($)</Label>
                <Input
                  id="estimatedRehab"
                  name="estimatedRehab"
                  type="number"
                  value={formData.estimatedRehab}
                  onChange={handleInputChange}
                  className="mt-2 border-2 border-black"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="font-bold">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-2 border-2 border-black h-32"
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="neo-button-primary"
                disabled={saving}
              >
                <Save size={18} className="mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyEdit;

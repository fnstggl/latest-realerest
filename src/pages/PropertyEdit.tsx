
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
import ImageUploader from "@/components/create-listing/ImageUploader";
import SEO from "@/components/SEO";
import PropertyImages from "@/components/property-detail/PropertyImages";

interface Property {
  id: string;
  price: number;
  market_price: number;
  description?: string;
  images?: string[];
  location: string;
  full_address?: string;
  beds: number;
  baths: number;
  sqft: number;
  after_repair_value?: number;
  estimated_rehab?: number;
  property_type?: string;
  title: string;
}

const PropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
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
    propertyType: "",
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      
      if (!id || !user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch directly from Supabase
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching property:", error);
          toast.error("Failed to load property details");
          setLoading(false);
          return;
        }
        
        if (data) {
          setProperty({
            id: data.id,
            title: data.title,
            price: data.price,
            market_price: data.market_price,
            location: data.location,
            full_address: data.full_address || data.location,
            beds: data.beds,
            baths: data.baths,
            sqft: data.sqft,
            description: data.description || "",
            images: data.images || [],
            after_repair_value: data.after_repair_value || undefined,
            estimated_rehab: data.estimated_rehab || undefined,
            property_type: data.property_type || "House"
          });
          
          setImages(data.images || []);
          
          setFormData({
            price: data.price.toString(),
            marketPrice: data.market_price.toString(),
            location: data.location,
            full_address: data.full_address || data.location,
            beds: data.beds.toString(),
            baths: data.baths.toString(),
            sqft: data.sqft.toString(),
            description: data.description || "",
            afterRepairValue: data.after_repair_value ? data.after_repair_value.toString() : "",
            estimatedRehab: data.estimated_rehab ? data.estimated_rehab.toString() : "",
            propertyType: data.property_type || "House"
          });
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
  }, [id, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const compressAndUploadImages = async () => {
    if (imageFiles.length === 0) {
      return images; // Return existing images if no new ones
    }

    try {
      setIsProcessingImages(true);
      // Import dynamically to avoid build issues
      const imageCompression = await import('browser-image-compression');
      
      const options = {
        maxSizeMB: 1, // Max file size in MB
        maxWidthOrHeight: 1600,
        useWebWorker: true
      };
      
      let uploadedImageUrls = [...images]; // Start with existing images
      const propertyStoragePath = `properties/${id}`;
      
      // Process each new image file
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setUploadProgress(Math.round((i / imageFiles.length) * 40)); // First 40% for compression
        
        // Compress image
        const compressedFile = await imageCompression.default(file, options);
        
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${propertyStoragePath}/${fileName}`;
        
        setUploadProgress(40 + Math.round((i / imageFiles.length) * 50)); // Next 50% for upload
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('property_images')
          .upload(filePath, compressedFile);
        
        if (error) {
          console.error("Error uploading image:", error);
          continue;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('property_images')
          .getPublicUrl(filePath);
          
        uploadedImageUrls.push(urlData.publicUrl);
      }
      
      setUploadProgress(100);
      return uploadedImageUrls;
    } catch (error) {
      console.error("Error processing images:", error);
      throw new Error("Failed to process images");
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to edit a property");
      return;
    }
    
    if (!property) {
      toast.error("Property data not found");
      return;
    }
    
    setSaving(true);
    setUploadProgress(0);
    
    try {
      console.log("Starting property update process");
      let finalImages = images;
      
      // Process and upload new images if any
      if (imageFiles.length > 0) {
        console.log("Processing new images");
        finalImages = await compressAndUploadImages();
      }
      
      // Prepare data for update
      const price = parseFloat(formData.price);
      const marketPrice = parseFloat(formData.marketPrice) || price * 1.2;
      const afterRepairValue = formData.afterRepairValue ? parseFloat(formData.afterRepairValue) : marketPrice * 1.2;
      const estimatedRehab = formData.estimatedRehab ? parseFloat(formData.estimatedRehab) : marketPrice * 0.1;
      
      console.log("Updating property with data:", {
        price,
        market_price: marketPrice,
        location: formData.location,
        full_address: formData.full_address,
        beds: parseInt(formData.beds) || 0,
        baths: parseInt(formData.baths) || 0,
        sqft: parseInt(formData.sqft) || 0,
        description: formData.description,
        after_repair_value: afterRepairValue,
        estimated_rehab: estimatedRehab,
        images: finalImages,
        property_type: formData.propertyType
      });
      
      // Update in Supabase
      const { data, error } = await supabase
        .from('property_listings')
        .update({
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
          images: finalImages,
          property_type: formData.propertyType,
        })
        .eq('id', id)
        .select();
        
      if (error) {
        console.error("Error updating property:", error);
        throw error;
      }
      
      console.log("Property updated successfully:", data);
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
    <div className="min-h-screen bg-[#FCFBF8]">
      <SEO
        title={`Edit ${property.title} | Realer Estate`}
        description="Edit your property listing details"
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mt-50 mb-8">
          <Button 
            variant="default" 
            className="flex items-center text-white bg-black hover:bg-black/90 font-bold transition-colors rounded-lg mt-12"
            onClick={() => navigate(`/property/${id}`)}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Property
          </Button>
        </div>
        
        <div className="p-6 mb-12">
          <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="full_address" className="font-bold">Street Address</Label>
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
                <Label htmlFor="location" className="font-bold">City, State, Zip Code</Label>
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
                <Label htmlFor="propertyType" className="font-bold">Property Type</Label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="mt-2 border-2 border-black w-full px-3 py-2 rounded-md"
                >
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Multi-Family">Multi-Family</option>
                  <option value="Land">Land</option>
                  <option value="Other">Other</option>
                </select>
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

            <div>
              <PropertyImages 
                mainImage={images[0] || ""} 
                images={images} 
                onImagesChange={setImages}
                editable={true}
              />
            </div>

            <div>
              <ImageUploader
                images={images}
                setImages={setImages}
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                isSubmitting={saving}
                uploadProgress={uploadProgress}
                isProcessingImages={isProcessingImages}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-white hover:bg-white text-black font-bold px-6 py-2 relative group overflow-hidden rounded-xl"
                disabled={saving}
              >
                <Save size={18} className="mr-2" />
                <span className="relative z-10">{saving ? "Saving..." : "Save Changes"}</span>
                
                {/* Rainbow border hover effect - adds a gradient outline only on hover */}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyEdit;

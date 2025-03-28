import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Plus, X, Check, Image } from 'lucide-react';
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  address: z.string().min(1, {
    message: "Property address is required"
  }),
  description: z.string().min(1, {
    message: "Description is required"
  }),
  price: z.string().min(1, {
    message: "Price is required"
  }),
  marketPrice: z.string().min(1, {
    message: "Market price is required"
  }),
  city: z.string().min(2, {
    message: "City is required"
  }),
  state: z.string().min(2, {
    message: "State is required"
  }),
  zipCode: z.string().min(5, {
    message: "ZIP code is required"
  }),
  beds: z.string().min(1, {
    message: "Beds info is required"
  }),
  baths: z.string().min(1, {
    message: "Baths info is required"
  }),
  sqft: z.string().min(1, {
    message: "Square footage is required"
  }),
  afterRepairValue: z.string().optional(),
  estimatedRehab: z.string().optional(),
  comparableAddress1: z.string().optional(),
  comparableAddress2: z.string().optional(),
  comparableAddress3: z.string().optional()
});

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      description: "",
      price: "",
      marketPrice: "",
      city: "",
      state: "",
      zipCode: "",
      beds: "",
      baths: "",
      sqft: "",
      afterRepairValue: "",
      estimatedRehab: "",
      comparableAddress1: "",
      comparableAddress2: "",
      comparableAddress3: ""
    }
  });

  // Function to upload images to Supabase storage
  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    try {
      // Create a random folder name instead of using user.id which might not be a valid UUID
      const folderName = `listing-${Math.random().toString(36).substring(2, 15)}`;
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${folderName}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('property_images')
          .upload(filePath, file);
          
        if (error) {
          console.error('Error uploading image:', error);
          toast.error(`Error uploading image: ${error.message}`);
          continue;
        }
        
        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('property_images')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(publicUrl);
      }
    } catch (error) {
      console.error('Error in image upload:', error);
      toast.error('Something went wrong while uploading images');
    }
    
    return uploadedUrls;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to create a listing");
      return;
    }
    
    setIsSubmitting(true);
    toast.loading("Creating your listing...");
    
    try {
      // Upload images to Supabase storage
      const uploadedImageUrls = await uploadImagesToSupabase(imageFiles);
      
      // Use uploaded URLs or fall back to default
      const finalImages = uploadedImageUrls.length > 0 
        ? uploadedImageUrls 
        : ["https://source.unsplash.com/random/800x600?house"];
      
      // Create the location string from city, state and zip
      const location = `${values.city}, ${values.state} ${values.zipCode}`;
      
      // Calculate below market percentage
      const price = Number(values.price);
      const marketPrice = Number(values.marketPrice);
      const belowMarket = marketPrice > price 
        ? ((marketPrice - price) / marketPrice * 100).toFixed(1) 
        : "0";
      
      // Generate title from location and beds/baths
      const title = `${values.beds} bed, ${values.baths} bath home in ${values.city}, ${values.state}`;
      
      // Create an actual UUID for the user_id if the user object doesn't provide one
      // This is a workaround for development/testing purposes
      const userId = user.id || crypto.randomUUID();
      
      // Insert listing into Supabase
      const { data, error } = await supabase
        .from('property_listings')
        .insert({
          title: title,
          price: price,
          market_price: marketPrice,
          location: location,
          description: values.description,
          beds: parseInt(values.beds),
          baths: parseInt(values.baths),
          sqft: parseInt(values.sqft),
          images: finalImages,
          user_id: userId
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.dismiss();
      toast.success("Property listing created successfully!");
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast.dismiss();
      toast.error(`Failed to create listing: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > 15) {
      toast.warning("Maximum 15 images allowed. Some images won't be uploaded.");
    }

    const newImageFiles: File[] = [];
    const filesToProcess = Math.min(15 - images.length, files.length);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newImageFiles.push(file);
        
        // Create a URL for the image preview
        const imageUrl = URL.createObjectURL(file);
        setImages(prev => [...prev, imageUrl]);
      }
    }

    setImageFiles(prev => [...prev, ...newImageFiles]);
    
    if (newImageFiles.length > 0) {
      toast.success(`${newImageFiles.length} image(s) uploaded successfully!`);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate percent difference
  const calculateDiscountPercent = () => {
    const price = Number(form.watch('price')) || 0;
    const marketPrice = Number(form.watch('marketPrice')) || 0;
    if (price && marketPrice && marketPrice > price) {
      const discount = (marketPrice - price) / marketPrice * 100;
      return discount.toFixed(1);
    }
    return "0";
  };

  // List of US states
  const usStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  return <div className="min-h-screen bg-white">
      <Navbar />
      
      <motion.div className="container mx-auto px-4 py-12" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Property Listing</h1>
          
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Property Address</h2>
                  <FormField control={form.control} name="address" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-black font-bold">Full Property Address</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 123 Main St" className="h-12 rounded-none border-2 border-black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="city" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">City</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Portland" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={form.control} name="state" render={({
                    field
                    }) => (
                      <FormItem>
                        <FormLabel className="text-black font-bold">State</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-none border-2 border-black">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-2 border-black max-h-[280px]">
                            {usStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="zipCode" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 97204" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                  
                  <FormField control={form.control} name="description" render={({
                  field
                }) => <FormItem className="mt-6">
                        <FormLabel className="text-black font-bold">Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your property..." className="min-h-[120px] rounded-none border-2 border-black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Property Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="beds" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">Bedrooms</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 3" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="baths" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">Bathrooms</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 2" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="sqft" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">Square Footage</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 2000" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Price Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="price" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">Your Listing Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 450000" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="marketPrice" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">Average Market Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 500000" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                  
                  {form.watch('price') && form.watch('marketPrice') && <div className="mt-4 p-4 bg-gray-100 border-2 border-black">
                      <p className="font-bold">
                        Discount: <span className="text-[#ea384c]">{calculateDiscountPercent()}% below market</span>
                      </p>
                    </div>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField control={form.control} name="afterRepairValue" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">After Repair Value ($) (Optional)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 550000" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="estimatedRehab" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">Estimated Rehab Cost ($) (Optional)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 50000" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Comparable Properties (Optional)</h2>
                  <div className="space-y-4">
                    <FormField control={form.control} name="comparableAddress1" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">Comparable Address 1</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="comparableAddress2" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">Comparable Address 2</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="comparableAddress3" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-black font-bold">Comparable Address 3</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address" className="h-12 rounded-none border-2 border-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Property Images</h2>
                  <div className="mb-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                    />
                    <Button 
                      type="button" 
                      className="h-32 w-full border-4 border-black rounded-none hover:bg-gray-50 flex flex-col items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" 
                      onClick={handleImageUpload}
                    >
                      <Upload size={24} />
                      <span className="font-bold">Click to Upload Images (max 15)</span>
                    </Button>
                  </div>
                  
                  {images.length > 0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {images.map((img, index) => <div key={index} className="relative border-4 border-black group">
                          <img src={img} alt={`Property ${index + 1}`} className="h-32 w-full object-cover" />
                          <button type="button" className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}>
                            <X size={16} />
                          </button>
                        </div>)}
                    </div>}
                </div>
                
                <div className="pt-6 border-t-2 border-black flex justify-end gap-4">
                  <Button type="button" variant="outline" className="font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-3 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" onClick={() => navigate('/dashboard')}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="text-white font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-3 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-[#d60013]"
                  >
                    {isSubmitting ? 'Creating...' : (
                      <>
                        <Check size={18} className="mr-2" />
                        Create Listing
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>;
};

const handleImageUpload = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  // Check if adding these files would exceed the limit
  if (images.length + files.length > 15) {
    toast.warning("Maximum 15 images allowed. Some images won't be uploaded.");
  }

  const newImageFiles: File[] = [];
  const filesToProcess = Math.min(15 - images.length, files.length);

  for (let i = 0; i < filesToProcess; i++) {
    const file = files[i];
    if (file.type.startsWith('image/')) {
      newImageFiles.push(file);
      
      // Create a URL for the image preview
      const imageUrl = URL.createObjectURL(file);
      setImages(prev => [...prev, imageUrl]);
    }
  }

  setImageFiles(prev => [...prev, ...newImageFiles]);
  
  if (newImageFiles.length > 0) {
    toast.success(`${newImageFiles.length} image(s) uploaded successfully!`);
  }
  
  // Reset the file input
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

const removeImage = (index: number) => {
  setImages(prev => prev.filter((_, i) => i !== index));
  setImageFiles(prev => prev.filter((_, i) => i !== index));
};

// Calculate percent difference
const calculateDiscountPercent = () => {
  const price = Number(form.watch('price')) || 0;
  const marketPrice = Number(form.watch('marketPrice')) || 0;
  if (price && marketPrice && marketPrice > price) {
    const discount = (marketPrice - price) / marketPrice * 100;
    return discount.toFixed(1);
  }
  return "0";
};

// List of US states
const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default CreateListing;

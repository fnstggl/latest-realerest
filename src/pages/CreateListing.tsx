
import React, { useState } from 'react';
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
import { Upload, Plus, X, Check } from 'lucide-react';
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  price: z.string().min(1, { message: "Price is required" }),
  marketPrice: z.string().min(1, { message: "Market price is required" }),
  location: z.string().min(3, { message: "Location is required" }),
  beds: z.string().min(1, { message: "Beds info is required" }),
  baths: z.string().min(1, { message: "Baths info is required" }),
  sqft: z.string().min(1, { message: "Square footage is required" }),
  afterRepairValue: z.string().optional(),
  estimatedRehab: z.string().optional(),
  comparableAddress1: z.string().optional(),
  comparableAddress2: z.string().optional(),
  comparableAddress3: z.string().optional(),
});

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      marketPrice: "",
      location: "",
      beds: "",
      baths: "",
      sqft: "",
      afterRepairValue: "",
      estimatedRehab: "",
      comparableAddress1: "",
      comparableAddress2: "",
      comparableAddress3: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Generate a unique ID for the property
    const propertyId = `property-${Date.now()}`;
    
    // Calculate below market percentage
    const price = Number(values.price);
    const marketPrice = Number(values.marketPrice);
    const belowMarket = marketPrice > price 
      ? ((marketPrice - price) / marketPrice * 100).toFixed(1) 
      : "0";
    
    // Prepare the listing data
    const newListing = {
      id: propertyId,
      title: values.title,
      price: Number(values.price),
      marketPrice: Number(values.marketPrice),
      location: values.location,
      description: values.description,
      beds: Number(values.beds),
      baths: Number(values.baths),
      sqft: Number(values.sqft),
      image: images.length > 0 ? images[0] : "https://source.unsplash.com/random/800x600?house",
      belowMarket: Number(belowMarket),
      sellerId: user?.id || 'unknown',
      sellerName: user?.name || 'Unknown Seller',
      images: images,
      afterRepairValue: values.afterRepairValue ? Number(values.afterRepairValue) : undefined,
      estimatedRehab: values.estimatedRehab ? Number(values.estimatedRehab) : undefined,
      comparables: [
        values.comparableAddress1,
        values.comparableAddress2,
        values.comparableAddress3
      ].filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    try {
      // Get existing listings
      const existingListingsJSON = localStorage.getItem('propertyListings');
      const existingListings = existingListingsJSON ? JSON.parse(existingListingsJSON) : [];
      
      // Add new listing
      const updatedListings = [...existingListings, newListing];
      
      // Save back to localStorage
      localStorage.setItem('propertyListings', JSON.stringify(updatedListings));
      
      // Also save to user's listings
      const userListingsJSON = localStorage.getItem(`userListings-${user?.id}`);
      const userListings = userListingsJSON ? JSON.parse(userListingsJSON) : [];
      const updatedUserListings = [...userListings, newListing];
      localStorage.setItem(`userListings-${user?.id}`, JSON.stringify(updatedUserListings));
      
      toast.success("Property listing created successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving listing:", error);
      toast.error("Failed to create listing. Please try again.");
    }
  };

  const handleImageUpload = () => {
    // Simulate image upload - would be replaced with actual upload logic
    const mockImage = `https://source.unsplash.com/random/800x600?house&${Date.now()}`;
    setImages(prev => [...prev, mockImage]);
    toast.success("Image uploaded successfully!");
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate percent difference
  const calculateDiscountPercent = () => {
    const price = Number(form.watch('price')) || 0;
    const marketPrice = Number(form.watch('marketPrice')) || 0;
    
    if (price && marketPrice && marketPrice > price) {
      const discount = ((marketPrice - price) / marketPrice) * 100;
      return discount.toFixed(1);
    }
    
    return "0";
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Property Listing</h1>
          
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Property Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Modern Craftsman Home" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Location</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Portland, OR" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel className="text-black font-bold">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your property..." 
                            className="min-h-[120px] rounded-none border-2 border-black" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Property Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="beds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Bedrooms</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 3" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="baths"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Bathrooms</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 2" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sqft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Square Footage</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 2000" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Price Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Your Listing Price ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 450000" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="marketPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Average Market Price ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 500000" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {form.watch('price') && form.watch('marketPrice') && (
                    <div className="mt-4 p-4 bg-gray-100 border-2 border-black">
                      <p className="font-bold">
                        Discount: <span className="text-[#ea384c]">{calculateDiscountPercent()}% below market</span>
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="afterRepairValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">After Repair Value ($) (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 550000" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estimatedRehab"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Estimated Rehab Cost ($) (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 50000" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Comparable Properties (Optional)</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="comparableAddress1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Comparable Address 1</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter address" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="comparableAddress2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Comparable Address 2</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter address" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="comparableAddress3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">Comparable Address 3</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter address" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Property Images</h2>
                  <div className="mb-6">
                    <Button
                      type="button"
                      className="h-32 w-full border-2 border-dashed border-black rounded-none hover:bg-gray-50 flex flex-col items-center justify-center gap-2"
                      onClick={handleImageUpload}
                    >
                      <Upload size={24} />
                      <span className="font-bold">Click to Upload Images</span>
                    </Button>
                  </div>
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {images.map((img, index) => (
                        <div key={index} className="relative border-2 border-black group">
                          <img 
                            src={img} 
                            alt={`Property ${index + 1}`} 
                            className="h-32 w-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="pt-6 border-t-2 border-black flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-3 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-3 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <Check size={18} className="mr-2" />
                    Create Listing
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateListing;

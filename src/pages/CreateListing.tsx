
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Plus, X, Check, Image, Loader2, AlertCircle } from 'lucide-react';
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
import { v4 as uuidv4 } from 'uuid';

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

// Use a smaller default image size for faster loading
const DEFAULT_IMAGE = "https://source.unsplash.com/random/400x300?house";

// Maximum image size in bytes (3MB)
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
// Maximum number of images allowed
const MAX_IMAGES = 5;

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessingImages, setIsProcessingImages] = useState(false); // Changed from number to boolean
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);

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

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to create a listing");
      navigate('/signin', { state: { returnPath: '/sell/create' } });
    } else {
      console.log("Authenticated user:", user?.id);
      
      // Check storage bucket exists
      const checkStorageBucket = async () => {
        try {
          const { data, error } = await supabase.storage.getBucket('property_images');
          if (error) {
            console.error("Storage bucket error:", error);
            
            // If bucket doesn't exist, create it
            if (error.message.includes('not found')) {
              const { error: createError } = await supabase.storage.createBucket('property_images', {
                public: true
              });
              
              if (createError) {
                console.error("Failed to create bucket:", createError);
              } else {
                console.log("Created property_images bucket");
              }
            }
          } else {
            console.log("Property images bucket exists:", data);
          }
        } catch (err) {
          console.error("Error checking storage bucket:", err);
        }
      };
      
      checkStorageBucket();
    }
  }, [isAuthenticated, navigate, user]);

  // Cleanup function for image processing
  useEffect(() => {
    return () => {
      // Abort any ongoing uploads if component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Revoke any object URLs to prevent memory leaks
      images.forEach(img => {
        if (img.startsWith('blob:')) {
          URL.revokeObjectURL(img);
        }
      });
    };
  }, [images]);

  // Optimized image upload function with concurrency control
  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [DEFAULT_IMAGE];
    
    // Create a unique folder name for this batch of uploads
    const folderName = `listing-${uuidv4()}`;
    
    try {
      // Create a new AbortController for this upload session
      abortControllerRef.current = new AbortController();
      
      // Set up concurrency - process up to 2 images at a time
      const concurrencyLimit = 2;
      const results: string[] = [];
      
      // Process files in batches to control concurrency
      for (let i = 0; i < files.length; i += concurrencyLimit) {
        const batch = files.slice(i, i + concurrencyLimit);
        const batchPromises = batch.map(async (file) => {
          try {
            // Check if operation has been aborted
            if (abortControllerRef.current?.signal.aborted) {
              throw new Error('Upload aborted');
            }
            
            // Create a unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `${folderName}/${fileName}`;
            
            // Use optimized upload settings
            const { data, error } = await supabase.storage
              .from('property_images')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              });
              
            if (error) {
              console.error('Error uploading image:', error);
              return null;
            }
            
            // Get public URL with better caching
            const { data: { publicUrl } } = supabase.storage
              .from('property_images')
              .getPublicUrl(filePath);
            
            // Update progress - distribute progress across batches
            const progressIncrement = 80 / files.length;
            setUploadProgress(prev => Math.min(90, prev + progressIncrement));
              
            return publicUrl;
          } catch (err) {
            if ((err as Error).message === 'Upload aborted') {
              console.log('Upload was aborted');
            } else {
              console.error('Error processing file:', err);
            }
            return null;
          }
        });
        
        // Wait for current batch to complete before processing next batch
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(Boolean) as string[]);
      }
      
      setUploadProgress(95);
      return results.length > 0 ? results : [DEFAULT_IMAGE];
      
    } catch (error) {
      console.error('Error in image upload:', error);
      return [DEFAULT_IMAGE]; // Fallback to default image
    }
  };

  // Cancel ongoing uploads and reset state
  const cancelUploads = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsSubmitting(false);
    setUploadProgress(0);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to create a listing");
      navigate('/signin');
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    // Show loading toast that we can update
    const loadingToastId = toast.loading("Creating your listing...");
    
    try {
      // Basic validation for user ID
      if (!user.id) {
        throw new Error("Invalid user ID");
      }

      console.log('Creating listing for user:', user.id);
      
      // Show progress update
      toast.loading("Uploading images...", { id: loadingToastId });
      setUploadProgress(10);
      
      // Upload images to Supabase storage
      const uploadedImageUrls = await uploadImagesToSupabase(imageFiles);
      
      // Use uploaded URLs or fallback to default
      const finalImages = uploadedImageUrls.length > 0 
        ? uploadedImageUrls 
        : [DEFAULT_IMAGE];
      
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
      
      // Update progress
      toast.loading("Saving listing details...", { id: loadingToastId });
      setUploadProgress(97);
      
      // Log the user ID being used for debugging
      console.log("Inserting listing with user_id:", user.id, "Type:", typeof user.id);
      
      // Insert listing into Supabase with explicit type handling
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
          user_id: user.id
        })
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      // Complete the progress
      setUploadProgress(100);
      toast.dismiss(loadingToastId);
      toast.success("Property listing created successfully!");
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast.dismiss(loadingToastId);
      cancelUploads();
      
      // Show more specific error messages
      if (error.message?.includes('invalid input syntax for type uuid')) {
        toast.error("Authentication error. Please sign out and sign in again.");
      } else if (error.message?.includes('foreign key constraint')) {
        toast.error("User account error. Please update your profile.");
      } else if (error.message?.includes('violates row-level security policy')) {
        toast.error("Access denied. Please ensure you're properly signed in.");
        console.error("RLS policy violation. User ID:", user.id);
        // Force re-authentication
        logout();
        setTimeout(() => {
          navigate('/signin', { state: { returnPath: '/sell/create' } });
        }, 1500);
      } else {
        toast.error(`Failed to create listing: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Optimized image handling with better validation and processing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > MAX_IMAGES) {
      toast.warning(`Maximum ${MAX_IMAGES} images allowed.`);
    }

    setIsProcessingImages(true);
    const newImageFiles: File[] = [];
    // Limit to MAX_IMAGES images maximum
    const filesToProcess = Math.min(MAX_IMAGES - images.length, files.length);

    try {
      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        
        // Verify file is an image
        if (!file.type.startsWith('image/')) {
          toast.error(`File "${file.name}" is not an image and was skipped.`);
          continue;
        }
        
        // Check file size
        if (file.size > MAX_IMAGE_SIZE) {
          toast.warning(`Image "${file.name}" exceeds ${MAX_IMAGE_SIZE/1024/1024}MB limit and was skipped.`);
          continue;
        }
        
        newImageFiles.push(file);
        
        // Create a URL for the image preview (with memory management)
        const imageUrl = URL.createObjectURL(file);
        setImages(prev => [...prev, imageUrl]);
      }

      setImageFiles(prev => [...prev, ...newImageFiles]);
      
      if (newImageFiles.length > 0) {
        toast.success(`${newImageFiles.length} image(s) added.`);
      }
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing images. Please try again.");
    } finally {
      setIsProcessingImages(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    if (images[index] && images[index].startsWith('blob:')) {
      URL.revokeObjectURL(images[index]);
    }
    
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
                  <h2 className="text-xl font-bold mb-4">Property Address</h2>
                  <FormField 
                    control={form.control} 
                    name="address" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black font-bold">Full Property Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 123 Main St" 
                            className="h-12 rounded-none border-2 border-black" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* City field */}
                    <FormField 
                      control={form.control} 
                      name="city" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">City</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Portland" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* State dropdown */}
                    <FormField 
                      control={form.control} 
                      name="state" 
                      render={({ field }) => (
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
                      )}
                    />
                    
                    {/* ZIP Code field */}
                    <FormField 
                      control={form.control} 
                      name="zipCode" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-bold">ZIP Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. 97204" 
                              className="h-12 rounded-none border-2 border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Description textarea */}
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
                
                {/* Property Details section */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Property Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Bedrooms */}
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
                    
                    {/* Bathrooms */}
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
                    
                    {/* Square Footage */}
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
                
                {/* Price Information section */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Price Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Listing Price */}
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
                    
                    {/* Market Price */}
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
                  
                  {/* Display discount percentage */}
                  {form.watch('price') && form.watch('marketPrice') && (
                    <div className="mt-4 p-4 bg-gray-100 border-2 border-black">
                      <p className="font-bold">
                        Discount: <span className="text-[#ea384c]">{calculateDiscountPercent()}% below market</span>
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* After Repair Value */}
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
                    
                    {/* Estimated Rehab Cost */}
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
                
                {/* Comparable Properties section (Optional) */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Comparable Properties (Optional)</h2>
                  <div className="space-y-4">
                    {/* Comparable Address 1 */}
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
                    
                    {/* Comparable Address 2 */}
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
                    
                    {/* Comparable Address 3 */}
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
                
                {/* Property Images section */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Property Images</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Recommended: Add up to {MAX_IMAGES} images (less than {MAX_IMAGE_SIZE/1024/1024}MB each) for faster upload times.
                  </p>
                  <div className="mb-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                      disabled={isSubmitting || isProcessingImages || images.length >= MAX_IMAGES}
                    />
                    <Button 
                      type="button" 
                      className="h-32 w-full border-4 border-black rounded-none hover:bg-gray-50 flex flex-col items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" 
                      onClick={handleImageUpload}
                      disabled={isSubmitting || isProcessingImages || images.length >= MAX_IMAGES}
                    >
                      {isProcessingImages ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          <span className="font-bold">Processing images...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={24} />
                          <span className="font-bold">Click to Upload Images (max {MAX_IMAGES})</span>
                          {images.length >= MAX_IMAGES && (
                            <span className="text-red-500 text-sm">Maximum images reached</span>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Display selected images */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {images.map((img, index) => (
                        <div key={index} className="relative border-4 border-black group">
                          <img 
                            src={img} 
                            alt={`Property ${index + 1}`} 
                            className="h-32 w-full object-cover" 
                          />
                          <button 
                            type="button" 
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
                            onClick={() => removeImage(index)}
                            disabled={isSubmitting}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Show progress bar during submission */}
                  {isSubmitting && uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                      <div 
                        className="bg-[#d60013] h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }} 
                      />
                    </div>
                  )}
                </div>
                
                {/* Form submission buttons */}
                <div className="pt-6 border-t-2 border-black flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-3 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" 
                    onClick={() => {
                      if (isSubmitting) {
                        cancelUploads();
                        toast.info("Upload canceled");
                      } else {
                        navigate('/dashboard');
                      }
                    }}
                  >
                    {isSubmitting ? "Cancel Upload" : "Cancel"}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isProcessingImages}
                    className="text-white font-bold border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-3 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-[#d60013] disabled:bg-gray-400"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
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
    </div>
  );
};

export default CreateListing;

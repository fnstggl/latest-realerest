
import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import BountyInput from '@/components/create-listing/BountyInput';

// Import formSchema (small import)
import { formSchema } from '@/components/create-listing/formSchema';
import { uploadImagesToSupabase, createNotification } from '@/components/create-listing/UploadService';
import AIPropertyExtractor from '@/components/create-listing/AIPropertyExtractor';

// Lazy load heavier components
const PropertyTypeSection = lazy(() => import('@/components/create-listing/PropertyTypeSection'));
const AddressSection = lazy(() => import('@/components/create-listing/AddressSection'));
const PropertyDetailsSection = lazy(() => import('@/components/create-listing/PropertyDetailsSection'));
const PriceSection = lazy(() => import('@/components/create-listing/PriceSection'));
const ComparableSection = lazy(() => import('@/components/create-listing/ComparableSection'));
const ImageUploader = lazy(() => import('@/components/create-listing/ImageUploader'));
const SubmitSection = lazy(() => import('@/components/create-listing/SubmitSection'));

// Use a smaller default image size for faster loading
const DEFAULT_IMAGE = "https://source.unsplash.com/random/400x300?house";

// Loading fallback component
const LoadingFallback = () => <div className="flex justify-center items-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-[#d60013]" />
  </div>;

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
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
      propertyType: "",
      afterRepairValue: "",
      estimatedRehab: "",
      comparableAddress1: "",
      comparableAddress2: "",
      comparableAddress3: "",
      bounty: "",
    }
  });

  // Mark page as loaded after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to create a listing");
      navigate('/signin', {
        state: {
          returnPath: '/sell/create'
        }
      });
    } else {
      console.log("Authenticated user:", user?.id);

      // Check storage bucket exists
      const checkStorageBucket = async () => {
        try {
          const {
            data,
            error
          } = await supabase.storage.getBucket('property_images');
          if (error) {
            console.error("Storage bucket error:", error);

            // If bucket doesn't exist, create it
            if (error.message.includes('not found')) {
              const {
                error: createError
              } = await supabase.storage.createBucket('property_images', {
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

  // Cancel ongoing uploads and reset state
  const cancelUploads = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsSubmitting(false);
    setUploadProgress(0);
  };

  // Update onSubmit to include bounty
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to create a listing");
      navigate('/signin');
      return;
    }
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
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
      toast.loading("Uploading images...", {
        id: loadingToastId
      });
      setUploadProgress(10);

      // Upload images to Supabase storage using the service
      const uploadedImageUrls = await uploadImagesToSupabase(imageFiles, progress => {
        setUploadProgress(progress);
      });

      // Use uploaded URLs or fallback to default
      const finalImages = uploadedImageUrls.length > 0 ? uploadedImageUrls : [DEFAULT_IMAGE];

      // Create the location string from city, state and zip
      const location = `${values.city}, ${values.state} ${values.zipCode}`;

      // Store the full address separately from the display location
      const fullAddress = values.address;

      // Calculate below market percentage
      const price = Number(values.price);
      const marketPrice = Number(values.marketPrice);
      const belowMarket = marketPrice > price ? ((marketPrice - price) / marketPrice * 100).toFixed(1) : "0";

      // Generate title with property type and location
      const title = `${values.propertyType} in ${values.city}, ${values.state}`;

      // Update progress
      toast.loading("Saving listing details...", {
        id: loadingToastId
      });
      setUploadProgress(97);

      // Log the user ID being used for debugging
      console.log("Inserting listing with user_id:", user.id, "Type:", typeof user.id);

      // Insert listing into Supabase with explicit type handling
      const { data, error } = await supabase.from('property_listings').insert({
        title: title,
        price: price,
        market_price: marketPrice,
        location: location,
        full_address: fullAddress,
        description: values.description,
        beds: parseInt(values.beds),
        baths: parseInt(values.baths),
        sqft: parseInt(values.sqft),
        images: finalImages,
        user_id: user.id,
        bounty: values.bounty ? Number(values.bounty) : null
      }).select();
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // Complete the progress
      setUploadProgress(100);
      toast.dismiss(loadingToastId);
      toast.success("Property listing created successfully!");

      // Trigger a notification for all users when a new property is listed
      if (data?.[0]?.id) {
        try {
          // Create notification using our service
          await createNotification(data[0].id, values.propertyType, values.city, values.state);
          console.log("Notification created for new property");
        } catch (notifyError) {
          console.error("Could not create notification:", notifyError);
        }
      }

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
          navigate('/signin', {
            state: {
              returnPath: '/sell/create'
            }
          });
        }, 1500);
      } else {
        toast.error(`Failed to create listing: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If page is not fully loaded, show a more pleasant loading state
  if (!isPageLoaded) {
    return <div className="min-h-screen bg-[#FCFBF8]">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#d60013]" />
            <h2 className="text-xl font-medium mt-4">Loading form...</h2>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-[#FCFBF8]">
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
          <h1 className="text-3xl font-bold mb-3 my-[30px]">Create New Property Listing</h1>
          <p className="mb-8 text-lg font-playfair font-bold italic text-black">
            List your property in 60 seconds.
          </p>
          
          <div className="bg-white border border-black/10 p-8 rounded-xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Add the AI Property Extractor component at the top */}
                <AIPropertyExtractor form={form} />
                
                <Suspense fallback={<LoadingFallback />}>
                  <PropertyTypeSection form={form} />
                </Suspense>
                
                <Suspense fallback={<LoadingFallback />}>
                  <AddressSection form={form} />
                </Suspense>
                
                <Suspense fallback={<LoadingFallback />}>
                  <PropertyDetailsSection form={form} />
                </Suspense>
                
                <Suspense fallback={<LoadingFallback />}>
                  <PriceSection form={form} />
                </Suspense>
                
                <Suspense fallback={<LoadingFallback />}>
                  <ComparableSection form={form} />
                </Suspense>
                
                <Suspense fallback={<LoadingFallback />}>
                  <BountyInput 
                    value={form.watch("bounty")} 
                    onChange={(value) => form.setValue("bounty", value)} 
                  />
                </Suspense>
                
                <Suspense fallback={<LoadingFallback />}>
                  <ImageUploader images={images} setImages={setImages} imageFiles={imageFiles} setImageFiles={setImageFiles} isSubmitting={isSubmitting} uploadProgress={uploadProgress} isProcessingImages={isProcessingImages} />
                </Suspense>
                
                <Suspense fallback={<LoadingFallback />}>
                  <SubmitSection isSubmitting={isSubmitting} />
                </Suspense>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>;
};

export default CreateListing;

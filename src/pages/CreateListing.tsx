
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
import { Loader2, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import BountyInput from '@/components/create-listing/BountyInput';
import { ensureAuthenticated } from '@/utils/authUtils';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import formSchema (small import)
import { formSchema } from '@/components/create-listing/formSchema';
import { uploadImageToSupabase, uploadImagesToSupabase, createNotification } from '@/components/create-listing/UploadService';
import AIPropertyExtractor from '@/components/create-listing/AIPropertyExtractor';
import AdditionalImagesInput from '@/components/create-listing/AdditionalImagesInput';

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
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasPerformedAuthCheck, setHasPerformedAuthCheck] = useState(false);
  const [uploadAttempts, setUploadAttempts] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout
  } = useAuth();
  
  // Form setup
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
      additionalImagesLink: "",
    }
  });

  // Mark page as loaded after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced auth check that includes validation of the session
  const validateAuthentication = async () => {
    // Reset any previous auth errors
    setAuthError(null);
    
    if (!isAuthenticated || !user) {
      console.error("Authentication state check failed - user not authenticated");
      setAuthError("You must be logged in to create a listing");
      return false;
    }

    try {
      // Perform a direct session check to verify the auth state
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session validation error:", error);
        setAuthError("Authentication error. Please sign in again.");
        return false;
      }
      
      if (!data.session || !data.session.user) {
        console.error("No active session found despite authentication state being true");
        setAuthError("Your session has expired. Please sign in again.");
        return false;
      }
      
      console.log("Authentication validated successfully:", data.session.user.id);
      return true;
    } catch (err) {
      console.error("Exception during authentication validation:", err);
      setAuthError("Authentication error. Please try signing in again.");
      return false;
    } finally {
      setHasPerformedAuthCheck(true);
    }
  };

  // Check if user is authenticated with the enhanced validation
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to signin");
      toast.error("You must be logged in to create a listing");
      navigate('/signin', {
        state: {
          returnPath: '/sell/create'
        }
      });
    } else if (!authLoading && isAuthenticated) {
      validateAuthentication();
      
      // Check storage bucket exists
      const checkStorageBucket = async () => {
        try {
          console.log("Checking storage bucket access...");
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
                if (createError.message.includes("row-level security") || createError.message.includes("permission denied")) {
                  setAuthError("Storage access issue. Please try signing in again.");
                  toast.error("You don't have permission to create a storage bucket. Please contact support.");
                }
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
  }, [isAuthenticated, navigate, user, authLoading]);

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

  // Update onSubmit to handle errors better and avoid infinite loading states
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Reset error state
    setAuthError(null);
    
    // Verify authentication before starting
    const authUser = await ensureAuthenticated();
    if (!authUser) {
      console.error("Authentication check failed at form submission");
      setAuthError("Authentication required. Please sign in to continue.");
      return;
    }
    
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    // Create a new abort controller for this submission
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setIsSubmitting(true);
    setUploadProgress(0);
    setUploadAttempts(prev => prev + 1);

    // Show loading toast that we can update
    const loadingToastId = toast.loading("Creating your listing...");
    
    try {
      // Check if the request was aborted
      if (signal.aborted) {
        throw new Error("Upload was cancelled");
      }
      
      // Another authentication validation just before the critical database operations
      const authCheck = await validateAuthentication();
      if (!authCheck) {
        cancelUploads();
        toast.dismiss(loadingToastId);
        toast.error("Authentication error. Please sign in again before continuing.");
        return;
      }
      
      // Add detailed logging to track auth state
      console.log('Creating listing for authenticated user:', authUser.id);
      console.log('Auth state:', { isAuthenticated, hasValidSession: !!authUser });

      // Create a temporary ID for the listing that we'll use for image organization
      const tempPropertyId = uuidv4();

      // Show progress update
      toast.loading("Uploading and optimizing images...", {
        id: loadingToastId
      });
      setUploadProgress(10);

      let uploadedImageUrls: string[];
      
      try {
        // Upload images to Supabase storage using the enhanced service
        uploadedImageUrls = await uploadImagesToSupabase(imageFiles, tempPropertyId, progress => {
          if (signal.aborted) return;
          setUploadProgress(progress);
        });
      } catch (uploadError: any) {
        console.error("Image upload failed:", uploadError);
        // Show specific error for permission issues
        if (uploadError.message?.includes("permission denied") || uploadError.message?.includes("row-level security")) {
          toast.dismiss(loadingToastId);
          setAuthError("Storage permission issue. Please sign in again to refresh your session.");
          toast.error("Storage permission issue. Please check that you have permission to upload images.");
          cancelUploads();
          return;
        }
        
        // For other errors, continue with default image
        console.warn("Using default image due to upload failure");
        uploadedImageUrls = [DEFAULT_IMAGE];
        toast.loading("Using default image due to upload error...", {
          id: loadingToastId
        });
      }

      // Check if the request was aborted during image upload
      if (signal.aborted) {
        throw new Error("Upload was cancelled");
      }

      // Use uploaded URLs or fallback to default
      const finalImages = uploadedImageUrls.length > 0 ? uploadedImageUrls : [DEFAULT_IMAGE];

      // Create the location string from city, state and zip
      const location = `${values.city}, ${values.state} ${values.zipCode}`;

      // Store the full address separately from the display location
      const fullAddress = values.address;

      // Calculate below market percentage
      const price = Number(values.price) || 0;
      const marketPrice = Number(values.marketPrice) || 0;
      const belowMarket = marketPrice > price ? ((marketPrice - price) / marketPrice * 100).toFixed(1) : "0";

      // Generate title with property type and location
      const title = `${values.propertyType} in ${values.city}, ${values.state}`;

      // Update progress
      toast.loading("Saving listing details...", {
        id: loadingToastId
      });
      setUploadProgress(97);

      // Add timeout protection to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (isSubmitting) {
          cancelUploads();
          toast.dismiss(loadingToastId);
          toast.error("Submission timed out. Please try again.");
        }
      }, 60000); // 60 second timeout

      // Log the user ID being used for debugging
      console.log("Inserting listing with user_id:", authUser.id, "Type:", typeof authUser.id);

      try {
        // Using 'reward' instead of 'bounty' to match database column name
        const { data, error } = await supabase.from('property_listings').insert({
          title: title,
          price: price,
          market_price: marketPrice,
          location: location,
          full_address: fullAddress,
          description: values.description,
          beds: parseInt(values.beds) || 0,
          baths: parseInt(values.baths) || 0,
          sqft: parseInt(values.sqft) || 0,
          images: finalImages,
          user_id: authUser.id,
          reward: values.bounty ? Number(values.bounty) : null,
          additional_images_link: values.additionalImagesLink || null,
          property_type: values.propertyType || 'House',
          after_repair_value: values.afterRepairValue ? Number(values.afterRepairValue) : null,
          estimated_rehab: values.estimatedRehab ? Number(values.estimatedRehab) : null
        }).select();
        
        // Clear timeout since we got a response
        clearTimeout(timeoutId);
        
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
            await createNotification(data[0].id, values.propertyType || 'Property', values.city || '', values.state || '');
            console.log("Notification created for new property");
          } catch (notifyError) {
            console.error("Could not create notification:", notifyError);
          }
        }

        // Navigate to dashboard
        navigate('/dashboard');
      } catch (dbError: any) {
        console.error("Database error:", dbError);
        
        // Clear timeout since we got a response
        clearTimeout(timeoutId);
        
        // Handle specific database errors
        if (dbError.message?.includes('violates row-level security policy')) {
          toast.dismiss(loadingToastId);
          setAuthError("Access denied. Please ensure you're properly signed in.");
          toast.error("Access denied. Please ensure you're properly signed in.");
          
          // Force re-authentication
          logout();
          setTimeout(() => {
            navigate('/signin', {
              state: {
                returnPath: '/sell/create'
              }
            });
          }, 1500);
          return;
        }
        
        throw dbError;
      }
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast.dismiss(loadingToastId);
      cancelUploads();

      // Show more specific error messages
      if (error.message?.includes('invalid input syntax for type uuid')) {
        setAuthError("Authentication error. Please sign out and sign in again.");
        toast.error("Authentication error. Please sign out and sign in again.");
      } else if (error.message?.includes('foreign key constraint')) {
        setAuthError("User account error. Please update your profile.");
        toast.error("User account error. Please update your profile.");
      } else if (error.message?.includes('violates row-level security policy')) {
        setAuthError("Access denied. Please ensure you're properly signed in.");
        toast.error("Access denied. Please ensure you're properly signed in.");
        console.error("RLS policy violation. User ID:", user?.id);
        // Force re-authentication
        logout();
        setTimeout(() => {
          navigate('/signin', {
            state: {
              returnPath: '/sell/create'
            }
          });
        }, 1500);
      } else if (error.message === "Upload was cancelled") {
        toast.error("Upload was cancelled");
      } else {
        setAuthError(`Failed to create listing: ${error.message || 'Unknown error'}`);
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
          
          {/* Show auth errors with retry option */}
          {authError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {authError}{" "}
                <button 
                  onClick={validateAuthentication} 
                  className="underline font-semibold"
                >
                  Retry authentication
                </button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-white border border-black/10 p-8 rounded-xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Add the AI Property Extractor component at the top */}
                <Suspense fallback={<LoadingFallback />}>
                  <AIPropertyExtractor form={form} />
                </Suspense>
                
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
                
                {/* Add the AdditionalImagesInput component here */}
                <Suspense fallback={<LoadingFallback />}>
                  <AdditionalImagesInput form={form} />
                </Suspense>
                
                <Suspense fallback={<LoadingFallback />}>
                  <SubmitSection 
                    isSubmitting={isSubmitting}
                    hasAuthError={!!authError}
                  />
                </Suspense>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>;
};

export default CreateListing;

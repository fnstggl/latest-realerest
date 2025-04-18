
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { formSchema } from '@/components/create-listing/formSchema';
import { uploadImagesToSupabase, createNotification } from '@/components/create-listing/UploadService';

export const useCreateListing = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  
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
      comparableAddress3: ""
    }
  });

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
      const DEFAULT_IMAGE = "https://source.unsplash.com/random/400x300?house";
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
      const {
        data,
        error
      } = await supabase.from('property_listings').insert({
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
        user_id: user.id
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

  return {
    form,
    images,
    setImages,
    imageFiles,
    setImageFiles,
    isSubmitting,
    uploadProgress,
    isProcessingImages,
    setIsProcessingImages,
    isPageLoaded,
    setIsPageLoaded,
    onSubmit
  };
};

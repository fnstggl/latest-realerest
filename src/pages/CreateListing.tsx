
import React, { useState, useRef, useEffect } from 'react';
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
import { v4 as uuidv4 } from 'uuid';

// Import refactored components
import { formSchema } from '@/components/create-listing/formSchema';
import PropertyTypeSection from '@/components/create-listing/PropertyTypeSection';
import AddressSection from '@/components/create-listing/AddressSection';
import PropertyDetailsSection from '@/components/create-listing/PropertyDetailsSection';
import PriceSection from '@/components/create-listing/PriceSection';
import ComparableSection from '@/components/create-listing/ComparableSection';
import ImageUploader from '@/components/create-listing/ImageUploader';
import SubmitSection from '@/components/create-listing/SubmitSection';
import { uploadImagesToSupabase, createNotification } from '@/components/create-listing/UploadService';

// Use a smaller default image size for faster loading
const DEFAULT_IMAGE = "https://source.unsplash.com/random/400x300?house";

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
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
      
      // Upload images to Supabase storage using the service
      const uploadedImageUrls = await uploadImagesToSupabase(imageFiles, (progress) => {
        setUploadProgress(progress);
      });
      
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
      
      // Generate title with property type and location
      const title = `${values.propertyType} in ${values.city}, ${values.state}`;
      
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
          property_type: values.propertyType,
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
      
      // Trigger a notification for all users when a new property is listed
      if (data?.[0]?.id) {
        try {
          // Create notification using our service
          await createNotification(
            data[0].id,
            values.propertyType,
            values.city,
            values.state
          );
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
          navigate('/signin', { state: { returnPath: '/sell/create' } });
        }, 1500);
      } else {
        toast.error(`Failed to create listing: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
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
                {/* Property Type Dropdown Section */}
                <PropertyTypeSection form={form} />
                
                {/* Property Address Section */}
                <AddressSection form={form} />
                
                {/* Property Details Section */}
                <PropertyDetailsSection form={form} />
                
                {/* Price Information Section */}
                <PriceSection form={form} />
                
                {/* Comparable Properties Section */}
                <ComparableSection form={form} />
                
                {/* Property Images Section */}
                <ImageUploader 
                  images={images}
                  setImages={setImages}
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                  isSubmitting={isSubmitting}
                  uploadProgress={uploadProgress}
                  isProcessingImages={isProcessingImages}
                />
                
                {/* Submit Button Section */}
                <SubmitSection isSubmitting={isSubmitting} />
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateListing;

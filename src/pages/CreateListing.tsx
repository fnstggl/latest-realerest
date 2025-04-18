
import React, { useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Form } from "@/components/ui/form";
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useCreateListing } from '@/hooks/useCreateListing';

// Lazy load heavier components
const PropertyTypeSection = lazy(() => import('@/components/create-listing/PropertyTypeSection'));
const AddressSection = lazy(() => import('@/components/create-listing/AddressSection'));
const PropertyDetailsSection = lazy(() => import('@/components/create-listing/PropertyDetailsSection'));
const PriceSection = lazy(() => import('@/components/create-listing/PriceSection'));
const ComparableSection = lazy(() => import('@/components/create-listing/ComparableSection'));
const ImageUploader = lazy(() => import('@/components/create-listing/ImageUploader'));
const SubmitSection = lazy(() => import('@/components/create-listing/SubmitSection'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-[#d60013]" />
  </div>
);

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const {
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
  } = useCreateListing();

  // Mark page as loaded after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [setIsPageLoaded]);

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

  // If page is not fully loaded, show a more pleasant loading state
  if (!isPageLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/10 to-purple-100/20">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#d60013]" />
            <h2 className="text-xl font-medium mt-4">Loading form...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 py-12" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-3 my-[30px]">Create New Property Listing</h1>
          <p className="mb-8 text-lg">
            <span className="text-gradient-primary">List your property in 60 seconds.</span>
          </p>
          
          <div className="bg-white border border-black/10 p-8 rounded-xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <ImageUploader 
                    images={images} 
                    setImages={setImages} 
                    imageFiles={imageFiles} 
                    setImageFiles={setImageFiles} 
                    isSubmitting={isSubmitting} 
                    uploadProgress={uploadProgress} 
                    isProcessingImages={isProcessingImages} 
                  />
                </Suspense>
                
                <Suspense fallback={<LoadingFallback />}>
                  <SubmitSection isSubmitting={isSubmitting} />
                </Suspense>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateListing;

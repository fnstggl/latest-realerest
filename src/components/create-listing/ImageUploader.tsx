
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from 'lucide-react';
import { toast } from "sonner";
import OptimizedImage from '@/components/ui/OptimizedImage';

interface ImageUploaderProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  imageFiles: File[];
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isSubmitting: boolean;
  uploadProgress: number;
  isProcessingImages: boolean;
}

// Maximum image size in bytes (3MB)
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
// Maximum number of images allowed
const MAX_IMAGES = 10;
// Supported image types
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif', 'application/octet-stream'];

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  setImages,
  imageFiles,
  setImageFiles,
  isSubmitting,
  uploadProgress,
  isProcessingImages
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [conversionInProgress, setConversionInProgress] = useState(false);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.startsWith('blob:')) {
          URL.revokeObjectURL(img);
        }
      });
    };
  }, [images]);

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Enhanced HEIC detection with all possible checks
  const isHeicOrHeifFile = (file: File): boolean => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    // Combined detection approach
    return (
      fileType === 'image/heic' || 
      fileType === 'image/heif' || 
      fileName.endsWith('.heic') || 
      fileName.endsWith('.heif') ||
      // Handle miscategorized files
      (fileType === 'application/octet-stream' && 
        (fileName.endsWith('.heic') || fileName.endsWith('.heif')))
    );
  };

  // Create a preview for any image, with special handling for HEIC files
  const createImagePreview = async (file: File): Promise<string> => {
    // For HEIC files, we need special handling
    if (isHeicOrHeifFile(file)) {
      try {
        setConversionInProgress(true);
        
        // Try to dynamically import heic2any for conversion
        try {
          const heic2any = await import('heic2any');
          
          console.log("Converting HEIC file for preview:", file.name);
          
          // For more reliable conversion, use simple settings
          const conversionOptions = {
            blob: file,
            toType: "image/jpeg",
            quality: 0.8
          };
          
          // Apply timeout to conversion to prevent hanging
          const conversionPromise = heic2any.default(conversionOptions);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Preview conversion timed out")), 15000)
          );
          
          // Race between conversion and timeout
          const jpegBlob = await Promise.race([conversionPromise, timeoutPromise]);
          
          if (!jpegBlob) {
            throw new Error("HEIC conversion returned empty result");
          }
          
          // Create a URL for the converted image
          const resultBlob = Array.isArray(jpegBlob) ? jpegBlob[0] : jpegBlob;
          const imageUrl = URL.createObjectURL(resultBlob);
          
          setConversionInProgress(false);
          return imageUrl;
        } catch (importError) {
          console.error("Failed to import heic2any library:", importError);
          throw new Error("HEIC conversion library not available");
        }
      } catch (error) {
        console.error("HEIC preview conversion failed:", error);
        setConversionInProgress(false);
        
        // Use a placeholder until upload
        return '/placeholder.svg';
      }
    } else {
      // Standard file handling - create a normal blob URL
      return URL.createObjectURL(file);
    }
  };

  // Optimized image handling with better validation and preview generation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsValidating(true);

    try {
      // Check if adding these files would exceed the limit
      if (images.length + files.length > MAX_IMAGES) {
        toast.warning(`Maximum ${MAX_IMAGES} images allowed. Only adding the first ${MAX_IMAGES - images.length}.`);
      }

      const newImageFiles: File[] = [];
      const newImageUrls: string[] = [];
      
      // Limit to MAX_IMAGES images maximum
      const filesToProcess = Math.min(MAX_IMAGES - images.length, files.length);
      
      // Process files with progress feedback
      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        
        // Check file type using enhanced detection
        const fileType = file.type.toLowerCase();
        const isHeic = isHeicOrHeifFile(file);
        
        const isSupported = SUPPORTED_IMAGE_TYPES.includes(fileType) || isHeic;
        if (!isSupported) {
          toast.error(`File "${file.name}" is not a supported image type and was skipped.`);
          continue;
        }
        
        // Check file size and show warning, but still allow
        if (file.size > MAX_IMAGE_SIZE) {
          toast.warning(`Image "${file.name}" is large (${(file.size / 1024 / 1024).toFixed(1)}MB). It will be compressed during upload.`);
        }
        
        // Add to collection
        newImageFiles.push(file);
        
        try {
          // Create preview with special handling for HEIC
          const imageUrl = await createImagePreview(file);
          newImageUrls.push(imageUrl);
        } catch (previewErr) {
          console.error("Error creating preview:", previewErr);
          // Use placeholder if preview creation fails
          newImageUrls.push('/placeholder.svg');
        }
      }

      if (newImageFiles.length > 0) {
        setImageFiles(prev => [...prev, ...newImageFiles]);
        setImages(prev => [...prev, ...newImageUrls]);
        
        toast.success(`${newImageFiles.length} image${newImageFiles.length === 1 ? '' : 's'} added. ${
          newImageFiles.some(isHeicOrHeifFile) ? 'HEIC/HEIF images will be converted to JPEG during upload.' : 
          'Images will be optimized during upload.'
        }`);
      }
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing images. Please try again.");
    } finally {
      // Reset the file input and validation state
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsValidating(false);
    }
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    if (images[index] && images[index].startsWith('blob:')) {
      URL.revokeObjectURL(images[index]);
    }
    
    // Remove from both arrays
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 rounded-xl border border-black/10 bg-white">
      <h2 className="text-xl font-bold mb-4">Property Images</h2>
      <p className="text-sm text-gray-600 mb-4">
        Recommended: Add up to {MAX_IMAGES} images (less than {MAX_IMAGE_SIZE/1024/1024}MB each). 
        All formats including HEIC/iPhone images are supported.
      </p>
      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif,.heic,.heif,image/*"
          disabled={isSubmitting || isProcessingImages || isValidating || conversionInProgress || images.length >= MAX_IMAGES}
        />
        <button 
          type="button" 
          className="h-32 w-full bg-white text-black relative rounded-xl flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50"
          onClick={handleImageUpload}
          disabled={isSubmitting || isProcessingImages || isValidating || conversionInProgress || images.length >= MAX_IMAGES}
        >
          {isValidating || conversionInProgress ? (
            <>
              <span className="font-bold">{conversionInProgress ? 'Converting HEIC image...' : 'Processing images...'}</span>
              <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
            </>
          ) : isProcessingImages ? (
            <>
              <span className="font-bold">Processing images...</span>
              <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
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
          <span 
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: "transparent",
              border: "2px solid black"
            }}
          ></span>
        </button>
      </div>
      
      {/* Display selected images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {images.map((img, index) => (
            <div key={index} className="relative border border-black/10 rounded-xl overflow-hidden group">
              <OptimizedImage 
                src={img} 
                alt={`Property ${index + 1}`} 
                className="h-32 w-full object-cover" 
                width={200}
                height={150}
                sizes="(max-width: 768px) 50vw, 25vw"
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
            className="bg-black h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-gray-500 mt-1">
            {uploadProgress < 30 ? "Processing images..." : 
             uploadProgress < 80 ? "Uploading images..." : 
             "Finalizing..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

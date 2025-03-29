
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from "sonner";

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
const MAX_IMAGES = 5;

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

  return (
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
          ></div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

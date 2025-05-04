
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from 'lucide-react';
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
const MAX_IMAGES = 10;

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

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
      // Limit to MAX_IMAGES images maximum
      const filesToProcess = Math.min(MAX_IMAGES - images.length, files.length);

      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        
        // Verify file is an image
        if (!file.type.startsWith('image/')) {
          toast.error(`File "${file.name}" is not an image and was skipped.`);
          continue;
        }
        
        // Check file size
        if (file.size > MAX_IMAGE_SIZE) {
          toast.warning(`Image "${file.name}" exceeds ${MAX_IMAGE_SIZE/1024/1024}MB limit. Compressing...`);
        }
        
        newImageFiles.push(file);
        
        // Create a URL for the image preview (with memory management)
        const imageUrl = URL.createObjectURL(file);
        setImages(prev => [...prev, imageUrl]);
      }

      if (newImageFiles.length > 0) {
        setImageFiles(prev => [...prev, ...newImageFiles]);
        toast.success(`${newImageFiles.length} image(s) added. They'll be optimized during upload.`);
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
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 rounded-xl border border-black/10 bg-white">
      <h2 className="text-xl font-bold mb-4">Property Images</h2>
      <p className="text-sm text-gray-600 mb-4">
        Recommended: Add up to {MAX_IMAGES} images (less than {MAX_IMAGE_SIZE/1024/1024}MB each). 
        Images will be automatically optimized to save storage and improve loading times.
      </p>
      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          disabled={isSubmitting || isProcessingImages || isValidating || images.length >= MAX_IMAGES}
        />
        <button 
          type="button" 
          className="h-32 w-full bg-white text-black relative rounded-xl flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50"
          onClick={handleImageUpload}
          disabled={isSubmitting || isProcessingImages || isValidating || images.length >= MAX_IMAGES}
        >
          {isValidating ? (
            <>
              <span className="font-bold">Validating images...</span>
            </>
          ) : isProcessingImages ? (
            <>
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
              <img 
                src={img} 
                alt={`Property ${index + 1}`} 
                className="h-32 w-full object-cover" 
                loading="lazy"
                decoding="async"
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
            {uploadProgress < 30 ? "Compressing images..." : 
             uploadProgress < 80 ? "Uploading images..." : 
             "Finalizing..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

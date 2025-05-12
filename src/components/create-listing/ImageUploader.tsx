
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
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];

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
  const [heicFiles, setHeicFiles] = useState<Record<string, boolean>>({});

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

  // Convert HEIC to JPEG for preview if possible
  const createHeicPreview = async (file: File): Promise<string> => {
    try {
      // Try to dynamically import heic2any for conversion
      const heic2any = await import('heic2any');
      
      // Convert HEIC to JPEG blob for preview
      const jpegBlob = await heic2any.default({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8
      });
      
      // Create a URL for the converted image
      const imageUrl = URL.createObjectURL(jpegBlob instanceof Blob ? jpegBlob : jpegBlob[0]);
      
      // Mark this URL as being from a HEIC file
      setHeicFiles(prev => ({ ...prev, [imageUrl]: true }));
      
      toast.success(`HEIC file "${file.name}" converted for preview.`);
      return imageUrl;
    } catch (error) {
      console.error("HEIC preview conversion failed:", error);
      toast.error(`Failed to convert HEIC file "${file.name}" for preview. Using basic preview instead.`);
      
      // Fall back to regular object URL
      const imageUrl = URL.createObjectURL(file);
      setHeicFiles(prev => ({ ...prev, [imageUrl]: true }));
      return imageUrl;
    }
  };

  // Check if file is a HEIC/HEIF format
  const isHeicFile = (file: File): boolean => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    return fileType === 'image/heic' || 
          fileType === 'image/heif' || 
          fileName.endsWith('.heic') || 
          fileName.endsWith('.heif');
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

      // Process files one by one - with special handling for HEIC
      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        
        // Check if file is a supported image type
        const fileType = file.type.toLowerCase();
        // Special handling for HEIC files which might have inconsistent MIME types
        const fileIsHeic = isHeicFile(file);
        
        if (!SUPPORTED_IMAGE_TYPES.includes(fileType) && !fileIsHeic) {
          toast.error(`File "${file.name}" is not a supported image type and was skipped.`);
          continue;
        }
        
        // Check file size
        if (file.size > MAX_IMAGE_SIZE) {
          toast.warning(`Image "${file.name}" exceeds ${MAX_IMAGE_SIZE/1024/1024}MB limit. Will be compressed during upload.`);
        }
        
        newImageFiles.push(file);
        
        // Create a URL for the image preview (with memory management)
        let imageUrl: string;
        
        // Special handling for HEIC files - convert them for preview
        if (fileIsHeic) {
          toast.loading(`Converting HEIC file "${file.name}" for preview...`, { id: `heic-${i}` });
          try {
            imageUrl = await createHeicPreview(file);
            toast.dismiss(`heic-${i}`);
          } catch (conversionError) {
            toast.dismiss(`heic-${i}`);
            toast.error(`Failed to create preview for "${file.name}". It will still be uploaded and converted.`);
            // Use placeholder for preview
            imageUrl = '/placeholder.svg';
          }
        } else {
          imageUrl = URL.createObjectURL(file);
        }
        
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
    
    // Also remove from heicFiles tracking if it exists there
    if (heicFiles[images[index]]) {
      setHeicFiles(prev => {
        const newHeicFiles = { ...prev };
        delete newHeicFiles[images[index]];
        return newHeicFiles;
      });
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
          accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif,.heic,.heif"
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
              <span className="text-xs">JPG, PNG, GIF, WEBP, HEIC supported</span>
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
                data-heic={heicFiles[img] ? 'true' : 'false'}
              />
              <button 
                type="button" 
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={() => removeImage(index)}
                disabled={isSubmitting}
              >
                <X size={16} />
              </button>
              {heicFiles[img] && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2">
                  HEIC
                </div>
              )}
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


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { X, Upload, ImagePlus } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Progress } from "@/components/ui/progress";

interface ImageUploaderProps {
  images: string[];
  setImages: (images: string[]) => void;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  isSubmitting?: boolean;
  uploadProgress?: number;
  isProcessingImages?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  setImages,
  imageFiles,
  setImageFiles,
  isSubmitting = false,
  uploadProgress = 0,
  isProcessingImages = false,
}) => {
  const [dragging, setDragging] = useState(false);

  // Process file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Convert FileList to array
    const newFiles = Array.from(files);
    
    // Check if exceeding maximum file count (10)
    if (imageFiles.length + newFiles.length > 10) {
      toast.error('You can only upload up to 10 images');
      return;
    }

    // Validate file types
    const validFiles = newFiles.filter(file => {
      const isValid = file.type.startsWith('image/') || 
                      file.name.toLowerCase().endsWith('.heic') || 
                      file.name.toLowerCase().endsWith('.heif');
      if (!isValid) {
        toast.error(`${file.name} is not a valid image file`);
      }
      return isValid;
    });

    // Check file sizes
    const validSizedFiles = validFiles.filter(file => {
      const isValidSize = file.size < 10 * 1024 * 1024; // 10MB limit
      if (!isValidSize) {
        toast.error(`${file.name} exceeds the 10MB file size limit`);
      }
      return isValidSize;
    });

    if (validSizedFiles.length > 0) {
      // Add valid files to the existing files
      setImageFiles([...imageFiles, ...validSizedFiles]);
      
      // Create temporary preview URLs
      validSizedFiles.forEach(file => {
        const previewUrl = URL.createObjectURL(file);
        setImages([...images, previewUrl]);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleRemoveImage = (index: number) => {
    // Remove from imageFiles
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);

    // Remove from preview images
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Property Images</h3>
        <span className="text-sm text-gray-500">
          {imageFiles.length}/10 images • 10MB max per image
        </span>
      </div>

      {/* Image upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer hover:border-gray-400 text-center ${
          dragging ? 'border-primary bg-slate-100/30' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('image-upload')?.click()}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*,.heic,.heif"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
          disabled={isSubmitting || isProcessingImages}
        />
        <div className="flex flex-col items-center justify-center">
          <ImagePlus className="w-10 h-10 mb-2 text-gray-400" />
          <p className="mb-2 text-sm font-medium">
            Drag & drop images or <span className="text-primary underline">browse</span>
          </p>
          <p className="text-xs text-gray-500">
            Supports JPG, PNG, WebP, HEIC • 10MB max file size
          </p>
        </div>
      </div>

      {/* Upload progress indicator */}
      {isSubmitting && uploadProgress > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">
              {isProcessingImages ? 'Processing images...' : 'Uploading images...'}
            </span>
            <span className="text-sm">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-medium">Uploaded images</h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <AspectRatio ratio={3/2} className="bg-slate-100 rounded-md overflow-hidden">
                  <img
                    src={image}
                    alt={`Property Image ${index + 1}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Add fallback for broken images
                      e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Preview';
                    }}
                  />
                </AspectRatio>
                {!isSubmitting && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs py-0.5 px-2 rounded">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Drag files to rearrange. First image will be the main listing photo.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

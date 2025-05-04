
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImagesProps {
  mainImage: string;
  images?: string[];
  onImagesChange?: (images: string[]) => void;
  editable?: boolean;
}

const PropertyImages: React.FC<PropertyImagesProps> = ({
  mainImage,
  images = [],
  onImagesChange,
  editable = false
}) => {
  const [activeImage, setActiveImage] = useState(mainImage);
  
  // Create a sanitized list of unique, valid images
  const validImages = React.useMemo(() => {
    if (!images || images.length === 0) return [mainImage];
    // Filter out empty or invalid URLs and remove duplicates
    return [...new Set([mainImage, ...images.filter(img => img && typeof img === 'string' && img.trim() !== '')])];
  }, [mainImage, images]);

  // Function to move an image left in the array
  const moveImageLeft = (index: number) => {
    if (index <= 0 || !editable || !onImagesChange) return;
    
    const newImages = [...validImages];
    const temp = newImages[index];
    newImages[index] = newImages[index - 1];
    newImages[index - 1] = temp;
    
    onImagesChange(newImages);
    
    if (activeImage === newImages[index]) {
      setActiveImage(newImages[index]);
    } else if (activeImage === newImages[index - 1]) {
      setActiveImage(newImages[index - 1]);
    }
  };

  // Function to move an image right in the array
  const moveImageRight = (index: number) => {
    if (index >= validImages.length - 1 || !editable || !onImagesChange) return;
    
    const newImages = [...validImages];
    const temp = newImages[index];
    newImages[index] = newImages[index + 1];
    newImages[index + 1] = temp;
    
    onImagesChange(newImages);
    
    if (activeImage === newImages[index]) {
      setActiveImage(newImages[index]);
    } else if (activeImage === newImages[index + 1]) {
      setActiveImage(newImages[index + 1]);
    }
  };
  
  return (
    <div>
      <div className="border border-white/40 shadow-lg p-2 rounded-xl mb-4 my-[35px]">
        <img 
          src={activeImage || mainImage || '/placeholder.svg'} 
          alt="Property image" 
          className="w-full h-[400px] object-cover rounded-lg" 
          loading="lazy" 
          decoding="async"
          width="1280"
          height="720"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      
      {validImages && validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {validImages.map((img, index) => (
            <div 
              key={index} 
              className={`cursor-pointer relative ${activeImage === img ? 'border-2 border-gray-400' : 'border border-white/40'} rounded-lg`} 
            >
              <img 
                src={img} 
                alt={`Property image ${index + 1}`} 
                className="w-full h-20 object-cover rounded-lg" 
                loading="lazy" 
                decoding="async"
                width="100" 
                height="100"
                onClick={() => setActiveImage(img)}
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              
              {editable && (
                <div className="absolute inset-0 flex items-center justify-between">
                  <button
                    type="button"
                    className={`bg-white/80 hover:bg-white text-black rounded-full p-1 ml-1 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-80'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImageLeft(index);
                    }}
                    disabled={index === 0}
                    aria-label="Move image left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <button
                    type="button"
                    className={`bg-white/80 hover:bg-white text-black rounded-full p-1 mr-1 ${index === validImages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-80'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImageRight(index);
                    }}
                    disabled={index === validImages.length - 1}
                    aria-label="Move image right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImages;

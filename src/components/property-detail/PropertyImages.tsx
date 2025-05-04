
import React, { useState } from 'react';

interface PropertyImagesProps {
  mainImage: string;
  images?: string[];
}

const PropertyImages: React.FC<PropertyImagesProps> = ({
  mainImage,
  images = []
}) => {
  const [activeImage, setActiveImage] = useState(mainImage);
  
  // Create a sanitized list of unique, valid images
  const validImages = React.useMemo(() => {
    if (!images || images.length === 0) return [mainImage];
    // Filter out empty or invalid URLs and remove duplicates
    return [...new Set([mainImage, ...images.filter(img => img && typeof img === 'string')])];
  }, [mainImage, images]);
  
  return (
    <div>
      <div className="border border-white/40 shadow-lg p-2 rounded-xl mb-4 my-[35px]">
        <img 
          src={activeImage || mainImage} 
          alt="Property image" 
          className="w-full h-[400px] object-cover rounded-lg" 
          loading="lazy" 
          decoding="async"
          width="1280"
          height="720"
        />
      </div>
      
      {validImages && validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {validImages.map((img, index) => (
            <div 
              key={index} 
              className={`cursor-pointer ${activeImage === img ? 'border-2 border-gray-400' : 'border border-white/40'} rounded-lg`} 
              onClick={() => setActiveImage(img)}
            >
              <img 
                src={img} 
                alt={`Property image ${index + 1}`} 
                className="w-full h-20 object-cover rounded-lg" 
                loading="lazy" 
                decoding="async"
                width="100" 
                height="100"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImages;

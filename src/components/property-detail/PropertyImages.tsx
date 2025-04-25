
import React, { useState } from 'react';

export interface PropertyImagesProps {
  images: string[];
  mainImage?: string; // Make mainImage optional with a default value
}

export const PropertyImages: React.FC<PropertyImagesProps> = ({ 
  images, 
  mainImage = images && images.length > 0 ? images[0] : undefined // Default to first image
}) => {
  const [currentImage, setCurrentImage] = useState(mainImage || (images && images.length > 0 ? images[0] : ''));

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 w-full h-64 rounded-xl flex items-center justify-center mb-6">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-2">
        <img
          src={currentImage || images[0]}
          alt="Property"
          className="w-full h-[400px] object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden cursor-pointer ${
                currentImage === image ? 'ring-2 ring-black' : ''
              }`}
              onClick={() => setCurrentImage(image)}
            >
              <img
                src={image}
                alt={`Property thumbnail ${index + 1}`}
                className="w-full h-20 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImages;


import React, { useState } from 'react';

interface PropertyImagesProps {
  mainImage: string;
  images?: string[];
}

const PropertyImages: React.FC<PropertyImagesProps> = ({ mainImage, images = [] }) => {
  const [activeImage, setActiveImage] = useState(mainImage);

  return (
    <div>
      <div className="layer-2 border border-white/20 shadow-lg p-2 rounded-xl mb-4">
        <img 
          src={activeImage || mainImage} 
          alt="Property image" 
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </div>
      
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`layer-1 cursor-pointer ${activeImage === img ? 'border-2 border-white/40' : 'border border-white/20'} rounded-lg transition-all duration-300`}
              onClick={() => setActiveImage(img)}
            >
              <img 
                src={img} 
                alt={`Property image ${index + 1}`} 
                className="w-full h-20 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImages;

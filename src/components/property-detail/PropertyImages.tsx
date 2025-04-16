
import React, { useState } from 'react';

interface PropertyImagesProps {
  mainImage: string;
  images?: string[];
}

const PropertyImages: React.FC<PropertyImagesProps> = ({ mainImage, images = [] }) => {
  const [activeImage, setActiveImage] = useState(mainImage);

  return (
    <div>
      <div className="glass-card backdrop-blur-lg border border-white/20 shadow-lg p-2 rounded-xl property-card-glow mb-4">
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
              className={`glass-content backdrop-blur-sm cursor-pointer property-card-glow ${activeImage === img ? 'border-2 border-white/40' : 'border border-white/20'}`}
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

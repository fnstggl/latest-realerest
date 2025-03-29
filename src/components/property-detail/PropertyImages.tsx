
import React, { useState } from 'react';

interface PropertyImagesProps {
  mainImage: string;
  images?: string[];
}

const PropertyImages: React.FC<PropertyImagesProps> = ({ mainImage, images = [] }) => {
  const [activeImage, setActiveImage] = useState(mainImage);

  return (
    <div>
      <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4">
        <img 
          src={activeImage || mainImage} 
          alt="Property image" 
          className="w-full h-[400px] object-cover"
        />
      </div>
      
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`border-2 cursor-pointer ${activeImage === img ? 'border-[#d60013]' : 'border-black'}`}
              onClick={() => setActiveImage(img)}
            >
              <img 
                src={img} 
                alt={`Property image ${index + 1}`} 
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

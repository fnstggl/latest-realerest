
import React, { useState, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PropertyImagesProps {
  mainImage: string;
  images?: string[];
  editable?: boolean;
  onImagesReordered?: (newImages: string[]) => void;
}

interface SortableImageProps {
  image: string;
  id: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SortableImage: React.FC<SortableImageProps> = ({ image, id, isActive, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${isActive ? 'border-2 border-gray-400' : 'border border-white/40'} rounded-lg`}
      onClick={onClick}
    >
      <img 
        src={image} 
        alt={`Property image`} 
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
  );
};

const PropertyImages: React.FC<PropertyImagesProps> = ({
  mainImage,
  images = [],
  editable = false,
  onImagesReordered
}) => {
  const [activeImage, setActiveImage] = useState(mainImage);
  
  // Create a sanitized list of unique, valid images
  const validImages = React.useMemo(() => {
    if (!images || images.length === 0) return [mainImage];
    // Filter out empty or invalid URLs and remove duplicates
    return [...new Set([mainImage, ...images.filter(img => img && typeof img === 'string' && img.trim() !== '')])];
  }, [mainImage, images]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = validImages.findIndex(img => img === active.id);
      const newIndex = validImages.findIndex(img => img === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove(validImages, oldIndex, newIndex);
        if (onImagesReordered) {
          onImagesReordered(newImages);
          
          // Update active image if main image changed
          if (activeImage === validImages[0]) {
            setActiveImage(newImages[0]);
          }
        }
      }
    }
  }, [validImages, onImagesReordered, activeImage]);
  
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
          {editable ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={validImages} strategy={verticalListSortingStrategy}>
                {validImages.map((img) => (
                  <SortableImage 
                    key={img} 
                    image={img} 
                    id={img} 
                    isActive={activeImage === img}
                    onClick={() => setActiveImage(img)} 
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            // Non-editable view
            validImages.map((img, index) => (
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyImages;

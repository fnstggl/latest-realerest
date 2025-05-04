
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface PropertyImagesProps {
  mainImage: string;
  images?: string[];
  editable?: boolean;
  onReorder?: (newOrder: string[]) => void;
}

const PropertyImages: React.FC<PropertyImagesProps> = ({
  mainImage,
  images = [],
  editable = false,
  onReorder
}) => {
  const [activeImage, setActiveImage] = useState(mainImage);
  
  // Create a sanitized list of unique, valid images
  const validImages = React.useMemo(() => {
    if (!images || images.length === 0) return [mainImage];
    // Filter out empty or invalid URLs and remove duplicates
    return [...new Set([mainImage, ...images.filter(img => img && typeof img === 'string' && img.trim() !== '')])];
  }, [mainImage, images]);
  
  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination || !onReorder) {
      return;
    }

    const reorderedImages = Array.from(validImages);
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);

    // Set the first image as main
    setActiveImage(reorderedImages[0]);
    
    // Notify parent component of the reordering
    onReorder(reorderedImages);
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
        editable ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="property-images" direction="horizontal">
              {(provided) => (
                <div 
                  className="grid grid-cols-4 gap-2"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {validImages.map((img, index) => (
                    <Draggable key={img} draggableId={img} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`cursor-pointer relative ${activeImage === img ? 'border-2 border-gray-400' : 'border border-white/40'} rounded-lg`}
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
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                              Cover
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
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
        )
      )}
    </div>
  );
};

export default PropertyImages;

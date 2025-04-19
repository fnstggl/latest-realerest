
import React from 'react';
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const ImageSliderSection = () => {
  // Array of placeholder colors for variety
  const placeholderColors = ['#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563'];
  
  return (
    <section className="py-16 overflow-hidden">
      <InfiniteSlider durationOnHover={75} gap={24} className="mb-16">
        {placeholderColors.map((color, index) => (
          <div
            key={index}
            className="aspect-square w-[200px] rounded-lg"
            style={{ backgroundColor: color }}
            aria-label={`Placeholder image ${index + 1}`}
          />
        ))}
      </InfiniteSlider>
    </section>
  );
};

export default ImageSliderSection;

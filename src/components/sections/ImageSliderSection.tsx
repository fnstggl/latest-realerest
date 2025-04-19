
import React from 'react';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

const ImageSliderSection: React.FC = () => {
  const placeholderImages = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
  ];

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <InfiniteSlider durationOnHover={75} gap={24}>
          {placeholderImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Placeholder ${index + 1}`}
              className="aspect-square w-[200px] rounded-lg object-cover glass-card"
            />
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
};

export default ImageSliderSection;


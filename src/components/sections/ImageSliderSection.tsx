
import React from 'react';
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const ImageSliderSection = () => {
  const testimonials = [
    {
      image: "public/lovable-uploads/13556d32-ddd9-4eac-86d2-f459a5c5bd80.png",
      alt: "Alex Khan testimonial"
    },
    {
      image: "public/lovable-uploads/9f1e56f6-7883-4248-98a3-766802dbd545.png",
      alt: "Anthony Wilson testimonial"
    },
    {
      image: "public/lovable-uploads/d9a0bc6f-78a4-444f-9fa5-2758a42dbb53.png",
      alt: "Catherine Valdez testimonial"
    },
    {
      image: "public/lovable-uploads/406dd083-b0ee-420c-96a8-4bc55a04ec7b.png",
      alt: "Mason Blackwell testimonial"
    },
    {
      image: "public/lovable-uploads/5e356598-8803-4705-bc7f-7d69dc957ef9.png",
      alt: "Jessie McLean testimonial"
    },
    {
      image: "public/lovable-uploads/4b4f54a0-bc3a-4fb4-b642-ae71da1b53d5.png",
      alt: "Mona Rodriguez testimonial"
    }
  ];
  
  return (
    <section className="py-16 overflow-hidden">
      <InfiniteSlider durationOnHover={75} gap={24} className="mb-16">
        {testimonials.map((testimonial, index) => (
          <img
            key={index}
            src={testimonial.image}
            alt={testimonial.alt}
            className="aspect-square w-[300px] rounded-lg object-cover"
          />
        ))}
      </InfiniteSlider>
    </section>
  );
};

export default ImageSliderSection;


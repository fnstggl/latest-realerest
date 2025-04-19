
import React from 'react';
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const ImageSliderSection = () => {
  const testimonials = [
    {
      image: "public/lovable-uploads/072b1972-fccf-4f58-9680-4123954726e6.png",
      alt: "Alex Khan testimonial"
    },
    {
      image: "public/lovable-uploads/95e7d74c-c01d-4e95-9f6b-a0db9f6970b9.png",
      alt: "Anthony Wilson testimonial"
    },
    {
      image: "public/lovable-uploads/7d103283-f03b-4287-a5b4-66f51ce9c830.png",
      alt: "Catherine Valdez testimonial"
    },
    {
      image: "public/lovable-uploads/7be93ebf-8db0-4248-9cfb-71d16cdae946.png",
      alt: "Mason Blackwell testimonial"
    },
    {
      image: "public/lovable-uploads/230bf061-cbff-4142-9e41-b0ed6bf3b429.png",
      alt: "Jessie McLean testimonial"
    },
    {
      image: "public/lovable-uploads/fe69f4db-5578-457d-bfd5-477d46fd2d7e.png",
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

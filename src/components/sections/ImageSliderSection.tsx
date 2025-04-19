
import React from 'react';
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const ImageSliderSection = () => {
  const testimonials = [
    {
      image: "public/lovable-uploads/103b6b75-8842-42a0-acfd-636b627a8d0a.png",
      alt: "Alex Khan testimonial"
    },
    {
      image: "public/lovable-uploads/36b6b469-d77f-4812-8c1e-bfecdfc4c835.png",
      alt: "Anthony Wilson testimonial"
    },
    {
      image: "public/lovable-uploads/b6acc046-fb18-40ed-8c34-120a5e977183.png",
      alt: "Catherine Valdez testimonial"
    },
    {
      image: "public/lovable-uploads/981d213d-6c59-4d90-a036-055d07380f24.png",
      alt: "Mason Blackwell testimonial"
    },
    {
      image: "public/lovable-uploads/e3001b53-45da-4b74-ab1c-6a1e7b11d3c3.png",
      alt: "Jessie McLean testimonial"
    },
    {
      image: "public/lovable-uploads/7a5fffe4-b4bf-415c-b1d4-cd47204ce999.png",
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


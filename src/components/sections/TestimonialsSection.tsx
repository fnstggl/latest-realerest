
import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";

const testimonials = [
  {
    name: "Alex Khan",
    role: "Bought his home in *Punta Gorda* for *21% below market*",
    review: "I was living in Punta Gorda looking to make the switch from renting to buying my own place, but I couldn't find a place near my job I could afford. Thankfully, I found Realer Estate online which had a home in Punta Gorda for 21% below market.",
  },
  {
    name: "Catherine Valdez",
    role: "Bought her home in *New Jersey* for *35% below market*",
    review: "I was one of the earlier buyers on Realer Estate, and walked me through every step of the process. Me and my husband were looking to downsize, so when we found a home in Jersey near our son's college at a price we could actually afford, we took it. The house is great, we renovated for the first month and a half and we've been living there ever since.",
  },
  {
    name: "Mason Blackwell",
    role: "Bought his apartment in *Boston* for *27% below market*",
    review: "First-time homebuyer here, was thinking about buying a home for a while but thought it was impossible at my budget. Realer Estate proved me wrong, and I'm glad it did. I'm now able to stay near my family and hometown while also being in the city.",
  },
  {
    name: "Jessie McLean",
    role: "Bought a home in *Dallas* for *11% below market*",
    review: "Realer Estate made buying a home a reality for me, even though home prices in Dallas kept rising. As a recent graduate, I was looking for a home in my price range but also in Dallas near my work. I found a home in Dallas for 11% below market on Realer Estate, and I was able to send in an offer in the same week.",
  },
  {
    name: "Mona Rodriguez",
    role: "Bought her home in *Houston* for *19% below market*",
    review: "Realer Estate made finding a home I could afford easy. I had been looking for homes in Houston on Zillow (filtering prices from lowest to highest) just trying to find something within my price range. I saw a Realer Estate post on Reddit and hadn't heard of it but decided to give it a try. I had the keys to my new home for nearly 20% below market 11 days later!",
  },
  {
    name: "Anthony Wilson",
    role: "Bought his home in *South Holland* for *41% below market*",
    review: "I was definitely skeptical of Realer Estate at first because I'd never heard of it before buying my home from here, but I was very impressed. My home was at an amazing price, and I'm glad I saw it at the right time because I was finally able to move out of my parent's house and into my first home at a price that worked for me.",
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-8 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Stories from buyers who found a{' '}
            <span className="font-playfair font-bold italic">better</span>{' '}
            <span className="font-futura font-bold">way</span>
          </h2>
          <p className="text-base sm:text-xl text-foreground/80 max-w-2xl mx-auto mb-4">
            See why we're trusted by homebuyers across the nation
          </p>
        </div>
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  );
};

export default TestimonialsSection;

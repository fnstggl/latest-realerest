
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const CTASection: React.FC = () => {
  return (
    <section className="py-8 relative overflow-hidden">
      <div className="container px-4 lg:px-8 mx-auto flex justify-center">
        <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 max-w-5xl w-full">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              But how are these homes 
              actually
              <br />
              <span className="font-playfair font-bold italic py-1 rounded-lg inline-block px-0 mx-[4px]">
                below-market?
              </span>
            </h2>
            <p className="text-xl mb-8 text-foreground/80">We connect you with motivated sellers, skip the middlemen, and price homes to sell—fast.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="glass" className="font-bold shadow-lg backdrop-blur-xl border border-white/30 electric-blue-button">
                <Link to="/search">Find Homes</Link>
              </Button>
              <Button asChild variant="glass" className="font-bold shadow-lg backdrop-blur-xl border border-white/30 electric-blue-button">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl shadow-2xl">
            <AspectRatio ratio={16 / 9} className="w-full">
              <img src="/lovable-uploads/90c52d44-966c-481c-bdd7-ebc3b04ffdc8.png" alt="Modern home exterior at sunset with warm lighting" className="w-full h-full object-cover rounded-lg" />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;



import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import SearchBar from '@/components/SearchBar';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HeroSection: React.FC = () => {
  return (
    <section className="pt-20 sm:pt-24 md:pt-36 pb-8 sm:pb-16 relative overflow-hidden perspective-container flex justify-center w-full">
      <div className="container px-4 lg:px-8 mx-auto relative flex justify-center">
        <motion.div 
          className="w-full max-w-5xl text-center mx-auto" 
          initial="hidden" 
          animate="visible" 
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-1 sm:mb-3 md:mb-4 mx-auto text-center leading-tight">
              Find a home you love...
            </h1>
            <div className="mb-2 sm:mb-4 md:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center text-gradient-static tracking-normal py-1">
                at a price you'll love more
              </h1>
            </div>
            <p className="text-foreground mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base mx-auto max-w-2xl text-center">
              Helping families buy homes they were told they couldn't afford.
            </p>
            <div className="glass-card p-1 mb-4 sm:mb-6 md:mb-8 shadow-xl search-glow rounded-xl mx-auto w-full max-w-2xl">
              <SearchBar className="" />
            </div>
            <div className="flex flex-row gap-3 sm:gap-4 justify-center mx-auto">
              <Button 
                asChild 
                variant="glass" 
                className="font-bold text-xs sm:text-sm md:text-base shadow-lg backdrop-blur-xl hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 search-glow"
              >
                <Link to="/search">Find Homes</Link>
              </Button>
              <Button 
                asChild 
                variant="glass" 
                className="font-bold text-xs sm:text-sm md:text-base shadow-lg backdrop-blur-xl hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 search-glow"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

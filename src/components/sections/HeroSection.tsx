
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
    <section className="pt-32 md:pt-36 pb-16 relative overflow-hidden perspective-container flex justify-center items-center w-full">
      <div className="container mx-auto px-4 lg:px-8 flex justify-center items-center">
        <motion.div 
          className="w-full max-w-3xl text-center" 
          initial="hidden" 
          animate="visible" 
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="layer-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-3 md:mb-4 break-words sm:whitespace-nowrap text-shadow">
              Find a home you love...
            </h1>
            <div className="apple-glow-text mb-4 md:mb-6 shadow-2xl layer-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold break-words sm:whitespace-nowrap text-shadow">
                at a price you'll love more
              </h1>
            </div>
            <p className="text-foreground mb-6 md:mb-8 text-base md:text-lg">
              Helping families buy homes they were told they couldn't afford.
            </p>
            <div className="glass-card edge-glow-input p-1 mb-6 md:mb-8 shadow-xl layer-2">
              <SearchBar className="" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                variant="glass" 
                className="font-bold text-base shadow-lg backdrop-blur-xl hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
              >
                <Link to="/search">Find Homes</Link>
              </Button>
              <Button 
                asChild 
                variant="glass" 
                className="font-bold text-base shadow-lg backdrop-blur-xl hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
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

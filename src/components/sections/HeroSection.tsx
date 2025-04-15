
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import SearchBar from '@/components/SearchBar';

// Animation variants - modified to remove scroll animations
const fadeInUp = {
  hidden: {
    opacity: 1,
    y: 0
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0
    }
  }
};
const stagger = {
  hidden: {
    opacity: 1
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0
    }
  }
};

const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 md:pt-20 pb-16 relative overflow-hidden">
      <div className="container px-4 lg:px-8 mx-auto relative md:ml-64">
        <motion.div 
          className="grid md:grid-cols-2 gap-8 md:gap-12 items-center" 
          initial="visible" 
          animate="visible" 
          variants={stagger}
        >
          <motion.div className="order-2 md:order-1" variants={fadeInUp}>
            <div className="mb-2">
              <span className="px-4 py-1 text-sm bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-primary font-medium inline-block mb-4">
                Real Estate Reimagined
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-3 md:mb-4 break-words sm:whitespace-nowrap text-shadow">
              Find a home you love...
            </h1>
            <div className="glass-gradient-orange-pink px-2 sm:px-3 py-1 rounded-xl w-auto inline-block mb-4 md:mb-6 shadow-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white break-words sm:whitespace-nowrap text-shadow">
                at a price you'll love more
              </h1>
            </div>
            <p className="text-foreground mb-6 md:mb-8 text-base md:text-lg">
              Helping families buy homes they were told they couldn't afford.
            </p>
            <div className="glass-card p-1 mb-6 md:mb-8 shadow-lg">
              <SearchBar className="" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                variant="glass" 
                className="font-bold text-base shadow-lg"
              >
                <Link to="/search">Find Homes</Link>
              </Button>
              <Button 
                asChild 
                variant="glass" 
                className="font-bold text-base"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div className="order-1 md:order-2 relative" variants={fadeInUp}>
            <div className="glass-card p-6 rounded-xl relative shadow-xl">
              <img 
                src="/lovable-uploads/90c52d44-966c-481c-bdd7-ebc3b04ffdc8.png" 
                alt="Modern house with a luxurious pool" 
                className="w-full h-auto rounded-lg object-cover shadow-lg"
              />
              
              <div className="absolute -bottom-5 -right-5 glass-dark p-4 rounded-lg shadow-lg max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">Trending Now</span>
                </div>
                <p className="text-xs opacity-80">Exclusive properties below market value in your area</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

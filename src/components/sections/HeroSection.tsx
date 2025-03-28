
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import SearchBar from '@/components/SearchBar';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HeroSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 lg:px-8 mx-auto">
        <motion.div 
          className="grid md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div 
            className="order-2 md:order-1"
            variants={fadeInUp}
          >
            {/* Single-line header text layout */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-4 whitespace-nowrap">
              Find your dream home...
            </h1>
            <div className="bg-[#d60013] block mb-6 px-3 py-1 -rotate-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-fit md:w-auto max-w-none overflow-visible">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white whitespace-nowrap">
                we'll find your dream price
              </h1>
            </div>
            <p className="text-xl text-black mb-8">
              Connecting families to affordable housing—fast. Discover properties below market value through DoneDeal's exclusive platform.
            </p>
            <SearchBar className="mb-8" />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild 
                className="neo-button-primary font-bold"
              >
                <Link to="/search">Get Started</Link>
              </Button>
              <Button asChild 
                variant="outline" 
                className="neo-button font-bold"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div 
            className="order-1 md:order-2"
            variants={fadeInUp}
          >
            {/* Intentionally left empty per user request */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

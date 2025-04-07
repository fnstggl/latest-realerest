
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import SearchBar from '@/components/SearchBar';

// Animation variants
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 60
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};
const stagger = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};
const HeroSection: React.FC = () => {
  return <section className="py-16 bg-white">
      <div className="container px-4 lg:px-8 mx-auto">
        <motion.div className="grid md:grid-cols-2 gap-12 items-center" initial="hidden" animate="visible" variants={stagger}>
          <motion.div className="order-2 md:order-1" variants={fadeInUp}>
            {/* Single-line header text layout */}
            <h1 className="text-5xl lg:text-7xl font-bold text-black mb-4 whitespace-nowrap md:text-5xl">
              Find your dream home...
            </h1>
            <div className="bg-[#d60013] block mb-6 px-3 py-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-auto inline-block">
              <h1 className="text-5xl lg:text-7xl font-bold text-white whitespace-nowrap md:text-5xl">
                we'll find your dream price
              </h1>
            </div>
            <p className="text-black mb-8 text-lg">Connecting families with affordable housing—fast. Discover below-market homes without compromising on size, location or safety.</p>
            <SearchBar className="mb-8" />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="neo-button-primary font-bold">
                <Link to="/search">Find Homes</Link>
              </Button>
              <Button asChild variant="outline" className="neo-button font-bold border-4 border-black">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div className="order-1 md:order-2" variants={fadeInUp}>
            {/* Intentionally left empty per user request */}
          </motion.div>
        </motion.div>
      </div>
    </section>;
};
export default HeroSection;

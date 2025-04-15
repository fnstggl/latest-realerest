
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
  return <section className="py-12 sm:py-16 bg-white">
      <div className="container px-4 lg:px-8 mx-auto">
        <motion.div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center text-center" initial="hidden" animate="visible" variants={stagger}>
          <motion.div className="order-2 md:order-1 flex flex-col items-center" variants={fadeInUp}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-3 md:mb-4 break-words sm:whitespace-nowrap">Find a home you love...</h1>
            <div className="bg-[#d0161a] block mb-4 md:mb-6 px-2 sm:px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-auto inline-block">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white break-words sm:whitespace-nowrap">at a price you'll love more</h1>
            </div>
            <p className="text-black mb-6 md:mb-8 text-base md:text-lg text-center">Helping families buy homes they were told they couldn't afford.</p>
            <SearchBar className="mb-6 md:mb-8 w-full max-w-xl" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="red" className="neo-button-primary font-bold text-base">
                <Link to="/search">Find Homes</Link>
              </Button>
              <Button asChild variant="navy" className="neo-button-secondary font-bold text-base">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div className="order-1 md:order-2 flex justify-center" variants={fadeInUp}>
            {/* Intentionally left empty per user request */}
          </motion.div>
        </motion.div>
      </div>
    </section>;
};
export default HeroSection;

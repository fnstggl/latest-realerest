
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
            <div className="glass-card p-1 mb-4 sm:mb-6 md:mb-8 shadow-xl rounded-xl mx-auto w-full max-w-2xl">
              <SearchBar className="" />
            </div>
            <div className="flex flex-row gap-3 sm:gap-4 justify-center mx-auto">
              <Button 
                asChild 
                className="font-bold text-xs sm:text-sm md:text-base shadow-sm backdrop-blur-xl bg-white hover:bg-white text-black relative group overflow-hidden border border-transparent rounded-lg"
              >
                <Link to="/search">
                  <span className="relative z-10">Find Homes</span>
                  <span 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                    style={{
                      background: "transparent",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "border-box",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      boxShadow: "0 0 25px rgba(217, 70, 239, 0.9), 0 0 45px rgba(108, 66, 245, 0.7), 0 0 65px rgba(255, 92, 0, 0.5), 0 0 85px rgba(255, 60, 172, 0.4)",
                      filter: "blur(6px)"
                    }}
                  ></span>
                </Link>
              </Button>
              <Button 
                asChild 
                className="font-bold text-xs sm:text-sm md:text-base shadow-sm backdrop-blur-xl bg-white hover:bg-white text-black relative group overflow-hidden border border-transparent rounded-lg"
              >
                <Link to="/about">
                  <span className="relative z-10">Learn More</span>
                  <span 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                    style={{
                      background: "transparent",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "border-box",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      boxShadow: "0 0 25px rgba(217, 70, 239, 0.9), 0 0 45px rgba(108, 66, 245, 0.7), 0 0 65px rgba(255, 92, 0, 0.5), 0 0 85px rgba(255, 60, 172, 0.4)",
                      filter: "blur(6px)"
                    }}
                  ></span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

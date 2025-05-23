import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SearchBar from '@/components/SearchBar';
import { GlowEffect } from '@/components/ui/glow-effect';

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
    <section className="pt-32 sm:pt-24 md:pt-36 pb-16 sm:pb-16 relative overflow-hidden perspective-container flex justify-center w-full">
      {/* Background gradient blob - positioned absolutely to the entire section */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 w-full h-full"
        style={{
          backgroundImage: `url('/lovable-uploads/28a79fc0-8fcc-4d56-9bd6-0696e9db1e9b.png')`,
          backgroundSize: '80% auto', // Reduced from 90% to 80%
          backgroundPosition: 'calc(50% - 20px) center', // Shifted 15px to the left
          backgroundRepeat: 'no-repeat',
          opacity: 0.9
        }}
      ></div>
      
      <div className="container px-4 lg:px-8 mx-auto relative flex justify-center">
        <div className="w-full max-w-5xl text-center mx-auto">
          <div className="flex flex-col items-center relative z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-black mb-1 sm:mb-3 md:mb-4 mx-auto text-center leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
              Find a home you <span className="font-extrabold">love</span>...
            </h1>
            <div className="mb-2 sm:mb-4 md:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-black tracking-normal py-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                at a <em>price</em> you'll <span className="font-extrabold">love</span> more
              </h1>
            </div>
            <p className="text-foreground mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base mx-auto max-w-2xl text-center relative z-10">
              Helping families buy homes they were told they <span className="font-bold">couldn't afford</span>.
            </p>
            <div className="glass-card p-0.25 mb-4 sm:mb-6 md:mb-8 shadow-xl rounded-xl mx-auto w-full max-w-2xl relative">
              <SearchBar className="" />
              <GlowEffect
                colors={['#3C79F5', '#6C42F5', '#D946EF', '#FF5C00', '#FF3CAC']}
                mode="flowHorizontal"
                blur="soft"
                scale={1}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -inset-[3px] rounded-xl pointer-events-none"
              />
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
                      filter: "blur(2px)"
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
                      filter: "blur(2px)"
                    }}
                  ></span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

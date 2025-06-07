
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SearchBar from '@/components/SearchBar';
import { GlowEffect } from '@/components/ui/glow-effect';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 sm:pt-24 md:pt-36 pb-16 sm:pb-16 relative overflow-hidden perspective-container flex justify-center w-full">
      {/* City skyline background image - positioned absolutely behind all content */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-0 w-full h-full"
        style={{
          backgroundImage: `url('/lovable-uploads/bea0bd67-09a3-4aab-b79b-5053a47af153.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3
        }}
      ></div>
      
      <div className="container px-4 lg:px-8 mx-auto relative flex justify-center">
        <div className="w-full max-w-5xl text-center mx-auto">
          <div className="flex flex-col items-center relative z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#01204b] mb-1 sm:mb-3 md:mb-4 mx-auto text-center leading-tight font-polysans">
              Find a home you <span className="font-bold">love</span>...
            </h1>
            <div className="mb-2 sm:mb-4 md:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#01204b] tracking-normal py-1 font-polysans">
                at a <em>price</em> you'll <span className="font-bold">love</span> more
              </h1>
            </div>
            <p className="text-[#01204b] mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base mx-auto max-w-2xl text-center relative z-10 font-polysans-semibold">
              Below & off-market properties. All in one place.
            </p>
            <div className="glass-card p-0.25 mb-4 sm:mb-6 md:mb-8 shadow-xl rounded-xl mx-auto w-full max-w-2xl relative">
              <SearchBar className="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

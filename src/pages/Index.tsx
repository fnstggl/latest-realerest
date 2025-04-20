
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProperties from '@/components/sections/FeaturedProperties';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import SiteFooter from '@/components/sections/SiteFooter';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden relative perspective-container">
      {/* Subtle gradient blobs for background - static, not pulsing */}
      <div className="fixed top-[10%] left-[15%] w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] rounded-full bg-blue-100/20 filter blur-[40px] sm:blur-[60px] md:blur-[80px] -z-10"></div>
      <div className="fixed top-[20%] right-[15%] w-[125px] sm:w-[175px] md:w-[200px] lg:w-[250px] h-[125px] sm:h-[175px] md:h-[200px] lg:h-[250px] rounded-full bg-purple-100/20 filter blur-[35px] sm:blur-[50px] md:blur-[70px] -z-10"></div>
      <div className="fixed bottom-[15%] left-[25%] w-[175px] sm:w-[250px] md:w-[300px] lg:w-[350px] h-[175px] sm:h-[250px] md:h-[300px] lg:h-[350px] rounded-full bg-pink-100/20 filter blur-[45px] sm:blur-[65px] md:blur-[90px] -z-10"></div>
      <div className="fixed bottom-[10%] right-[25%] w-[100px] sm:w-[150px] md:w-[175px] lg:w-[200px] h-[100px] sm:h-[150px] md:h-[175px] lg:h-[200px] rounded-full bg-blue-50/20 filter blur-[30px] sm:blur-[45px] md:blur-[60px] -z-10"></div>
      
      {/* Content layers */}
      <div className="relative z-10">
        <Navbar />
        <div className="w-full">
          <HeroSection />
          <FeaturedProperties />
          <TestimonialsSection />
          <CTASection />
          <SiteFooter />
        </div>
      </div>
    </div>
  );
};

export default Index;


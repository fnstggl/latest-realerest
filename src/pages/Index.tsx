
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProperties from '@/components/sections/FeaturedProperties';
import CTASection from '@/components/sections/CTASection';
import SiteFooter from '@/components/sections/SiteFooter';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden relative perspective-container">
      {/* Subtle gradient blobs for background - static, not pulsing */}
      <div className="fixed top-[10%] left-[15%] w-[300px] h-[300px] rounded-full bg-blue-100/20 filter blur-[80px] -z-10"></div>
      <div className="fixed top-[20%] right-[15%] w-[250px] h-[250px] rounded-full bg-purple-100/20 filter blur-[70px] -z-10"></div>
      <div className="fixed bottom-[15%] left-[25%] w-[350px] h-[350px] rounded-full bg-pink-100/20 filter blur-[90px] -z-10"></div>
      <div className="fixed bottom-[10%] right-[25%] w-[200px] h-[200px] rounded-full bg-blue-50/20 filter blur-[60px] -z-10"></div>
      
      {/* Content layers */}
      <div className="relative z-10">
        <Navbar />
        <div className="w-full">
          <HeroSection />
          <FeaturedProperties />
          <CTASection />
          <SiteFooter />
        </div>
      </div>
    </div>
  );
};

export default Index;

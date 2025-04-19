
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProperties from '@/components/sections/FeaturedProperties';
import CTASection from '@/components/sections/CTASection';
import SiteFooter from '@/components/sections/SiteFooter';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
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

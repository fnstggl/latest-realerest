
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProperties from '@/components/sections/FeaturedProperties';
import CTASection from '@/components/sections/CTASection';
import SiteFooter from '@/components/sections/SiteFooter';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden relative perspective-container">
      {/* Soft gradient blobs for background */}
      <div className="gradient-blob gradient-blob-1"></div>
      <div className="gradient-blob gradient-blob-2"></div>
      <div className="gradient-blob gradient-blob-3"></div>
      <div className="gradient-blob gradient-blob-4"></div>
      <div className="gradient-blob gradient-blob-5"></div>
      
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

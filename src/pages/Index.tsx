
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProperties from '@/components/sections/FeaturedProperties';
import CTASection from '@/components/sections/CTASection';
import SiteFooter from '@/components/sections/SiteFooter';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Gradient blobs */}
      <div className="gradient-blob gradient-blob-1"></div>
      <div className="gradient-blob gradient-blob-2"></div>
      <div className="gradient-blob gradient-blob-3"></div>
      <div className="gradient-blob gradient-blob-4"></div>
      
      <Navbar />
      <div className="w-full max-w-full overflow-hidden">
        <HeroSection />
        <FeaturedProperties />
        <CTASection />
        <SiteFooter />
      </div>
    </div>
  );
};

export default Index;

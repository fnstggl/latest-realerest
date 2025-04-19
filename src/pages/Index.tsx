
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProperties from '@/components/sections/FeaturedProperties';
import CTASection from '@/components/sections/CTASection';
import SiteFooter from '@/components/sections/SiteFooter';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      <BackgroundGradientAnimation interactive={true}>
        <div className="relative z-10">
          <Navbar />
          <div className="w-full">
            <HeroSection />
            <FeaturedProperties />
            <CTASection />
            <SiteFooter />
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
};

export default Index;

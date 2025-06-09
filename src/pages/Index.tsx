
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProperties from '@/components/sections/FeaturedProperties';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import SiteFooter from '@/components/sections/SiteFooter';
import SEO from '@/components/SEO';

const Index: React.FC = () => {
  const currentDomain = window.location.origin;

  return (
    <div className="min-h-screen bg-[#FCFBF8] overflow-x-hidden relative perspective-container">
      <SEO
        title="Realer Estate – Below Market Real Estate Deals & Investment Opportunities"
        description="Find your dream home at below market value. Realer Estate connects you with motivated sellers offering properties at significant discounts without agent fees."
        canonical="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Realer Estate",
          "url": currentDomain,
          "logo": `${currentDomain}/lovable-uploads/4a5ee413-b1c2-49b0-817d-51d20149fc74.png`,
          "sameAs": [],
          "description": "Find below market real estate deals & investment opportunities at Realer Estate. Get motivated sellers and off-market properties.",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US"
          }
        }}
      />
      
      {/* Visually hidden, but SEO-visible h1 (for accessibility and SEO) */}
      <h1 className="sr-only" tabIndex={-1}>
        Realer Estate – Below Market Real Estate Deals & Investment Opportunities
      </h1>

      {/* Orange gradient at the top - extended to cover navbar and hero section with smooth fade */}
      <div 
        className="fixed top-0 left-0 right-0 h-48 z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/0cc49413-ea99-4d22-a1d4-19b9341d2545.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          mask: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 100%)',
          WebkitMask: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 100%)'
        }}
      ></div>

      {/* Subtle gradient blobs for background */}
      <div className="fixed top-[10%] left-[15%] w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] rounded-full bg-blue-100/20 filter blur-[40px] sm:blur-[60px] md:blur-[80px] -z-10"></div>
      <div className="fixed top-[20%] right-[15%] w-[125px] sm:w-[175px] md:w-[200px] lg:w-[250px] h-[125px] sm:h-[175px] md:h-[200px] lg:h-[250px] rounded-full bg-purple-100/20 filter blur-[35px] sm:blur-[50px] md:blur-[70px] -z-10"></div>
      <div className="fixed bottom-[15%] left-[25%] w-[175px] sm:w-[250px] md:w-[300px] lg:w-[350px] h-[175px] sm:h-[250px] md:h-[300px] lg:h-[350px] rounded-full bg-pink-100/20 filter blur-[45px] sm:blur-[65px] md:blur-[90px] -z-10"></div>
      <div className="fixed bottom-[10%] right-[25%] w-[100px] sm:w-[150px] md:w-[175px] lg:w-[200px] h-[100px] sm:h-[150px] md:h-[175px] lg:h-[200px] rounded-full bg-blue-50/20 filter blur-[30px] sm:blur-[45px] md:blur-[60px] -z-10"></div>
      
      <div className="relative z-10">
        <Navbar />
        {/* SEO: Add visible h2 without breaking design */}
        <div className="sr-only">
          <h2>Find below market real estate deals and investment opportunities</h2>
        </div>
        <main aria-label="Homepage Main Content" className="w-full">
          <HeroSection />
          <FeaturedProperties />
          {/* Testimonials section temporarily hidden but kept in the codebase */}
          {/* <TestimonialsSection /> */}
          <CTASection />
          <SiteFooter />
        </main>
      </div>
    </div>
  );
};

export default Index;

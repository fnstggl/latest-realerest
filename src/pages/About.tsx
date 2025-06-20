
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SEO from '@/components/SEO';
import { Tilt } from "@/components/ui/tilt";
import OptimizedImage from '@/components/ui/OptimizedImage';

const About: React.FC = () => {
  // Animation variants for sections
  const sectionVariant = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const textRevealVariant = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };
  
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#01204b] overflow-hidden">
      <SEO 
        title="About Realer Estate | Our Mission & Story" 
        description="Realer Estate is revolutionizing how people buy and sell homes. Learn about our mission to make housing accessible again with below-market properties." 
        canonical="/about" 
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Realer Estate",
          "description": "Our mission is to give people a real shot at buying a home — without needing perfect credit, endless paperwork, or thousands over asking.",
          "url": "https://realerestate.org/about",
          "mainEntity": {
            "@type": "Organization",
            "name": "Realer Estate",
            "url": "https://realerestate.org",
            "logo": "https://realerestate.org/lovable-uploads/7c808a82-7af5-43f9-ada8-82e9817c464d.png",
            "description": "Realer Estate helps connect buyers with below-market properties and sellers who want to sell quickly without fees.",
            "founders": [{
              "@type": "Person",
              "name": "Beckett & Derrick",
              "jobTitle": "Founders"
            }]
          }
        }} 
      />
      
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-8 md:pb-16">
        {/* Main content container with consistent max-width for all sections */}
        <div className="max-w-4xl mx-auto">
          {/* Header Section - Centered with same margin as other sections */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="mb-8 md:mb-10 text-center"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-futura font-extrabold text-[#01204b] tracking-tighter leading-tight">
              FROM DREAM<br />
              TO DREAM HOME
            </h1>
          </motion.div>
          
          {/* Subtext - Centered */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <p className="text-lg md:text-xl font-polysans text-[#01204b] tracking-tight">
              Realer Estate is a platform helping struggling homebuyers find homes they can <em>afford</em>. We 
              understand the real estate market is broken. Regular buyers are getting priced out. Not anymore. 
              We provide exclusively below-market homes, available to everyone—no lotteries, waitlists or fees.
            </p>
          </motion.div>
          
          {/* Divider - thicker black line */}
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }} 
            animate={{ opacity: 1, scaleX: 1 }} 
            transition={{ duration: 0.8, delay: 0.5 }} 
            className="w-full h-[30px] bg-black mt-10 md:mt-12 mb-0 origin-left"
          />
          
          {/* Featured Image - no space after divider */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1.2, delay: 0.7 }}
            className="w-full"
          >
            <OptimizedImage 
              src="/lovable-uploads/869ab762-f99a-4e66-8b73-0e10639dbeda.png" 
              alt="New York City street view with tall buildings" 
              className="w-full h-[400px] md:h-[600px] object-cover" 
              priority={true} 
            />
          </motion.div>
        </div>
        
        {/* THE JOURNEY Section - Redesigned */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={sectionVariant} 
          className="mx-auto max-w-4xl mb-24 md:mb-32 mt-24 md:mt-32"
        >
          {/* Journey text moved above image */}
          <div className="mx-auto space-y-6 mb-10">
            <motion.p custom={0} variants={textRevealVariant} className="text-lg md:text-xl font-polysans text-[#01204b] tracking-tight">
              We know how frustrating the process of buying and selling your house can feel, so at Realer Estate... we're doing things differently.
            </motion.p>
            
            <motion.p custom={1} variants={textRevealVariant} className="text-lg md:text-xl font-polysans text-[#01204b] tracking-tight">
              By connecting motivated sellers with buyers looking for affordable housing, we ensure that properties on Realer Estate are <span className="font-polysans italic text-[#01204b]">actually great deals</span>.
            </motion.p>
            
            <motion.p custom={2} variants={textRevealVariant} className="text-lg md:text-xl font-polysans text-[#01204b] tracking-tight">
              "We knew there had to be a better way—something faster, simpler, and actually made for people like us."
            </motion.p>
          </div>
          
          {/* Divider - same 30px thickness */}
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }} 
            animate={{ opacity: 1, scaleX: 1 }} 
            transition={{ duration: 0.8 }} 
            className="w-full h-[30px] bg-black mb-0 origin-left"
          />
          
          {/* Image */}
          <div className="relative overflow-hidden">
            <img 
              src="/lovable-uploads/7b12fd25-9fa6-4b02-81ed-521ace622717.png" 
              alt="Small cottage style home with green shutters" 
              className="w-full h-[400px] md:h-[600px] object-cover"
            />
          </div>
        </motion.section>
        
        {/* THE VISION Section - Redesigned */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={sectionVariant} 
          className="mx-auto max-w-4xl mb-24 md:mb-32"
        >
          {/* Vision text moved above image */}
          <div className="mx-auto space-y-6 mb-10">
            <motion.p custom={0} variants={textRevealVariant} className="text-lg md:text-xl font-polysans tracking-tight text-[#01204b]">
              Realer Estate is about revolutionizing the real estate market to make it work for <span className="font-polysans italic text-[#01204b]">people</span> again. You shouldn't have to fight this hard for something so basic.
            </motion.p>
            
            <motion.div custom={1} variants={textRevealVariant} className="flex items-center space-x-3 pt-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-[#1A1F2C] text-white">RE</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-polysans text-[#01204b] tracking-tight">- Beckett & Derrick</p>
                <p className="text-sm font-polysans-semibold text-gray-600 tracking-tight">Realer Estate Founders</p>
              </div>
            </motion.div>
          </div>
          
          {/* Divider - same 30px thickness */}
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }} 
            animate={{ opacity: 1, scaleX: 1 }} 
            transition={{ duration: 0.8 }} 
            className="w-full h-[30px] bg-black mb-0 origin-left" 
          />
          
          {/* Image */}
          <div className="relative overflow-hidden">
            <img 
              src="/lovable-uploads/79ffa508-3e4e-436f-b3f2-f0dc75e16344.png" 
              alt="Aerial view of suburban neighborhood" 
              className="w-full h-[400px] md:h-[600px] object-cover" 
            />
          </div>
        </motion.section>
        
        {/* HOW IT WORKS Section */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={sectionVariant} 
          className="mx-auto max-w-4xl mb-24 md:mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-polysans text-[#01204b]]">HOW IT WORKS</h2>
            <p className="text-xl md:text-2xl font-polysans-semibold text-[#8E9196] mt-4">Below-market properties that actually make sense.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div custom={0} variants={textRevealVariant} className="border-2 border-[#1A1F2C] p-8 relative">
              <div className="text-6xl font-polysans italic mb-6 text-[#01204b]">01</div>
              <p className="text-lg font-polysans text-[#01204b]">We work <span className="font-polysans italic">directly</span> with motivated sellers who are looking to sell their homes below market value to sell them faster.</p>
            </motion.div>
            
            <motion.div custom={1} variants={textRevealVariant} className="border-2 border-[#1A1F2C] p-8 relative">
              <div className="text-6xl font-polysans italic mb-6 text-[#01204b]">02</div>
              <p className="text-lg font-polysans text-[#01204b]">By connecting these motivated sellers with buyers looking for affordable housing, we ensure that properties on Realer Estate are <span className="font-polysans text-[#01204b] italic">actually great deals</span>.</p>
            </motion.div>
            
            <motion.div custom={2} variants={textRevealVariant} className="border-2 border-[#1A1F2C] p-8 relative">
              <div className="text-6xl font-polysans italic font-bold mb-6 text-[#01204b]">03</div>
              <p className="text-lg font-polysans text-[#01204b]">Due to the high demand for below-market properties, listings on our platform <span className="font-polysans italic text-[#01204b]">may not stay available</span> for long.</p>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Call to Action - Updated text and left-aligned */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={sectionVariant} 
          className="mb-16 md:mb-32 relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-5">
            <img src="/lovable-uploads/c4859284-6b6b-4692-90c2-acd37daaacaa.png" alt="Background texture" className="w-full h-full object-cover grayscale" />
          </div>
          
          <div className="text-left">
            <h2 className="text-6xl md:text-8xl font-bold text-[#01204b] mb-8 leading-tight tracking-tighter">
              <span className="block">REAL ESTATE</span>
              <span className="inline-block font-futura font-extrabold tracking-tighter">
                DONE RIGHT
              </span>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 mt-12">
              <Button variant="outline" size="lg" className="text-lg font-polysans border-[#01204b] text-[#01204b] hover:bg-[#01204b] hover:text-white transition-all py-6" asChild>
                <Link to="/search">Find Properties</Link>
              </Button>
              <Button variant="default" size="lg" className="text-lg font-polysans bg-[#01204b] text-white hover:bg-[#01204b]/80 py-6" asChild>
                <Link to="/sell/create">List Your Property</Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default About;

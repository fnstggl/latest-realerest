
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SEO from '@/components/SEO';
import { Tilt } from "@/components/ui/tilt";

const About: React.FC = () => {
  // Animation variants for sections
  const sectionVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };
  
  const textRevealVariant = {
    hidden: { opacity: 0, y: 50 },
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
    <div className="min-h-screen bg-[#FCFBF8] text-black overflow-hidden">
      <SEO 
        title="About Realer Estate | Our Mission & Story" 
        description="Realer Estate is revolutionizing how people buy and sell homes. Learn about our mission to make housing accessible again with below-market properties." 
        canonical="/about"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Realer Estate",
          "description": "Our mission is to give people a real shot at buying a home — without needing perfect credit, endless paperwork, or thousands over asking.",
          "url": window.location.origin + "/about",
          "mainEntity": {
            "@type": "Organization",
            "name": "Realer Estate",
            "url": window.location.origin,
            "logo": `${window.location.origin}/lovable-uploads/7c808a82-7af5-43f9-ada8-82e9817c464d.png`,
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
      
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Header Section */}
        <div className="max-w-[1400px] mx-auto mb-16 md:mb-32">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-10 right-4 md:right-10 text-8xl md:text-9xl font-bold text-[#1A1F2C]/5">*</div>
            
            <h1 className="text-8xl md:text-[12rem] leading-none font-bold tracking-tighter text-[#1A1F2C]">
              REALER<span className="block relative">ESTATE<span className="absolute -right-8 top-0 text-[#ea384c]">*</span></span>
            </h1>
            
            <div className="mt-8 ml-1 md:mt-4 md:ml-2">
              <p className="text-xl md:text-2xl text-[#8E9196] tracking-wide">
                The anatomy of a rebuild in the real estate market.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* THE ORIGIN Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariant}
          className="mb-32 md:mb-48"
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 mb-6 md:mb-0">
              <div className="flex items-center">
                <h2 className="text-5xl md:text-6xl font-bold text-[#1A1F2C]">THE ORIGIN</h2>
                <span className="text-3xl text-[#8E9196] ml-2">(1)</span>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-8">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00000099] to-transparent z-10"></div>
                <img 
                  src="/lovable-uploads/d02ec260-e51f-47be-bbc4-9a50902a8bcc.png" 
                  alt="New York City street view" 
                  className="w-full h-[300px] md:h-[450px] object-cover grayscale"
                />
                
                <div className="absolute inset-0 flex items-center z-20 px-8">
                  <Tilt>
                    <h3 className="text-6xl md:text-8xl font-bold text-white leading-none max-w-lg">
                      TWO STUDENTS IN NYC<span className="text-[#ea384c]">*</span>
                    </h3>
                  </Tilt>
                </div>
              </div>
              
              <div className="mt-8 space-y-6 border-l-4 border-[#1A1F2C] pl-6 max-w-3xl text-[#1A1F2C]">
                <motion.p 
                  custom={0}
                  variants={textRevealVariant}
                  className="text-lg md:text-xl"
                >
                  We built <span className="font-playfair italic font-bold">Realer Estate</span> to make housing feel possible again. Our mission is to give people a real shot at buying a home — without needing perfect credit, endless paperwork, or thousands over asking.
                </motion.p>
                
                <motion.p 
                  custom={1}
                  variants={textRevealVariant}
                  className="text-lg md:text-xl font-playfair italic"
                >
                  "We were two students in NYC trying to figure out how anyone was supposed to buy a home."
                </motion.p>
                
                <motion.p 
                  custom={2}
                  variants={textRevealVariant}
                  className="text-lg md:text-xl"
                >
                  We're here for the buyers who've been priced out, the ones who refresh Zillow every night hoping something new pops up. We're here for the people trying to get their families into something stable, something <span className="font-playfair italic font-bold">real</span>.
                </motion.p>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* THE JOURNEY Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariant}
          className="mb-32 md:mb-48"
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 mb-6 md:mb-0 md:order-2">
              <div className="flex items-center justify-end">
                <h2 className="text-5xl md:text-6xl font-bold text-[#1A1F2C]">THE JOURNEY</h2>
                <span className="text-3xl text-[#8E9196] ml-2">(2)</span>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-8 md:order-1">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-[#00000099] to-transparent z-10"></div>
                <img 
                  src="/lovable-uploads/ae9b8849-2f3b-4a70-a520-d02738b34efd.png" 
                  alt="Modern home exterior" 
                  className="w-full h-[300px] md:h-[450px] object-cover grayscale"
                />
                
                <div className="absolute inset-0 flex items-center justify-end z-20 px-8">
                  <Tilt>
                    <h3 className="text-6xl md:text-8xl font-bold text-white leading-none max-w-lg text-right">
                      <span className="text-[#ea384c]">*</span>DOING THINGS DIFFERENTLY
                    </h3>
                  </Tilt>
                </div>
              </div>
              
              <div className="mt-8 space-y-6 border-r-4 border-[#1A1F2C] pr-6 ml-auto max-w-3xl text-right text-[#1A1F2C]">
                <motion.p 
                  custom={0}
                  variants={textRevealVariant}
                  className="text-lg md:text-xl"
                >
                  We know how frustrating the process of buying and selling your house can feel, so at Realer Estate... we're doing things differently.
                </motion.p>
                
                <motion.p 
                  custom={1}
                  variants={textRevealVariant}
                  className="text-lg md:text-xl"
                >
                  By connecting motivated sellers with buyers looking for affordable housing, we ensure that properties on Realer Estate are <span className="font-playfair italic font-bold">actually great deals</span>.
                </motion.p>
                
                <motion.p 
                  custom={2}
                  variants={textRevealVariant}
                  className="text-lg md:text-xl font-playfair italic"
                >
                  "We knew there had to be a better way—something faster, simpler, and actually made for people like us."
                </motion.p>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* THE VISION Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariant}
          className="mb-32 md:mb-48"
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 mb-6 md:mb-0">
              <div className="flex items-center">
                <h2 className="text-5xl md:text-6xl font-bold text-[#1A1F2C]">THE VISION</h2>
                <span className="text-3xl text-[#8E9196] ml-2">(3)</span>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-8">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00000099] to-transparent z-10"></div>
                <img 
                  src="/lovable-uploads/b82e0252-0b3e-4142-bbe9-1f4da2824ab9.png" 
                  alt="Classic apartment buildings" 
                  className="w-full h-[300px] md:h-[450px] object-cover grayscale"
                />
                
                <div className="absolute inset-0 flex items-center z-20 px-8">
                  <Tilt>
                    <h3 className="text-6xl md:text-8xl font-bold text-white leading-none max-w-lg">
                      HOUSING FOR <span className="text-[#ea384c]">*</span>EVERYONE
                    </h3>
                  </Tilt>
                </div>
              </div>
              
              <div className="mt-8 space-y-6 border-l-4 border-[#1A1F2C] pl-6 max-w-3xl text-[#1A1F2C]">
                <motion.p 
                  custom={0}
                  variants={textRevealVariant}
                  className="text-lg md:text-xl"
                >
                  Realer Estate is about revolutionizing the real estate market to make it work for <span className="font-playfair italic font-bold">people</span> again. You shouldn't have to fight this hard for something so basic.
                </motion.p>
                
                <motion.div 
                  custom={1}
                  variants={textRevealVariant}
                  className="flex items-center space-x-3 pt-4"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-[#1A1F2C] text-white">RE</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">- Beckett & Derrick</p>
                    <p className="text-sm">Realer Estate Founders</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* HOW IT WORKS Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariant}
          className="mb-32 md:mb-48"
        >
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-bold text-[#1A1F2C]">HOW IT<span className="text-[#ea384c]">*</span>WORKS</h2>
            <p className="text-xl md:text-2xl text-[#8E9196] mt-4">Below-market properties that actually make sense.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              custom={0}
              variants={textRevealVariant}
              className="border-2 border-[#1A1F2C] p-8 relative"
            >
              <div className="text-6xl font-playfair italic font-bold mb-6 text-[#1A1F2C]">01</div>
              <p className="text-lg">We work <span className="font-playfair italic">directly</span> with motivated sellers who are looking to sell their homes below market value to sell them faster.</p>
              <div className="absolute top-2 right-2 text-4xl text-[#ea384c] font-bold">*</div>
            </motion.div>
            
            <motion.div 
              custom={1}
              variants={textRevealVariant}
              className="border-2 border-[#1A1F2C] p-8 relative"
            >
              <div className="text-6xl font-playfair italic font-bold mb-6 text-[#1A1F2C]">02</div>
              <p className="text-lg">By connecting these motivated sellers with buyers looking for affordable housing, we ensure that properties on Realer Estate are <span className="font-playfair italic font-bold">actually great deals</span>.</p>
            </motion.div>
            
            <motion.div 
              custom={2}
              variants={textRevealVariant}
              className="border-2 border-[#1A1F2C] p-8 relative"
            >
              <div className="text-6xl font-playfair italic font-bold mb-6 text-[#1A1F2C]">03</div>
              <p className="text-lg">Due to the high demand for below-market properties, listings on our platform <span className="font-playfair italic">may not stay available</span> for long.</p>
              <div className="absolute bottom-2 right-2 text-4xl text-[#ea384c] font-bold">*</div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Call to Action */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariant}
          className="mb-16 md:mb-32 relative"
        >
          <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-5">
            <img 
              src="/lovable-uploads/c4859284-6b6b-4692-90c2-acd37daaacaa.png" 
              alt="Background texture" 
              className="w-full h-full object-cover grayscale" 
            />
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-6xl md:text-8xl font-bold text-[#1A1F2C] mb-8 leading-tight">
              <span className="block">WE DO REAL ESTATE</span>
              <span className="inline-block font-playfair italic relative">
                DIFFERENTLY
                <span className="absolute -right-10 md:-right-12 -top-1 text-[#ea384c] font-sans">*</span>
              </span>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
              <Button variant="outline" size="lg" className="text-lg font-bold border-[#1A1F2C] text-[#1A1F2C] hover:bg-[#1A1F2C] hover:text-white transition-all py-6" asChild>
                <Link to="/search">Find Properties</Link>
              </Button>
              <Button variant="default" size="lg" className="text-lg font-bold bg-[#1A1F2C] text-white hover:bg-[#1A1F2C]/80 py-6" asChild>
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

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserTag } from '@/components/UserTag';
const About: React.FC = () => {
  return <div className="min-h-screen bg-[#FCFBF8] text-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-24 md:mb-32 relative">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-6">
                <h1 className="brutalist-text text-[14vw] md:text-[8vw] leading-none mb-6 relative z-10 tracking-tighter">
                  <span className="block">REAL</span>
                  <span className="block relative md:ml-12 mx-0">ESTATE</span>
                  <span className="block relative ml-8 mx-0">REIMAGINED</span>
                </h1>
                <div className="mt-6 md:mt-12 relative">
                  <p className="text-xl md:text-2xl font-playfair italic ml-4 border-l-4 border-black pl-6 tracking-wide">
                    We were two students in NYC trying to figure out how anyone was supposed to <span className="font-bold not-italic">buy a home</span>.
                  </p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 md:pl-12 relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src="/lovable-uploads/4b977fed-5785-41f3-aa3b-dd408eb81af3.png" alt="New York City skyline" className="w-full h-full object-cover grayscale" />
                </div>
                <p className="text-sm mt-2 italic text-right">Where it all began</p>
              </div>
            </div>
          </div>
          
          {/* Our Story Section */}
          <div className="mb-24 md:mb-32 relative">
            <div className="grid grid-cols-12 gap-8 items-center">
              <div className="col-span-12 md:col-span-4 md:order-2">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src="/lovable-uploads/ae9b8849-2f3b-4a70-a520-d02738b34efd.png" alt="Modern home exterior" className="w-full h-full object-cover grayscale" />
                </div>
              </div>
              <div className="col-span-12 md:col-span-8 md:order-1">
                <div className="flex items-start mb-8">
                  <span className="text-8xl font-playfair italic font-bold tracking-tighter mr-4 opacity-20">01</span>
                  <h2 className="brutalist-text text-6xl md:text-7xl tracking-tighter mt-4">OUR STORY</h2>
                </div>
                <div className="text-lg md:text-xl space-y-8 md:pl-24">
                  <p>We built <span className="font-playfair italic font-bold">Realer Estate</span> to make housing feel possible again. Our mission is to give people a real shot at buying a home — without needing perfect credit, endless paperwork, or thousands over asking.</p>
                  <p className="font-playfair italic text-2xl">"We know how frustrating the process of buying and selling your house can feel, so at Realer Estate... we're doing things differently."</p>
                  <p>We're here for the buyers who've been priced out, the ones who refresh Zillow every night hoping something new pops up. We're here for the people trying to get their families into something stable, something <span className="font-playfair italic font-bold">real</span>. And we're here for sellers too — the ones ready to move on, without the wait.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* How We're Different */}
          <div className="mb-24 md:mb-32 relative">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-7">
                <h3 className="brutalist-text text-6xl md:text-7xl mb-12 tracking-tighter">HOW WE OFFER <span className="font-playfair italic">BELOW-MARKET</span> PROPERTIES</h3>
              </div>
              <div className="col-span-12 md:col-span-5">
                <div className="aspect-[4/3] overflow-hidden mb-6">
                  <img src="/lovable-uploads/3055a39f-8a3b-40bb-bc84-1682c72cefeb.png" alt="Aerial view of neighborhood" className="w-full h-full object-cover grayscale" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="border border-black p-6 relative">
                <div className="text-6xl font-bold mb-4 font-playfair italic">01</div>
                <p className="text-lg">We work <span className="font-playfair italic">directly</span> with motivated sellers who are looking to sell their homes below market value to sell them faster.</p>
              </div>
              <div className="border border-black p-6 mt-8 md:mt-16 relative my-0">
                <div className="text-6xl font-bold mb-4 font-playfair italic">02</div>
                <p className="text-lg">By connecting these motivated sellers with buyers looking for affordable housing, we ensure that properties on Realer Estate are <span className="font-playfair italic font-bold">actually great deals</span>.</p>
              </div>
              <div className="border border-black p-6 mt-4 md:mt-8 relative my-0">
                <div className="text-6xl font-bold mb-4 font-playfair italic">03</div>
                <p className="text-lg">Due to the high demand for below-market properties, listings on our platform <span className="font-playfair italic">may not stay available</span> for long.</p>
              </div>
            </div>
          </div>
          
          {/* For Buyers & Sellers */}
          <div className="mb-24 md:mb-32">
            <div className="grid grid-cols-12 gap-8 mb-16">
              <div className="col-span-12 md:col-span-7 order-2 md:order-1">
                <div className="flex items-center mb-6">
                  <h2 className="brutalist-text text-5xl md:text-6xl mr-4 tracking-tighter">FOR <span className="font-playfair italic font-bold">BUYERS</span></h2>
                  <UserTag role="buyer" />
                </div>
                <div className="border border-black p-8 backdrop-blur-sm">
                  <ul className="space-y-6">
                    {["Buy a home faster than you can say \"sold\"", "Save your cash for the home, not the agent.", "Know you're paying a fair price—always.", "No fees. No middlemen. Just the keys."].map((item, index) => <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center text-white bg-black w-8 h-8 rounded-full mr-4 flex-shrink-0 font-bold">
                            {index + 1}
                          </span>
                          <span className="text-lg md:text-xl font-medium">{item}</span>
                        </li>)}
                  </ul>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 order-1 md:order-2">
                <div className="aspect-square overflow-hidden">
                  <img src="/lovable-uploads/8fa9a7ae-6846-47b2-89cd-edcf73e2f353.png" alt="Modern home exterior" className="w-full h-full object-cover grayscale" />
                </div>
                <p className="text-sm mt-2 italic text-right">Finding your dream home</p>
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-5 order-1">
                <div className="aspect-square overflow-hidden">
                  <img src="/lovable-uploads/b82e0252-0b3e-4142-bbe9-1f4da2824ab9.png" alt="Classic apartment buildings" className="w-full h-full object-cover grayscale" />
                </div>
                <p className="text-sm mt-2 italic">Properties with potential</p>
              </div>
              <div className="col-span-12 md:col-span-7 order-2">
                <div className="flex items-center mb-6 justify-end">
                  <UserTag role="seller" />
                  <h2 className="brutalist-text text-5xl md:text-6xl ml-4 tracking-tighter">FOR <span className="font-playfair italic font-bold">SELLERS</span></h2>
                </div>
                <div className="border border-black p-8 backdrop-blur-sm">
                  <ul className="space-y-6">
                    {["List your home in 1 minute, sell it in 2.", "Zero fees, zero commissions, forever.", "Sell your home, skip the headache.", "Get a great offer on your home... today."].map((item, index) => <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center text-white bg-black w-8 h-8 rounded-full mr-4 flex-shrink-0 font-bold">
                            {index + 1}
                          </span>
                          <span className="text-lg md:text-xl font-medium">{item}</span>
                        </li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Our Mission */}
          <div className="mb-24 md:mb-32">
            <div className="grid grid-cols-12 gap-8 items-center">
              <div className="col-span-12 md:col-span-7 md:order-2">
                <h2 className="brutalist-text text-7xl md:text-9xl leading-none mb-8 tracking-tighter">
                  OUR<br />
                  <span className="font-playfair italic font-bold relative -ml-4">MISSION</span>
                </h2>
                <div className="text-lg md:text-xl space-y-4 md:ml-24">
                  <p>Realer Estate is about revolutionizing the real estate market to make it work for <span className="font-playfair italic font-bold">people</span> again. You shouldn't have to fight this hard for something so basic.</p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 md:order-1 border border-black p-8 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black"></div>
                <div className="text-lg md:text-xl space-y-6 relative z-10">
                  <p className="font-playfair text-2xl md:text-3xl italic">"We knew there had to be a better way—something faster, simpler, and actually made for people like us."</p>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-black text-white">RE</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">- Beckett & Derrick</p>
                      <p className="text-sm">Realer Estate Founders</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src="/lovable-uploads/cc2dcd0d-d592-4b85-976c-d2e569ab22e8.png" alt="City street view" className="w-full h-full object-cover grayscale" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-5">
              <img src="/lovable-uploads/c4859284-6b6b-4692-90c2-acd37daaacaa.png" alt="Background texture" className="w-full h-full object-cover grayscale" />
            </div>
            <h2 className="brutalist-text text-5xl md:text-7xl mb-8 tracking-tighter">
              <span className="block">WE DO REAL ESTATE</span> 
              <span className="block font-playfair italic font-bold">DIFFERENTLY.</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="text-lg font-bold border-black text-black hover:bg-black hover:text-white transition-all" asChild>
                <Link to="/search">Find Properties</Link>
              </Button>
              <Button variant="default" size="lg" className="text-lg font-bold bg-black text-white hover:bg-black/80" asChild>
                <Link to="/sell/create">List Your Property</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>;
};
export default About;
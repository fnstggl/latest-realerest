
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserTag } from '@/components/UserTag';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section */}
          <div className="mb-24 md:mb-32 relative overflow-hidden">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-7">
                <h1 className="brutalist-text text-[14vw] md:text-[12vw] leading-none mb-6 relative z-10">
                  <span className="block">REAL</span>
                  <span className="block relative -mt-4 md:ml-24">ESTATE</span>
                  <span className="negative-text-effect block relative ml-12 -mt-6">REIMAGINED</span>
                </h1>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-black/5 blur-3xl"></div>
              </div>
              <div className="col-span-12 md:col-span-5 space-y-6 md:space-y-12 pt-12 md:pt-24">
                <div>
                  <p className="text-xl md:text-3xl font-playfair mb-8">
                    We were two students in NYC trying to figure out how anyone was supposed to <span className="blue-text">buy a home.</span>
                  </p>
                </div>
                <p className="text-lg md:text-xl leading-relaxed ml-6 border-l-4 pl-4 border-black/50">
                  Everywhere we looked, it felt impossible. Prices were too high, listings were outdated or gone, and everything moved fast.
                </p>
                <p className="text-xl md:text-2xl font-bold">So we created <br />
                  <span className="negative-text-effect text-3xl md:text-4xl">Realer Estate.</span>
                  <br /><span className="text-xl">Real homes. Realistic prices.</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Our Story Section */}
          <div className="mb-24 md:mb-32 relative">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-5 md:order-2 bg-black text-white p-8 ml-auto">
                <div className="editorial-number text-black/10">01</div>
                <h2 className="brutalist-text text-6xl md:text-7xl mb-8 relative z-10">OUR<br />
                <span className="negative-text-effect">STORY</span></h2>
              </div>
              <div className="col-span-12 md:col-span-7 md:order-1 flex items-center">
                <div className="text-lg md:text-xl space-y-8">
                  <p>We built <span className="negative-text-gradient">Realer Estate</span> to make housing feel possible again. Our mission is to give people a real shot at buying a home — without needing perfect credit, endless paperwork, or thousands over asking.</p>
                  <p className="editorial-callout">We know how frustrating the process of buying and selling your house can feel, so at Realer Estate... we're doing things differently.</p>
                  <p>We're here for the buyers who've been priced out, the ones who refresh Zillow every night hoping something new pops up. We're here for the people trying to get their families into something stable, something real. And we're here for sellers too — the ones ready to move on, without the wait.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* How We're Different */}
          <div className="mb-24 md:mb-32 relative">
            <div className="relative overflow-hidden">
              <div className="absolute -right-20 top-20 text-[200px] md:text-[280px] opacity-5 brutalist-text">WE DO</div>
              <div className="grid grid-cols-12 gap-4 relative z-10">
                <div className="col-span-12 md:col-span-7">
                  <h3 className="brutalist-text text-6xl md:text-7xl mb-12 relative">HOW WE OFFER <span className="negative-text-effect">BELOW-MARKET</span> PROPERTIES</h3>
                </div>
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="brutalist-layout-item bg-black/5 p-6 backdrop-blur-sm">
                    <div className="text-6xl font-bold mb-4 negative-text-gradient">01</div>
                    <p className="text-lg">We work directly with motivated sellers who are looking to sell their homes below market value to sell them faster.</p>
                  </div>
                  <div className="brutalist-layout-item bg-black/5 p-6 mt-8 md:mt-16 backdrop-blur-sm">
                    <div className="text-6xl font-bold mb-4 negative-text-gradient">02</div>
                    <p className="text-lg">By connecting these motivated sellers with buyers looking for affordable housing, we ensure that properties on Realer Estate are actually great deals.</p>
                  </div>
                  <div className="brutalist-layout-item bg-black/5 p-6 mt-4 md:mt-8 backdrop-blur-sm">
                    <div className="text-6xl font-bold mb-4 negative-text-gradient">03</div>
                    <p className="text-lg">Due to the high demand for below-market properties, listings on our platform may not stay available for long.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* For Buyers & Sellers */}
          <div className="mb-24 md:mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative">
                <div className="flex items-center mb-6">
                  <h2 className="brutalist-text text-5xl md:text-6xl mr-4">FOR <span className="negative-text-effect">BUYERS</span></h2>
                  <UserTag role="buyer" />
                </div>
                <div className="relative border border-black/20 p-8 backdrop-blur-sm">
                  <ul className="space-y-6">
                    {["Buy a home faster than you can say \"sold\"", 
                      "Save your cash for the home, not the agent.", 
                      "Know you're paying a fair price—always.", 
                      "No fees. No middlemen. Just the keys."].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center text-white bg-black w-8 h-8 rounded-full mr-4 flex-shrink-0 font-bold">
                            {index + 1}
                          </span>
                          <span className="text-lg md:text-xl font-medium">{item}</span>
                        </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="relative mt-12 md:mt-24">
                <div className="flex items-center mb-6">
                  <h2 className="brutalist-text text-5xl md:text-6xl mr-4">FOR <span className="negative-text-effect">SELLERS</span></h2>
                  <UserTag role="seller" />
                </div>
                <div className="relative border border-black/20 p-8 backdrop-blur-sm">
                  <ul className="space-y-6">
                    {["List your home in 1 minute, sell it in 2.", 
                      "Zero fees, zero commissions, forever.", 
                      "Sell your home, skip the headache.", 
                      "Get a great offer on your home... today."].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center text-white bg-black w-8 h-8 rounded-full mr-4 flex-shrink-0 font-bold">
                            {index + 1}
                          </span>
                          <span className="text-lg md:text-xl font-medium">{item}</span>
                        </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Our Mission */}
          <div className="mb-24 md:mb-32">
            <div className="grid grid-cols-12 gap-8 items-center">
              <div className="col-span-12 md:col-span-7 md:order-2">
                <h2 className="brutalist-text text-7xl md:text-9xl leading-none mb-8">
                  OUR<br />
                  <span className="negative-text-effect relative">MISSION</span>
                </h2>
                <div className="text-lg md:text-xl space-y-4 md:ml-24">
                  <p>Realer Estate is about revolutionizing the real estate market to make it work for people again. You shouldn't have to fight this hard for something so basic.</p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 md:order-1 bg-black/5 p-8 border border-black/20 backdrop-blur-sm relative">
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
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center mb-12">
            <h2 className="brutalist-text text-5xl md:text-7xl mb-8">
              <span className="block">WE DO REAL ESTATE</span> 
              <span className="block negative-text-effect">DIFFERENTLY.</span>
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
    </div>
  );
};

export default About;


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
    <div className="min-h-screen bg-white text-black overflow-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section - Brutalist Typography */}
        <div className="relative mb-16 md:mb-24 overflow-hidden">
          <div className="absolute -right-20 top-0 text-[200px] md:text-[400px] font-bold opacity-5 leading-none tracking-tighter">
            REAL
          </div>
          
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 relative z-10">
              <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter leading-none uppercase">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="transform rotate-2"
                  >
                    Our
                  </motion.div>
                </div>
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="transform -rotate-1"
                  >
                    Vision
                  </motion.div>
                </div>
              </h1>
              
              <div className="mt-12 md:mt-20 grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <div className="text-lg font-bold mb-4 tracking-tight transform rotate-1">CLEAR-CUT TALKING</div>
                  <div className="bg-black text-white p-4 md:p-6 text-lg md:text-xl max-w-xl transform -rotate-1 mb-6 md:mb-0">
                    <p>We were two students in NYC trying to figure out how anyone was supposed to buy a home.</p>
                    <p className="mt-4">So we created <span className="font-bold underline">Realer Estate</span>.</p>
                  </div>
                </div>
                
                <div className="col-span-12 md:col-span-6 md:pl-8">
                  <div className="text-lg font-bold mb-4 tracking-tight transform -rotate-1">MIXED SUBTLY FORMAL</div>
                  <div className="text-lg md:text-xl transform rotate-1">
                    <p>Everywhere we looked, it felt impossible. Prices were too high, listings were outdated or gone, and everything moved fast — unless you had cash, connections, or perfect timing, you were out of luck.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Story Section - Experimental Layout */}
        <div className="mb-24 md:mb-32 relative">
          <div className="absolute left-0 -top-20 text-[150px] font-bold opacity-5 transform -rotate-90 -translate-x-1/2">
            STORY
          </div>
          
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4 order-2 md:order-1">
              <div className="border-t-4 border-l-4 border-black py-8 px-6 h-full transform -translate-y-4 translate-x-4">
                <div className="font-bold text-5xl md:text-7xl uppercase tracking-tighter mb-6">Our<br/>Story</div>
                <p className="text-lg mb-4">We built Realer Estate to make housing feel possible again.</p>
                <p className="text-lg">Our mission is to give people a real shot at buying a home — without needing perfect credit, endless paperwork, or thousands over asking.</p>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-8 order-1 md:order-2">
              <div className="bg-black p-6 md:p-10 text-white transform translate-y-6 md:translate-y-10">
                <p className="text-lg md:text-xl mb-6">We know how frustrating the process of buying and selling your house can feel, so at Realer Estate... we're doing things differently.</p>
                <p className="text-lg md:text-xl">We're here for the buyers who've been priced out, the ones who refresh Zillow every night hoping something new pops up. We're here for the people trying to get their families into something stable, something real. And we're here for sellers too — the ones ready to move on, without the wait.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* How We're Different - Deconstructivist Influence */}
        <div className="mb-24 md:mb-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 mb-8">
              <div className="inline-block transform -rotate-1">
                <h2 className="text-[5rem] md:text-[8rem] font-black tracking-tighter uppercase leading-none mix-blend-difference">
                  <span className="inline-block transform translate-y-6">We</span>
                  <span className="inline-block transform -translate-y-2 mx-4">Do</span>
                </h2>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6 transform translate-x-4">
              <h3 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-tighter">How We Offer Below-Market Properties</h3>
              
              <div className="space-y-10 md:space-y-16">
                <div className="relative">
                  <div className="text-[80px] font-black absolute -left-8 -top-10 opacity-10">01</div>
                  <div className="relative z-10 pl-10 border-l-2 border-black">
                    <p className="text-lg">We work directly with motivated sellers who are looking to sell their homes below market value to sell them faster.</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="text-[80px] font-black absolute -left-8 -top-10 opacity-10">02</div>
                  <div className="relative z-10 pl-10 border-l-2 border-black">
                    <p className="text-lg">By connecting these motivated sellers with buyers looking for affordable housing, we ensure that properties on Realer Estate are actually great deals.</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="text-[80px] font-black absolute -left-8 -top-10 opacity-10">03</div>
                  <div className="relative z-10 pl-10 border-l-2 border-black">
                    <p className="text-lg">Due to the high demand for below-market properties, listings on our platform may not stay available for long.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6 flex items-center">
              <div className="w-full aspect-square bg-black text-white flex items-center justify-center p-8 transform rotate-3">
                <span className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-center">Real<br/>Estate<br/>Re<br/>Imagined</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* For Buyers & Sellers - Modern Minimalism Meets Chaos */}
        <div className="mb-24 md:mb-32 relative">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-6 relative">
              <div className="absolute -left-4 top-0 w-24 h-24 bg-black"></div>
              <div className="transform translate-x-8 translate-y-12 z-10 relative">
                <div className="flex items-center mb-6 transform -rotate-2">
                  <h2 className="text-5xl font-black uppercase tracking-tighter mr-4">For Buyers</h2>
                  <UserTag role="buyer" />
                </div>
                <div className="bg-white border-4 border-black p-8 transform rotate-1">
                  <ul className="space-y-6">
                    {["Buy a home faster than you can say \"sold\"", "Save your cash for the home, not the agent.", "Know you're paying a fair price—always.", "No fees. No middlemen. Just the keys."].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-black text-white w-8 h-8 rounded-none mr-4 flex-shrink-0 font-bold">
                          {index + 1}
                        </span>
                        <span className="text-lg font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-6 relative">
              <div className="absolute -right-4 bottom-0 w-24 h-24 bg-black"></div>
              <div className="transform -translate-x-8 -translate-y-12 z-10 relative">
                <div className="flex items-center mb-6 transform rotate-2">
                  <h2 className="text-5xl font-black uppercase tracking-tighter mr-4">For Sellers</h2>
                  <UserTag role="seller" />
                </div>
                <div className="bg-white border-4 border-black p-8 transform -rotate-1">
                  <ul className="space-y-6">
                    {["List your home in 1 minute, sell it in 2.", "Zero fees, zero commissions, forever.", "Sell your home, skip the headache.", "Get a great offer on your home... today."].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-black text-white w-8 h-8 rounded-none mr-4 flex-shrink-0 font-bold">
                          {index + 1}
                        </span>
                        <span className="text-lg font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Mission - Text Masking Effect */}
        <div className="mb-24 md:mb-32 overflow-hidden">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-7 flex flex-col justify-between">
              <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-8 uppercase">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    Our
                  </motion.div>
                </div>
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full bg-black text-white pl-4"
                  >
                    Mission
                  </motion.div>
                </div>
              </h2>
              
              <div className="text-lg space-y-4 max-w-xl transform -rotate-1 border-l-4 border-black pl-6 py-4">
                <p>Realer Estate is about revolutionizing the real estate market to make it work for people again. You shouldn't have to fight this hard for something so basic.</p>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-5 bg-black text-white p-8 transform translate-y-8 md:translate-y-16">
              <div className="text-lg space-y-6">
                <p className="transform rotate-2">"We knew there had to be a better way—something faster, simpler, and actually made for people like us."</p>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-white text-black">RE</AvatarFallback>
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
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-10 leading-none">
            <span className="block transform translate-x-6">We Do</span>
            <span className="block transform -translate-x-6">Real Estate</span>
            <span className="block transform translate-x-2">Differently</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="outline" size="lg" className="text-lg font-bold border-4 border-black rounded-none hover:bg-black hover:text-white transform rotate-1 transition-all" asChild>
              <Link to="/search">Find Properties</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg font-bold border-4 border-black rounded-none hover:bg-black hover:text-white transform -rotate-1 transition-all" asChild>
              <Link to="/sell/create">List Your Property</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default About;

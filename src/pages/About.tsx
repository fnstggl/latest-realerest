import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserTag } from '@/components/UserTag';
const About: React.FC = () => {
  return <div className="min-h-screen bg-[#FCFBF8]">
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
          <div className="mb-16 md:mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-7xl md:text-8xl font-bold font-playfair tracking-tighter mb-6 leading-none lg:text-8xl">
                  REAL<br />ESTATE<br />
                  <span className="relative font-normal text-8xl">
                    <span className="absolute inset-x-0 bottom-2 h-3 bg-black/10"></span>
                    REIMAGINED
                  </span>
                </h1>
              </div>
              <div className="space-y-6 text-lg">
                <p className="text-xl md:text-2xl font-playfair font-bold">We were two students in NYC trying to figure out how anyone was supposed to buy a home.</p>
                <p>Everywhere we looked, it felt impossible. Prices were too high, listings were outdated or gone, and everything moved fast — unless you had cash, connections, or perfect timing, you were out of luck.</p>
                <p>So we created Realer Estate. <span className="font-bold">Real homes. Realistic prices.</span></p>
              </div>
            </div>
          </div>
          
          {/* Our Story Section */}
          <div className="mb-24 md:mb-32">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-5">
                <h2 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4 font-playfair">OUR STORY</h2>
              </div>
              <div className="col-span-12 md:col-span-7 border border-white/40 shadow-md p-8 rounded-xl space-y-6 bg-transparent">
                <p className="text-lg">We built Realer Estate to make housing feel possible again. Our mission is to give people a real shot at buying a home — without needing perfect credit, endless paperwork, or thousands over asking. We know how frustrating the process of buying and selling your house can feel can be to buy a house, so at Realer Estate... we're doing things differently.</p>
                <p className="text-lg">We're here for the buyers who've been priced out, the ones who refresh Zillow every night hoping something new pops up. We're here for the people trying to get their families into something stable, something real. And we're here for sellers too — the ones ready to move on, without the wait.</p>
              </div>
            </div>
          </div>
          
          {/* How We're Different */}
          <div className="mb-24 md:mb-32">
            <div className="relative">
              <h2 className="text-[140px] md:text-[180px] lg:text-[220px] font-bold opacity-5 absolute -top-20 left-0 pointer-events-none font-playfair">WE DO</h2>
              <div className="relative z-10 bg-white/80 border border-white/40 shadow-md p-8 rounded-xl">
                <h3 className="text-4xl md:text-5xl font-bold mb-6 font-playfair">How We Offer Below-Market Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="text-6xl font-bold opacity-20 font-futura">01</div>
                    <p>We work directly with motivated sellers who are looking to sell their homes below market value to sell them faster.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="text-6xl font-bold opacity-20 font-futura">02</div>
                    <p>By connecting these motivated sellers with buyers looking for affordable housing, we ensure that properties on Realer Estate are actually great deals.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="text-6xl font-bold opacity-20 font-futura">03</div>
                    <p>Due to the high demand for below-market properties, listings on our platform may not stay available for long.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* For Buyers & Sellers */}
          <div className="mb-24 md:mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center mb-6">
                  <h2 className="text-5xl font-bold font-playfair mr-4">FOR BUYERS</h2>
                  <UserTag role="buyer" />
                </div>
                <div className="bg-white p-8 rounded-xl shadow-md h-full border border-white/60">
                  <ul className="space-y-6">
                    {["Buy a home faster than you can say \"sold\"", "Save your cash for the home, not the agent.", "Know you're paying a fair price—always.", "No fees. No middlemen. Just the keys."].map((item, index) => <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-[#F2FCE2] text-[#4CA154] w-8 h-8 rounded-full mr-4 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-lg font-medium">{item}</span>
                      </li>)}
                  </ul>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-6">
                  <h2 className="text-5xl font-bold font-playfair mr-4">FOR SELLERS</h2>
                  <UserTag role="seller" />
                </div>
                <div className="bg-white p-8 rounded-xl shadow-md h-full border border-white/60">
                  <ul className="space-y-6">
                    {["List your home in 1 minute, sell it in 2.", "Zero fees, zero commissions, forever.", "Sell your home, skip the headache.", "Get a great offer on your home... today."].map((item, index) => <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-[#F9E0E0] text-[#ea384c] w-8 h-8 rounded-full mr-4 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-lg font-medium">{item}</span>
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
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter font-playfair leading-none mb-8">
                  OUR<br />MISSION
                </h2>
                <div className="text-lg space-y-4">
                  <p>Realer Estate is about revolutionizing the real estate market to make it work for people again. You shouldn't have to fight this hard for something so basic.</p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 md:order-1 bg-white/80 border border-white/40 shadow-md p-8 rounded-xl">
                <div className="text-lg space-y-6">
                  <p>"We knew there had to be a better way—something faster, simpler, and actually made for people like us."</p>
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
          <div className="text-center bg-white/80 border border-white/40 shadow-md p-10 rounded-xl mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 font-playfair">We do real estate differently.</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="translucent" size="lg" className="text-lg font-bold" asChild>
                <Link to="/search">Find Properties</Link>
              </Button>
              <Button variant="translucent" size="lg" className="text-lg font-bold" asChild>
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
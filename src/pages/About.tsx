
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white perspective-container">
      <div className="gradient-blob gradient-blob-1"></div>
      <div className="gradient-blob gradient-blob-2"></div>
      <div className="gradient-blob gradient-blob-3"></div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="max-w-4xl mx-auto"
        >
          <div className="mb-12 layer-1">
            <h1 className="text-5xl font-bold mb-4">About DoneDeal</h1>
            <div className="h-2 w-32 bg-[#9b87f5] glass-card shadow-md"></div>
          </div>
          
          <div className="glass-card backdrop-blur-lg border border-white/30 shadow-2xl p-8 mb-12 perspective-container layer-2">
            <h2 className="text-2xl font-bold mb-4 layer-1">Our Story</h2>
            <p className="text-lg mb-6 glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-2">We were two students in NYC trying to figure out how anyone was supposed to buy a home. Everywhere we looked, it felt impossible. Prices were too high, listings were outdated or gone, and everything moved fast — unless you had cash, connections, or perfect timing, you were out of luck. We couldn't understand why something as basic as finding an affordable home felt this broken.</p>
            <p className="text-lg glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-2">It felt hopeless. But instead of giving up, we started building. We knew there had to be a better way—something faster, simpler, and actually made for people like us. So we created DoneDeal to connect real buyers with real homes, without all the games. No middlemen. No hidden fees. No jumping through hoops. Just a clear path toward ownership for people who've been told they don't belong in the market.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glass-card backdrop-blur-lg border border-white/30 shadow-2xl p-8 bg-[#9b87f5]/20 perspective-container layer-2">
              <h2 className="text-2xl font-bold mb-4 purple-text layer-1">For Buyers</h2>
              <ul className="space-y-3">
                {[
                  "Buy a home faster than you can say \"sold\"",
                  "Save your cash for the home, not the agent.",
                  "Know you're paying a fair price—always.",
                  "No fees. No middlemen. Just the keys."
                ].map((item, index) => (
                  <li key={index} className="flex items-start glass p-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
                    <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0 text-[#9b87f5]" />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-card backdrop-blur-lg border border-white/30 shadow-2xl p-8 bg-[#6E59A5]/20 perspective-container layer-2">
              <h2 className="text-2xl font-bold mb-4 purple-text layer-1">For Sellers</h2>
              <ul className="space-y-3">
                {[
                  "List your home in 1 minute, sell it in 2.",
                  "Zero fees, zero commissions, forever.",
                  "Sell your home, skip the headache.",
                  "Get a great offer on your home... today."
                ].map((item, index) => (
                  <li key={index} className="flex items-start glass p-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
                    <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0 text-[#9b87f5]" />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="glass-card backdrop-blur-lg border border-white/30 shadow-2xl p-8 mb-12 perspective-container layer-2">
            <h2 className="text-2xl font-bold mb-4 layer-1">Our Mission</h2>
            <p className="text-lg mb-4 glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">We built DoneDeal to make housing feel possible again. Our mission is to give people a real shot at buying a home — without needing perfect credit, endless paperwork, or thousands over asking. We know how frustrating the process of buying and selling your house can feel can be to buy a house, so at DoneDeal... we're trying to do things differently.</p>
            <p className="text-lg mb-4 glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">We're here for the buyers who've been priced out, the ones who refresh Zillow every night hoping something new pops up. We're here for the people trying to get their families into something stable, something real. And we're here for sellers too — the ones ready to move on, without the wait.</p>
            <p className="text-lg glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">DoneDeal is about revolutionizing the real estate market to make it work for people again. You shouldn't have to fight this hard for something so basic.</p>
          </div>
          
          <div className="glass-card backdrop-blur-lg border border-white/30 shadow-2xl p-8 mb-12 perspective-container layer-2">
            <h2 className="text-2xl font-bold mb-4 layer-1">How We Offer Below-Market Properties</h2>
            <p className="text-lg mb-4 glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">We work directly with motivated sellers who are looking to sell their homes below market value to sell them faster. This may be due to a number of reasons, including pre-foreclosure situations, pre-probate sales, property liens, job relocations, or they simply don't want to go through all the chaos of realtors and the months-long process of trying to get their home sold on their own.</p>
            <p className="text-lg mb-4 glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">By connecting these motivated sellers with buyers looking for affordable housing, we ensure that properties on DoneDeal are actually great deals. These homes are meant to be sold fast rather than for the highest possible price, creating an opportunity for substantial savings.</p>
            <p className="text-lg glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
              Due to the high demand for below-market properties, listings on our platform may not stay available for long. The supply of these opportunities is naturally limited, so we encourage serious buyers to act quickly when they find a property they're interested in.
            </p>
          </div>
          
          <div className="text-center glass-card backdrop-blur-lg border border-white/30 shadow-md p-6 rounded-xl layer-2">
            <h2 className="text-3xl font-bold mb-6 layer-1">Ready to experience DoneDeal?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center layer-3">
              <Button asChild variant="glass" className="font-bold shadow-lg backdrop-blur-xl search-glow">
                <Link to="/search">Find Properties</Link>
              </Button>
              <Button asChild variant="glass" className="font-bold shadow-lg backdrop-blur-xl search-glow">
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

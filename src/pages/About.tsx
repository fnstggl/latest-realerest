import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
const About: React.FC = () => {
  return <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">About DoneDeal</h1>
            <div className="h-2 w-32 bg-[#d60013]"></div>
          </div>
          
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-lg mb-6">We were two students in NYC trying to figure out how anyone was supposed to buy a home. Everywhere we looked, it felt impossible. Prices were too high, listings were outdated or gone, and everything moved fast — unless you had cash, connections, or perfect timing, you were out of luck. We couldn’t understand why something as basic as finding an affordable home felt this broken.</p>
            <p className="text-lg">It felt hopeless. But instead of giving up, we started building. We knew there had to be a better way — something faster, simpler, and actually made for people like us. So we created DoneDeal to connect real buyers with real homes, without all the games. No middlemen. No hidden fees. No jumping through hoops. Just a clear path toward ownership for people who’ve been told they don’t belong in the market.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 bg-[#d60013] text-white">
              <h2 className="text-2xl font-bold mb-4">For Buyers</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0" />
                  <span>Access properties at below market prices</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0" />
                  <span>Connect directly with motivated sellers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0" />
                  <span>Save thousands on your dream home</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0" />
                  <span>Simple, transparent process</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0" />
                  <span>Act quickly on time-sensitive deals</span>
                </li>
              </ul>
            </div>
            
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
              <h2 className="text-2xl font-bold mb-4">For Sellers</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0 text-[#d60013]" />
                  <span>Reach motivated buyers quickly</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0 text-[#d60013]" />
                  <span>Sell without high agent commissions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0 text-[#d60013]" />
                  <span>Control who views your property</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={20} className="mr-2 mt-1 flex-shrink-0 text-[#d60013]" />
                  <span>Simple listing creation and management</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg mb-4">We built DoneDeal to make housing feel possible again. Our mission is to give people a real shot at buying a home — without needing perfect credit, endless paperwork, or thousands over asking. </p>
            <p className="text-lg mb-4">We’re here for the buyers who’ve been priced out, the ones who refresh Zillow every night hoping something new pops up. We’re here for the people trying to get their families into something stable, something real. And we’re here for sellers too — the ones ready to move on, without the wait.</p>
            <p className="text-lg">DoneDeal is about making the market work for people again. You shouldn’t have to fight this hard for something so basic.</p>
          </div>
          
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">How We Offer Below-Market Properties</h2>
            <p className="text-lg mb-4">We work directly with motivated sellers who are looking to sell their homes below market value to sell them faster. This may be due to a number of reasons, including pre-foreclosure situations, pre-probate sales, property liens, job relocations, or simply the need for a quick sale.</p>
            <p className="text-lg mb-4">By connecting these motivated sellers with buyers looking for affordable housing, we ensure that properties on DoneDeal are actually great deals. These homes are meant to be sold fast rather than for the highest possible price, creating an opportunity for substantial savings.</p>
            <p className="text-lg">
              Due to the high demand for below-market properties, listings on our platform may not stay available for long. The supply of these opportunities is naturally limited, so we encourage serious buyers to act quickly when they find a property they're interested in.
            </p>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to experience DoneDeal?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="neo-button-primary">
                <Link to="/search">Find Properties</Link>
              </Button>
              <Button asChild variant="navy" className="neo-button">
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
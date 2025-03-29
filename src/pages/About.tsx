
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">About DoneDeal</h1>
            <div className="h-2 w-32 bg-[#d60013]"></div>
          </div>
          
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg mb-6">
              At DoneDeal, we believe everyone deserves access to affordable housing. Our mission is to connect buyers directly with motivated sellers offering properties below market value, creating a win-win situation for both parties.
            </p>
            <p className="text-lg">
              We're eliminating unnecessary middlemen and breaking down the barriers that make homeownership seem out of reach for many Americans. By providing a direct, transparent platform, we're revolutionizing the way people buy and sell homes.
            </p>
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
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-lg mb-4">
              DoneDeal was founded by two students looking to make buying a home actually affordable for everyday Americans.
            </p>
            <p className="text-lg mb-4">
              After witnessing countless buyers priced out of the market and sellers losing thousands to commissions and fees, we knew there had to be a better way. We created DoneDeal to directly connect motivated sellers with qualified buyers, benefiting both sides of the transaction.
            </p>
            <p className="text-lg">
              Today, we're proud to be revolutionizing the real estate market with our transparent, user-friendly platform that puts power back in the hands of buyers and sellers.
            </p>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to experience DoneDeal?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="neo-button-primary">
                <Link to="/search">Find Properties</Link>
              </Button>
              <Button asChild className="neo-button">
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


import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';

const Careers: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Help us revolutionize the real estate industry by making home ownership more accessible for everyone.
            </p>
          </div>
          
          {/* Company Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-10 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="w-12 h-12 bg-[#d60013] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black mb-4">1</div>
                <h3 className="text-xl font-bold mb-4">Innovation</h3>
                <p>We're constantly looking for new ways to improve the real estate experience and make home ownership more accessible.</p>
              </div>
              
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="w-12 h-12 bg-[#d60013] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black mb-4">2</div>
                <h3 className="text-xl font-bold mb-4">Transparency</h3>
                <p>We believe in being honest and direct in everything we do, from our property listings to our approach to business.</p>
              </div>
              
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="w-12 h-12 bg-[#d60013] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black mb-4">3</div>
                <h3 className="text-xl font-bold mb-4">Accessibility</h3>
                <p>We're committed to making home ownership possible for more people by reducing costs and simplifying the process.</p>
              </div>
            </div>
          </div>
          
          {/* Current Opportunities */}
          <div>
            <h2 className="text-3xl font-bold mb-10 text-center">Current Opportunities</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Marketing Intern</h3>
                    <p className="text-gray-700">Marketing</p>
                  </div>
                  <div className="bg-[#d60013] text-white px-2 py-1 border-2 border-black font-bold text-sm">
                    Remote
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">Help us grow our platform by implementing innovative digital marketing strategies, managing our social media presence, and creating engaging content for our blog.</p>
                
                <div className="flex items-center mt-4">
                  <Mail size={18} className="mr-2 text-[#d60013]" />
                  <a href="mailto:apply@donedealhome.com" className="font-bold hover:text-[#d60013]">
                    apply@donedealhome.com
                  </a>
                </div>
              </div>
              
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Investment Opportunity</h3>
                    <p className="text-gray-700">Investor Relations</p>
                  </div>
                  <div className="bg-[#d60013] text-white px-2 py-1 border-2 border-black font-bold text-sm">
                    Flexible
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">Looking to invest in the future of real estate? We're seeking forward-thinking investors who share our vision of making homeownership more accessible for everyday Americans.</p>
                
                <div className="flex items-center mt-4">
                  <Mail size={18} className="mr-2 text-[#d60013]" />
                  <a href="mailto:apply@donedealhome.com" className="font-bold hover:text-[#d60013]">
                    apply@donedealhome.com
                  </a>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-16">
              <p className="text-lg">We're a small but growing team. Check back for more opportunities in the future!</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default Careers;

import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
const Careers: React.FC = () => {
  return <div className="min-h-screen bg-[#FCFBF8]">
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
      }} className="max-w-6xl mx-auto">
          {/* Hero Section - Apple-style */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl max-w-2xl mx-auto text-gray-600">
              Help us revolutionize the real estate industry by making home ownership more accessible for everyone.
            </p>
          </div>
          
          {/* Company Values - Apple-style */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-300">
                <h3 className="text-2xl font-semibold mb-4">Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We're constantly looking for new ways to improve the real estate experience and make home ownership more accessible.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-300">
                <h3 className="text-2xl font-semibold mb-4">Transparency</h3>
                <p className="text-gray-600 leading-relaxed">
                  We believe in being honest and direct in everything we do, from our property listings to our approach to business.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-300">
                <h3 className="text-2xl font-semibold mb-4">Accessibility</h3>
                <p className="text-gray-600 leading-relaxed">
                  We're committed to making home ownership possible for more people by reducing costs and simplifying the process.
                </p>
              </div>
            </div>
          </div>
          
          {/* Current Opportunities - Apple-style */}
          <div>
            <h2 className="text-4xl font-bold mb-12 text-center">Current Opportunities</h2>
            
            <div className="grid md:grid-cols-2 gap-10 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold">Marketing Intern</h3>
                    <p className="text-black mt-1">Marketing</p>
                  </div>
                  <div className="px-3 py-1 bg-gray-50 text-black rounded-full text-sm font-medium">
                    Remote
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Help us grow our platform by implementing innovative digital marketing strategies, managing our social media presence, and creating engaging content for our blog.
                </p>
                
                <div className="flex items-center mt-6">
                  <Mail size={18} className="mr-2 text-black" />
                  <a href="mailto:apply@donedealhome.com" className="font-medium text-black hover:underline">apply@realerestate.com</a>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold">Investment Opportunity</h3>
                    <p className="text-black mt-1">Investor Relations</p>
                  </div>
                  <div className="px-3 py-1 bg-gray-50 text-black rounded-full text-sm font-medium">
                    Flexible
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Looking to invest in the future of real estate? We're seeking forward-thinking investors who share our vision of making homeownership more accessible for everyday Americans.
                </p>
                
                <div className="flex items-center mt-6">
                  <Mail size={18} className="mr-2 text-black" />
                  <a href="mailto:invest@donedealhome.com" className="font-medium text-black hover:underline">invest@realerestate.com</a>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-20">
              <p className="text-xl text-gray-600 mb-8">
                We're a small but growing team. Check back for more opportunities in the future!
              </p>
              <Button className="bg-[#0892D0] hover:bg-[#0882C0] text-white px-8 py-6 rounded-full text-lg" onClick={() => window.location.href = 'mailto:careers@donedealhome.com'}>
                Contact Our Team
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>;
};
export default Careers;

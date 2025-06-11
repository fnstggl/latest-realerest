
import React from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Building, Users, Handshake, Coins, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Guide: React.FC = () => {
  const navigate = useNavigate();
  
  const guides = [
    {
      title: 'How to Buy',
      description: 'Find your dream home below market value',
      icon: Coins,
      path: '/guide/buying',
      iconBg: 'bg-[#fd4801]'
    },
    {
      title: 'How to Sell',
      description: 'List your property and find buyers fast',
      icon: Home,
      path: '/guide/selling',
      iconBg: 'bg-[#01204b]'
    },
    {
      title: 'How to Wholesale',
      description: 'Connect buyers and sellers to earn bounties',
      icon: Handshake,
      path: '/guide/wholesale',
      iconBg: 'bg-[#fd4801]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="font-polysans text-[#01204b] text-center mb-12">
            <h1 className="font-polysans-semibold text-[#01204b] text-3xl sm:text-4xl md:text-5xl mb-6">
              Real<span className="font-polysans italic">er</span> Estate Guides
            </h1>
          </div>
          
          {/* Background image overlay */}
          <div className="relative mb-12">
            <div 
              className="absolute inset-0 w-full h-[400px] z-0"
              style={{
                backgroundImage: `url('/lovable-uploads/3814ac85-68ae-4ca8-a30d-92713ab1360b.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            
            {/* Guide cards positioned to overlay the bottom of the background image */}
            <div className="relative z-10 pt-64">
              <div className="grid md:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <motion.div
                    key={guide.title}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="relative"
                  >
                    <Card 
                      className="p-6 cursor-pointer h-full border-none shadow-md flex flex-col bg-white"
                      onClick={() => navigate(guide.path)}
                    >
                      <div className={`w-12 h-12 rounded-lg ${guide.iconBg} mb-4 flex items-center justify-center`}>
                        <guide.icon size={24} className="text-white" />
                      </div>
                      <h2 className="text-xl font-polysans text-[#01204b] mb-2">{guide.title}</h2>
                      <p className="font-polysans text-gray-600">{guide.description}</p>
                      <div className="mt-auto pt-4">
                        <span className="font-polysans-semibold text-[#01204b] inline-flex items-center">
                          Learn more
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Moved subtitle to bottom */}
          <div className="text-center">
            <p className="font-polysans-semibold text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Learn how our platform works and get step-by-step guidance for buyers, sellers, and wholesalers.
            </p>
          </div>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default Guide;

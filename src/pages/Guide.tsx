
import React from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Building, Users, Handshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Guide: React.FC = () => {
  const navigate = useNavigate();
  
  const guides = [
    {
      title: 'How to Buy',
      description: 'Find your dream home below market value',
      icon: Building,
      path: '/guide/buying',
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'How to Sell',
      description: 'List your property and find buyers fast',
      icon: Users,
      path: '/guide/selling',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'How to Wholesale',
      description: 'Connect buyers and sellers to earn bounties',
      icon: Handshake,
      path: '/guide/wholesale',
      color: 'from-pink-500 to-orange-500'
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
          <div className="text-center mb-12">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-6">
              <span className="font-playfair italic">Realer Estate</span> Guides
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Learn how our platform works and get step-by-step guidance for buyers, sellers, and wholesalers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <motion.div
                key={guide.title}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative"
              >
                <Card 
                  className="p-6 cursor-pointer h-full border-none shadow-md flex flex-col"
                  onClick={() => navigate(guide.path)}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${guide.color} mb-4 flex items-center justify-center`}>
                    <guide.icon size={24} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">{guide.title}</h2>
                  <p className="text-gray-600">{guide.description}</p>
                  <div className="mt-auto pt-4">
                    <span className="font-medium text-black inline-flex items-center">
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
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default Guide;

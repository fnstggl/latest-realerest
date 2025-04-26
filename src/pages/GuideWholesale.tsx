import React from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, Handshake, Briefcase, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const GuideWholesale: React.FC = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      number: 1,
      title: 'Find bounties to accept',
      description: 'Browse properties with bounty incentives. These are opportunities for you to connect buyers with sellers and earn a commission when the deal closes successfully.',
      icon: DollarSign,
      link: '/search',
      linkText: 'Browse Bounties'
    },
    {
      number: 2,
      title: 'Bring an interested buyer to the deal',
      description: 'Connect your network of buyers to these below-market opportunities. When you find an interested buyer, join the waitlist to claim the potential bounty.',
      icon: Handshake,
      link: '/dashboard',
      linkText: 'View Your Dashboard'
    },
    {
      number: 3,
      title: 'Get the deal to closing',
      description: 'Facilitate communication between buyer and seller to help move the transaction forward. Our platform makes it easy to coordinate all parties involved.',
      icon: Briefcase,
      link: '/messages',
      linkText: 'Check Messages'
    },
    {
      number: 4,
      title: 'Get paid your bounty',
      description: "Once the deal closes successfully, you'll receive your bounty payment directly through our secure platform. No waiting, no chasing down payments.",
      icon: Award,
      link: '/dashboard',
      linkText: 'Track Your Bounties'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-futura-extra-bold"
            >
              How to <span className="font-playfair italic">Wholesale</span> with Realer Estate
            </motion.h1>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/guide')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              <span>Back to Guides</span>
            </Button>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 mb-12 text-lg"
          >
            Follow these steps to earn bounties by connecting buyers with sellers on our platform.
          </motion.p>
          
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.2 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
              >
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-6' : 'md:pl-6'}`}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black mb-4">
                      <step.icon size={32} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                      <span className="font-playfair italic pr-2">Step {step.number}:</span>
                      {step.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{step.description}</p>
                    <Link to={step.link}>
                      <Button className="relative bg-white text-black border border-transparent hover:bg-white group">
                        <span>{step.linkText}</span>
                        <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" 
                          style={{
                            background: "transparent",
                            border: "2px solid transparent",
                            backgroundImage: "linear-gradient(90deg, #D946EF, #FF3CAC 20%, #FF5C00 40%, #FF9004 60%)",
                            backgroundOrigin: "border-box",
                            backgroundClip: "border-box",
                            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude"
                          }} 
                        />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="w-full md:w-1/2 relative">
                  <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-8 aspect-video flex items-center justify-center shadow-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
                    <step.icon size={120} className="text-pink-500/20 absolute" />
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center relative z-10 font-playfair italic text-black">
                      Step {step.number}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-8 mt-16 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to start earning bounties?</h2>
            <p className="text-gray-600 mb-6">Browse available properties with bounty incentives and start connecting buyers and sellers.</p>
            <Link to="/search">
              <Button className="px-8 py-6 h-auto text-lg relative bg-white text-black border border-transparent hover:bg-white group">
                Browse Bounties
                <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" 
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #D946EF, #FF3CAC 20%, #FF5C00 40%, #FF9004 60%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }} 
                />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default GuideWholesale;

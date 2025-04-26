
import React from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Users, ClipboardCheck, Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const GuideBuying: React.FC = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      number: 1,
      title: 'Find a property you love',
      description: 'Browse our selection of below-market value properties. Use filters to narrow down your search based on location, price, and property features.',
      icon: Search,
      link: '/search',
      linkText: 'Browse Properties',
      image: '/lovable-uploads/81056460-1bf7-455a-a7cc-82acf5437124.png'
    },
    {
      number: 2,
      title: 'Join the waitlist to contact sellers directly',
      description: "When you find a property you're interested in, join its waitlist to get direct access to the seller. This gives you an opportunity to ask questions and express your interest.",
      icon: Users,
      link: '/search',
      linkText: 'Discover Properties',
      image: '/lovable-uploads/eb2621fe-525a-410a-9d88-b71c65cc68b6.png'
    },
    {
      number: 3,
      title: 'Send in an offer',
      description: "Once you've found your ideal property and connected with the seller, submit your offer directly through our platform. You can negotiate terms and make contingent offers.",
      icon: ClipboardCheck,
      link: '/dashboard',
      linkText: 'View Your Dashboard',
      image: '/lovable-uploads/4b0c9c1d-4067-4573-b666-7eece05c5509.png'
    },
    {
      number: 4,
      title: 'Get the keys',
      description: 'After your offer is accepted, complete the transaction process and receive the keys to your new home. Congratulations on your below-market purchase!',
      icon: Key,
      link: '/faq',
      linkText: 'Read FAQs',
      image: '/lovable-uploads/06ff0e76-d135-430a-8f8e-c8b0e14f1141.png'
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
              How to <span className="font-playfair italic">Buy</span> with Realer Estate
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
            Follow these simple steps to find and purchase below-market properties through our platform.
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
                            backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
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
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img src={step.image} alt={step.title} className="w-full h-auto" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mt-16 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to find your dream home?</h2>
            <p className="text-gray-600 mb-6">Start browsing our selection of below-market value properties today.</p>
            <Link to="/search">
              <Button className="px-8 py-6 h-auto text-lg relative bg-white text-black border border-transparent hover:bg-white group">
                Browse Properties
                <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" 
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
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

export default GuideBuying;

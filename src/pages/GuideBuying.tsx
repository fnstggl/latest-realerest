import React from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Users, ClipboardCheck, Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  linkText: string;
}

const GuideBuying: React.FC = () => {
  const navigate = useNavigate();
  
  const steps: Step[] = [{
    number: 1,
    title: 'Find a property you love',
    description: 'Browse our selection of below-market value properties. Use filters to narrow down your search based on location, price, and property features.',
    icon: Search,
    link: '/search',
    linkText: 'Browse Properties'
  }, {
    number: 2,
    title: 'Join the waitlist to contact sellers directly',
    description: "When you find a property you're interested in, join its waitlist to get direct access to the seller. This gives you an opportunity to ask questions and express your interest.",
    icon: Users,
    link: '/search',
    linkText: 'Discover Properties'
  }, {
    number: 3,
    title: 'Send in an offer',
    description: "Once you've found your ideal property and connected with the seller, submit your offer directly through our platform. You can negotiate terms and make contingent offers.",
    icon: ClipboardCheck,
    link: '/dashboard',
    linkText: 'View Your Dashboard'
  }, {
    number: 4,
    title: 'Get the keys',
    description: 'After your offer is accepted, complete the transaction process and receive the keys to your new home. Congratulations on your below-market purchase!',
    icon: Key,
    link: '/faq',
    linkText: 'Read FAQs'
  }];

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <motion.h1 initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5
          }} className="text-3xl md:text-4xl font-futura-extra-bold">
              <span className="font-futura-extra-bold">How to </span>
              <span className="font-playfair italic font-bold">Buy</span>
              <span className="font-futura-extra-bold"> with Realer Estate</span>
            </motion.h1>
            
            <Button variant="ghost" onClick={() => navigate('/guide')} className="flex items-center gap-2">
              <ArrowLeft size={18} />
              <span>Back to Guides</span>
            </Button>
          </div>
          
          <motion.p initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }} className="text-gray-600 mb-12 text-lg">
            Follow these simple steps to find and purchase below-market properties through our platform.
          </motion.p>
          
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => <motion.div key={step.number} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1 * index + 0.2
          }} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}>
                <div className="w-full md:w-1/2 md:pr-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-transparent">
                      {step.icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                      <span className="font-playfair italic pr-2">Step {step.number}:</span>
                      {step.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{step.description}</p>
                    <Link to={step.link}>
                      <Button className="relative bg-white text-black border border-transparent hover:bg-white group">
                        {step.linkText}
                        <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" style={{
                          background: "transparent",
                          border: "2px solid transparent",
                          backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                          backgroundOrigin: "border-box",
                          backgroundClip: "border-box",
                          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude"
                        }} />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="w-full md:w-1/2 relative">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img 
                      alt={`Step ${step.number}`} 
                      className="w-full h-auto" 
                      src={index === 0 ? "/lovable-uploads/637849fa-cf2e-4528-a247-557df386b00e.png" : 
                           index === 1 ? "/lovable-uploads/8fc09b02-e367-4b00-9a0e-0018170f60cf.png" :
                           index === 2 ? "/lovable-uploads/57567df8-e8fd-4f5d-b8d2-23355d03943d.png" :
                           "/lovable-uploads/de1d274a-66c9-4a26-9d63-797cc1438d18.png"}
                    />
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default GuideBuying;

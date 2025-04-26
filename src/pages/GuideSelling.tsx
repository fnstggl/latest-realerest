import React from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ListPlus, MessageCircle, CheckCircle, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const GuideSelling: React.FC = () => {
  const navigate = useNavigate();
  const steps = [{
    number: 1,
    title: 'List your property',
    description: 'Create your property listing with details, photos, and set your below-market price. Add a bounty incentive to sell even faster and attract more interest from wholesalers.',
    icon: ListPlus,
    link: '/sell/create',
    linkText: 'List Your Property'
  }, {
    number: 2,
    title: 'Contact interested buyers',
    description: 'Receive direct messages from pre-screened, verified buyers interested in your property. Negotiate and answer questions in real-time through our secure platform.',
    icon: MessageCircle,
    link: '/messages',
    linkText: 'Check Messages'
  }, {
    number: 3,
    title: 'Accept an offer',
    description: 'Review offers from multiple buyers, select the best one for your situation. Our platform makes it easy to accept offers and move forward with the transaction.',
    icon: CheckCircle,
    link: '/dashboard',
    linkText: 'View Your Dashboard'
  }, {
    number: 4,
    title: 'Sell your home',
    description: 'Complete the closing process and transfer ownership. Our platform helps guide you through each step to ensure a smooth and successful transaction.',
    icon: Home,
    link: '/faq',
    linkText: 'Read FAQs'
  }];

  return <div className="min-h-screen bg-[#FCFBF8]">
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
              How to <span className="font-playfair italic">Sell</span> with Realer Estate
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
            Follow these steps to list and sell your property quickly through our platform.
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
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-6' : 'md:pl-6'}`}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-black mb-4 bg-transparent">
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
                        <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" style={{
                      background: "transparent",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(90deg, #6C42F5, #D946EF 20%, #FF3CAC 40%, #FF5C00 60%)",
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
                  <img 
                    src="/placeholder.svg" 
                    alt={`Step ${step.number}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </motion.div>)}
          </div>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.7
        }} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to sell your property?</h2>
            <p className="text-gray-600 mb-6">List your property below market value and find buyers quickly.</p>
            <Link to="/sell/create">
              <Button className="px-8 py-6 h-auto text-lg relative bg-white text-black border border-transparent hover:bg-white group">
                List Your Property
                <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" style={{
                background: "transparent",
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(90deg, #6C42F5, #D946EF 20%, #FF3CAC 40%, #FF5C00 60%)",
                backgroundOrigin: "border-box",
                backgroundClip: "border-box",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude"
              }} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      <SiteFooter />
    </div>;
};

export default GuideSelling;

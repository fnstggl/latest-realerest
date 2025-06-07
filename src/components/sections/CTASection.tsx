
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import WaitlistButton from '@/components/WaitlistButton';
import { motion } from 'framer-motion';

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.section 
      className="py-20 bg-white border-t border-gray-100 relative overflow-hidden perspective-container"
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.2 }} 
      variants={fadeInUp}
    >
      <div className="container px-4 lg:px-8 mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#01204b] mb-4 font-editorial tracking-wide">
            But how are these homes actually <br className="hidden sm:block" />
            below-market?
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Properties are listed directly by homeowners - no agent fees, no hidden costs, no middlemen. Homeowners save on agent commissions and pass those savings on to you.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6 sm:p-8 mb-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Join the early access waitlist</h3>
            <p className="text-gray-700 mb-6">
              Get notified when new below-market properties become available in your area. Be the first to know about these exclusive deals.
            </p>
            <WaitlistButton />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/search')} 
              className="glass-button font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
            >
              Browse Properties
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/about')} 
              className="font-bold"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;

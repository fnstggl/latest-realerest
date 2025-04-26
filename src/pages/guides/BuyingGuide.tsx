
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GuideStep } from '@/components/guide/GuideStep';
import { ArrowLeft, Home, ListChecks, Send, Key } from 'lucide-react';

const BuyingGuide = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/guides');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 relative">
      <button 
        onClick={handleGoBack} 
        className="absolute top-4 left-4 text-gray-700 hover:text-black transition-colors"
      >
        <ArrowLeft size={32} />
      </button>

      <h1 className="text-4xl font-playfair font-bold italic text-center mb-12">
        How to Buy Properties
      </h1>
      
      <GuideStep
        number={1}
        position="left"
        title="Find a property you love"
        icon={<Home className="w-12 h-12 text-blue-600 mb-4" />}
        description={
          `Browse through our curated selection of below-market properties. Use our advanced filters to find properties that match your criteria. ${
            `Visit our `
          } property search page to get started.`
        }
      />
      
      <GuideStep
        number={2}
        position="right"
        title="Join the waitlist to contact Sellers directly"
        icon={<ListChecks className="w-12 h-12 text-blue-600 mb-4" />}
        description="Get direct access to property owners through our platform. No middlemen or unnecessary fees - just direct communication with motivated sellers."
      />
      
      <GuideStep
        number={3}
        position="left"
        title="Send in an offer"
        icon={<Send className="w-12 h-12 text-blue-600 mb-4" />}
        description="Submit your offer directly through our platform. Our streamlined process makes it easy to negotiate and reach an agreement with the seller."
      />

      <GuideStep
        number={4}
        position="right"
        title="Get the keys"
        icon={<Key className="w-12 h-12 text-blue-600 mb-4" />}
        description="Close the deal and get your new property. Our platform helps facilitate the transaction while letting you maintain control of the process."
      />
      
      <div className="text-center mt-12">
        <Link to="/search" className="text-blue-600 hover:text-black font-medium transition-colors">
          Start browsing properties →
        </Link>
      </div>
    </div>
  );
};

export default BuyingGuide;

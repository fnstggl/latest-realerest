
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GuideStep } from '@/components/guide/GuideStep';
import { ArrowLeft, Home, ListChecks, Send, Key } from 'lucide-react';
import Navbar from '@/components/Navbar';

const BuyingGuide = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/guides');
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12 space-y-16">
        <div className="flex items-center gap-8 mb-12">
          <button 
            onClick={handleGoBack} 
            className="text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <h1 className="text-4xl font-playfair font-bold italic">
            How to Buy Properties
          </h1>
        </div>
        
        <GuideStep 
          number={1} 
          position="left" 
          title="Find a Property You Love" 
          icon={<Home className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            <>
              Browse through our curated selection of below-market properties. Use our advanced 
              filters to find properties that match your criteria.{' '}
              <Link to="/search" className="text-blue-600 hover:text-blue-800 underline">
                Start your search →
              </Link>
            </>
          }
        />
        
        <GuideStep 
          number={2} 
          position="right" 
          title="Join the Waitlist" 
          icon={<ListChecks className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            <>
              Get direct access to property owners through our platform. No middlemen or 
              unnecessary fees.{' '}
              <Link to="/blog/buyer-benefits" className="text-blue-600 hover:text-blue-800 underline">
                Learn about buyer benefits →
              </Link>
            </>
          }
        />
        
        <GuideStep 
          number={3} 
          position="left" 
          title="Send in an Offer" 
          icon={<Send className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            <>
              Submit your offer directly through our platform. Our streamlined process makes 
              it easy to negotiate and reach an agreement.{' '}
              <Link to="/blog/making-offers" className="text-blue-600 hover:text-blue-800 underline">
                Tips for making offers →
              </Link>
            </>
          }
        />

        <GuideStep 
          number={4} 
          position="right" 
          title="Get the Keys" 
          icon={<Key className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            <>
              Close the deal and get your new property. Our platform helps facilitate the 
              transaction while letting you maintain control.{' '}
              <Link to="/blog/closing-checklist" className="text-blue-600 hover:text-blue-800 underline">
                Closing checklist →
              </Link>
            </>
          }
        />

        <div className="text-center mt-12">
          <Link to="/search" className="text-blue-600 hover:text-black font-medium transition-colors">
            Start browsing properties →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyingGuide;

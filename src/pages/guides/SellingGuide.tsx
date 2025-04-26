
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GuideStep } from '@/components/guide/GuideStep';
import { ArrowLeft, ListOrdered, Users, Check, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';

const SellingGuide = () => {
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
            How to Sell Properties
          </h1>
        </div>
        
        <GuideStep 
          number={1} 
          position="left" 
          title="List Your Property" 
          icon={<ListOrdered className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            <>
              Create a detailed listing with high-quality photos. Add a bounty incentive to 
              attract more buyers and sell faster.{' '}
              <Link to="/sell/create" className="text-blue-600 hover:text-blue-800 underline">
                Create your listing →
              </Link>
            </>
          }
        />
        
        <GuideStep 
          number={2} 
          position="right" 
          title="Contact Interested Buyers" 
          icon={<Users className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            <>
              Receive and respond to inquiries from qualified buyers. Our platform helps you 
              manage conversations efficiently.{' '}
              <Link to="/blog/screening-buyers" className="text-blue-600 hover:text-blue-800 underline">
                Tips for screening buyers →
              </Link>
            </>
          }
        />
        
        <GuideStep 
          number={3} 
          position="left" 
          title="Accept Offer" 
          icon={<Check className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            <>
              Review and accept the best offer. Our platform helps you evaluate offers and 
              negotiate terms with potential buyers.{' '}
              <Link to="/blog/negotiating-tips" className="text-blue-600 hover:text-blue-800 underline">
                Negotiation strategies →
              </Link>
            </>
          }
        />

        <GuideStep 
          number={4} 
          position="right" 
          title="Close the Deal" 
          icon={<Home className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            <>
              Complete the sale and transfer ownership. Our platform guides you through the 
              closing process while maintaining transparency.{' '}
              <Link to="/blog/closing-process" className="text-blue-600 hover:text-blue-800 underline">
                Learn about closing →
              </Link>
            </>
          }
        />

        <div className="text-center mt-12">
          <Link to="/sell/create" className="text-blue-600 hover:text-black font-medium transition-colors">
            Create your listing →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellingGuide;

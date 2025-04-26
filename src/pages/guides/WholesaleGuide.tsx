
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GuideStep } from '@/components/guide/GuideStep';
import { ArrowLeft, Banknote, UserPlus, SearchCheck, DollarSign } from 'lucide-react';
import Navbar from '@/components/Navbar';

const WholesaleGuide = () => {
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
            How to Wholesale Properties
          </h1>
        </div>
        
        <GuideStep 
          number={1} 
          position="left" 
          title="Find Bounties to Accept" 
          icon={<SearchCheck className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            "Search through our curated properties with bounties. These are sellers offering incentives for bringing buyers."
          }
        />
        
        <GuideStep 
          number={2} 
          position="right" 
          title="Bring an Interested Buyer" 
          icon={<UserPlus className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            "Connect with investors in your network or find new buyers through our platform. Use our contract templates to secure the deal."
          }
        />
        
        <GuideStep 
          number={3} 
          position="left" 
          title="Get Deal to Closing" 
          icon={<Banknote className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            "Work with the seller and buyer to complete the transaction. Our platform helps facilitate a smooth closing process."
          }
        />

        <GuideStep 
          number={4} 
          position="right" 
          title="Get Paid" 
          icon={<DollarSign className="w-12 h-12 text-blue-600 mb-4" />}
          description={
            "Receive your bounty payment once the deal closes. Track your earnings and manage your wholesale deals through our platform."
          }
        />

        <div className="text-center mt-12">
          <span className="text-blue-600 font-medium">
            Start finding bounties
          </span>
        </div>
      </div>
    </div>
  );
};

export default WholesaleGuide;

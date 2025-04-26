
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GuideStep } from '@/components/guide/GuideStep';
import { ArrowLeft } from 'lucide-react';

const WholesaleGuide = () => {
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
        How to Wholesale Properties
      </h1>
      
      <GuideStep
        number={1}
        position="left"
        title="Find Deals"
        description="Search for properties with significant equity or motivated sellers. Our platform provides access to below-market properties that could be perfect for wholesaling opportunities."
      />
      
      <GuideStep
        number={2}
        position="right"
        title="Secure the Contract"
        description="Once you've identified a property, negotiate with the seller to get it under contract. Make sure to include assignment clauses that allow you to transfer the contract to another buyer."
      />
      
      <GuideStep
        number={3}
        position="left"
        title="Find Your Buyer"
        description={
          `Market the property to your network of buyers or find new buyers through our platform. ${
            `Connect with investors `
          } who are actively looking for deals.`
        }
      />
      
      <div className="text-center mt-12">
        <Link to="/search" className="text-blue-600 hover:text-black font-medium transition-colors">
          Start finding deals →
        </Link>
      </div>
    </div>
  );
};

export default WholesaleGuide;

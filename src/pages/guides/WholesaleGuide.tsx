
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GuideStep } from '@/components/guide/GuideStep';
import { ArrowLeft, Search, Users, Check, DollarSign } from 'lucide-react';

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
        title="Find bounty to accept"
        icon={<Search className="w-12 h-12 text-blue-600 mb-4" />}
        description="Search for properties with significant equity or motivated sellers. Our platform provides access to below-market properties that could be perfect for wholesaling opportunities."
      />
      
      <GuideStep
        number={2}
        position="right"
        title="Bring an interested buyer to the deal"
        icon={<Users className="w-12 h-12 text-blue-600 mb-4" />}
        description="Market the property to your network of buyers or find new buyers through our platform. Connect with investors who are actively looking for deals."
      />
      
      <GuideStep
        number={3}
        position="left"
        title="Get deal to closing"
        icon={<Check className="w-12 h-12 text-blue-600 mb-4" />}
        description="Facilitate the transaction between the seller and your buyer. Ensure all parties are aligned and the deal moves smoothly towards closing."
      />

      <GuideStep
        number={4}
        position="right"
        title="Get paid"
        icon={<DollarSign className="w-12 h-12 text-blue-600 mb-4" />}
        description="Collect your wholesale fee once the deal closes. Our platform helps ensure a transparent and efficient process for all parties involved."
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

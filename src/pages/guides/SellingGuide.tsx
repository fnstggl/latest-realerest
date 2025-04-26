
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GuideStep } from '@/components/guide/GuideStep';
import { ArrowLeft, ListOrdered, Users, Check, Home } from 'lucide-react';

const SellingGuide = () => {
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
        How to Sell Properties
      </h1>
      
      <GuideStep
        number={1}
        position="left"
        title="List your property"
        icon={<ListOrdered className="w-12 h-12 text-blue-600 mb-4" />}
        description="Create a detailed listing for your property, including high-quality photos and an attractive incentive to sell faster. Our platform makes it easy to showcase your property to motivated buyers."
      />
      
      <GuideStep
        number={2}
        position="right"
        title="Contact interested buyers"
        icon={<Users className="w-12 h-12 text-blue-600 mb-4" />}
        description="Receive and respond to inquiries from qualified buyers directly through our platform. Our streamlined communication system helps you manage conversations efficiently."
      />
      
      <GuideStep
        number={3}
        position="left"
        title="Accept offer"
        icon={<Check className="w-12 h-12 text-blue-600 mb-4" />}
        description="Review and accept the best offer for your property. Our platform helps you evaluate offers and negotiate terms with potential buyers."
      />

      <GuideStep
        number={4}
        position="right"
        title="Sell home"
        icon={<Home className="w-12 h-12 text-blue-600 mb-4" />}
        description="Complete the sale and transfer ownership. Our platform guides you through the closing process while maintaining transparency and efficiency."
      />
      
      <div className="text-center mt-12">
        <Link to="/sell/create" className="text-blue-600 hover:text-black font-medium transition-colors">
          Create your listing →
        </Link>
      </div>
    </div>
  );
};

export default SellingGuide;

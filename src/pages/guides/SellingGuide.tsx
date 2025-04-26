
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GuideStep } from '@/components/guide/GuideStep';
import { ArrowLeft } from 'lucide-react';

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
        title="List Your Property"
        description={
          `Create a detailed listing for your property, including high-quality photos and accurate information. Our platform makes it easy to showcase your property to motivated buyers. ${
            `Visit our `
          } property listing page to get started.`
        }
      />
      
      <GuideStep
        number={2}
        position="right"
        title="Set Your Price"
        description="Determine your below-market price point that will attract serious buyers while still meeting your financial goals. Our platform provides market insights to help you price competitively."
      />
      
      <GuideStep
        number={3}
        position="left"
        title="Connect with Buyers"
        description="Receive and respond to inquiries from interested buyers directly through our platform. Our streamlined communication system helps you manage conversations and track potential deals efficiently."
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

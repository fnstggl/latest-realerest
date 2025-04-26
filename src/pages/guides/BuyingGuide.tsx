
import React from 'react';
import { Link } from 'react-router-dom';
import { GuideStep } from '@/components/guide/GuideStep';

const BuyingGuide = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      <h1 className="text-4xl font-playfair font-bold italic text-center mb-12">
        How to Buy Properties
      </h1>
      
      <GuideStep
        number={1}
        position="left"
        title="Browse Available Properties"
        description={
          `Start your journey by exploring our curated selection of below-market properties. Use our advanced filters to find properties that match your criteria. ${
            `Visit our `
          } property search page to get started.`
        }
      />
      
      <GuideStep
        number={2}
        position="right"
        title="Contact Sellers Directly"
        description="Once you've found a property you're interested in, reach out to the seller directly through our platform. No middlemen or unnecessary fees - just direct communication with the property owner."
      />
      
      <GuideStep
        number={3}
        position="left"
        title="Close the Deal"
        description="After negotiating terms with the seller, proceed with the standard closing process. Our platform helps facilitate the transaction while letting you maintain control of the process."
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

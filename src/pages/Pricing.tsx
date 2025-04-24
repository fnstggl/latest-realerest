import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingTier = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  buttonLink, 
  highlighted = false 
}: { 
  title: string; 
  price: string; 
  description: string; 
  features: string[]; 
  buttonText: string; 
  buttonLink: string; 
  highlighted?: boolean;
}) => (
  <div className={`border-4 border-black p-8 ${highlighted ? 'shadow-[8px_8px_0px_0px_rgba(214,0,19,1)]' : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'} bg-white`}>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <div className="mb-4">
      <span className="text-4xl font-bold">{price}</span>
      {price !== 'Free' && <span className="text-gray-600">/month</span>}
    </div>
    <p className="mb-6 text-gray-700">{description}</p>
    
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <CheckCircle2 size={20} className={`mr-2 mt-1 ${highlighted ? 'text-[#d60013]' : 'text-black'}`} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    
    <Button 
      asChild
      className={`w-full font-bold ${highlighted ? 'neo-button-primary' : 'neo-button bg-white'}`}
      variant={highlighted ? 'default' : 'outline'}
    >
      <Link to={buttonLink}>{buttonText}</Link>
    </Button>
  </div>
);

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl max-w-3xl mx-auto">Choose the plan that fits your needs. No hidden fees, no surprises.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PricingTier
              title="Basic"
              price="Free"
              description="Perfect for browsing available properties."
              features={[
                "Browse listings",
                "Create account",
                "Join property waitlists",
                "Email notifications",
                "View property details"
              ]}
              buttonText="Get Started"
              buttonLink="/signup"
            />
            
            <PricingTier
              title="Premium"
              price="$19.99"
              description="For serious homebuyers ready to make a move."
              features={[
                "Everything in Basic",
                "Early access to new listings",
                "Unlimited waitlist requests",
                "Property price history",
                "Direct messaging with sellers",
                "Personalized property alerts"
              ]}
              buttonText="Upgrade Now"
              buttonLink="/signup?plan=premium"
              highlighted={true}
            />
            
            <PricingTier
              title="Pro Seller"
              price="$29.99"
              description="For property owners looking to sell quickly."
              features={[
                "List unlimited properties",
                "Featured listing placement",
                "Detailed buyer insights",
                "Professional listing optimization",
                "Priority support",
                "Transaction management tools"
              ]}
              buttonText="List Your Property"
              buttonLink="/signup?plan=seller"
            />
          </div>
          
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <h3 className="text-xl font-bold mb-3">Can I cancel my subscription anytime?</h3>
                <p>Yes, you can cancel your subscription at any time. Your benefits will continue until the end of your billing period.</p>
              </div>
              
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <h3 className="text-xl font-bold mb-3">Is there a fee when I buy or sell a property?</h3>
                <p>Unlike traditional brokers, we charge a low flat fee of 1% for completed transactions, saving you thousands compared to the typical 5-6% commission.</p>
              </div>
              
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <h3 className="text-xl font-bold mb-3">Do I need a paid plan to list my property?</h3>
                <p>You can list one property with a free account, but our Pro Seller plan offers more features and unlimited listings.</p>
              </div>
              
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <h3 className="text-xl font-bold mb-3">How do I upgrade my plan?</h3>
                <p>Simply go to your account settings and select "Manage Subscription" to upgrade to a different plan at any time.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;

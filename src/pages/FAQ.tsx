
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'buyers' | 'sellers' | 'listings' | 'account';
}

const faqs: FAQItem[] = [
  {
    question: "What is DoneDeal?",
    answer: "DoneDeal is a platform that connects buyers with sellers offering properties below market value. We eliminate traditional barriers that typically exist in real estate transactions, creating a more direct and affordable way to buy and sell properties.",
    category: 'general'
  },
  {
    question: "How does DoneDeal differ from traditional real estate platforms?",
    answer: "Unlike traditional platforms, DoneDeal specializes in below-market properties and direct seller-to-buyer connections. We have a unique waitlist system that helps serious buyers connect with sellers, and sellers can control who views their property details.",
    category: 'general'
  },
  {
    question: "How do I find properties below market value?",
    answer: "You can browse our listings directly or use our search function to filter properties by location, price range, and percentage below market value. Each listing clearly shows how much below market value the property is priced.",
    category: 'buyers'
  },
  {
    question: "What is the waitlist feature?",
    answer: "When you find a property you're interested in, you can join the waitlist by providing your contact information. The seller then reviews waitlist requests and approves buyers they want to connect with. Once approved, you'll see the full property details and can contact the seller directly.",
    category: 'buyers'
  },
  {
    question: "How do I know these properties are actually below market value?",
    answer: "Sellers are required to provide comparable properties and market data when listing. Our system validates these comparables to ensure accuracy. Additionally, each listing shows both the asking price and the calculated market value.",
    category: 'buyers'
  },
  {
    question: "How do I list my property on DoneDeal?",
    answer: "Simply create a seller account, click on 'List Your Property' and follow the step-by-step process. You'll need to provide details about your property, set your price, upload photos, and provide comparable properties to verify the market value.",
    category: 'sellers'
  },
  {
    question: "Why should I list my property below market value?",
    answer: "Listing below market value can attract more potential buyers, lead to faster sales, and often results in simpler transactions with fewer contingencies. By pricing strategically, you can save money on carrying costs and potentially avoid months of your property sitting on the market.",
    category: 'sellers'
  },
  {
    question: "How does the waitlist system benefit me as a seller?",
    answer: "The waitlist system lets you review interested buyers and choose who can see your full property details. This helps screen out non-serious inquiries and protects your privacy. You can also see buyer profiles before deciding to connect with them.",
    category: 'sellers'
  },
  {
    question: "Can I change or update my listing after it's published?",
    answer: "Yes, you can update your listing at any time from your dashboard. You can change the price, update photos, modify the description, or make any other changes you need.",
    category: 'listings'
  },
  {
    question: "How long do listings stay active on DoneDeal?",
    answer: "Standard listings remain active for 90 days, after which you can easily renew them if the property hasn't sold.",
    category: 'listings'
  },
  {
    question: "Can I delete my account?",
    answer: "Yes, you can delete your account at any time from your account settings. If you have active listings, you'll be prompted to either close or transfer them before the account deletion is completed.",
    category: 'account'
  }
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl max-w-2xl mx-auto">Find answers to common questions about using DoneDeal to buy or sell properties.</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-8">
              <Input
                type="text"
                placeholder="Search FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-0 focus:border-black"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <Button 
                className={`font-bold text-sm py-1 px-3 ${activeCategory === 'all' ? 'bg-[#d60013] text-white' : 'bg-white text-black'} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all`}
                onClick={() => setActiveCategory('all')}
              >
                All
              </Button>
              <Button 
                className={`font-bold text-sm py-1 px-3 ${activeCategory === 'general' ? 'bg-[#d60013] text-white' : 'bg-white text-black'} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all`}
                onClick={() => setActiveCategory('general')}
              >
                General
              </Button>
              <Button 
                className={`font-bold text-sm py-1 px-3 ${activeCategory === 'buyers' ? 'bg-[#d60013] text-white' : 'bg-white text-black'} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all`}
                onClick={() => setActiveCategory('buyers')}
              >
                For Buyers
              </Button>
              <Button 
                className={`font-bold text-sm py-1 px-3 ${activeCategory === 'sellers' ? 'bg-[#d60013] text-white' : 'bg-white text-black'} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all`}
                onClick={() => setActiveCategory('sellers')}
              >
                For Sellers
              </Button>
              <Button 
                className={`font-bold text-sm py-1 px-3 ${activeCategory === 'listings' ? 'bg-[#d60013] text-white' : 'bg-white text-black'} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all`}
                onClick={() => setActiveCategory('listings')}
              >
                Listings
              </Button>
              <Button 
                className={`font-bold text-sm py-1 px-3 ${activeCategory === 'account' ? 'bg-[#d60013] text-white' : 'bg-white text-black'} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all`}
                onClick={() => setActiveCategory('account')}
              >
                Account
              </Button>
            </div>
            
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <div key={index} className={`border-b-2 border-black last:border-b-0`}>
                    <div 
                      className={`p-6 cursor-pointer flex justify-between items-center ${activeIndex === index ? 'bg-gray-50' : ''}`}
                      onClick={() => toggleFAQ(index)}
                    >
                      <h3 className="font-bold text-lg pr-8">{faq.question}</h3>
                      {activeIndex === index ? (
                        <ChevronUp className="flex-shrink-0 text-[#d60013]" />
                      ) : (
                        <ChevronDown className="flex-shrink-0" />
                      )}
                    </div>
                    
                    {activeIndex === index && (
                      <div className="p-6 pt-0">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="mb-4">No FAQs match your search criteria.</p>
                  <Button 
                    variant="link" 
                    className="text-[#d60013] font-bold"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-12 text-center">
              <p className="mb-4">Still have questions?</p>
              <Button asChild className="neo-button-primary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default FAQ;

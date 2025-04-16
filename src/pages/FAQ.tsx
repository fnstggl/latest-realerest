
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "What is Realer Estate?",
      answer: "Realer Estate is a platform that connects buyers directly with sellers offering properties below market value, eliminating middlemen and reducing costs for everyone involved."
    },
    {
      question: "How does Realer Estate make money?",
      answer: "We charge a flat 1% fee on completed property transactions, which is significantly lower than traditional real estate commissions (typically 5-6%)."
    },
    {
      question: "Are properties on Realer Estate guaranteed to be below market value?",
      answer: "While our platform focuses on below-market-value properties, we cannot guarantee that all listings will be below market value as market conditions may change. We encourage buyers to do their own research and due diligence."
    },
    {
      question: "How do I list my property?",
      answer: "To list your property, create an account, click on 'Sell' in the navigation menu, and follow the steps to complete your listing. You'll need to provide details about your property, set your asking price, and upload photos."
    },
    {
      question: "How do I make an offer on a property?",
      answer: "Once you've found a property you're interested in, you can make an offer directly through our platform. Simply click the 'Make Offer' button on the property listing page, enter your offer amount, and submit."
    },
    {
      question: "Is Realer Estate available nationwide?",
      answer: "Yes, Realer Estate is available across the United States. We're constantly expanding our reach to serve more markets effectively."
    },
    {
      question: "How does the offer process work?",
      answer: "When you make an offer, the seller is notified immediately. They can accept, decline, or counter your offer. If they accept, you'll be connected to complete the transaction. Our platform facilitates the initial negotiation process, but the final closing is handled outside our platform."
    },
    {
      question: "Do I need a real estate agent to use Realer Estate?",
      answer: "No, you don't need a real estate agent to use our platform. However, you're welcome to involve one if you prefer. Our platform is designed to be user-friendly for both buyers and sellers to connect directly."
    },
    {
      question: "What if I have a dispute with a buyer/seller?",
      answer: "We encourage open communication through our platform's messaging system. If you encounter issues that can't be resolved directly, please contact our support team who will assist in mediating the situation."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security very seriously. We use industry-standard encryption and security practices to protect your personal information. Please review our Privacy Policy for more details."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Find answers to the most common questions about Realer Estate.</p>
          </div>
          
          <Card className="border-none shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">General Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-bold text-[#0892D0]">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Still have questions?</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-gray-700 mb-6">Our support team is here to help with any other questions you might have.</p>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 rounded-md bg-[#0892D0] text-white font-medium hover:bg-[#077fb4] transition-colors"
                >
                  Contact Support
                </a>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default FAQ;

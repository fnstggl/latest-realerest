
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-12 border-b-4 border-black pb-6">
            <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-700">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">1. Introduction</h2>
              <p className="mb-4">
                Welcome to DoneDeal. By accessing or using our website, mobile application, or services, you agree to be bound by these Terms of Service.
              </p>
              <p>
                If you do not agree with any part of these terms, you may not use our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">2. Definitions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>"Company", "We", "Us", "Our"</strong> refers to DoneDeal.</li>
                <li><strong>"Platform"</strong> refers to our website, mobile applications, and services.</li>
                <li><strong>"User", "You", "Your"</strong> refers to individuals who access or use our Platform.</li>
                <li><strong>"Buyer"</strong> refers to Users seeking to purchase properties.</li>
                <li><strong>"Seller"</strong> refers to Users listing properties for sale.</li>
                <li><strong>"Listing"</strong> refers to property information posted on our Platform.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">3. Account Registration</h2>
              <p className="mb-4">
                To access certain features of our Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p className="mb-4">
                You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              <p>
                We reserve the right to disable any user account at any time if, in our opinion, you have failed to comply with these Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">4. Platform Usage</h2>
              <p className="mb-4">
                Our Platform connects property buyers with sellers offering below-market-value properties. We do not guarantee that all listings will be below market value, as market conditions may change.
              </p>
              <p className="mb-4">
                As a Seller, you are responsible for the accuracy of your listings. You agree not to post false or misleading information about properties.
              </p>
              <p>
                As a Buyer, you acknowledge that property details are provided by Sellers and that we cannot guarantee their accuracy. We recommend that you conduct your own due diligence before making any purchase decisions.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">5. Fees and Payments</h2>
              <p className="mb-4">
                We offer both free and paid subscription plans. The details of each plan are available on our Pricing page.
              </p>
              <p className="mb-4">
                For completed property transactions, we charge a flat fee of 1% of the final sale price. This fee is lower than traditional real estate commissions.
              </p>
              <p>
                All fees are subject to change. We will provide notice of any fee changes through our Platform.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">6. Prohibited Activities</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use our Platform for any illegal purpose or in violation of any laws</li>
                <li>Post false, inaccurate, misleading, or offensive content</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the operation of our Platform</li>
                <li>Attempt to gain unauthorized access to any portion of our Platform</li>
                <li>Collect or store personal data about other users without their consent</li>
                <li>Use our Platform to send unsolicited communications</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">7. Intellectual Property</h2>
              <p className="mb-4">
                All content on our Platform, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the property of DoneDeal or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, modify, distribute, or create derivative works based on our content without our express written permission.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">8. Limitation of Liability</h2>
              <p className="mb-4">
                To the maximum extent permitted by law, DoneDeal shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
              </p>
              <p>
                We are not responsible for the actions or content of third parties, including Sellers and Buyers on our Platform.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">9. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on our Platform. Your continued use of our Platform after such modifications constitutes your acceptance of the revised Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">10. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at legal@donedeal.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;

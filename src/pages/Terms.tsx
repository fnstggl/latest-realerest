
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms: React.FC = () => {
  return <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="max-w-4xl mx-auto">
          <Card className="mb-8 border-none shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-4xl font-bold">Terms of Service</CardTitle>
              <p className="text-lg text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">1. Introduction</h2>
                  <p className="mb-4 text-gray-700">Welcome to Realer Estate. By accessing or using our website, mobile application, or services, you agree to be bound by these Terms of Service.</p>
                  <p className="text-gray-700">
                    If you do not agree with any part of these terms, you may not use our services.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">2. Definitions</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li className=""><strong>"Company", "We", "Us", "Our"</strong> refers to Realer Estate.</li>
                    <li><strong>"Platform"</strong> refers to our website, mobile applications, and services.</li>
                    <li><strong>"User", "You", "Your"</strong> refers to individuals who access or use our Platform.</li>
                    <li><strong>"Buyer"</strong> refers to Users seeking to purchase properties.</li>
                    <li><strong>"Seller"</strong> refers to Users listing properties for sale.</li>
                    <li><strong>"Listing"</strong> refers to property information posted on our Platform.</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">3. Account Registration</h2>
                  <p className="mb-4 text-gray-700">
                    To access certain features of our Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                  </p>
                  <p className="mb-4 text-gray-700">
                    You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                  </p>
                  <p className="text-gray-700">
                    We reserve the right to disable any user account at any time if, in our opinion, you have failed to comply with these Terms.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">4. Platform Usage</h2>
                  <p className="mb-4 text-gray-700">
                    Our Platform connects property buyers with sellers offering below-market-value properties. We do not guarantee that all listings will be below market value, as market conditions may change.
                  </p>
                  <p className="mb-4 text-gray-700">
                    As a Seller, you are responsible for the accuracy of your listings. You agree not to post false or misleading information about properties.
                  </p>
                  <p className="text-gray-700">
                    As a Buyer, you acknowledge that property details are provided by Sellers and that we cannot guarantee their accuracy. We recommend that you conduct your own due diligence before making any purchase decisions.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">5. Fees and Payments</h2>
                  <p className="mb-4 text-gray-700">
                    We offer both free and paid subscription plans. The details of each plan are available on our Pricing page.
                  </p>
                  <p className="mb-4 text-gray-700">
                    For completed property transactions, we charge a flat fee of 1% of the final sale price. This fee is lower than traditional real estate commissions.
                  </p>
                  <p className="text-gray-700">
                    All fees are subject to change. We will provide notice of any fee changes through our Platform.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">6. Prohibited Activities</h2>
                  <p className="mb-4 text-gray-700">You agree not to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
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
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">7. Intellectual Property</h2>
                  <p className="mb-4 text-gray-700">All content on our Platform, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the property of Realer Estate or its licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
                  <p className="text-gray-700">
                    You may not reproduce, modify, distribute, or create derivative works based on our content without our express written permission.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">8. Limitation of Liability</h2>
                  <p className="mb-4 text-gray-700">To the maximum extent permitted by law, Realer Estate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.</p>
                  <p className="text-gray-700">
                    We are not responsible for the actions or content of third parties, including Sellers and Buyers on our Platform.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">9. Modifications to Terms</h2>
                  <p className="text-gray-700">
                    We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on our Platform. Your continued use of our Platform after such modifications constitutes your acceptance of the revised Terms.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">10. Contact Information</h2>
                  <p className="text-gray-700">If you have any questions about these Terms, please contact us at legal@realerestate.org.</p>
                </section>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>;
};
export default Terms;

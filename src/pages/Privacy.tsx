import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="mb-8 border-none shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-4xl font-bold">Privacy Policy</CardTitle>
              <p className="text-lg text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">1. Introduction</h2>
                  <p className="mb-4 text-gray-700">
                    At Realer Estate, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                  </p>
                  <p className="text-gray-700">
                    Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">2. Information We Collect</h2>
                  <p className="mb-4 text-gray-700">We may collect information about you in a variety of ways. The information we may collect includes:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, telephone number, and home address, that you voluntarily give to us when you register or when you choose to participate in various activities related to our platform.
                    </li>
                    <li>
                      <strong>Financial Data:</strong> Payment and billing information collected when you purchase a subscription or service.
                    </li>
                    <li>
                      <strong>Derivative Data:</strong> Information our servers automatically collect when you access our platform, such as your IP address, browser type, operating system, access times, and the pages you have viewed.
                    </li>
                    <li>
                      <strong>Mobile Device Data:</strong> Device information, such as your mobile device ID, model, and manufacturer, if you access our platform from a mobile device.
                    </li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">3. How We Use Your Information</h2>
                  <p className="mb-4 text-gray-700">We may use the information we collect about you for various purposes, including to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Create and manage your account</li>
                    <li>Process transactions and send related information</li>
                    <li>Send you administrative information, such as updates, security alerts, and support messages</li>
                    <li>Respond to customer service requests and support needs</li>
                    <li>Personalize your experience and deliver content and product offerings relevant to your interests</li>
                    <li>Administer promotions, contests, and surveys</li>
                    <li>Compile anonymous statistical data for research purposes</li>
                    <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">4. Disclosure of Your Information</h2>
                  <p className="mb-4 text-gray-700">We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      <strong>By Law or to Protect Rights:</strong> If we believe the release of information is necessary to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
                    </li>
                    <li>
                      <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service.
                    </li>
                    <li>
                      <strong>Marketing Communications:</strong> With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes.
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
                    </li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">5. Your Rights</h2>
                  <p className="mb-4 text-gray-700">You have certain rights regarding the personal information we collect about you:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      <strong>Access:</strong> You have the right to request a copy of the personal information we hold about you.
                    </li>
                    <li>
                      <strong>Rectification:</strong> You have the right to request that we correct any inaccurate personal information we hold about you.
                    </li>
                    <li>
                      <strong>Deletion:</strong> You have the right to request that we delete your personal information.
                    </li>
                    <li>
                      <strong>Opt-out:</strong> You can opt-out of receiving our marketing communications at any time.
                    </li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">6. Contact Us</h2>
                  <p className="text-gray-700">
                    If you have questions or comments about this Privacy Policy, please contact us at:
                    <br />
                    Email: privacy@realerestate.com
                    <br />
                    Phone: (929) 949-5634
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default Privacy;

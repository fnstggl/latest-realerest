
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Cookies: React.FC = () => {
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
          <Card className="mb-8 border-none shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-4xl font-bold">Cookie Policy</CardTitle>
              <p className="text-lg text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">1. What Are Cookies</h2>
                  <p className="mb-4 text-gray-700">
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
                  </p>
                  <p className="text-gray-700">
                    Cookies allow a website to recognize your device and remember if you've been to the website before. They can be temporary or permanent.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">2. How We Use Cookies</h2>
                  <p className="mb-4 text-gray-700">We use cookies on our website for a variety of reasons:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access.
                    </li>
                    <li>
                      <strong>Preference Cookies:</strong> These cookies allow our website to remember information that changes the way the website behaves or looks, like your preferred language or the region you are in.
                    </li>
                    <li>
                      <strong>Statistical Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </li>
                    <li>
                      <strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
                    </li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">3. Third-Party Cookies</h2>
                  <p className="mb-4 text-gray-700">
                    Some cookies are placed by third parties on our website. These third parties may include analytics providers, advertising networks, and social media platforms.
                  </p>
                  <p className="text-gray-700">
                    Third-party cookies enable third-party features or functionality to be provided on or through our website, such as advertising, interactive content, and analytics.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">4. Managing Cookies</h2>
                  <p className="mb-4 text-gray-700">
                    Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when cookies are being sent. The methods for doing so vary from browser to browser, and from version to version.
                  </p>
                  <p className="mb-4 text-gray-700">
                    However, if you disable cookies, some features of our website may not function properly or at all.
                  </p>
                  <p className="text-gray-700">
                    To find out more about how to manage cookies on your browser, you can visit:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                    <li>Chrome: <a href="https://support.google.com/chrome/answer/95647" className="text-[#0892D0] hover:underline">https://support.google.com/chrome/answer/95647</a></li>
                    <li>Firefox: <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-[#0892D0] hover:underline">https://support.mozilla.org/en-US/kb/cookies</a></li>
                    <li>Safari: <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-[#0892D0] hover:underline">https://support.apple.com/guide/safari/manage-cookies</a></li>
                    <li>Edge: <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-[#0892D0] hover:underline">https://support.microsoft.com/edge/delete-cookies</a></li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">5. Changes to This Cookie Policy</h2>
                  <p className="text-gray-700">
                    We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page. You are advised to review this Cookie Policy periodically for any changes.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-[#0892D0]">6. Contact Us</h2>
                  <p className="text-gray-700">
                    If you have any questions about our Cookie Policy, please contact us at:
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

export default Cookies;

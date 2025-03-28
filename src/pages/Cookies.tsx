
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const Cookies: React.FC = () => {
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
            <h1 className="text-5xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-xl text-gray-700">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">1. What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
              <p>
                Cookies help us enhance your experience on our Platform by remembering your preferences, understanding how you use our site, and offering personalized content and advertisements.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">2. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the Platform to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Preference Cookies</h3>
                  <p>
                    These cookies allow us to remember your settings and preferences, such as language and location, to provide a more personalized experience.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Analytics Cookies</h3>
                  <p>
                    We use analytics cookies to collect information about how visitors use our Platform, including which pages they visit most often and if they receive error messages. This helps us improve our Platform and your experience.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Marketing Cookies</h3>
                  <p>
                    These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. They can share this information with other organizations or advertisers.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">3. Third-Party Cookies</h2>
              <p className="mb-4">
                Some cookies are placed by third parties on our Platform. These third parties may include analytics providers, advertising networks, and social media platforms.
              </p>
              <p>
                We do not control these third-party cookies and suggest that you check the privacy policies of these third parties to understand how they use your information.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">4. Managing Cookies</h2>
              <p className="mb-4">
                Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies or delete certain cookies. However, if you choose to block all cookies, you may not be able to use all functionality of our Platform.
              </p>
              <p className="mb-4">
                You can generally manage your cookie preferences through your browser settings. Here's how to do it in common browsers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and Other Site Data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
                <li><strong>Edge:</strong> Settings → Site Permissions → Cookies and Site Data</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">5. Cookie Consent</h2>
              <p>
                When you first visit our Platform, you will be shown a cookie banner requesting your consent to set cookies. By clicking "Accept All Cookies," you consent to our use of all cookies. By clicking "Manage Preferences," you can select which types of cookies you accept.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">6. Changes to This Cookie Policy</h2>
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date at the top.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">7. Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at privacy@donedeal.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cookies;

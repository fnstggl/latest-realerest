
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
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
            <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-700">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">1. Introduction</h2>
              <p className="mb-4">
                At DoneDeal, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, or services.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our Platform, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">2. Information We Collect</h2>
              <h3 className="text-xl font-bold mb-2">Personal Information</h3>
              <p className="mb-4">
                We may collect personal information that you voluntarily provide to us when you register for an account, express interest in a property, list a property, or contact us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Mailing address</li>
                <li>Financial information (for transactions)</li>
                <li>Property details (for sellers)</li>
              </ul>
              
              <h3 className="text-xl font-bold mb-2">Automatically Collected Information</h3>
              <p className="mb-4">
                When you access our Platform, we may automatically collect certain information about your device and usage, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device type, operating system, and browser type</li>
                <li>IP address</li>
                <li>Geographic location</li>
                <li>Pages visited and features used</li>
                <li>Time spent on our Platform</li>
                <li>Referring websites or applications</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">3. How We Use Your Information</h2>
              <p className="mb-4">We may use your information for various purposes, including to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and manage your account</li>
                <li>Connect buyers with sellers</li>
                <li>Process transactions</li>
                <li>Send notifications about properties, waitlists, or account activities</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our Platform and user experience</li>
                <li>Conduct research and analysis</li>
                <li>Enforce our terms, conditions, and policies</li>
                <li>Protect our Platform from fraudulent or illegal activity</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">4. Sharing Your Information</h2>
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Other Users:</strong> When you list a property or join a waitlist, certain information may be shared with relevant users.</li>
                <li><strong>Service Providers:</strong> We may share your information with third-party vendors who provide services on our behalf.</li>
                <li><strong>Business Partners:</strong> We may share your information with partners who offer complementary services, such as mortgage lenders or home inspectors.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">5. Your Privacy Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to delete your personal information</li>
                <li>Right to restrict or object to processing</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at privacy@donedeal.com.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">6. Security of Your Information</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.
              </p>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">7. Children's Privacy</h2>
              <p>
                Our Platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">8. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#d60013] pb-2">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@donedeal.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;


import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const jobPositions: JobPosition[] = [
  {
    id: "eng-001",
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Join our team to build the next generation of real estate technology, focusing on React, TypeScript, and modern web frameworks."
  },
  {
    id: "eng-002",
    title: "Backend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Help us scale our platform to handle thousands of property listings and users, working with Node.js, PostgreSQL, and AWS."
  },
  {
    id: "mkt-001",
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Drive growth and user acquisition through innovative digital marketing strategies, SEO, and social media campaigns."
  },
  {
    id: "cs-001",
    title: "Customer Success Manager",
    department: "Customer Support",
    location: "New York, NY",
    type: "Full-time",
    description: "Ensure our users have the best experience possible by providing exceptional support and guidance through the property buying process."
  },
  {
    id: "re-001",
    title: "Real Estate Operations Manager",
    department: "Operations",
    location: "Austin, TX",
    type: "Full-time",
    description: "Oversee property listings, ensure compliance with real estate regulations, and optimize our platform for both buyers and sellers."
  }
];

const JobCard: React.FC<{ job: JobPosition }> = ({ job }) => (
  <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold">{job.title}</h3>
        <p className="text-gray-700">{job.department}</p>
      </div>
      <div className="bg-[#d60013] text-white px-2 py-1 border-2 border-black font-bold text-sm">
        {job.type}
      </div>
    </div>
    
    <p className="text-gray-700 mb-4">{job.description}</p>
    
    <div className="flex justify-between items-center">
      <span className="font-bold">{job.location}</span>
      <Button className="neo-button" variant="outline">
        Apply Now <ArrowRight size={16} className="ml-2" />
      </Button>
    </div>
  </div>
);

const Careers: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Help us revolutionize the real estate industry by making home ownership more accessible for everyone.
            </p>
          </div>
          
          {/* Company Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-10 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="w-12 h-12 bg-[#d60013] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black mb-4">1</div>
                <h3 className="text-xl font-bold mb-4">Innovation</h3>
                <p>We're constantly looking for new ways to improve the real estate experience and make home ownership more accessible.</p>
              </div>
              
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="w-12 h-12 bg-[#d60013] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black mb-4">2</div>
                <h3 className="text-xl font-bold mb-4">Transparency</h3>
                <p>We believe in being honest and direct in everything we do, from our pricing to our property listings.</p>
              </div>
              
              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="w-12 h-12 bg-[#d60013] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black mb-4">3</div>
                <h3 className="text-xl font-bold mb-4">Accessibility</h3>
                <p>We're committed to making home ownership possible for more people by reducing costs and simplifying the process.</p>
              </div>
            </div>
          </div>
          
          {/* Benefits */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-10 text-center">Why Work With Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <h3 className="text-2xl font-bold mb-6">Benefits & Perks</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                    <span className="text-lg">Competitive salary and equity packages</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                    <span className="text-lg">Comprehensive health, dental, and vision insurance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                    <span className="text-lg">Flexible work options (remote or in-office)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                    <span className="text-lg">Unlimited PTO policy</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                    <span className="text-lg">401(k) matching</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                    <span className="text-lg">Professional development budget</span>
                  </li>
                </ul>
              </div>
              <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <h3 className="text-2xl font-bold mb-6">Our Culture</h3>
                <p className="text-lg mb-4">
                  At DoneDeal, we believe that a great company is built by great people. We foster an environment where:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                    <span className="text-lg">Your ideas matter and can shape our product</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                    <span className="text-lg">Collaboration and teamwork are valued over competition</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                    <span className="text-lg">Work-life balance is respected and encouraged</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                    <span className="text-lg">Diversity and inclusion are fundamental to our success</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Open Positions */}
          <div>
            <h2 className="text-3xl font-bold mb-10 text-center">Open Positions</h2>
            
            <div className="mb-8">
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Button className="neo-button" variant="outline">All Departments</Button>
                <Button className="neo-button" variant="outline">All Locations</Button>
                <Button className="neo-button" variant="outline">All Job Types</Button>
              </div>
            </div>
            
            <div className="grid gap-8">
              {jobPositions.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold mb-6">Don't see a position that fits your skills?</h3>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                We're always looking for talented individuals to join our team. Send us your resume and tell us how you can contribute.
              </p>
              <Button className="neo-button-primary">
                Send General Application
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Careers;

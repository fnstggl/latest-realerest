
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, Phone } from 'lucide-react';
import { toast } from "sonner";
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      toast.success("Message sent successfully!");
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitting(false);
    }, 1500);
  };

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
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl bg-white/80 p-4 rounded-lg shadow-sm inline-block border border-white/40">We'd love to hear from you! Reach out with any questions or feedback.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="order-2 md:order-1">
              <form onSubmit={handleSubmit} className="bg-white/80 border border-white/40 shadow-md p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-bold">Your Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="Enter your name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                      className="border border-gray-200 focus:border-[#0892D0] focus:ring-1 focus:ring-[#0892D0]" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      className="border border-gray-200 focus:border-[#0892D0] focus:ring-1 focus:ring-[#0892D0]" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-bold">Subject</Label>
                    <Input 
                      id="subject" 
                      type="text" 
                      placeholder="What's this about?" 
                      value={subject} 
                      onChange={e => setSubject(e.target.value)} 
                      required 
                      className="border border-gray-200 focus:border-[#0892D0] focus:ring-1 focus:ring-[#0892D0]" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-bold">Your Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Type your message here..." 
                      value={message} 
                      onChange={e => setMessage(e.target.value)} 
                      required 
                      className="border border-gray-200 focus:border-[#0892D0] focus:ring-1 focus:ring-[#0892D0] min-h-[150px]" 
                    />
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      disabled={submitting} 
                      className="w-full bg-white border border-gray-200 hover:border-[#0892D0] hover:shadow-[0_0_10px_rgba(8,146,208,0.5)] text-black font-bold shadow-sm transition-all"
                    >
                      <Send size={18} className="mr-2" />
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="order-1 md:order-2 space-y-8">
              <div className="bg-white/80 border border-white/40 shadow-md p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-6 text-[#0892D0]">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start bg-white/90 p-4 rounded-lg shadow-sm border border-gray-100">
                    <Mail size={24} className="mr-4 mt-1 text-[#0892D0]" />
                    <div>
                      <h3 className="font-bold">Email Us</h3>
                      <p>info@donedealhome.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start bg-white/90 p-4 rounded-lg shadow-sm border border-gray-100">
                    <Phone size={24} className="mr-4 mt-1 text-[#0892D0]" />
                    <div>
                      <h3 className="font-bold">Call Us</h3>
                      <p>(929) 949-5634</p>
                      <p>Monday-Friday, 9am-5pm EST</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 border border-white/40 shadow-md p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  <div className="bg-white/90 p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#0892D0]">How does DoneDeal work?</h3>
                    <p>We connect buyers directly with sellers offering properties below market value. No middlemen, just direct connections.</p>
                  </div>
                  
                  <div className="bg-white/90 p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#0892D0]">How do I list my property?</h3>
                    <p>Simply create an account, click "List Property" and follow the steps.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default Contact;

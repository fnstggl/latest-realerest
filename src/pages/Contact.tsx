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
  return <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl">We'd love to hear from you! Reach out with any questions or feedback.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="order-2 md:order-1">
              <form onSubmit={handleSubmit} className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="font-bold">Your Name</Label>
                    <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required className="mt-2 border-2 border-black" />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="font-bold">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-2 border-2 border-black" />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="font-bold">Subject</Label>
                    <Input id="subject" type="text" placeholder="What's this about?" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-2 border-2 border-black" />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="font-bold">Your Message</Label>
                    <Textarea id="message" placeholder="Type your message here..." value={message} onChange={e => setMessage(e.target.value)} required className="mt-2 border-2 border-black min-h-[150px]" />
                  </div>
                  
                  <Button type="submit" disabled={submitting} className="w-full text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-[#011f5b]">
                    <Send size={18} className="mr-2" />
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="order-1 md:order-2 space-y-8">
              <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 bg-[#d60013] text-white">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail size={24} className="mr-4 mt-1" />
                    <div>
                      <h3 className="font-bold">Email Us</h3>
                      <p>info@donedealhome.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone size={24} className="mr-4 mt-1" />
                    <div>
                      <h3 className="font-bold">Call Us</h3>
                      <p>(929) 949-5634</p>
                      <p>Monday-Friday, 9am-5pm EST</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold">How does DoneDeal work?</h3>
                    <p className="text-gray-700">We connect buyers directly with sellers offering properties below market value. No middlemen, just direct connections.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold">How do I list my property?</h3>
                    <p className="text-gray-700">Simply create an account, click "List Property" and follow the steps.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>;
};
export default Contact;
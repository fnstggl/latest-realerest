
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
    <div className="min-h-screen bg-white perspective-container">
      <div className="gradient-blob gradient-blob-1"></div>
      <div className="gradient-blob gradient-blob-2"></div>
      <div className="gradient-blob gradient-blob-3"></div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12 layer-1">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm inline-block layer-2">We'd love to hear from you! Reach out with any questions or feedback.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="order-2 md:order-1">
              <form onSubmit={handleSubmit} className="glass-card backdrop-blur-lg border border-white/30 shadow-2xl p-8 perspective-container layer-2">
                <h2 className="text-2xl font-bold mb-6 layer-1">Send Us a Message</h2>
                
                <div className="space-y-6">
                  <div className="glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
                    <Label htmlFor="name" className="font-bold">Your Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="Enter your name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                      className="mt-2 glass-input" 
                    />
                  </div>
                  
                  <div className="glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
                    <Label htmlFor="email" className="font-bold">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      className="mt-2 glass-input" 
                    />
                  </div>
                  
                  <div className="glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
                    <Label htmlFor="subject" className="font-bold">Subject</Label>
                    <Input 
                      id="subject" 
                      type="text" 
                      placeholder="What's this about?" 
                      value={subject} 
                      onChange={e => setSubject(e.target.value)} 
                      required 
                      className="mt-2 glass-input" 
                    />
                  </div>
                  
                  <div className="glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
                    <Label htmlFor="message" className="font-bold">Your Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Type your message here..." 
                      value={message} 
                      onChange={e => setMessage(e.target.value)} 
                      required 
                      className="mt-2 glass-input min-h-[150px]" 
                    />
                  </div>
                  
                  <div className="layer-3">
                    <Button 
                      type="submit" 
                      disabled={submitting} 
                      className="w-full glass-button-purple text-white font-bold shadow-lg backdrop-blur-md border border-white/30 search-glow"
                    >
                      <Send size={18} className="mr-2" />
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="order-1 md:order-2 space-y-8">
              <div className="glass-card backdrop-blur-lg border border-white/30 shadow-2xl p-8 bg-[#9b87f5]/20 perspective-container layer-2">
                <h2 className="text-2xl font-bold mb-6 purple-text layer-1">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
                    <Mail size={24} className="mr-4 mt-1 text-[#9b87f5]" />
                    <div>
                      <h3 className="font-bold">Email Us</h3>
                      <p>info@donedealhome.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
                    <Phone size={24} className="mr-4 mt-1 text-[#9b87f5]" />
                    <div>
                      <h3 className="font-bold">Call Us</h3>
                      <p>(929) 949-5634</p>
                      <p>Monday-Friday, 9am-5pm EST</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card backdrop-blur-lg border border-white/30 shadow-2xl p-8 perspective-container layer-2">
                <h2 className="text-2xl font-bold mb-6 layer-1">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  <div className="glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
                    <h3 className="font-bold purple-text">How does DoneDeal work?</h3>
                    <p>We connect buyers directly with sellers offering properties below market value. No middlemen, just direct connections.</p>
                  </div>
                  
                  <div className="glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm layer-3">
                    <h3 className="font-bold purple-text">How do I list my property?</h3>
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

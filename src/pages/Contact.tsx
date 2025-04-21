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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      
      <div className="container mx-auto px-4 py-16 lg:py-24">
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
            <h1 className="font-bold mb-4 my-[20px] text-4xl">Contact Us</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">Please feel free to reach out with any questions or feedback for us. We're listening.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card className="h-full border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-medium">Your Name</Label>
                      <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required className="border-gray-200 focus:border-[#000000] focus:ring-1 focus:ring-[#000000]" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-medium">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="border-gray-200 focus:border-[#000000] focus:ring-1 focus:ring-[#000000]" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="font-medium">Subject</Label>
                      <Input id="subject" type="text" placeholder="What's this about?" value={subject} onChange={e => setSubject(e.target.value)} required className="border-gray-200 focus:border-[#000000] focus:ring-1 focus:ring-[#000000]" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-medium">Your Message</Label>
                      <Textarea id="message" placeholder="Type your message here..." value={message} onChange={e => setMessage(e.target.value)} required className="border-gray-200 focus:border-[#000000] focus:ring-1 focus:ring-[#000000] min-h-[150px] rounded-xl" />
                    </div>
                    
                    <div>
                      <Button type="submit" disabled={submitting} className="w-full relative bg-white text-black border border-transparent hover:bg-white group" variant="ghost">
                        <Send size={18} className="mr-2" />
                        {submitting ? "Sending..." : "Send Message"}
                        <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "border-box",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                        borderRadius: "inherit"
                      }} />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-black">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                      <Mail size={20} className="text-[#000000]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-700">Email Us</h3>
                      <p className="text-gray-600">info@realerestate.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                      <Phone size={20} className="text-[#000000]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-700">Call Us</h3>
                      <p className="text-gray-600">(929) 949-5634</p>
                      <p className="text-gray-500 text-sm">Monday-Friday, 9am-5pm EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-bold mb-1 text-black">How does Realer Estate work?</h3>
                    <p className="text-gray-600">We connect buyers directly with sellers offering properties below market value. No middlemen, just direct connections.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-1 text-black">How do I list my property?</h3>
                    <p className="text-gray-600">Simply create an account, click "List Property" and follow the steps.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>;
};
export default Contact;
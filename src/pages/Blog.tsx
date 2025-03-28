
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: "How to Find Properties Below Market Value",
    excerpt: "Learn the insider strategies for finding properties priced below market value in today's competitive real estate market.",
    author: "Sarah Johnson",
    date: "May 15, 2023",
    readTime: "8 min read",
    image: "https://source.unsplash.com/random/800x600?house&1"
  },
  {
    id: 2,
    title: "5 Red Flags to Look for When Buying a Home",
    excerpt: "Don't get caught with unexpected repairs and issues. Know these warning signs before making your purchase.",
    author: "Michael Chang",
    date: "June 3, 2023",
    readTime: "6 min read",
    image: "https://source.unsplash.com/random/800x600?house&2"
  },
  {
    id: 3,
    title: "Why Selling Direct Can Get You a Better Deal",
    excerpt: "Bypass agent commissions and sell your property faster with these proven direct-to-buyer strategies.",
    author: "Emily Rodriguez",
    date: "July 20, 2023",
    readTime: "10 min read",
    image: "https://source.unsplash.com/random/800x600?house&3"
  },
  {
    id: 4,
    title: "Understanding ARV: After Repair Value Explained",
    excerpt: "Learn how to calculate the true value of a property after renovations are complete, a crucial skill for investors.",
    author: "David Williams",
    date: "August 5, 2023",
    readTime: "7 min read",
    image: "https://source.unsplash.com/random/800x600?house&4"
  },
  {
    id: 5,
    title: "First-Time Buyer's Guide to Negotiating",
    excerpt: "Master these negotiation tactics to get the best possible price on your first home purchase.",
    author: "Jessica Turner",
    date: "September 12, 2023",
    readTime: "9 min read",
    image: "https://source.unsplash.com/random/800x600?house&5"
  },
];

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">DoneDeal Blog</h1>
            <p className="text-xl max-w-2xl mx-auto">Tips, strategies, and insights to help you navigate the real estate market and find exceptional deals.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <div className="flex items-center mr-4">
                      <Calendar size={14} className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2 hover:text-[#d60013] transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-700 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <User size={14} className="mr-1 text-[#d60013]" />
                      <span className="text-sm font-medium">{post.author}</span>
                    </div>
                    
                    <Button 
                      variant="link" 
                      className="text-[#d60013] p-0 hover:text-[#d60013]/80 font-bold flex items-center"
                    >
                      Read More
                      <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button className="neo-button-primary">
              Load More Articles
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;

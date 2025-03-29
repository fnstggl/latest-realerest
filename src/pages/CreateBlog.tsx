
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import SiteFooter from '@/components/sections/SiteFooter';
import { Loader2 } from 'lucide-react';

const CreateBlog: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
  });

  // Generate a random image URL for the blog post
  const getRandomImageUrl = () => {
    const randomNum = Math.floor(Math.random() * 10) + 1;
    return `https://source.unsplash.com/random/800x600?house&${randomNum}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to create a blog post",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }
    
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      
      const authorName = profileData?.name || 'Anonymous';
      
      // Create a new blog post
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([
          {
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            author: authorName,
            user_id: user.id,
            image: getRandomImageUrl(),
            read_time: Math.floor(Math.random() * 10) + 5, // Random read time between 5-15 mins
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your blog post has been published",
      });
      
      navigate('/blog');
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Create SEO Blog Post</h1>
            <p className="text-lg mb-8 text-center">
              Write quality content that will boost your property listings in search engines.
            </p>
            
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-lg font-medium mb-2">
                    Blog Title <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter a catchy title"
                    value={formData.title}
                    onChange={handleChange}
                    className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="excerpt" className="block text-lg font-medium mb-2">
                    Short Excerpt <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="excerpt"
                    name="excerpt"
                    placeholder="A brief summary of your blog post (1-2 sentences)"
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-lg font-medium mb-2">
                    Blog Content <span className="text-red-600">*</span>
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your blog post content here..."
                    value={formData.content}
                    onChange={handleChange}
                    className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[300px]"
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="neo-button-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      'Publish Blog Post'
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">SEO Tips:</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Include relevant keywords related to real estate and your property.</li>
                <li>Write informative, value-added content that readers will find useful.</li>
                <li>Use descriptive headings and subheadings.</li>
                <li>Keep paragraphs short and focused for better readability.</li>
                <li>Link to your property listing within the blog content when relevant.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default CreateBlog;

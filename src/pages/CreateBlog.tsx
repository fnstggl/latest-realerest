
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
import { Loader2, Wand2 } from 'lucide-react';
import { usePropertySelector, PropertyOption } from '@/hooks/usePropertySelector';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const CreateBlog: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
  });

  // Use our custom hook for property selection
  const { 
    properties, 
    selectedProperty, 
    setSelectedProperty, 
    isLoading: propertiesLoading 
  } = usePropertySelector();

  // Generate a random image URL for the blog post
  const getRandomImageUrl = () => {
    const randomNum = Math.floor(Math.random() * 10) + 1;
    return `https://source.unsplash.com/random/800x600?house&${randomNum}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePropertySelect = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
    }
  };

  const handleGenerateContent = async () => {
    if (!selectedProperty) {
      toast({
        title: "No property selected",
        description: "Please select a property to generate content",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-property-blog', {
        body: { property: selectedProperty }
      });

      if (error) throw error;

      if (data.content) {
        setFormData({
          title: data.title || `Great Investment: ${selectedProperty.belowMarket}% Below Market in ${selectedProperty.location}`,
          excerpt: data.excerpt || `Check out this amazing property in ${selectedProperty.location} that is ${selectedProperty.belowMarket}% below market value!`,
          content: data.content
        });

        toast({
          title: "Content generated",
          description: "AI has created your blog post content"
        });
      }
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Could not generate content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
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
      
      // Create a new blog post, possibly linking to the property
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([
          {
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            author: authorName,
            user_id: user.id,
            image: selectedProperty?.images?.[0] || getRandomImageUrl(),
            read_time: Math.floor(Math.random() * 10) + 5, // Random read time between 5-15 mins
            property_id: selectedProperty?.id // Link to the property if selected
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

  // Format the blog content for preview (without HTML tags)
  const formattedContent = formData.content
    .split('\n\n')
    .map((paragraph, i) => (
      <p key={i} className="mb-4">{paragraph}</p>
    ));

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
            
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-10">
              <h2 className="text-2xl font-bold mb-4">Choose Your Property</h2>
              <p className="mb-4">Select one of your properties to feature in this blog post:</p>
              
              {propertiesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-2">You don't have any properties listed yet</p>
                  <Button 
                    onClick={() => navigate('/sell/create')} 
                    variant="outline"
                    className="border-2 border-black"
                  >
                    Create Your First Listing
                  </Button>
                </div>
              ) : (
                <>
                  <Select onValueChange={handlePropertySelect}>
                    <SelectTrigger className="w-full border-2 border-black mb-6">
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title} - {formatCurrency(property.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedProperty && (
                    <Card className="p-4 border-2 border-black mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-gray-100 overflow-hidden">
                          <img 
                            src={selectedProperty.images?.[0] || "https://placehold.co/200x200?text=Property"} 
                            alt={selectedProperty.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{selectedProperty.title}</h3>
                          <div className="text-sm text-gray-500">
                            {selectedProperty.location} • {selectedProperty.beds} beds • {selectedProperty.baths} baths
                          </div>
                          <div className="mt-1 font-medium">
                            {formatCurrency(selectedProperty.price)} 
                            <span className="text-[#d60013] ml-2">
                              ({selectedProperty.belowMarket}% below market)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button 
                          onClick={handleGenerateContent} 
                          variant="outline"
                          className="border-2 border-black w-full flex gap-2"
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4" />
                              Generate Blog Post with AI
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  )}
                </>
              )}
            </div>
            
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
                  
                  {formData.content ? (
                    <div className="mb-4">
                      <div className="border-2 border-gray-300 rounded-md p-4 bg-gray-50">
                        <div className="prose max-w-none">
                          {formattedContent}
                        </div>
                      </div>
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="text-sm"
                          onClick={() => {
                            const textarea = document.getElementById('content') as HTMLTextAreaElement;
                            textarea.focus();
                          }}
                        >
                          Edit content
                        </Button>
                      </div>
                    </div>
                  ) : null}
                  
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your blog post content here..."
                    value={formData.content}
                    onChange={handleChange}
                    className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[300px] ${
                      formData.content ? "sr-only" : ""
                    }`}
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

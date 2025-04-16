
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from 'react-helmet-async';

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  read_time: number;
  created_at: string;
  property_id: string | null;
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blogPost, setBlogPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true);
      try {
        // Fetch the blog post
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setBlogPost(data);
        
        // If there's a property ID associated with this blog post, fetch that too
        if (data.property_id) {
          const { data: propertyData, error: propertyError } = await supabase
            .from('property_listings')
            .select('*')
            .eq('id', data.property_id)
            .maybeSingle();
            
          if (propertyError) throw propertyError;
          
          if (propertyData) {
            setProperty(propertyData);
          }
        }
      } catch (error: any) {
        console.error('Error fetching blog post:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load blog post",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id, toast]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/10 to-purple-100/20">
      <Navbar />
      
      {blogPost && (
        <Helmet>
          <title>{blogPost.title} | DoneDeal Blog</title>
          <meta name="description" content={blogPost.content.substring(0, 160)} />
          <meta property="og:title" content={blogPost.title} />
          <meta property="og:description" content={blogPost.content.substring(0, 160)} />
          <meta property="og:image" content={blogPost.image} />
          <meta property="og:type" content="article" />
          <link rel="canonical" href={window.location.href} />
          <meta name="author" content={blogPost.author} />
          <meta name="twitter:title" content={blogPost.title} />
          <meta name="twitter:description" content={blogPost.content.substring(0, 160)} />
          <meta name="twitter:image" content={blogPost.image} />
        </Helmet>
      )}
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="glass" 
            asChild 
            className="mb-6 hover:bg-white/40 property-card-glow"
          >
            <Link to="/blog" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </Button>
          
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 bg-white/30 backdrop-blur-md animate-pulse rounded-xl w-3/4"></div>
              <div className="h-6 bg-white/30 backdrop-blur-md animate-pulse rounded-xl w-1/3"></div>
              <div className="h-64 bg-white/30 backdrop-blur-md animate-pulse rounded-xl"></div>
            </div>
          ) : blogPost ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card backdrop-blur-lg border border-white/30 shadow-lg p-8 rounded-xl property-card-glow"
            >
              <h1 className="text-4xl font-bold mb-6 rainbow-text">{blogPost.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm mb-8 gap-4">
                <div className="flex items-center glass p-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">
                  <Calendar size={16} className="mr-2 text-pink-500" />
                  <span>{formatDate(blogPost.created_at)}</span>
                </div>
                <div className="flex items-center glass p-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">
                  <Clock size={16} className="mr-2 text-pink-500" />
                  <span>{blogPost.read_time} min read</span>
                </div>
                <div className="flex items-center glass p-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">
                  <User size={16} className="mr-2 text-pink-500" />
                  <span className="font-medium">{blogPost.author}</span>
                </div>
              </div>
              
              {blogPost.image && (
                <div className="mb-8 glass overflow-hidden rounded-xl property-card-glow">
                  <img 
                    src={blogPost.image} 
                    alt={blogPost.title} 
                    className="w-full h-auto object-cover" 
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none glass p-6 rounded-xl backdrop-blur-sm border border-white/20 shadow-sm">
                {blogPost.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {property && (
                <div className="mt-12 glass-card backdrop-blur-lg border border-white/30 shadow-lg p-6 rounded-xl property-card-glow">
                  <h2 className="text-2xl font-bold mb-4 rainbow-text">Related Property</h2>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img 
                        src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.svg'} 
                        alt={property.title}
                        className="w-full h-40 object-cover rounded-xl glass" 
                      />
                    </div>
                    <div className="md:w-2/3 space-y-2">
                      <h3 className="text-xl font-bold mb-2 rainbow-text">{property.title}</h3>
                      <p className="glass p-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">{property.location}</p>
                      <div className="flex gap-4 mb-4">
                        <span className="font-medium glass px-2 py-1 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">{property.beds} Beds</span>
                        <span className="font-medium glass px-2 py-1 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">{property.baths} Baths</span>
                        <span className="font-medium glass px-2 py-1 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">{property.sqft} SqFt</span>
                      </div>
                      <div className="font-bold text-xl mb-4 rainbow-text">${Number(property.price).toLocaleString()}</div>
                      <Button asChild variant="translucent" className="property-card-glow">
                        <Link to={`/property/${property.id}`} className="flex items-center gap-2">
                          <Home size={16} />
                          View Property
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-20 glass-card backdrop-blur-lg border border-white/30 shadow-lg p-8 rounded-xl property-card-glow">
              <h2 className="text-2xl font-bold mb-4 rainbow-text">Blog post not found</h2>
              <p className="mb-6 glass p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">Sorry, the blog post you're looking for doesn't exist or has been removed.</p>
              <Button asChild variant="translucent" className="property-card-glow">
                <Link to="/blog">Return to Blog</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default BlogPost;

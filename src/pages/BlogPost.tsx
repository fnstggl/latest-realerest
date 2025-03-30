
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
    <div className="min-h-screen bg-white">
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
            variant="outline" 
            asChild 
            className="mb-6 hover:bg-gray-100"
          >
            <Link to="/blog" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </Button>
          
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ) : blogPost ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8"
            >
              <h1 className="text-4xl font-bold mb-6">{blogPost.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8 gap-4">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(blogPost.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{blogPost.read_time} min read</span>
                </div>
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span className="font-medium">{blogPost.author}</span>
                </div>
              </div>
              
              {blogPost.image && (
                <div className="mb-8 border-4 border-black overflow-hidden">
                  <img 
                    src={blogPost.image} 
                    alt={blogPost.title} 
                    className="w-full h-auto object-cover" 
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                {blogPost.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {property && (
                <div className="mt-12 p-6 border-4 border-black bg-gray-50">
                  <h2 className="text-2xl font-bold mb-4">Related Property</h2>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img 
                        src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.svg'} 
                        alt={property.title}
                        className="w-full h-40 object-cover border-2 border-black" 
                      />
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                      <p className="text-gray-700 mb-2">{property.location}</p>
                      <div className="flex gap-4 mb-4">
                        <span className="font-medium">{property.beds} Beds</span>
                        <span className="font-medium">{property.baths} Baths</span>
                        <span className="font-medium">{property.sqft} SqFt</span>
                      </div>
                      <div className="font-bold text-xl mb-4">${Number(property.price).toLocaleString()}</div>
                      <Button asChild className="neo-button-primary">
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
            <div className="text-center py-20 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
              <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
              <p className="mb-6">Sorry, the blog post you're looking for doesn't exist or has been removed.</p>
              <Button asChild className="neo-button-primary">
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

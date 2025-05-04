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
import { useIsMobile } from '@/hooks/use-mobile';
import SEO from '@/components/SEO';

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  read_time: number;
  created_at: string;
  property_id: string | null;
  excerpt: string;
  location?: string;
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blogPost, setBlogPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
        <SEO
          title={`${blogPost.title} | Realer Estate Blog`}
          description={blogPost.excerpt || blogPost.content.substring(0, 155)}
          canonical={`/blog/${id}`}
          image={blogPost.image}
          type="article"
          schema={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blogPost.title,
            "image": blogPost.image,
            "datePublished": blogPost.created_at,
            "author": {
              "@type": "Person",
              "name": blogPost.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Realer Estate",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/lovable-uploads/7c808a82-7af5-43f9-ada8-82e9817c464d.png`
              }
            },
            "description": blogPost.excerpt || blogPost.content.substring(0, 155),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            }
          }}
        />
      )}
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          {isMobile && (
            <Button 
              variant="outline" 
              asChild 
              className="mb-6 border-gray-200 hover:bg-gray-50"
            >
              <Link to="/blog" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Blog
              </Link>
            </Button>
          )}
          
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 bg-gray-100 animate-pulse rounded-xl w-3/4"></div>
              <div className="h-6 bg-gray-100 animate-pulse rounded-xl w-1/3"></div>
              <div className="h-64 bg-gray-100 animate-pulse rounded-xl"></div>
            </div>
          ) : blogPost ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-200 shadow-sm p-8 rounded-xl"
            >
              <h1 className="text-4xl font-bold mb-6">{blogPost.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm mb-8 gap-4">
                <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                  <Calendar size={16} className="mr-2 text-gray-600" />
                  <span>{formatDate(blogPost.created_at)}</span>
                </div>
                <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                  <Clock size={16} className="mr-2 text-gray-600" />
                  <span>{blogPost.read_time} min read</span>
                </div>
                <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                  <User size={16} className="mr-2 text-gray-600" />
                  <span className="font-medium">{blogPost.author}</span>
                </div>
              </div>
              
              {blogPost.image && (
                <div className="mb-8 overflow-hidden rounded-xl">
                  <img 
                    src={blogPost.image} 
                    alt={blogPost.title} 
                    className="w-full h-auto object-cover" 
                    loading="lazy"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none bg-gray-50 p-6 rounded-xl">
                {blogPost.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {property && (
                <div className="mt-12 bg-white border border-gray-200 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold mb-4">Related Property</h2>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img 
                        src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.svg'} 
                        alt={property.title}
                        className="w-full h-40 object-cover rounded-xl bg-gray-50" 
                        loading="lazy"
                      />
                    </div>
                    <div className="md:w-2/3 space-y-2">
                      <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                      <p className="bg-gray-50 p-2 rounded-lg">{property.location}</p>
                      <div className="flex gap-4 mb-4">
                        <span className="font-medium bg-gray-50 px-2 py-1 rounded-lg">{property.beds} Beds</span>
                        <span className="font-medium bg-gray-50 px-2 py-1 rounded-lg">{property.baths} Baths</span>
                        <span className="font-medium bg-gray-50 px-2 py-1 rounded-lg">{property.sqft} SqFt</span>
                      </div>
                      <div className="font-bold text-xl mb-4">${Number(property.price).toLocaleString()}</div>
                      <Button asChild variant="default" className="bg-black hover:bg-gray-800 text-white">
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
            <div className="text-center py-20 bg-white border border-gray-200 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
              <p className="mb-6 bg-gray-50 p-4 rounded-lg">Sorry, the blog post you're looking for doesn't exist or has been removed.</p>
              <Button asChild variant="default" className="bg-black hover:bg-gray-800 text-white">
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

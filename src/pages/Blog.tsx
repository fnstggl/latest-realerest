import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, Search, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import SiteFooter from '@/components/sections/SiteFooter';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Helmet } from 'react-helmet-async';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  user_id: string;
  image: string;
  read_time: number;
  created_at: string;
  date?: string; // formatted date
  location?: string;
}

const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('blog_posts').select('*').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      if (data) {
        const formattedPosts = data.map(post => ({
          ...post,
          date: new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }));
        setBlogPosts(formattedPosts);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    try {
      const {
        error
      } = await supabase.from('blog_posts').delete().eq('id', deletePostId);
      if (error) throw error;
      setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== deletePostId));
      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive"
      });
    } finally {
      setDeletePostId(null);
      setIsDialogOpen(false);
    }
  };

  const openDeleteDialog = (postId: string) => {
    setDeletePostId(postId);
    setIsDialogOpen(true);
  };

  const filteredPosts = blogPosts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || post.author.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      
      <Navbar />
      
      <Helmet>
        <title>Realer Estate Blog | Property Investment Articles</title>
        <meta name="description" content="Read our latest articles on property investment, real estate opportunities, and below market deals in your area." />
        <meta property="og:title" content="Realer Estate Blog | Property Investment Articles" />
        <meta property="og:description" content="Read our latest articles on property investment, real estate opportunities, and below market deals in your area." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
        <meta name="keywords" content="real estate blog, property investment, affordable homes, below market deals, property listings" />
        
        {/* Structured Data for Blog */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Realer Estate Blog",
            "description": "Articles about property investment, real estate opportunities, and below market deals.",
            "url": window.location.href,
            "publisher": {
              "@type": "Organization",
              "name": "Realer Estate",
              "logo": {
                "@type": "ImageObject",
                "url": "/lovable-uploads/7c808a82-7af5-43f9-ada8-82e9817c464d.png"
              }
            },
            "blogPosts": filteredPosts.slice(0, 10).map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "datePublished": post.created_at
            }))
          })}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">Realer Estate Blog</h1>
            <p className="text-xl max-w-2xl mx-auto">Boost your property's visibility with SEO-optimized blog posts that help buyers find your listings.</p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-10">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search blog posts..." 
                className="pl-10 border border-gray-200 focus:ring-black focus:border-black" 
                value={searchQuery} 
                onChange={handleSearchChange} 
                aria-label="Search blog posts"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <Button asChild variant="default" className="bg-black hover:bg-gray-800 text-white border-none">
              <Link to="/sell/create-blog">Create Your SEO Blog Post</Link>
            </Button>
            <p className="mt-4 text-sm text-gray-600">Write articles that link to your property listings to boost visibility on search engines!</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-container">
                <div className="gradient-blob"></div>
                <p className="relative z-10 font-medium">Loading posts...</p>
              </div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-lg transition-all"
                >
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        loading="lazy"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <div className="flex items-center mr-4 bg-gray-50 p-1 px-2 rounded-lg">
                        <Calendar size={14} className="mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center bg-gray-50 p-1 px-2 rounded-lg">
                        <Clock size={14} className="mr-1" />
                        <span>{post.read_time} min read</span>
                      </div>
                    </div>
                    
                    <Link to={`/blog/${post.id}`} className="block">
                      <h2 className="text-xl font-bold mb-2 hover:text-gray-700 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center bg-gray-50 p-1 px-2 rounded-lg">
                        <User size={14} className="mr-1 text-gray-600" />
                        <span className="text-sm font-medium">{post.author}</span>
                      </div>
                      
                      <div className="flex items-center">
                        {user && user.id === post.user_id && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="mr-2 text-gray-600 hover:text-black hover:bg-transparent"
                            onClick={() => openDeleteDialog(post.id)}
                            aria-label="Delete post"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                        
                        <Button 
                          variant="link" 
                          className="text-black p-0 hover:text-gray-700 font-bold flex items-center" 
                          asChild
                        >
                          <Link to={`/blog/${post.id}`}>
                            Read More
                            <ArrowRight size={14} className="ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">No blog posts found</h3>
              <p className="text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">Be the first to publish a blog post!</p>
              <Button asChild className="bg-black hover:bg-gray-800 text-white">
                <Link to="/sell/create-blog">Create Your First Post</Link>
              </Button>
            </div>
          )}
          
          {filteredPosts.length > 6 && (
            <div className="text-center mt-12">
              <Button className="bg-black hover:bg-gray-800 text-white">
                Load More Articles
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 p-6 shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="bg-gray-50 p-3 rounded-lg">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-black hover:bg-gray-800 text-white" onClick={handleDeletePost}>
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <SiteFooter />
    </div>
  );
};

export default Blog;

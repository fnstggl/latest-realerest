
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
}

const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedPosts = data.map(post => ({
          ...post,
          date: new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
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
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', deletePostId);

      if (error) throw error;

      setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== deletePostId));
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
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

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <Helmet>
        <title>DoneDeal Blog | Property Investment Articles</title>
        <meta name="description" content="Read our latest articles on property investment, real estate opportunities, and below market deals." />
        <meta property="og:title" content="DoneDeal Blog | Property Investment Articles" />
        <meta property="og:description" content="Read our latest articles on property investment, real estate opportunities, and below market deals." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">DoneDeal Blog</h1>
            <p className="text-xl max-w-2xl mx-auto">Boost your property's visibility with SEO-optimized blog posts that help buyers find your listings.</p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-10">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search blog posts..."
                className="pl-10 layer-2 glass-content backdrop-blur-lg border border-white/40 focus:ring-0 focus:border-white/50"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <Button asChild className="layer-3 glass-content backdrop-blur-md border border-white/40 hover:translate-y-[-5px] transition-all">
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
                  className="layer-2 glass-card backdrop-blur-lg border border-white/40 overflow-hidden group transition-all hover:translate-y-[-5px]"
                >
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <div className="flex items-center mr-4 layer-1 glass p-1 px-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">
                        <Calendar size={14} className="mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center layer-1 glass p-1 px-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">
                        <Clock size={14} className="mr-1" />
                        <span>{post.read_time} min read</span>
                      </div>
                    </div>
                    
                    <Link to={`/blog/${post.id}`} className="block">
                      <h2 className="text-xl font-bold mb-2 hover:text-[#0892D0] transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className="text-gray-700 mb-4 layer-1 glass-content p-3 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center layer-1 glass p-1 px-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">
                        <User size={14} className="mr-1 text-[#0892D0]" />
                        <span className="text-sm font-medium">{post.author}</span>
                      </div>
                      
                      <div className="flex items-center">
                        {user && user.id === post.user_id && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="mr-2 text-[#0892D0] hover:text-[#0892D0]/80 hover:bg-transparent"
                            onClick={() => openDeleteDialog(post.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                        
                        <Button 
                          variant="link" 
                          className="text-[#0892D0] p-0 hover:text-[#0892D0]/80 font-bold flex items-center"
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
            <div className="text-center py-20 layer-2 glass-card backdrop-blur-lg border border-white/40 p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-2">No blog posts found</h3>
              <p className="text-gray-600 mb-6 layer-1 glass-content p-3 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">Be the first to publish a blog post!</p>
              <Button asChild className="layer-3 glass-content backdrop-blur-md border border-white/40 hover:translate-y-[-5px] transition-all">
                <Link to="/sell/create-blog">Create Your First Post</Link>
              </Button>
            </div>
          )}
          
          {filteredPosts.length > 6 && (
            <div className="text-center mt-12">
              <Button className="layer-3 glass-content backdrop-blur-md border border-white/40 hover:translate-y-[-5px] transition-all">
                Load More Articles
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="layer-3 glass-card backdrop-blur-lg border border-white/40 p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="layer-1 glass-content p-3 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="layer-1 glass">
              Cancel
            </Button>
            <Button className="layer-3 glass-content backdrop-blur-md border border-white/40 hover:translate-y-[-5px] transition-all" onClick={handleDeletePost}>
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

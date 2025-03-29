
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
                className="pl-10 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-0 focus:border-black"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <Button asChild className="neo-button-primary">
              <Link to="/sell/create-blog">Create Your SEO Blog Post</Link>
            </Button>
            <p className="mt-4 text-sm text-gray-600">Write articles that link to your property listings to boost visibility on search engines!</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="inline-block h-12 w-12 border-4 border-t-[#d60013] border-r-[#d60013] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
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
                        <span>{post.read_time} min read</span>
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
                      
                      <div className="flex items-center">
                        {user && user.id === post.user_id && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="mr-2 text-red-500 hover:text-red-700 hover:bg-transparent"
                            onClick={() => openDeleteDialog(post.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                        
                        <Button 
                          variant="link" 
                          className="text-[#d60013] p-0 hover:text-[#d60013]/80 font-bold flex items-center"
                        >
                          Read More
                          <ArrowRight size={14} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold mb-2">No blog posts found</h3>
              <p className="text-gray-600 mb-6">Be the first to publish a blog post!</p>
              <Button asChild className="neo-button-primary">
                <Link to="/sell/create-blog">Create Your First Post</Link>
              </Button>
            </div>
          )}
          
          {filteredPosts.length > 6 && (
            <div className="text-center mt-12">
              <Button className="neo-button-primary">
                Load More Articles
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="neo-button-primary" onClick={handleDeletePost}>
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

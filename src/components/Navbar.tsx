
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu, User, LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import NotificationCenter from './NotificationCenter';
import ChatIcon from './ChatIcon';
import { useNotifications } from '@/context/NotificationContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    isAuthenticated,
    user
  } = useAuth();
  const {
    unreadCount
  } = useNotifications();
  
  const handleSignIn = () => {
    navigate('/signin');
  };
  
  const handleSignUp = () => {
    navigate('/signup');
  };

  // Mobile navigation remains as a sheet
  const MobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="glass" size="icon" className="md:hidden">
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] glass-dark border-r p-0">
        <div className="flex flex-col gap-6 p-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-purple rounded-full text-white flex items-center justify-center font-bold text-lg">RE</div>
            <span className="font-bold text-white text-2xl">RealerEstate</span>
          </Link>
          
          <nav className="flex flex-col space-y-2">
            <Link to="/" className="text-primary hover:text-white transition-colors font-bold text-xl py-3 border-b border-white/10 gradient-hover-text">
              Home
            </Link>
            <Link to="/search" className="text-white hover:text-primary transition-colors font-bold text-xl py-3 border-b border-white/10 gradient-hover-text">
              Browse
            </Link>
            <Link to="/sell/create" className="text-white hover:text-primary transition-colors font-bold text-xl py-3 border-b border-white/10 gradient-hover-text">
              Sell
            </Link>
            <Link to="/about" className="text-white hover:text-primary transition-colors font-bold text-xl py-3 border-b border-white/10 gradient-hover-text">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-primary transition-colors font-bold text-xl py-3 border-b border-white/10 gradient-hover-text">
              Contact
            </Link>
          </nav>
          
          <div className="flex flex-col gap-3 mt-4">
            {isAuthenticated ? (
              <Button className="w-full justify-center font-bold" variant="glass" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  className="w-full justify-center font-bold property-card-glow text-black" 
                  variant="translucent"
                  onClick={handleSignIn}
                >
                  Log In
                </Button>
                
                <Button 
                  className="w-full justify-center font-bold property-card-glow text-black" 
                  variant="translucent"
                  onClick={handleSignUp}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <motion.nav 
      className="glass fixed top-0 left-0 right-0 py-3 px-4 sm:px-6 z-50 shadow-lg backdrop-blur-lg bg-white/20 border-b border-white/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isMobile && <MobileNavigation />}
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-purple rounded-full text-white flex items-center justify-center font-bold text-xl shadow-md">RE</div>
            <span className="font-bold text-foreground text-2xl hidden md:block">RealerEstate</span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-8 mx-auto">
          <Link to="/" className="text-foreground font-semibold gradient-hover-text transition-all duration-300">Home</Link>
          <Link to="/search" className="text-foreground font-semibold gradient-hover-text transition-all duration-300">Browse</Link>
          <Link to="/sell/create" className="text-foreground font-semibold gradient-hover-text transition-all duration-300">Sell</Link>
          <Link to="/about" className="text-foreground font-semibold gradient-hover-text transition-all duration-300">About</Link>
          <Link to="/contact" className="text-foreground font-semibold gradient-hover-text transition-all duration-300">Contact</Link>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <div className="flex gap-2 sm:gap-4 items-center">
              <NotificationCenter />
              <ChatIcon />
              
              <Button 
                variant="glass" 
                className="p-1 sm:p-2 glass text-xs sm:text-base relative text-foreground property-card-glow"
                onClick={() => navigate('/dashboard')}
              >
                <User size={isMobile ? 16 : 20} className="mr-1 sm:mr-2" />
                <span className="font-bold hidden xs:inline-block">{user?.name || 'Account'}</span>
                
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="translucent"
                className="font-bold text-xs sm:text-base py-1 px-2 sm:py-2 sm:px-4 hover:bg-white/40 z-10 property-card-glow text-black" 
                onClick={handleSignIn}
              >
                <LogIn size={18} className="mr-1 sm:mr-2" />
                Log In
              </Button>
              
              <Button 
                variant="translucent"
                className="font-bold text-xs sm:text-base py-1 px-2 sm:py-2 sm:px-4 hover:bg-white/40 z-10 property-card-glow text-black" 
                onClick={handleSignUp}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

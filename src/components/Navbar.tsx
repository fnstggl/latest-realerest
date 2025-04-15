
import React, { useState } from 'react';
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
            <Link to="/" className="text-primary hover:text-white transition-colors font-bold text-xl py-3 border-b border-white/10">
              Home
            </Link>
            <Link to="/search" className="text-white hover:text-primary transition-colors font-bold text-xl py-3 border-b border-white/10">
              Browse
            </Link>
            <Link to="/sell/create" className="text-white hover:text-primary transition-colors font-bold text-xl py-3 border-b border-white/10">
              Sell
            </Link>
            <Link to="/about" className="text-white hover:text-primary transition-colors font-bold text-xl py-3 border-b border-white/10">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-primary transition-colors font-bold text-xl py-3 border-b border-white/10">
              Contact
            </Link>
          </nav>
          
          <div className="flex flex-col gap-3 mt-4">
            {isAuthenticated ? (
              <Button className="w-full justify-center font-bold glass-button-primary" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" className="w-full justify-center glass-button font-bold text-white" onClick={handleSignIn}>
                  Log In
                </Button>
                
                <Button variant="red" className="w-full justify-center glass-button-primary font-bold" onClick={handleSignUp}>
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
      className="glass fixed top-4 left-1/2 -translate-x-1/2 py-2 px-4 sm:px-6 w-[95%] max-w-7xl z-50 shadow-lg"
      initial={{
        y: -100
      }}
      animate={{
        y: 0
      }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isMobile && <MobileNavigation />}
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-purple rounded-full text-white flex items-center justify-center font-bold text-xl shadow-md">RE</div>
            <span className="font-bold text-foreground text-2xl hidden md:block">RealerEstate</span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6 text-lg">
          <Link to="/" className="text-primary hover:text-primary/80 transition-colors font-bold relative group">
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/search" className="text-foreground hover:text-primary transition-colors font-bold relative group">
            <span>Browse</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/sell/create" className="text-foreground hover:text-primary transition-colors font-bold relative group">
            <span>Sell</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors font-bold relative group">
            <span>About</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="text-foreground hover:text-primary transition-colors font-bold relative group">
            <span>Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <div className="flex gap-2 sm:gap-4 items-center">
              <NotificationCenter />
              <ChatIcon />
              
              <Button 
                variant="outline" 
                className="p-1 sm:p-2 glass text-xs sm:text-base relative"
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
              <Link to="/search"></Link>
              
              <Button 
                variant="glass" 
                className="hidden md:flex font-bold text-foreground" 
                onClick={handleSignIn}
              >
                <LogIn size={18} className="mr-2" />
                Log In
              </Button>
              
              <Button 
                variant="black" 
                className="font-bold text-xs sm:text-base py-1 px-2 sm:py-2 sm:px-4" 
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

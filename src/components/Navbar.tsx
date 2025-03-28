
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu, User, LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import NotificationCenter from './NotificationCenter';
import { useNotifications } from '@/context/NotificationContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated, user, accountType } = useAuth();
  const { unreadCount } = useNotifications();

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const MobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] border-r-4 border-black p-0">
        <div className="flex flex-col gap-6 p-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-[#d60013] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black">DD</div>
            <span className="font-bold text-black text-2xl">DoneDeal</span>
          </Link>
          
          <nav className="flex flex-col space-y-2">
            <Link 
              to="/" 
              className="text-black hover:text-[#d60013] transition-colors font-bold text-xl py-3 border-b-2 border-black"
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className="text-black hover:text-[#d60013] transition-colors font-bold text-xl py-3 border-b-2 border-black"
            >
              Browse
            </Link>
            <Link 
              to="/sell/create" 
              className="text-black hover:text-[#d60013] transition-colors font-bold text-xl py-3 border-b-2 border-black"
            >
              Sell
            </Link>
            <Link 
              to="/about" 
              className="text-black hover:text-[#d60013] transition-colors font-bold text-xl py-3 border-b-2 border-black"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-black hover:text-[#d60013] transition-colors font-bold text-xl py-3 border-b-2 border-black"
            >
              Contact
            </Link>
          </nav>
          
          <div className="flex flex-col gap-3 mt-4">
            {isAuthenticated ? (
              <Button 
                className="w-full justify-center font-bold bg-black text-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(214,0,19,1)]"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-center neo-button font-bold"
                  onClick={handleSignIn}
                >
                  Log In
                </Button>
                
                <Button 
                  className="w-full justify-center neo-button-primary font-bold"
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
      className="bg-white border-b-4 border-black py-4 px-6 w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isMobile && <MobileNavigation />}
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-[#d60013] rounded-full text-white flex items-center justify-center font-bold text-xl border-2 border-black">DD</div>
            <span className="font-bold text-black text-2xl hidden md:block">DoneDeal</span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6 text-lg">
          <Link to="/" className="text-black hover:text-[#d60013] transition-colors font-bold relative group">
            <span className="text-[#d60013]">Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#d60013] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/search" className="text-black hover:text-[#d60013] transition-colors font-bold relative group">
            <span>Browse</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#d60013] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/sell/create" className="text-black hover:text-[#d60013] transition-colors font-bold relative group">
            <span>Sell</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#d60013] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="text-black hover:text-[#d60013] transition-colors font-bold relative group">
            <span>About</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#d60013] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="text-black hover:text-[#d60013] transition-colors font-bold relative group">
            <span>Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#d60013] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex gap-4 items-center">
              <div className="hidden md:flex bg-black text-white px-3 py-1 rounded-none border-2 border-black text-sm">
                <span className="font-bold">{accountType.toUpperCase()}</span>
              </div>
              
              <NotificationCenter showIndicator={unreadCount > 0} />
              
              <Button 
                variant="ghost" 
                className="p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none relative"
                onClick={() => navigate('/dashboard')}
              >
                <User size={20} className="mr-2" />
                <span className="font-bold">{user?.name || 'Account'}</span>
                
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          ) : (
            <>
              <Link to="/search">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-black rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Search size={20} />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="hidden md:flex neo-button font-bold"
                onClick={handleSignIn}
              >
                <LogIn size={18} className="mr-2" />
                Log In
              </Button>
              
              <Button 
                className="neo-button-primary font-bold"
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

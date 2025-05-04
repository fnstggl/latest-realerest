
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, User } from 'lucide-react';
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
  const LogoText = () => (
    <>
      <img 
        src="/lovable-uploads/7c808a82-7af5-43f9-ada8-82e9817c464d.png" 
        alt="Realer Estate Logo" 
        className="w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 object-contain -translate-y-[2px]" 
      />
      <span className="font-playfair font-bold italic text-foreground text-sm sm:text-base md:text-base hidden md:block">Realer Estate</span>
    </>
  );
  const MobileNavigation = () => <Sheet>
      <SheetTrigger asChild>
        <Button variant="glass" size="icon" className="md:hidden h-8 w-8 sm:h-9 sm:w-9">
          <Menu size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] glass-dark border-none p-0" // Removed border
    >
        <div className="flex flex-col gap-4 sm:gap-6 p-6 sm:p-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/7c808a82-7af5-43f9-ada8-82e9817c464d.png" alt="Realer Estate Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            <span className="font-bold text-black text-lg sm:text-xl md:text-2xl">Realer Estate</span>
          </Link>

          <nav className="flex flex-col space-y-1 sm:space-y-2">
            <Link to="/" className="text-black hover:nav-home-hover transition-colors font-bold text-base sm:text-lg md:text-xl py-2 sm:py-3">
              Home
            </Link>
            <Link to="/search" className="text-black hover:nav-browse-hover transition-colors font-bold text-base sm:text-lg md:text-xl py-2 sm:py-3">
              Browse
            </Link>
            <Link to="/sell/create" className="text-black hover:nav-sell-hover transition-colors font-bold text-base sm:text-lg md:text-xl py-2 sm:py-3">
              Sell
            </Link>
            <Link to="/guide" className="text-black hover:nav-guide-hover transition-colors font-bold text-base sm:text-lg md:text-xl py-2 sm:py-3">
              Guide
            </Link>
            <Link to="/about" className="text-black hover:nav-about-hover transition-colors font-bold text-base sm:text-lg md:text-xl py-2 sm:py-3">
              About
            </Link>
          </nav>

          <div className="flex flex-col gap-3 mt-2 sm:mt-4">
            {isAuthenticated ? <Button className="w-full justify-center font-bold text-sm sm:text-base" variant="translucent" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button> : <>
                <Button variant="translucent" className="w-full justify-center font-bold text-sm sm:text-base" onClick={handleSignIn}>
                  Log In
                </Button>
                <Button variant="default" className="w-full justify-center font-bold text-sm sm:text-base" onClick={handleSignUp}>
                  Sign up
                </Button>
              </>}
          </div>
        </div>
      </SheetContent>
    </Sheet>;
  return <nav className="glass fixed top-0 left-0 right-0 py-2 sm:py-3 px-3 sm:px-4 md:px-6 z-50 shadow-lg backdrop-blur-lg bg-[#FCFBF8]/20 border-b border-white/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isMobile && <MobileNavigation />}

          <Link to="/" className="flex items-center gap-2">
            <LogoText />
          </Link>
        </div>

        <div className="hidden md:flex space-x-6 lg:space-x-8 mx-auto">
          <Link to="/" className="playfair-hover font-semibold text-sm lg:text-base">Home</Link>
          <Link to="/search" className="playfair-hover font-semibold text-sm lg:text-base">Browse</Link>
          <Link to="/sell/create" className="playfair-hover font-semibold text-sm lg:text-base">Sell</Link>
          <Link to="/guide" className="playfair-hover font-semibold text-sm lg:text-base">Guide</Link>
          <Link to="/about" className="playfair-hover font-semibold text-sm lg:text-base">About</Link>
        </div>

        <div className="flex items-center gap-1 xs:gap-2 sm:gap-4">
          {isAuthenticated ? <div className="flex gap-1 xs:gap-2 sm:gap-4 items-center">
              <NotificationCenter />
              <ChatIcon />

              <Button variant="ghost" className="p-1 sm:p-2 text-xs sm:text-base relative text-foreground border-transparent hover:bg-transparent hover:text-current cursor-pointer" onClick={() => navigate('/dashboard')}>
                <User size={isMobile ? 14 : 20} className="mr-1 sm:mr-2" />
                <span className="font-bold text-xs sm:text-sm">{user?.name || 'Account'}</span>

              {unreadCount > 0}
              </Button>
            </div> : <>
              <Button variant="translucent" className="font-bold text-[10px] xs:text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 text-black h-7 sm:h-9" onClick={handleSignIn}>
                Log In
              </Button>

              <Button variant="default" className="font-bold text-[10px] xs:text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 text-white bg-black hover:bg-black/90 h-7 sm:h-9" onClick={handleSignUp}>
                Sign up
              </Button>
            </>}
        </div>
      </div>
    </nav>;
};

export default Navbar;

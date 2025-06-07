
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

  const LogoText = () => <>
      <img src="/lovable-uploads/4a5ee413-b1c2-49b0-817d-51d20149fc74.png" alt="Realer Estate Logo" className="w-6 h-6 sm:w-6 sm:h-6 md:w-6 md:h-6 object-contain mt-[3px]" />
      <span className="font-playfair font-bold italic text-[#fd4801] text-xs sm:text-sm md:text-sm hidden md:block">Realer Estate</span>
    </>;

  const MobileNavigation = () => <Sheet>
      <SheetTrigger asChild>
        <Button variant="glass" size="icon" className="md:hidden h-8 w-8 sm:h-9 sm:w-9">
          <Menu size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] glass-dark border-none p-0">
        <div className="flex flex-col gap-4 sm:gap-6 p-6 sm:p-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/4a5ee413-b1c2-49b0-817d-51d20149fc74.png" alt="Realer Estate Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            <span className="font-bold text-black text-lg sm:text-xl md:text-2xl">Realer Estate</span>
          </Link>

          <nav className="flex flex-col space-y-1 sm:space-y-2">
            <Link to="/" className="text-black hover:nav-home-hover transition-colors font-polysans-semibold text-base sm:text-lg md:text-xl py-2 sm:py-3">
              Home
            </Link>
            <Link to="/search" className="text-black hover:nav-browse-hover transition-colors font-polysans-semibold text-base sm:text-lg md:text-xl py-2 sm:py-3">
              Browse
            </Link>
            <Link to="/sell/create" className="text-black hover:nav-sell-hover transition-colors font-polysans-semibold text-base sm:text-lg md:text-xl py-2 sm:py-3">
              Sell
            </Link>
            <Link to="/guide" className="text-black hover:nav-guide-hover transition-colors font-polysans-semibold text-base sm:text-lg md:text-xl py-2 sm:py-3">
              Guide
            </Link>
            <Link to="/about" className="text-black hover:nav-about-hover transition-colors font-polysans-semibold text-base sm:text-lg md:text-xl py-2 sm:py-3">
              About
            </Link>
          </nav>

          <div className="flex flex-col gap-3 mt-2 sm:mt-4">
            {isAuthenticated ? <Button className="w-full justify-center font-polysans-semibold text-sm sm:text-base" variant="translucent" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button> : <>
                <Button variant="translucent" className="w-full justify-center font-polysans-semibold text-sm sm:text-base" onClick={handleSignIn}>
                  Log In
                </Button>
                <Button variant="default" className="w-full justify-center font-polysans-semibold text-sm sm:text-base bg-[#01204b] hover:bg-[#01204b]/90" onClick={handleSignUp}>
                  Sign up
                </Button>
              </>}
          </div>
        </div>
      </SheetContent>
    </Sheet>;

  return <nav className="fixed top-0 left-0 right-0 py-1 px-3 sm:px-4 md:px-6 z-50">
      {/* White pill background for the navbar */}
      <div className="max-w-7xl mx-auto bg-white rounded-full shadow-lg backdrop-blur-lg border border-white/30 py-1 sm:py-1.5 px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isMobile && <MobileNavigation />}

            <Link to="/" className="flex items-center gap-2">
              <LogoText />
            </Link>
          </div>

          <div className="hidden md:flex space-x-6 lg:space-x-8 mx-auto">
            <Link to="/" className="playfair-hover font-polysans-semibold text-xs lg:text-sm">Home</Link>
            <Link to="/search" className="playfair-hover font-polysans-semibold text-xs lg:text-sm">Browse</Link>
            <Link to="/sell/create" className="playfair-hover font-polysans-semibold text-xs lg:text-sm">Sell</Link>
            <Link to="/guide" className="playfair-hover font-polysans-semibold text-xs lg:text-sm">Guide</Link>
            <Link to="/about" className="playfair-hover font-polysans-semibold text-xs lg:text-sm">About</Link>
          </div>

          <div className="flex items-center gap-1 xs:gap-2 sm:gap-4">
            {isAuthenticated ? <div className="flex gap-1 xs:gap-2 sm:gap-4 items-center">
                <NotificationCenter />
                <ChatIcon />

                <Button variant="ghost" className="p-1 sm:p-2 text-xs sm:text-base relative text-foreground border-transparent hover:bg-transparent hover:text-current cursor-pointer" onClick={() => navigate('/dashboard')}>
                  <User size={isMobile ? 14 : 20} className="mr-1 sm:mr-2" />
                  <span className="font-polysans-semibold text-xs sm:text-sm">{user?.name || 'Account'}</span>

                {unreadCount > 0}
                </Button>
              </div> : <>
                <Button variant="translucent" className="font-polysans-semibold text-[10px] xs:text-xs sm:text-xs py-1 px-2 sm:py-1.5 sm:px-3 text-black h-6 sm:h-8" onClick={handleSignIn}>
                  Log In
                </Button>

                <Button variant="default" className="font-polysans-semibold text-[10px] xs:text-xs sm:text-xs py-1 px-2 sm:py-1.5 sm:px-3 text-white bg-[#01204b] hover:bg-[#01204b]/90 h-6 sm:h-8" onClick={handleSignUp}>
                  Sign up
                </Button>
              </>}
          </div>
        </div>
      </div>
    </nav>;
};

export default Navbar;

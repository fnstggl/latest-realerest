import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = location.pathname === '/';
  
  const {
    isAuthenticated,
    user
  } = useAuth();
  const {
    unreadCount
  } = useNotifications();

  // Handle scroll detection for non-home pages
  useEffect(() => {
    if (isHomePage) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleSignIn = () => {
    navigate('/signin');
  };
  const handleSignUp = () => {
    navigate('/signup');
  };
  const LogoText = () => <>
      <img alt="Realer Estate Logo" className="w-6 h-6 sm:w-6 sm:h-6 md:w-6 md:h-6 object-contain mt-[3px]" src="/lovable-uploads/14700a32-d53a-47c1-85a0-3cf22afea5f0.png" />
      <span className="text-[#fd4801] text-sm md:text-sm hidden md:block">
        <span className="font-polysans font-bold">Real</span>
        <span className="font-polysans font-bold italic">er</span>
        <span className="font-polysans font-bold"> Estate</span>
      </span>
    </>;
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
            <img src="/lovable-uploads/14700a32-d53a-47c1-85a0-3cf22afea5f0.png" alt="Realer Estate Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            <span className="text-black text-lg sm:text-xl md:text-2xl">
              <span className="font-polysans font-bold">Real</span>
              <span className="font-polysans font-bold italic">er</span>
              <span className="font-polysans font-bold"> Estate</span>
            </span>
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
                <Button variant="default" className="w-full justify-center font-polysans-semibold text-sm sm:text-base" onClick={handleSignUp}>
                  Sign up
                </Button>
              </>}
          </div>
        </div>
      </SheetContent>
    </Sheet>;

  // Determine navbar styling based on page and scroll state
  const getNavbarStyles = () => {
    if (isHomePage) {
      // Home page styling (unchanged)
      return "fixed top-1 left-0 right-0 px-3 sm:px-4 md:px-6 z-50";
    } else {
      // Other pages - sticky with scroll-based transparency
      return `fixed top-0 left-0 right-0 px-3 sm:px-4 md:px-6 z-50 transition-all duration-300 ${
        isScrolled ? 'pt-1' : 'pt-1'
      }`;
    }
  };

  const getNavbarContentStyles = () => {
    if (isHomePage) {
      // Home page styling (unchanged)
      return "max-w-7xl mx-auto bg-white rounded-full shadow-lg backdrop-blur-lg border border-white/30 py-1 sm:py-1.5 px-4 sm:px-6";
    } else {
      // Other pages - maintain rounded pill shape with transparency on scroll
      return `max-w-7xl mx-auto rounded-full shadow-lg backdrop-blur-lg border py-1 sm:py-1.5 px-4 sm:px-6 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/60 border-white/40' 
          : 'bg-white border-white/30'
      }`;
    }
  };

  return <nav className={getNavbarStyles()} style={isHomePage ? { paddingTop: '5px' } : {}}>
      {/* White pill background for the navbar */}
      <div className={getNavbarContentStyles()}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isMobile && <MobileNavigation />}

            <Link to="/" className="flex items-center gap-2">
              <LogoText />
            </Link>
          </div>

          <div className="hidden md:flex space-x-6 lg:space-x-8 mx-auto">
            <Link to="/" className="playfair-hover font-polysans-semibold text-sm lg:text-sm">Home</Link>
            <Link to="/search" className="playfair-hover font-polysans-semibold text-sm lg:text-sm">Browse</Link>
            <Link to="/sell/create" className="playfair-hover font-polysans-semibold text-sm lg:text-sm">Sell</Link>
            <Link to="/guide" className="playfair-hover font-polysans-semibold text-sm lg:text-sm">Guide</Link>
            <Link to="/about" className="playfair-hover font-polysans-semibold text-sm lg:text-sm">About</Link>
          </div>

          <div className="flex items-center gap-1 xs:gap-2 sm:gap-4">
            {isAuthenticated ? <div className="flex gap-1 xs:gap-1 sm:gap-2 items-center">
                <div className="p-0">
                  <NotificationCenter />
                </div>
                <div className="p-0">
                  <ChatIcon />
                </div>

                <Button variant="ghost" className="p-1 sm:p-1 text-xs sm:text-base relative text-foreground border-transparent hover:bg-transparent hover:text-current cursor-pointer" onClick={() => navigate('/dashboard')}>
                  <User size={isMobile ? 14 : 20} className="mr-1 sm:mr-2" />
                  <span className="font-polysans-semibold text-xs sm:text-sm">{user?.name || 'Account'}</span>

                {unreadCount > 0}
                </Button>
              </div> : <>
                <Button variant="translucent" className="font-polysans-semibold text-xs sm:text-sm py-0.5 px-1.5 sm:py-1 sm:px-2 text-black h-6 sm:h-7" onClick={handleSignIn}>
                  Log In
                </Button>

                <Button className="font-polysans-semibold text-xs sm:text-sm py-0.5 px-1.5 sm:py-1 sm:px-2 text-white bg-[#01204b] hover:bg-[#01204b]/90 h-6 sm:h-7" onClick={handleSignUp}>
                  Sign up
                </Button>
              </>}
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;

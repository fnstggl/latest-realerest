
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, User, Search, Bell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const MobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col gap-6 mt-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-donedeal-navy rounded-lg text-white flex items-center justify-center font-bold text-lg">DD</div>
            <span className="font-futura text-donedeal-navy text-xl">DoneDeal</span>
          </Link>
          
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-medium py-2">Home</Link>
            <Link to="/search" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-medium py-2">Search</Link>
            <Link to="/sell" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-medium py-2">Sell</Link>
            <Link to="/blog" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-medium py-2">Blog</Link>
          </nav>
          
          <div className="flex flex-col gap-3 mt-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            
            <Button 
              className="w-full justify-start bg-donedeal-navy hover:bg-donedeal-navy/90"
              onClick={handleSignUp}
            >
              Get Started
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="bg-white border-b border-gray-100 py-3 px-4 md:px-6 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isMobile && <MobileNavigation />}
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-donedeal-navy rounded-lg text-white flex items-center justify-center font-bold text-lg">DD</div>
            <span className="font-futura text-donedeal-navy text-xl hidden md:block">DoneDeal</span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-futura">Home</Link>
          <Link to="/search" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-futura">Search</Link>
          <Link to="/sell" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-futura">Sell</Link>
          <Link to="/blog" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-futura">Blog</Link>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" asChild className="text-donedeal-dark-gray hover:text-donedeal-navy rounded-full">
              <Link to="/search">
                <Search size={20} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="text-donedeal-dark-gray hover:text-donedeal-navy rounded-full md:hidden">
              <Link to="/">
                <Home size={20} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="text-donedeal-dark-gray hover:text-donedeal-navy rounded-full">
              <Link to="/notifications">
                <Bell size={20} />
              </Link>
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="hidden md:flex font-futura"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          
          <Button 
            className="bg-donedeal-navy hover:bg-donedeal-navy/90 font-futura"
            onClick={handleSignUp}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, User, Search, Bell } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-100 py-3 px-4 md:px-6 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-donedeal-navy rounded-lg text-white flex items-center justify-center font-bold text-lg">DD</div>
          <span className="font-semibold text-donedeal-navy text-xl hidden md:block">DoneDeal</span>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-medium">Home</Link>
          <Link to="/search" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-medium">Search</Link>
          <Link to="/sell" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-medium">Sell</Link>
          <Link to="/blog" className="text-donedeal-dark-gray hover:text-donedeal-navy transition-colors font-medium">Blog</Link>
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
          
          <Button asChild variant="outline" className="hidden md:flex">
            <Link to="/signin">Sign In</Link>
          </Button>
          
          <Button asChild className="bg-donedeal-navy hover:bg-donedeal-navy/90">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import LocationAlertForm from '@/components/LocationAlertForm';
import { Separator } from "@/components/ui/separator";

const SiteFooter: React.FC = () => {
  return <footer className="bg-white py-12 border-t border-gray-100">
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
              <img src="/lovable-uploads/bc372b10-d371-4de2-bbc1-edbd6483d58b.png" alt="Realer Estate Logo" className="w-10 h-10 object-contain" />
              <span className="text-[#fd4801] text-xl">
                <span className="font-polysans font-bold">Real</span>
                <span className="font-polysans font-bold italic">er</span>
                <span className="font-polysans font-bold"> Estate</span>
              </span>
            </Link>
            <p className="text-gray-600 font-polysans font-bold">Connecting families with affordable housing—fast.</p>
          </div>
          
          <div>
            <h3 className="font-polysans font-bold text-[#01204b] mb-4 text-lg">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/search" className="text-gray-600 hover:text-black transition-colors font-polysans-semibold">Search Homes</Link></li>
              <li><Link to="/sell/create" className="text-gray-600 hover:text-black transition-colors font-polysans-semibold">List Property</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-black transition-colors font-polysans-semibold">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-polysans font-bold text-[#01204b] mb-4 text-lg">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-black transition-colors font-polysans-semibold">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-black transition-colors font-polysans-semibold">Blog</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-black transition-colors font-polysans-semibold">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-black transition-colors font-polysans-semibold">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-polysans font-bold text-[#01204b] mb-4 text-lg">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-600 hover:text-black transition-colors font-polysans-semibold">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-black transition-colors font-polysans-semibold">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-black transition-colors font-polysans-semibold">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <LocationAlertForm />
        
        <div className="text-center text-gray-500 pt-6 border-t border-gray-100 mt-8">
          <p className="font-medium">© {new Date().getFullYear()} Realer Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};

export default SiteFooter;

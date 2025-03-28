
import React from 'react';
import { Link } from 'react-router-dom';

const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-white py-10 border-t-4 border-black">
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-[#d60013] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black">DD</div>
              <span className="font-bold text-black text-2xl">DoneDeal</span>
            </Link>
            <p className="text-black">
              Connecting families to affordable housing—fast.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-black mb-4 text-xl">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/search" className="text-black hover:text-[#d60013] font-bold">Search Homes</Link></li>
              <li><Link to="/sell/create" className="text-black hover:text-[#d60013] font-bold">List Property</Link></li>
              <li><Link to="/pricing" className="text-black hover:text-[#d60013] font-bold">Pricing</Link></li>
              <li><Link to="/faq" className="text-black hover:text-[#d60013] font-bold">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-black mb-4 text-xl">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-black hover:text-[#d60013] font-bold">About Us</Link></li>
              <li><Link to="/blog" className="text-black hover:text-[#d60013] font-bold">Blog</Link></li>
              <li><Link to="/careers" className="text-black hover:text-[#d60013] font-bold">Careers</Link></li>
              <li><Link to="/contact" className="text-black hover:text-[#d60013] font-bold">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-black mb-4 text-xl">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-black hover:text-[#d60013] font-bold">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-black hover:text-[#d60013] font-bold">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-black hover:text-[#d60013] font-bold">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t-2 border-black text-center text-black">
          <p className="font-bold">© {new Date().getFullYear()} DoneDeal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

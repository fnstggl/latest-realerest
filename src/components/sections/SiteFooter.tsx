
import React from 'react';
import { Link } from 'react-router-dom';

const SiteFooter: React.FC = () => {
  return (
    <footer className="pt-10 pb-4 relative overflow-hidden">
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="glass-card p-8 rounded-xl mb-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
                <div className="w-12 h-12 bg-white rounded-full text-[#0892D0] flex items-center justify-center font-bold text-lg border border-[#0892D0] shadow-[0_0_10px_rgba(8,146,208,0.5)]">RE</div>
                <span className="font-bold text-foreground text-2xl">Realer Estate</span>
              </Link>
              <p className="text-foreground/80">
                Connecting families to affordable housing—fast.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-foreground mb-4 text-xl">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/search" className="text-foreground/80 gradient-hover-text font-medium">Search Homes</Link></li>
                <li><Link to="/sell/create" className="text-foreground/80 gradient-hover-text font-medium">List Property</Link></li>
                <li><Link to="/faq" className="text-foreground/80 gradient-hover-text font-medium">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-foreground mb-4 text-xl">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-foreground/80 gradient-hover-text font-medium">About Us</Link></li>
                <li><Link to="/blog" className="text-foreground/80 gradient-hover-text font-medium">Blog</Link></li>
                <li><Link to="/careers" className="text-foreground/80 gradient-hover-text font-medium">Careers</Link></li>
                <li><Link to="/contact" className="text-foreground/80 gradient-hover-text font-medium">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-foreground mb-4 text-xl">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-foreground/80 gradient-hover-text font-medium">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-foreground/80 gradient-hover-text font-medium">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-foreground/80 gradient-hover-text font-medium">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center text-foreground/70">
          <p className="font-medium">© {new Date().getFullYear()} Realer Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

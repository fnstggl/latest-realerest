
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

interface Listing {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  image: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
}

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from a real API
    const fetchListings = async () => {
      setLoading(true);
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Removing mock listings to allow for real listings to show
        setListings([]);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 lg:px-8 mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div 
              className="order-2 md:order-1"
              variants={fadeInUp}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-4">
                Find your dream home...
              </h1>
              <div className="bg-[#d60013] inline-block mb-6 px-3 py-1 -rotate-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                  we'll find your dream price
                </h1>
              </div>
              <p className="text-xl text-black mb-8">
                Connecting families to affordable housing—fast. Discover properties below market value through DoneDeal's exclusive platform.
              </p>
              <div className="mb-8">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter location, zipcode, or address..." 
                    className="w-full px-6 py-4 text-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0"
                  />
                  <Button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#d60013] hover:bg-[#d60013]/90 text-white font-bold h-10 w-10 border-2 border-black flex items-center justify-center"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild 
                  className="neo-button-primary"
                >
                  <Link to="/search">Get Started</Link>
                </Button>
                <Button asChild 
                  variant="outline" 
                  className="neo-button"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              className="order-1 md:order-2"
              variants={fadeInUp}
            >
              <div className="w-full h-[400px] neo-container flex items-center justify-center">
                <h3 className="text-2xl font-bold">Home Sweet Home</h3>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Properties */}
      <motion.section 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="flex items-center mb-10">
            <div className="bg-[#d60013] inline-block px-3 py-1 -rotate-1 border-4 border-black">
              <h2 className="text-3xl font-bold text-white">Featured</h2>
            </div>
            <h2 className="text-3xl font-bold text-black ml-4">Properties</h2>
          </div>
          <p className="text-xl text-black mb-8">
            Discover properties below market value, exclusively available through DoneDeal.
          </p>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="border-4 border-black p-4 h-[400px] animate-pulse">
                  <div className="bg-gray-200 h-[240px] w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {listings.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {listings.map((property, index) => (
                    <motion.div 
                      key={property.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <PropertyCard {...property} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-2xl font-bold text-black mb-6">No properties have been listed yet.</h3>
                  <Button
                    className="neo-button-primary"
                    onClick={() => navigate('/sell')}
                  >
                    List Your Property
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.section>
      
      {/* CTA Section - Changed black background to white */}
      <motion.section 
        className="py-16 bg-white text-black border-t-4 border-b-4 border-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Ready to find your 
                <span className="bg-[#d60013] text-white px-2 mx-2 font-bold">
                  dream home?
                </span>
              </h2>
              <p className="text-xl mb-8">
                Get started today and discover properties below market value in your desired location.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="neo-button-primary">
                  <Link to="/search">Get Started</Link>
                </Button>
                <Button asChild variant="outline" className="neo-button">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div>
              <div className="w-full h-[300px] neo-container flex items-center justify-center">
                <h3 className="text-2xl font-bold">Find Your Dream Home</h3>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Footer */}
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
                <li><Link to="/sell" className="text-black hover:text-[#d60013] font-bold">List Property</Link></li>
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
    </div>
  );
};

export default Index;

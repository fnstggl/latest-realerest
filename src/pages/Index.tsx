
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data
const featuredProperties = [
  {
    id: "prop1",
    title: "Modern Craftsman Home",
    price: 425000,
    marketPrice: 520000,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=roam-in-color-z3QZ6gjGKOA-unsplash.jpg",
    location: "Portland, OR",
    beds: 3,
    baths: 2,
    sqft: 1850,
    belowMarket: 18,
  },
  {
    id: "prop2",
    title: "Downtown Luxury Condo",
    price: 610000,
    marketPrice: 750000,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=scott-webb-167099-unsplash.jpg",
    location: "Seattle, WA",
    beds: 2,
    baths: 2,
    sqft: 1200,
    belowMarket: 19,
  },
  {
    id: "prop3",
    title: "Renovated Victorian",
    price: 750000,
    marketPrice: 900000,
    image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=todd-kent-178j8tJrNlc-unsplash.jpg",
    location: "San Francisco, CA",
    beds: 4,
    baths: 3,
    sqft: 2400,
    belowMarket: 17,
  },
];

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

const Index: React.FC = () => {
  const navigate = useNavigate();

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
              <div className="bg-[#ea384c] inline-block mb-6 px-3 py-1 -rotate-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-bold h-10 w-10 border-2 border-black flex items-center justify-center"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild 
                  className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-bold border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none px-8 py-6 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <Link to="/search">Get Started</Link>
                </Button>
                <Button asChild 
                  variant="outline" 
                  className="font-bold border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none px-8 py-6 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              className="order-1 md:order-2"
              variants={fadeInUp}
            >
              <img 
                src="public/lovable-uploads/9a4a61cb-4c49-4371-af9a-8d35a6d2c16f.png" 
                alt="Dream Home" 
                className="w-full h-auto border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              />
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
            <div className="bg-[#ea384c] inline-block px-3 py-1 -rotate-1 border-4 border-black">
              <h2 className="text-3xl font-bold text-white">Featured</h2>
            </div>
            <h2 className="text-3xl font-bold text-black ml-4">Properties</h2>
          </div>
          <p className="text-xl text-black mb-8">
            Discover properties below market value, exclusively available through DoneDeal.
          </p>
          
          {featuredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
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
                className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-3 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                onClick={() => navigate('/sell')}
              >
                List Your Property
              </Button>
            </div>
          )}
        </div>
      </motion.section>
      
      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-black text-white"
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
                <span className="bg-[#ea384c] text-white px-2 mx-2 font-bold">
                  dream home?
                </span>
              </h2>
              <p className="text-xl mb-8">
                Get started today and discover properties below market value in your desired location.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild 
                  className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-bold border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] rounded-none px-8 py-6 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] transition-all"
                >
                  <Link to="/search">Get Started</Link>
                </Button>
                <Button asChild 
                  variant="outline" 
                  className="text-white font-bold border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] rounded-none px-8 py-6 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] transition-all"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div>
              <img 
                src="public/lovable-uploads/d0e77653-32be-41fe-ae3e-bb2b1a0b5c93.png" 
                alt="Dream Home" 
                className="w-full h-auto border-4 border-white"
              />
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
                <div className="w-12 h-12 bg-[#ea384c] rounded-full text-white flex items-center justify-center font-bold text-lg border-2 border-black">DD</div>
                <span className="font-bold text-black text-2xl">DoneDeal</span>
              </Link>
              <p className="text-black">
                Connecting families to affordable housing—fast.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-black mb-4 text-xl">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/search" className="text-black hover:text-[#ea384c] font-bold">Search Homes</Link></li>
                <li><Link to="/sell" className="text-black hover:text-[#ea384c] font-bold">List Property</Link></li>
                <li><Link to="/pricing" className="text-black hover:text-[#ea384c] font-bold">Pricing</Link></li>
                <li><Link to="/faq" className="text-black hover:text-[#ea384c] font-bold">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-black mb-4 text-xl">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-black hover:text-[#ea384c] font-bold">About Us</Link></li>
                <li><Link to="/blog" className="text-black hover:text-[#ea384c] font-bold">Blog</Link></li>
                <li><Link to="/careers" className="text-black hover:text-[#ea384c] font-bold">Careers</Link></li>
                <li><Link to="/contact" className="text-black hover:text-[#ea384c] font-bold">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-black mb-4 text-xl">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-black hover:text-[#ea384c] font-bold">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-black hover:text-[#ea384c] font-bold">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-black hover:text-[#ea384c] font-bold">Cookie Policy</Link></li>
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

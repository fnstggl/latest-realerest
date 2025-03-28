import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Search, ShoppingCart, Info, Phone, Mail } from 'lucide-react';
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
    // Fetch property listings from localStorage
    const fetchListings = () => {
      setLoading(true);
      try {
        const storedListings = localStorage.getItem('propertyListings');
        if (storedListings) {
          const parsedListings = JSON.parse(storedListings);
          setListings(parsedListings);
        } else {
          setListings([]);
        }
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
              <SearchBar className="mb-8" />
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
              <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <h3 className="text-2xl font-bold">Ready to find your dream home at the perfect price?</h3>
                <p className="mt-4">DoneDeal connects you with exclusive properties below market value. Sign up today to get started!</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Browse Section */}
      <motion.section 
        className="py-16 bg-white border-t-4 border-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <Search size={32} className="mr-4 text-[#d60013]" />
                <div className="bg-[#d60013] inline-block px-3 py-1 -rotate-1 border-4 border-black">
                  <h2 className="text-3xl font-bold text-white">Browse</h2>
                </div>
              </div>
              <p className="text-xl text-black max-w-xl">
                Search through our exclusive catalog of below-market properties. Filter by location, price, size, and more to find your perfect match.
              </p>
            </div>
            <Button asChild 
              className="neo-button-primary"
            >
              <Link to="/search">Browse Properties</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
              <h3 className="text-xl font-bold mb-4">Find By Location</h3>
              <p>Search properties in your desired neighborhoods or discover new areas with great value.</p>
              <Button asChild className="mt-4 neo-button" variant="outline">
                <Link to="/search?filter=location">Search Locations</Link>
              </Button>
            </div>
            
            <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
              <h3 className="text-xl font-bold mb-4">Filter By Price</h3>
              <p>Set your budget and find the best deals within your price range. Sort by biggest discounts.</p>
              <Button asChild className="mt-4 neo-button" variant="outline">
                <Link to="/search?filter=price">Filter Prices</Link>
              </Button>
            </div>
            
            <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
              <h3 className="text-xl font-bold mb-4">Property Features</h3>
              <p>Looking for specific amenities? Filter by bedrooms, bathrooms, square footage, and more.</p>
              <Button asChild className="mt-4 neo-button" variant="outline">
                <Link to="/search?filter=features">View Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Sell Section */}
      <motion.section 
        className="py-16 bg-white border-t-4 border-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <ShoppingCart size={32} className="mr-4 text-[#d60013]" />
                <div className="bg-[#d60013] inline-block px-3 py-1 -rotate-1 border-4 border-black">
                  <h2 className="text-3xl font-bold text-white">Sell</h2>
                </div>
              </div>
              <p className="text-xl text-black max-w-xl">
                Need to sell your property fast? List with DoneDeal to connect with motivated buyers and close deals quickly without the usual hassle.
              </p>
            </div>
            <Button asChild 
              className="neo-button-primary"
            >
              <Link to="/sell/create">List Your Property</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
              <h3 className="text-2xl font-bold mb-6">Why Sell With DoneDeal?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                  <span className="text-lg">Fast closing process - most properties sell within 30 days</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                  <span className="text-lg">Lower fees than traditional real estate agents</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                  <span className="text-lg">Direct connection with serious, pre-approved buyers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                  <span className="text-lg">Simple, transparent process from listing to closing</span>
                </li>
              </ul>
            </div>
            
            <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
              <h3 className="text-2xl font-bold mb-6">How It Works</h3>
              <ol className="space-y-6">
                <li className="flex">
                  <div className="w-8 h-8 mr-4 bg-[#d60013] text-white flex items-center justify-center font-bold border-2 border-black">1</div>
                  <div>
                    <h4 className="font-bold text-lg">Create Your Listing</h4>
                    <p>Add photos, details, and your asking price</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="w-8 h-8 mr-4 bg-[#d60013] text-white flex items-center justify-center font-bold border-2 border-black">2</div>
                  <div>
                    <h4 className="font-bold text-lg">Connect With Buyers</h4>
                    <p>Receive waitlist requests from interested buyers</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="w-8 h-8 mr-4 bg-[#d60013] text-white flex items-center justify-center font-bold border-2 border-black">3</div>
                  <div>
                    <h4 className="font-bold text-lg">Close The Deal</h4>
                    <p>Finalize the sale with our streamlined process</p>
                  </div>
                </li>
              </ol>
              <Button asChild className="w-full mt-8 neo-button-primary">
                <Link to="/sell/create">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* About Section */}
      <motion.section 
        className="py-16 bg-white border-t-4 border-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="flex items-center mb-10">
            <Info size={32} className="mr-4 text-[#d60013]" />
            <div className="bg-[#d60013] inline-block px-3 py-1 -rotate-1 border-4 border-black">
              <h2 className="text-3xl font-bold text-white">About</h2>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
              <p className="text-lg mb-6">
                At DoneDeal, we're on a mission to make home ownership more accessible by connecting buyers directly with properties below market value.
              </p>
              <p className="text-lg mb-6">
                Our platform eliminates unnecessary middlemen and reduces fees, making the real estate process faster, simpler, and more affordable for everyone.
              </p>
              <Button asChild className="neo-button">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
            
            <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
              <h3 className="text-2xl font-bold mb-6">Why DoneDeal?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                  <span className="text-lg">Properties priced 15-30% below market value</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                  <span className="text-lg">Direct connection between buyers and sellers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                  <span className="text-lg">Verified listings and pre-approved buyers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={24} className="mr-3 text-[#d60013] flex-shrink-0" />
                  <span className="text-lg">Faster closing times than traditional real estate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Contact Section */}
      <motion.section 
        className="py-16 bg-white border-t-4 border-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="flex items-center mb-10">
            <Phone size={32} className="mr-4 text-[#d60013]" />
            <div className="bg-[#d60013] inline-block px-3 py-1 -rotate-1 border-4 border-black">
              <h2 className="text-3xl font-bold text-white">Contact</h2>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6">Get In Touch</h3>
              <p className="text-lg mb-6">
                Have questions about how DoneDeal works? Want to learn more about listing your property or finding your dream home? Our team is here to help!
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Mail size={24} className="mr-3 text-[#d60013]" />
                  <span className="font-bold">info@donedeal.com</span>
                </div>
                <div className="flex items-center">
                  <Phone size={24} className="mr-3 text-[#d60013]" />
                  <span className="font-bold">(555) 123-4567</span>
                </div>
              </div>
              <Button asChild className="neo-button-primary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            
            <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
              <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg">How do I join a property waitlist?</h4>
                  <p>Create an account, browse properties, and click "Join Waitlist" on listings you're interested in.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Are there any fees to join?</h4>
                  <p>Basic accounts are free. We only charge a small fee when you successfully purchase or sell a property.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg">How quickly can I sell my home?</h4>
                  <p>Most properties on DoneDeal sell within 30 days of listing, much faster than traditional methods.</p>
                </div>
              </div>
              <Button asChild className="w-full mt-8 neo-button">
                <Link to="/faq">View All FAQs</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Featured Properties */}
      <motion.section 
        className="py-16 bg-white border-t-4 border-black"
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
                    onClick={() => navigate('/sell/create')}
                  >
                    List Your Property
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.section>
      
      {/* CTA Section */}
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
              <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <h3 className="text-2xl font-bold">Join thousands of satisfied homebuyers who found their perfect property at the perfect price with DoneDeal.</h3>
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
    </div>
  );
};

export default Index;

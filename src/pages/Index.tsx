
import React from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import TestimonialCard from '@/components/TestimonialCard';
import FlatIllustration from '@/components/FlatIllustration';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "First-time Homebuyer",
    content: "DoneDeal helped us find our dream home at 15% below market value. The process was smooth, and we closed in just 3 weeks!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    role: "Real Estate Investor",
    content: "I've used many platforms to find investment properties, but DoneDeal consistently offers the best below-market deals.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jessica Williams",
    role: "Homeowner",
    content: "Sold my house quickly and saved thousands on agent fees. The waitlist feature gave me peace of mind about who was viewing my home.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-donedeal-pink/30 to-donedeal-blue/30 pt-16 pb-20">
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-donedeal-navy leading-tight mb-4 animate-fade-in">
                Find your <span className="text-donedeal-orange">best home</span> at below market prices
              </h1>
              <p className="text-xl text-gray-700 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Connecting families to affordable housing—fast. Save up to 30% below market value.
              </p>
              <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <SearchBar />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Button asChild size="lg" className="bg-donedeal-navy hover:bg-donedeal-navy/90">
                  <Link to="/search">Find a Home</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/sell">List Your Property</Link>
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="text-gray-700">Below market prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="text-gray-700">Verified sellers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="text-gray-700">Private waitlists</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="text-gray-700">Fast closing</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center animate-scale-in">
              <FlatIllustration />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-donedeal-navy">Featured Below-Market Deals</h2>
            <Button asChild variant="ghost" className="flex items-center gap-1 text-donedeal-navy">
              <Link to="/search">
                View all
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                {...property}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-donedeal-navy mb-3">How DoneDeal Works</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Our platform connects you directly with motivated sellers offering below-market properties.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-donedeal-blue/20 hover:bg-donedeal-blue/30 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-donedeal-navy">1</span>
              </div>
              <h3 className="text-xl font-semibold text-donedeal-navy mb-2">Search Properties</h3>
              <p className="text-gray-700">
                Browse homes listed below market value with detailed information, photos, and price comparisons.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-donedeal-pink/20 hover:bg-donedeal-pink/30 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-donedeal-navy">2</span>
              </div>
              <h3 className="text-xl font-semibold text-donedeal-navy mb-2">Join Waitlist</h3>
              <p className="text-gray-700">
                Request to join the property's private waitlist. Once approved, view the exact location and schedule viewings.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-donedeal-green/20 hover:bg-donedeal-green/30 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-donedeal-navy">3</span>
              </div>
              <h3 className="text-xl font-semibold text-donedeal-navy mb-2">Close the Deal</h3>
              <p className="text-gray-700">
                Work directly with sellers for a fast, streamlined closing process. Save on both time and money.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-donedeal-blue/30 to-donedeal-pink/30">
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-donedeal-navy mb-3">What Our Users Say</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Success stories from buyers and sellers who've found great deals on DoneDeal.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-donedeal-navy text-white">
        <div className="container px-4 lg:px-8 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your below-market dream home?</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of buyers and sellers who are saving money with DoneDeal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-donedeal-orange hover:bg-donedeal-orange/90">
              <Link to="/search">Find a Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/sell">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-10 border-t border-gray-200">
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-donedeal-navy rounded-lg text-white flex items-center justify-center font-bold text-lg">DD</div>
                <span className="font-semibold text-donedeal-navy text-xl">DoneDeal</span>
              </Link>
              <p className="text-gray-600">
                Connecting families to affordable housing—fast.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-donedeal-navy mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/search" className="text-gray-600 hover:text-donedeal-navy">Search Homes</Link></li>
                <li><Link to="/sell" className="text-gray-600 hover:text-donedeal-navy">List Property</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-donedeal-navy">Pricing</Link></li>
                <li><Link to="/faq" className="text-gray-600 hover:text-donedeal-navy">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-donedeal-navy mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-donedeal-navy">About Us</Link></li>
                <li><Link to="/blog" className="text-gray-600 hover:text-donedeal-navy">Blog</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-donedeal-navy">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-donedeal-navy">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-donedeal-navy mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-600 hover:text-donedeal-navy">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-donedeal-navy">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-gray-600 hover:text-donedeal-navy">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} DoneDeal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

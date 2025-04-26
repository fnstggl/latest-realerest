import React from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Users, ClipboardCheck, Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
const GuideBuying: React.FC = () => {
  const navigate = useNavigate();
  const steps = [{
    number: 1,
    title: 'Find a property you love',
    description: 'Browse our selection of below-market value properties. Use filters to narrow down your search based on location, price, and property features.',
    icon: Search,
    link: '/search',
    linkText: 'Browse Properties',
    image: '/lovable-uploads/e7c82a7c-28f7-473c-aa5e-9c31e8db0bf8.png'
  }, {
    number: 2,
    title: 'Join the waitlist to contact sellers directly',
    description: "When you find a property you're interested in, join its waitlist to get direct access to the seller. This gives you an opportunity to ask questions and express your interest.",
    icon: Users,
    link: '/search',
    linkText: 'Discover Properties',
    image: '/lovable-uploads/e7c82a7c-28f7-473c-aa5e-9c31e8db0bf8.png'
  }, {
    number: 3,
    title: 'Send in an offer',
    description: "Once you've found your ideal property and connected with the seller, submit your offer directly through our platform. You can negotiate terms and make contingent offers.",
    icon: ClipboardCheck,
    link: '/dashboard',
    linkText: 'View Your Dashboard',
    image: '/lovable-uploads/e7c82a7c-28f7-473c-aa5e-9c31e8db0bf8.png'
  }, {
    number: 4,
    title: 'Get the keys',
    description: 'After your offer is accepted, complete the transaction process and receive the keys to your new home. Congratulations on your below-market purchase!',
    icon: Key,
    link: '/faq',
    linkText: 'Read FAQs',
    image: '/lovable-uploads/e7c82a7c-28f7-473c-aa5e-9c31e8db0bf8.png'
  }];
  return <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <motion.h1 initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5
          }} className="text-3xl md:text-4xl font-futura-extra-bold">
              <span className="font-futura-extra-bold">How to </span>
              <span className="font-playfair italic font-bold">Buy</span>
              <span className="font-futura-extra-bold"> with Realer Estate</span>
            </motion.h1>
            
            <Button variant="ghost" onClick={() => navigate('/guide')} className="flex items-center gap-2">
              <ArrowLeft size={18} />
              <span>Back to Guides</span>
            </Button>
          </div>
          
          <motion.p initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }} className="text-gray-600 mb-12 text-lg">
            Follow these simple steps to find and purchase below-market properties through our platform.
          </motion.p>
          
          <div className="space-y-16 md:space-y-24">
            {/* Step 1 */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2 md:pr-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white flex items a\center justify-center">
                    <Search size={32} className="text-black" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    <span className="font-playfair italic pr-2">Step 1:</span>
                    Find a property you love
                  </h2>
                  <p className="text-gray-600 mb-6">Browse our selection of below-market value properties. Use filters to narrow down your search based on location, price, and property features.</p>
                  <Link to="/search">
                    <Button className="relative bg-white text-black border border-transparent hover:bg-white group">
                      Browse Properties
                      <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" style={{
                      background: "transparent",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "border-box",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude"
                    }} />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 relative">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img alt="Find a property you love" className="w-full h-auto" src="/lovable-uploads/637849fa-cf2e-4528-a247-557df386b00e.png" />
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2 md:pl-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <Users size={32} className="text-black" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    <span className="font-playfair italic pr-2">Step 2:</span>
                    Join the waitlist to contact sellers directly
                  </h2>
                  <p className="text-gray-600 mb-6">When you find a property you're interested in, join its waitlist to get direct access to the seller. This gives you an opportunity to ask questions and express your interest.</p>
                  <Link to="/search">
                    <Button className="relative bg-white text-black border border-transparent hover:bg-white group">
                      Discover Properties
                      <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" style={{
                      background: "transparent",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "border-box",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude"
                    }} />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 relative">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img alt="Join the waitlist" className="w-full h-auto" src="/lovable-uploads/8fc09b02-e367-4b00-9a0e-0018170f60cf.png" />
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }} className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2 md:pr-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <ClipboardCheck size={32} className="text-black" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    <span className="font-playfair italic pr-2">Step 3:</span>
                    Send in an offer
                  </h2>
                  <p className="text-gray-600 mb-6">Once you've found your ideal property and connected with the seller, submit your offer directly through our platform. You can negotiate terms and make contingent offers.</p>
                  <Link to="/dashboard">
                    <Button className="relative bg-white text-black border border-transparent hover:bg-white group">
                      View Your Dashboard
                      <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" style={{
                      background: "transparent",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "border-box",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude"
                    }} />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 relative">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img alt="Send in an offer" className="w-full h-auto" src="/lovable-uploads/57567df8-e8fd-4f5d-b8d2-23355d03943d.png" />
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.5
          }} className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2 md:pl-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <Key size={32} className="text-black" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    <span className="font-playfair italic pr-2">Step 4:</span>
                    Get the keys
                  </h2>
                  <p className="text-gray-600 mb-6">After your offer is accepted, complete the transaction process and receive the keys to your new home. Congratulations on your below-market purchase!</p>
                  <Link to="/faq">
                    <Button className="relative bg-white text-black border border-transparent hover:bg-white group">
                      Read FAQs
                      <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" style={{
                      background: "transparent",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "border-box",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude"
                    }} />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 relative">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img alt="Get the keys" className="w-full h-auto" src="/lovable-uploads/860e85dd-90ec-4699-a497-666240a0c6e5.png" />
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.7
        }} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to find your dream home?</h2>
            <p className="text-gray-600 mb-6">Start browsing our selection of below-market value properties today.</p>
            <Link to="/search">
              <Button className="px-8 py-6 h-auto text-lg relative bg-white text-black border border-transparent hover:bg-white group">
                Browse Properties
                <span className="absolute inset-[-2px] -z-10 opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" style={{
                background: "transparent",
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                backgroundOrigin: "border-box",
                backgroundClip: "border-box",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude"
              }} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      <SiteFooter />
    </div>;
};
export default GuideBuying;
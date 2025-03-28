
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { User, Home, Settings, LogOut, Plus, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');
  
  const toggleAccountType = () => {
    setAccountType(accountType === 'buyer' ? 'seller' : 'buyer');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="flex flex-col md:flex-row gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-black">
                <div className="w-16 h-16 bg-black rounded-none text-white flex items-center justify-center font-bold text-xl border-2 border-black">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">User Name</h2>
                  <p className="text-gray-600 font-bold">user@example.com</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Account Type</h3>
                <div className="flex border-2 border-black">
                  <Button
                    className={`w-1/2 py-3 rounded-none font-bold ${accountType === 'buyer' ? 'bg-[#ea384c] text-white' : 'bg-white text-black'}`}
                    onClick={() => setAccountType('buyer')}
                  >
                    Buyer
                  </Button>
                  <Button
                    className={`w-1/2 py-3 rounded-none font-bold ${accountType === 'seller' ? 'bg-[#ea384c] text-white' : 'bg-white text-black'}`}
                    onClick={() => setAccountType('seller')}
                  >
                    Seller
                  </Button>
                </div>
                <p className="text-sm mt-2">
                  {accountType === 'buyer' ? 
                    'You can search and favorite properties.' : 
                    'You can create and manage property listings.'}
                </p>
              </div>
              
              <nav className="space-y-2">
                <Link to="/dashboard" className="flex items-center gap-2 py-3 px-4 bg-[#ea384c] text-white font-bold border-2 border-black">
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/profile" className="flex items-center gap-2 py-3 px-4 font-bold border-2 border-black hover:bg-black hover:text-white transition-colors">
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="flex items-center gap-2 py-3 px-4 font-bold border-2 border-black hover:bg-black hover:text-white transition-colors">
                  <Settings size={20} />
                  <span>Settings</span>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-start gap-2 py-3 px-4 font-bold border-2 border-black hover:bg-black hover:text-white transition-colors rounded-none"
                  onClick={() => {
                    toast.success("Successfully logged out!");
                    navigate('/');
                  }}
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </Button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <h1 className="text-3xl font-bold mb-6 pb-4 border-b-2 border-black">
                {accountType === 'buyer' ? 'Buyer Dashboard' : 'Seller Dashboard'}
              </h1>
              
              {accountType === 'buyer' ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Saved Properties</h2>
                    <div className="bg-gray-100 p-8 text-center border-2 border-black">
                      <p className="text-lg font-bold mb-4">You haven't saved any properties yet.</p>
                      <Button
                        className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-3 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        onClick={() => navigate('/search')}
                      >
                        Browse Properties
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold mb-4">Recent Searches</h2>
                    <div className="bg-gray-100 p-8 text-center border-2 border-black">
                      <p className="text-lg font-bold mb-4">No recent searches.</p>
                      <Button
                        className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-3 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        onClick={() => navigate('/search')}
                      >
                        Start Searching
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Your Listings</h2>
                      <Button
                        className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-4 py-2 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        onClick={() => navigate('/sell/create')}
                      >
                        <Plus size={18} className="mr-2" />
                        Add New Listing
                      </Button>
                    </div>
                    <div className="bg-gray-100 p-8 text-center border-2 border-black">
                      <p className="text-lg font-bold mb-4">You haven't created any listings yet.</p>
                      <Button
                        className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-3 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        onClick={() => navigate('/sell/create')}
                      >
                        Create Your First Listing
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold mb-4">Listing Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border-2 border-black p-4 text-center">
                        <p className="text-3xl font-bold">0</p>
                        <p className="font-bold">Active Listings</p>
                      </div>
                      <div className="border-2 border-black p-4 text-center">
                        <p className="text-3xl font-bold">0</p>
                        <p className="font-bold">Total Views</p>
                      </div>
                      <div className="border-2 border-black p-4 text-center">
                        <p className="text-3xl font-bold">0</p>
                        <p className="font-bold">Inquiries</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

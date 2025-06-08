
import React, { useState, useEffect } from 'react';
import { Phone, Mail, User, MessageSquare, Clock, Copy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SellerContactInfoProps {
  name?: string;
  phone?: string | null;
  email?: string | null;
  showContact: boolean;
  sellerId?: string | null;
  waitlistStatus?: string | null;
  propertyId?: string;
  propertyTitle?: string;
}

const SellerContactInfo: React.FC<SellerContactInfoProps> = ({ 
  name, 
  phone, 
  email, 
  showContact,
  sellerId,
  waitlistStatus,
  propertyId,
  propertyTitle
}) => {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [sellerEmail, setSellerEmail] = useState<string | null>(null);
  const [sellerPhone, setSellerPhone] = useState<string | null>(null);
  
  console.log("SellerContactInfo rendering:", { 
    showContact, 
    name, 
    email, 
    phone, 
    sellerId,
    waitlistStatus
  });

  const navigate = useNavigate();
  const { getOrCreateConversation } = useMessages();
  const { user } = useAuth();

  // Fetch seller's email and phone from Supabase
  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (!sellerId) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email, phone')
          .eq('id', sellerId)
          .single();
        
        if (error) {
          console.error('Error fetching seller info:', error);
          return;
        }
        
        if (data?.email) {
          setSellerEmail(data.email);
        }
        if (data?.phone) {
          setSellerPhone(data.phone);
        }
      } catch (err) {
        console.error('Error in fetchSellerInfo:', err);
      }
    };
    
    fetchSellerInfo();
  }, [sellerId]);

  // Return null early if we shouldn't display contact info
  if (!showContact) {
    console.log("SellerContactInfo not showing because showContact is false");
    return null;
  }
  
  const isPending = waitlistStatus === 'pending';
  
  // Use a formatted display name - if name is provided and not an email address, use it
  // Otherwise create a user-friendly name from the first part of the email
  const isEmail = name?.includes('@');
  let displayName = 'Unknown Seller';
  
  if (name && !isEmail) {
    displayName = name;
  } else if (email || sellerEmail) {
    const emailToUse = sellerEmail || email;
    const emailName = emailToUse!.split('@')[0];
    displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  // Handler for direct messaging seller
  const handleMessageSeller = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!sellerId) return;
    
    try {
      // Get or create conversation
      const conversationId = await getOrCreateConversation(sellerId);
      
      if (conversationId) {
        // Create a notification for the seller
        if (user?.id && propertyId && propertyTitle) {
          await supabase.from('notifications').insert([
            {
              user_id: sellerId,
              title: 'New Message',
              message: `You have a new message about your property "${propertyTitle}"`,
              type: 'message',
              properties: {
                conversationId: conversationId,
                propertyId: propertyId
              }
            }
          ]);
        }
        
        navigate(`/messages/${conversationId}`);
        toast.success("Connected with seller");
      } else {
        toast.error("Couldn't create conversation");
        navigate('/messages');
      }
    } catch (err) {
      console.error("Failed to navigate to seller conversation:", err);
      toast.error("Failed to connect with seller");
      navigate('/messages');
    }
  };

  const copyEmailToClipboard = () => {
    if (sellerEmail) {
      navigator.clipboard.writeText(sellerEmail);
      toast.success("Email copied to clipboard");
    }
  };

  const copyPhoneToClipboard = () => {
    if (sellerPhone) {
      navigator.clipboard.writeText(sellerPhone);
      toast.success("Phone number copied to clipboard");
    }
  };
  
  return (
    <div className="backdrop-blur-lg border border-white/20 p-4 rounded-xl mb-4">
      <h3 className="text-lg font-polysans font-bold mb-3 text-[#01204b]">Seller Information</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-white/10">
          <Link 
            to={`/seller/${sellerId}`} 
            className="flex items-center hover:scale-[1.02] transition-transform"
          >
            <User size={16} className="mr-2 text-[#01204b]" />
            <span className="text-[#01204b] font-polysans">{displayName}</span>
            <span className="text-sm text-gray-500 ml-2 font-polysans">(View listings)</span>
          </Link>
          
          {/* Contact icons */}
          <div className="flex items-center space-x-2">
            {/* Phone icon - only show if seller has phone */}
            {sellerPhone && (
              <div className="relative">
                <button
                  onClick={() => setShowPhonePopup(!showPhonePopup)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Phone size={16} className="text-[#01204b]" />
                </button>
                
                {showPhonePopup && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#01204b] font-polysans">{sellerPhone}</span>
                      <button
                        onClick={copyPhoneToClipboard}
                        className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy phone number"
                      >
                        <Copy size={14} className="text-[#01204b]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Email icon - always show if we have seller email */}
            {sellerEmail && (
              <div className="relative">
                <button
                  onClick={() => setShowEmailPopup(!showEmailPopup)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Mail size={16} className="text-[#01204b]" />
                </button>
                
                {showEmailPopup && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#01204b] font-polysans">{sellerEmail}</span>
                      <button
                        onClick={copyEmailToClipboard}
                        className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy email"
                      >
                        <Copy size={14} className="text-[#01204b]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {sellerId && !isPending && (
          <button
            type="button"
            onClick={handleMessageSeller}
            className="w-full mt-2 block relative overflow-hidden font-polysans font-bold py-2 rounded-xl backdrop-blur-lg bg-white text-[#01204b] border-2 border-[#fd4801] transition-transform"
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <span className="flex items-center justify-center relative z-10">
              <MessageSquare size={18} className="mr-2 text-[#01204b]" />
              <span className="relative z-10 text-[#01204b]">Message Seller</span>
            </span>
          </button>
        )}
        
        {sellerId && isPending && (
          <Button 
            variant="glass"
            disabled
            className="w-full mt-2 text-gray-500 font-polysans font-bold py-2 rounded-xl backdrop-blur-lg bg-white/50"
          >
            <Clock size={18} className="mr-2 text-[#01204b]" />
            <span className="font-polysans">Messaging Available After Approval</span>
          </Button>
        )}
      </div>
      
      {/* Click outside to close popups */}
      {(showEmailPopup || showPhonePopup) && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => {
            setShowEmailPopup(false);
            setShowPhonePopup(false);
          }}
        />
      )}
    </div>
  );
};

export default SellerContactInfo;

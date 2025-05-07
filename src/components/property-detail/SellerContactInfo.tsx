import React from 'react';
import { Phone, Mail, User, MessageSquare, Clock } from 'lucide-react';
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
  // Make sure we're doing proper debugging
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
  } else if (email) {
    const emailName = email.split('@')[0];
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
  
  return (
    <div className="backdrop-blur-lg border border-white/20 shadow-lg p-4 rounded-xl mb-4">
      <h3 className="text-lg font-bold mb-3 text-black">Seller Information</h3>
      
      <div className="space-y-2">
        <Link 
          to={`/seller/${sellerId}`} 
          className="flex items-center p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm group relative overflow-hidden hover:scale-[1.02] transition-transform"
        >
          <User size={16} className="mr-2 text-black" />
          <span className="text-black">{displayName}</span>
          <span className="text-sm text-gray-500 ml-2">(View listings)</span>
          
          {/* Gradient border on hover */}
          <span 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
            style={{
              background: "transparent",
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
              backgroundOrigin: "border-box",
              backgroundClip: "border-box",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)"
            }}
          />
        </Link>
        
        {/* Always show contact information section, but vary content based on waitlist status */}
        {isPending ? (
          <div className="flex items-center p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm">
            <Clock size={16} className="mr-2 text-black" />
            <span className="text-gray-600">Contact details will be available once your waitlist request is approved</span>
          </div>
        ) : (
          <>
            {email && (
              <div className="flex items-center p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm group relative overflow-hidden hover:scale-[1.02] transition-transform">
                <Mail size={16} className="mr-2 text-black" />
                <a href={`mailto:${email}`} className="text-black hover:underline">{email}</a>
                
                {/* Gradient border on hover */}
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)"
                  }}
                />
              </div>
            )}
            
            {phone && (
              <div className="flex items-center p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm group relative overflow-hidden hover:scale-[1.02] transition-transform">
                <Phone size={16} className="mr-2 text-black" />
                <a href={`tel:${phone}`} className="text-black hover:underline">{phone}</a>
                
                {/* Gradient border on hover */}
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                  style={{
                    background: "transparent",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)"
                  }}
                />
              </div>
            )}
            
            {!email && !phone && (
              <div className="text-sm text-gray-500 p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm">
                Contact details are not available for this seller.
              </div>
            )}
          </>
        )}
        
        {sellerId && !isPending && (
          // Note: Use a button instead of Link so we can dynamically navigate after conversation creation
          <button
            type="button"
            onClick={handleMessageSeller}
            className={
              "w-full mt-2 block relative overflow-hidden font-bold py-2 rounded-xl backdrop-blur-lg bg-white text-black " +
              "border-none group shadow transition-transform"
            }
            style={{
              position: "relative",
              // Ensure the button's stacking context does not block the span
              zIndex: 1,
            }}
          >
            <span className="flex items-center justify-center relative z-10">
              <MessageSquare size={18} className="mr-2 text-black" />
              <span className="relative z-10">Message Seller</span>
            </span>
            {/* Gradient border - always visible now */}
            <span
              className="absolute inset-0 opacity-100 rounded-xl pointer-events-none"
              style={{
                background: "transparent",
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(90deg, #3C79F5, #6C42F5 20%, #D946EF 40%, #FF5C00 60%, #FF3CAC 80%)",
                backgroundOrigin: "border-box",
                backgroundClip: "border-box",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)",
                zIndex: 2,
              }}
            />
          </button>
        )}
        
        {sellerId && isPending && (
          <Button 
            variant="glass"
            disabled
            className="w-full mt-2 text-gray-500 font-bold py-2 rounded-xl backdrop-blur-lg bg-white/50"
          >
            <Clock size={18} className="mr-2 text-black" />
            <span>Messaging Available After Approval</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default SellerContactInfo;

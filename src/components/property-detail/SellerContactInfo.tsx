
import React from 'react';
import { Phone, Mail, User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface SellerContactInfoProps {
  name?: string;
  phone?: string | null;
  email?: string | null;
  showContact: boolean;
  sellerId?: string | null;
}

const SellerContactInfo: React.FC<SellerContactInfoProps> = ({ 
  name, 
  phone, 
  email, 
  showContact,
  sellerId
}) => {
  // Make sure we're doing proper debugging
  console.log("SellerContactInfo rendering:", { 
    showContact, 
    name, 
    email, 
    phone, 
    sellerId 
  });

  // Return null early if we shouldn't display contact info
  if (!showContact) {
    console.log("SellerContactInfo not showing because showContact is false");
    return null;
  }
  
  const handleMessageSeller = () => {
    if (!sellerId) {
      toast.error("Unable to message seller at this time");
      return;
    }
  };
  
  return (
    <div className="backdrop-blur-lg border border-white/20 shadow-lg p-4 rounded-xl mb-4">
      <h3 className="text-lg font-bold mb-3 text-black">Seller Information</h3>
      
      <div className="space-y-2">
        <Link 
          to={`/search?seller=${sellerId}`} 
          className="flex items-center p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm group relative overflow-hidden hover:scale-[1.02] transition-transform"
        >
          <User size={16} className="mr-2 text-[#0892D0]" />
          <span className="text-black">{name || 'Property Owner'}</span>
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
        
        {email && (
          <div className="flex items-center p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm group relative overflow-hidden hover:scale-[1.02] transition-transform">
            <Mail size={16} className="mr-2 text-[#0892D0]" />
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
            <Phone size={16} className="mr-2 text-[#0892D0]" />
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
        
        {sellerId && (
          <Link 
            to={`/messages?seller=${sellerId}`}
            className="w-full mt-2 block"
          >
            <Button 
              variant="glass"
              className="w-full text-black font-bold py-2 rounded-xl backdrop-blur-lg bg-white hover:bg-white group relative overflow-hidden"
            >
              <MessageSquare size={18} className="mr-2" />
              <span className="text-gradient-static relative z-10">Message Seller</span>
              
              {/* Gradient border on hover */}
              <span 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
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
            </Button>
          </Link>
        )}
        
        {!email && !phone && (
          <div className="text-sm text-gray-500 p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm">
            Contact details are not available for this seller.
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerContactInfo;

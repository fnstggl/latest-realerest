
import React from 'react';
import { Phone, Mail, User } from 'lucide-react';

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
  if (!showContact) return null;
  
  return (
    <div className="backdrop-blur-lg border border-white/20 shadow-lg p-4 rounded-xl mb-4">
      <h3 className="text-lg font-bold mb-3 text-black">Seller Information</h3>
      
      <div className="space-y-2">
        <div className="flex items-center p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm">
          <User size={16} className="mr-2 electric-blue-glow" />
          <span className="text-black">{name || 'Property Owner'}</span>
        </div>
        
        {email && (
          <div className="flex items-center p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm">
            <Mail size={16} className="mr-2 electric-blue-glow" />
            <a href={`mailto:${email}`} className="hover:underline text-black">{email}</a>
          </div>
        )}
        
        {phone && (
          <div className="flex items-center p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm">
            <Phone size={16} className="mr-2 electric-blue-glow" />
            <a href={`tel:${phone}`} className="hover:underline text-black">{phone}</a>
          </div>
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

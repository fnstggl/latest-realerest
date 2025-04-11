
import React from 'react';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { useMessages } from '@/hooks/useMessages';

interface SellerContactInfoProps {
  name?: string;
  phone?: string | null;
  email?: string | null;
  showContact: boolean;
  sellerId?: string;
}

// Format phone number in a consistent way
const formatPhoneNumber = (phoneNumber: string | null | undefined): string | null => {
  if (!phoneNumber) return null;
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length < 10) return phoneNumber;
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};

const SellerContactInfo: React.FC<SellerContactInfoProps> = ({
  name = 'Property Owner',
  phone,
  email,
  showContact,
  sellerId
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrCreateConversation } = useMessages();

  if (!showContact) {
    return null;
  }

  const handleMessageSeller = async () => {
    if (!sellerId || !user) return;
    
    try {
      const conversationId = await getOrCreateConversation(sellerId);
      if (conversationId) {
        navigate(`/messages/${conversationId}`);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div className="border-2 border-black p-4 mt-6">
      <h3 className="font-bold mb-2">Contact Seller</h3>
      <p className="mb-1">{name}</p>
      
      {phone && (
        <div className="flex items-center">
          <Phone size={16} className="mr-2 text-[#0d2f72]" />
          <a href={`tel:${phone}`} className="text-[#0d2f72] hover:underline">
            {formatPhoneNumber(phone)}
          </a>
        </div>
      )}
      
      {email && (
        <div className="flex items-center mt-1">
          <Mail size={16} className="mr-2 text-[#0d2f72]" />
          <a href={`mailto:${email}`} className="text-[#0d2f72] hover:underline">
            {email}
          </a>
        </div>
      )}
      
      {!phone && !email && (
        <p className="text-gray-500 italic">No contact information available</p>
      )}
      
      {sellerId && user && sellerId !== user.id && (
        <Button 
          variant="navy"
          className="w-full mt-3 text-white font-bold py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
          onClick={handleMessageSeller}
        >
          <MessageSquare size={18} className="mr-2" />
          Message Seller
        </Button>
      )}
    </div>
  );
};

export default SellerContactInfo;

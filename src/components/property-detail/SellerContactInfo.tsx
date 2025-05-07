
import React from 'react';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useMessages } from '@/hooks/useMessages';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SellerContactInfoProps {
  name: string;
  phone: string | null;
  email: string | null;
  showContact?: boolean;
  sellerId?: string;
  propertyId?: string;
  propertyTitle?: string;
}

const SellerContactInfo: React.FC<SellerContactInfoProps> = ({ 
  name, 
  phone, 
  email, 
  showContact = true, 
  sellerId,
  propertyId,
  propertyTitle
}) => {
  const navigate = useNavigate();
  const { getOrCreateConversation } = useMessages();

  const handleMessageSeller = async () => {
    if (!sellerId) return;

    try {
      const conversationId = await getOrCreateConversation(sellerId);
      if (conversationId) {
        navigate(`/messages/${conversationId}`);
      } else {
        navigate('/messages');
        toast.error("Could not create conversation");
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
      navigate('/messages');
      toast.error("Error creating conversation");
    }
  };

  if (!showContact) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2 text-black">Seller Contact Information</h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-black font-bold">{name || 'Seller'}</div>
        {email && (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-black" />
            <a href={`mailto:${email}`} className="text-black hover:underline">{email}</a>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-black" />
            <a href={`tel:${phone}`} className="text-black hover:underline">{phone}</a>
          </div>
        )}
      </div>

      {sellerId && (
        <Button
          variant="outline"
          onClick={handleMessageSeller}
          className="w-full relative hover:bg-gray-50 group"
        >
          <MessageSquare size={16} className="mr-2 text-black" />
          <span className="relative z-10 text-black">Message Seller</span>
        </Button>
      )}
    </div>
  );
};

export default SellerContactInfo;

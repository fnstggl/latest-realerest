
import React, { useState } from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useMessages } from '@/hooks/useMessages';

export interface SellerContactInfoProps {
  name: string;
  email: string;
  phone?: string;
  propertyId?: string; // Make propertyId optional
  sellerId: string;
  refreshProperty?: () => Promise<void>;
}

export const SellerContactInfo: React.FC<SellerContactInfoProps> = ({
  name,
  email,
  phone,
  propertyId,
  sellerId,
  refreshProperty
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrCreateConversation } = useMessages();
  const [isLoading, setIsLoading] = useState(false);

  const handleContactSeller = async () => {
    if (!user) {
      toast.error('Please sign in to contact the seller');
      navigate('/signin');
      return;
    }

    setIsLoading(true);

    try {
      const conversationId = await getOrCreateConversation(sellerId);
      
      if (conversationId) {
        navigate(`/messages/${conversationId}`);
      } else {
        toast.error('Could not create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Could not contact seller');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Seller Contact</h2>
      
      <div className="space-y-4">
        <div>
          <p className="font-bold text-lg">{name}</p>
        </div>
        
        {email && (
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <a 
              href={`mailto:${email}`} 
              className="text-blue-600 hover:underline"
            >
              {email}
            </a>
          </div>
        )}
        
        {phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <a 
              href={`tel:${phone}`} 
              className="text-blue-600 hover:underline"
            >
              {phone}
            </a>
          </div>
        )}
        
        <Button 
          onClick={handleContactSeller} 
          disabled={isLoading}
          className="w-full"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {isLoading ? 'Loading...' : 'Message Seller'}
        </Button>
      </div>
    </div>
  );
};

export default SellerContactInfo;

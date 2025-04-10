
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfferStatusBannerProps {
  propertyId: string;
  sellerName: string;
  sellerEmail: string | null;
  sellerPhone: string | null;
}

type OfferStatus = 'pending' | 'accepted' | 'declined' | null;

const OfferStatusBanner: React.FC<OfferStatusBannerProps> = ({ 
  propertyId, 
  sellerName, 
  sellerEmail, 
  sellerPhone 
}) => {
  const { user } = useAuth();
  const [offerStatus, setOfferStatus] = useState<OfferStatus>(null);
  const [offerAmount, setOfferAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessDetails, setShowSuccessDetails] = useState(false);

  useEffect(() => {
    const checkOfferStatus = async () => {
      if (!user?.id || !propertyId) return;
      
      try {
        const { data, error } = await supabase
          .from('property_offers')
          .select('status, offer_amount')
          .eq('property_id', propertyId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (error) {
          console.error("Error checking offer status:", error);
          return;
        }
        
        if (data) {
          setOfferStatus(data.status as OfferStatus);
          setOfferAmount(data.offer_amount);
        }
      } catch (error) {
        console.error("Error checking offer status:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkOfferStatus();
  }, [user?.id, propertyId]);

  if (loading || !offerStatus) return null;

  if (offerStatus === 'pending') {
    return (
      <div className="bg-gray-100 border-2 border-black p-4 mb-4">
        <div className="flex items-center">
          <Clock size={20} className="text-gray-700 mr-2" />
          <div className="font-bold">Offer Sent to Seller</div>
        </div>
        <p className="mt-2">
          Your offer of ${offerAmount?.toLocaleString()} is being reviewed by the seller. We'll notify you when there's an update.
        </p>
      </div>
    );
  }

  if (offerStatus === 'declined') {
    return (
      <div className="bg-[#FFE8E8] border-2 border-black p-4 mb-4">
        <div className="flex items-center">
          <XCircle size={20} className="text-[#d0161a] mr-2" />
          <div className="font-bold">Offer Declined</div>
        </div>
        <p className="mt-2">
          Unfortunately, your offer of ${offerAmount?.toLocaleString()} was declined by the seller. You may make a new offer if you're still interested.
        </p>
      </div>
    );
  }

  if (offerStatus === 'accepted') {
    return (
      <div className="bg-[#E8F4FF] border-2 border-black p-4 mb-4">
        <div className="flex items-center">
          <CheckCircle size={20} className="text-[#0d2f72] mr-2" />
          <div className="font-bold">Offer Accepted!</div>
        </div>
        <p className="mt-2">
          Congratulations! Your offer of ${offerAmount?.toLocaleString()} has been accepted by the seller.
        </p>
        
        {!showSuccessDetails ? (
          <Button 
            variant="navy" 
            onClick={() => setShowSuccessDetails(true)}
            className="mt-2 w-full"
          >
            Next Steps <ArrowRight size={16} className="ml-1" />
          </Button>
        ) : (
          <div className="mt-4 p-4 border-2 border-[#0d2f72] bg-white">
            <h3 className="font-bold text-lg mb-2">Next Steps</h3>
            <p className="mb-4">Contact the seller directly to coordinate the next steps in your transaction:</p>
            
            <div className="mb-2"><span className="font-bold">Name:</span> {sellerName}</div>
            {sellerEmail && <div className="mb-2"><span className="font-bold">Email:</span> {sellerEmail}</div>}
            {sellerPhone && <div className="mb-2"><span className="font-bold">Phone:</span> {sellerPhone}</div>}
            
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Schedule a property inspection</li>
              <li>Discuss payment details and timeline</li>
              <li>Contact your real estate attorney to review documents</li>
              <li>Arrange for closing and property transfer</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default OfferStatusBanner;

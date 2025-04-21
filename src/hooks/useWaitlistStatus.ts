
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useWaitlistStatus() {
  const [waitlistStatus, setWaitlistStatus] = useState<'pending' | 'accepted' | 'declined' | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [shouldShowSellerInfo, setShouldShowSellerInfo] = useState(false);

  const checkWaitlistStatus = useCallback(async (
    propertyId: string, 
    userId: string, 
    propertyUserId?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('waitlist_requests')
        .select('status')
        .eq('property_id', propertyId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking waitlist status:", error);
        return;
      }

      if (data) {
        setWaitlistStatus(data.status as 'pending' | 'accepted' | 'declined');
        if (data.status === 'accepted') {
          setIsApproved(true);
          setShouldShowSellerInfo(true);
        } else if (data.status === 'pending') {
          setShouldShowSellerInfo(true);
        }
      } else {
        setWaitlistStatus(null);
        if (propertyUserId && propertyUserId === userId) {
          setShouldShowSellerInfo(true);
        }
      }
    } catch (err) {
      console.error("Error checking waitlist status:", err);
    }
  }, []);

  return { waitlistStatus, isApproved, shouldShowSellerInfo, checkWaitlistStatus };
}

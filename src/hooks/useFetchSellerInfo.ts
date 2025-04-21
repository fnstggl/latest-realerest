
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SellerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export function useFetchSellerInfo() {
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);

  const fetchSellerInfo = useCallback(async (userId: string): Promise<SellerInfo | null> => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, email, phone')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching seller profile:", profileError);
      }

      let sellerName = null;
      let sellerEmail = null;
      let sellerPhone = null;

      if (profileData) {
        sellerName = profileData.name;
        sellerEmail = profileData.email;
        sellerPhone = profileData.phone;
      }

      // If no profile name, fallback to email username
      if (!sellerName) {
        const { data: emailData, error: emailError } = await supabase
          .rpc('get_user_email', { user_id_param: userId });

        if (emailError) {
          console.error("Error getting seller email:", emailError);
        } else if (emailData) {
          const emailName = emailData.split('@')[0];
          sellerName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          sellerEmail = emailData;
        }
      }

      const newInfo: SellerInfo = {
        name: sellerName || "Unknown Seller",
        email: sellerEmail || undefined,
        phone: sellerPhone || undefined
      };
      setSellerInfo(newInfo);
      return newInfo;
    } catch (err) {
      console.error("Error fetching seller info:", err);
      setSellerInfo(null);
      return null;
    }
  }, []);

  return { sellerInfo, fetchSellerInfo };
}

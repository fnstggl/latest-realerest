
import { supabase } from "@/integrations/supabase/client";

export const sendNotification = async ({
  userId,
  title,
  message,
  type = 'info',
  properties = {}
}: {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'reward' | 'offer';
  properties?: Record<string, any>;
}) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        title,
        message,
        type,
        properties
      }]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

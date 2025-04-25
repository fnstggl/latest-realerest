
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LikeButtonProps {
  propertyId: string;
  sellerId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ propertyId, sellerId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('liked_properties')
          .select('id')
          .eq('property_id', propertyId)
          .eq('user_id', user.id)
          .maybeSingle();

        setIsLiked(!!data);
      } catch (error) {
        console.error('Error checking like status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfLiked();
  }, [propertyId, user]);

  const handleLikeClick = async () => {
    if (!user) {
      toast.error('Please sign in to like properties');
      return;
    }

    try {
      if (isLiked) {
        // Unlike the property
        await supabase
          .from('liked_properties')
          .delete()
          .eq('property_id', propertyId)
          .eq('user_id', user.id);
      } else {
        // Like the property
        await supabase.from('liked_properties').insert({
          property_id: propertyId,
          user_id: user.id
        });

        // Create notification for seller
        await supabase.from('notifications').insert({
          user_id: sellerId,
          title: 'New Property Like',
          message: 'Someone liked your property!',
          type: 'like',
          properties: { property_id: propertyId }
        });
      }

      setIsLiked(!isLiked);
      
      if (!isLiked) {
        toast.success('Property added to your liked properties');
      }
    } catch (error: any) {
      if (error.code === '23505') {
        // Handle unique constraint violation silently
        return;
      }
      toast.error('Error updating like status');
      console.error('Error updating like status:', error);
    }
  };

  if (isLoading) return null;

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleLikeClick}
      className="hover:bg-transparent p-2"
    >
      <Heart 
        size={24} 
        className={`transition-colors ${isLiked ? 'fill-black text-black' : 'text-black'}`}
        strokeWidth={1.5}
      />
    </Button>
  );
};

export default LikeButton;

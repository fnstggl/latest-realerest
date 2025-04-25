
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export interface LikeButtonProps {
  propertyId: string;
  isLiked?: boolean; // Make isLiked optional
  onClick?: () => Promise<void>;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ 
  propertyId,
  isLiked: initialIsLiked = false, // Default value
  onClick 
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.id) {
      // Check if the property is already liked by the user
      const checkLikeStatus = async () => {
        try {
          const { data, error } = await supabase
            .from('liked_properties')
            .select('id')
            .eq('user_id', user.id)
            .eq('property_id', propertyId)
            .maybeSingle();
          
          if (error) throw error;
          setIsLiked(!!data);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      };
      
      checkLikeStatus();
    }
  }, [user, propertyId]);
  
  const handleToggleLike = async () => {
    if (!user) {
      toast.error('You must be logged in to like properties');
      navigate('/signin');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLiked) {
        // Unlike the property
        const { error } = await supabase
          .from('liked_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);
        
        if (error) throw error;
        
        setIsLiked(false);
        toast.success('Property removed from liked properties');
      } else {
        // Like the property
        const { error } = await supabase
          .from('liked_properties')
          .insert([
            { user_id: user.id, property_id: propertyId }
          ]);
        
        if (error) throw error;
        
        setIsLiked(true);
        toast.success('Property added to liked properties');
      }
      
      // Call the onClick callback if provided
      if (onClick) {
        await onClick();
      }
    } catch (error) {
      console.error('Error toggling like status:', error);
      toast.error('Failed to update like status');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`w-full flex items-center justify-center ${
        isLiked ? 'bg-pink-50 border-pink-200 text-pink-600' : ''
      }`}
    >
      <Heart
        className={`mr-2 ${isLiked ? 'fill-current text-pink-600' : ''}`}
        size={20}
      />
      {isLiked ? 'Liked' : 'Like'}
    </Button>
  );
};

export default LikeButton;

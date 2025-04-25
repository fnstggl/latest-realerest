
import React from 'react';
import { Award } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface BountyBadgeProps {
  amount: number;
  propertyId?: string; // Make propertyId optional
}

export const BountyBadge: React.FC<BountyBadgeProps> = ({ amount, propertyId }) => {
  const { user } = useAuth();

  const handleClick = async () => {
    // Only handle click if propertyId is provided
    if (!propertyId) return;
    
    if (!user) {
      toast.error('You need to be logged in to claim this bounty');
      return;
    }

    try {
      // Check if already claimed
      const { data: existingClaim, error: checkError } = await supabase
        .from('bounty_claims')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .single();

      if (existingClaim) {
        toast.info('You have already claimed this bounty');
        return;
      }

      // Create new claim
      const { error } = await supabase
        .from('bounty_claims')
        .insert([
          {
            user_id: user.id,
            property_id: propertyId,
            status: 'claimed'
          }
        ]);

      if (error) {
        console.error('Error claiming bounty:', error);
        toast.error('Failed to claim bounty');
        return;
      }

      toast.success('Bounty claimed successfully!');
    } catch (error) {
      console.error('Error claiming bounty:', error);
      toast.error('Failed to claim bounty');
    }
  };

  return (
    <div 
      className={`flex items-center bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-medium ${
        propertyId ? 'cursor-pointer hover:bg-amber-200' : ''
      }`}
      onClick={propertyId ? handleClick : undefined}
      title={propertyId ? "Click to claim this bounty" : undefined}
    >
      <Award className="w-4 h-4 mr-1" />
      ${amount.toLocaleString()}
    </div>
  );
};


import React from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AccountTypeSelectorProps {
  currentType: string;
  userId: string;
  onUpdate: (type: string) => void;
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({ currentType, userId, onUpdate }) => {
  const accountTypes = [
    {
      type: 'seller',
      description: 'List and sell properties on the platform'
    },
    {
      type: 'buyer',
      description: 'Save properties and submit offers'
    },
    {
      type: 'wholesaler',
      description: 'Earn incentives by bringing cash buyers'
    }
  ];

  const handleTypeChange = async (type: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ account_type: type })
        .eq('id', userId);

      if (error) throw error;

      onUpdate(type);
      toast.success(`Account type updated to ${type}`);
    } catch (error) {
      console.error('Error updating account type:', error);
      toast.error('Failed to update account type');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg mb-2">Account Type</h3>
      <div className="grid gap-4">
        {accountTypes.map(({ type, description }) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`p-4 rounded-lg border text-left transition-all ${
              currentType === type 
                ? 'border-black bg-black/5' 
                : 'border-gray-200 hover:border-black'
            }`}
          >
            <div className="font-semibold capitalize mb-1">{type}</div>
            <div className="text-sm text-gray-600">{description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountTypeSelector;

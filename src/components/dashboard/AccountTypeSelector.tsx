
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
    if (type === currentType) return;
    
    try {
      onUpdate(type);
    } catch (error) {
      console.error('Error in account type change:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-polysans font-bold text-xl mb-2 text-[#01204b]">Account Type</h3>
      <div className="grid gap-4">
        {accountTypes.map(({ type, description }) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`p-4 rounded-lg border text-left transition-all ${
              currentType === type 
                ? 'border-[#01204b] bg-[#01204b]/5' 
                : 'border-gray-200 hover:border-[#01204b]'
            }`}
          >
            <div className="font-polysans font-bold capitalize mb-1 text-[#01204b]">{type}</div>
            <div className="text-sm text-gray-600 font-polysans-semibold">{description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountTypeSelector;

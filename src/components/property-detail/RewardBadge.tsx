
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RewardBadgeProps {
  amount: number;
  inPropertyCard?: boolean;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ amount, inPropertyCard = false }) => {
  // Don't render anything if the amount is less than 3000 or doesn't exist
  if (!amount || amount < 3000) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              flex items-center justify-center 
              ${inPropertyCard ? 'mr-4' : ''} 
              w-8 h-8 rounded-full 
              bg-[#FEF7CD]
              border-2 border-[#F97316]
              cursor-pointer
            `}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#F97316]"
            >
              <path
                d="M12 1L15.5 8.5L23 9.5L18 15L19.5 23L12 19.5L4.5 23L6 15L1 9.5L8.5 8.5L12 1Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="left" 
          className="max-w-[250px] text-sm z-50"
          sideOffset={5}
        >
          <p>Get paid {formatCurrency(amount)} for connecting the seller with a buyer</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RewardBadge;

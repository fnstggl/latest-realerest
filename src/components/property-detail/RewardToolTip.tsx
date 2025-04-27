
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency } from '@/lib/utils';

interface RewardToolTipProps {
  amount: number;
  className?: string;
}

const RewardToolTip: React.FC<RewardToolTipProps> = ({ amount, className = "" }) => {
  if (!amount || amount < 3000) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info size={16} className={`text-black hover:text-gray-700 transition-colors ${className}`} />
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-[300px] text-sm">
          <p>Connect the seller with an interested buyer and get paid {formatCurrency(amount)} if the deal closes. Join the waitlist to claim this reward.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RewardToolTip;

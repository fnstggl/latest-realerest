
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
  inPropertyCard?: boolean;
}

const RewardToolTip: React.FC<RewardToolTipProps> = ({ amount, className = "", inPropertyCard = false }) => {
  if (!amount || amount < 3000) return null;
  
  const tooltipContent = inPropertyCard
    ? `Get paid ${formatCurrency(amount)} if you connect the seller with a buyer and the deal goes through`
    : `Connect the seller with an interested buyer and get paid ${formatCurrency(amount)} if the deal closes. Join the waitlist to claim this reward`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info size={16} className={`text-white hover:text-white/80 transition-colors ${className}`} />
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[300px] text-sm">
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RewardToolTip;

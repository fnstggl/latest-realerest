
import React from 'react';
import { Award } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency } from '@/lib/utils';

interface RewardBadgeProps {
  amount: number;
  isCard?: boolean;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ amount, isCard = false }) => {
  if (!amount || amount < 1) return null;
  
  const cardStyles = isCard ? 'absolute top-4 right-4 z-20' : '';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm ${cardStyles}`}>
            <Award size={18} className="text-black" />
            <span className="text-sm font-medium text-black">{formatCurrency(amount)} Reward</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {formatCurrency(amount)} Finder's fee
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RewardBadge;

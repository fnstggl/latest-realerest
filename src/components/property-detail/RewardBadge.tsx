
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
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ amount }) => {
  if (!amount || amount < 1) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
            <Award size={18} className="text-black" />
            <span className="text-sm font-medium text-black">{formatCurrency(amount)} Reward</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            Finder's fee of {formatCurrency(amount)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RewardBadge;


import React from 'react';
import { Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RewardBadgeProps {
  amount: number;
  inPropertyCard?: boolean;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ amount, inPropertyCard = false }) => {
  if (!amount || amount < 3000) return null;
  
  const renderBadge = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center">
            <Award size={18} color="white" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[250px] text-sm">
          <p>Get paid {formatCurrency(amount)} for connecting the seller with a buyer</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return renderBadge();
};

export default RewardBadge;


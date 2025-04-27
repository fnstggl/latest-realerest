
import React from 'react';
import { Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import RewardToolTip from './RewardToolTip';

interface RewardBadgeProps {
  amount: number;
  inPropertyCard?: boolean;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ amount, inPropertyCard = false }) => {
  if (!amount || amount < 3000) return null;
  
  const getBadgeStyle = (amount: number) => {
    if (amount >= 10000) return "bg-[#FEC6A1]/10 text-[#FEC6A1]";
    if (amount > 5000) return "bg-[#FEF7CD]/10 text-[#FEF7CD]";
    return "bg-[#F2FCE2]/10 text-[#F2FCE2]";
  };
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${getBadgeStyle(amount)}`}>
      <Award size={18} />
      <span className="text-sm font-medium">{formatCurrency(amount)} Reward</span>
      <RewardToolTip amount={amount} inPropertyCard={inPropertyCard} />
    </div>
  );
};

export default RewardBadge;


import React from 'react';
import { Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface RewardBadgeProps {
  amount: number;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ amount }) => {
  if (!amount || amount < 3000) return null;
  
  const getBadgeStyle = (amount: number) => {
    if (amount >= 10000) return "bg-[#FEC6A1]/10 text-[#FEC6A1]";
    if (amount > 5000) return "bg-[#FEF7CD]/10 text-[#FEF7CD]";
    return "bg-[#F2FCE2]/10 text-[#F2FCE2]";
  };
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${getBadgeStyle(amount)}`}>
      <Award size={18} />
      <span className="text-sm font-medium">{formatCurrency(amount)} Wholesaler Reward</span>
    </div>
  );
};

export default RewardBadge;

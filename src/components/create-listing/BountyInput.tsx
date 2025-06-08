
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface RewardInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RewardInput: React.FC<RewardInputProps> = ({
  value,
  onChange
}) => {
  const rewardAmount = Number(value) || 0;
  
  const getFeedbackStyle = (amount: number) => {
    if (amount >= 10000) return "text-[#FD4802] font-semibold";
    if (amount > 5000) return "text-[#FFCA2E] font-semibold";
    return "text-[#FFE968] font-semibold";
  };
  
  const getFeedbackText = (amount: number) => {
    if (amount >= 10000) return "Competitive offer - Top priority for wholesalers";
    if (amount > 5000) return "Standard offer - High priority for wholesalers";
    if (amount >= 3000) return "Conservative offer - Basic priority for wholesalers";
    return "";
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="reward" className="font-medium">Offer Reward</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info size={16} className="text-[#8E9196]" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p>Offer a reward fee for wholesalers who bring a buyer to you upon closing. Wholesalers will bring cash buyers to you, so you can sit back and relax while they handle all of the outreach.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Input 
        id="reward" 
        type="number" 
        min={3000} 
        placeholder="Enter reward amount ($3,000 minimum)" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full" 
      />
      
      <p className="text-sm italic text-[#8E9196] mt-1 px-[10px]">Recommended to sell faster</p>
      
      {rewardAmount >= 3000 && (
        <p className={getFeedbackStyle(rewardAmount)}>
          {getFeedbackText(rewardAmount)}
        </p>
      )}
    </div>
  );
};

export default RewardInput;

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
interface BountyInputProps {
  value: string;
  onChange: (value: string) => void;
}
const BountyInput: React.FC<BountyInputProps> = ({
  value,
  onChange
}) => {
  const bountyAmount = Number(value) || 0;
  const getFeedbackStyle = (amount: number) => {
    if (amount >= 10000) return "text-[#FEC6A1] font-semibold";
    if (amount > 5000) return "text-[#FEF7CD] font-semibold";
    return "text-[#F2FCE2] font-semibold";
  };
  const getFeedbackText = (amount: number) => {
    if (amount >= 10000) return "Aggressive offer - High priority for wholesalers";
    if (amount > 5000) return "Competitive offer - Good visibility";
    if (amount >= 3000) return "Conservative offer - Standard visibility";
    return "";
  };
  return <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="bounty" className="font-medium">Offer Incentive</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info size={16} className="text-[#8E9196]" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p>Offer an assignment fee for wholesalers who bring a buyer to you upon closing. Wholesalers will bring cash buyers to you, so you can sit back and relax while they handle all of the outreach.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Input id="bounty" type="number" min={3000} placeholder="Enter incentive amount ($3,000 minimum)" value={value} onChange={e => onChange(e.target.value)} className="w-full" />
      
      <p className="text-sm italic text-[#8E9196] mt-1">Recommended</p>
      
      {bountyAmount >= 3000 && <p className={getFeedbackStyle(bountyAmount)}>
          {getFeedbackText(bountyAmount)}
        </p>}
    </div>;
};
export default BountyInput;
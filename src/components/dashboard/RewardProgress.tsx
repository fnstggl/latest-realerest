
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BuyerProgress {
  id: string;
  name: string;
  progress: number;
}

interface RewardProgressProps {
  propertyId: string;
  bountyAmount: number;
  totalRequired: number;
}

const RewardProgress: React.FC<RewardProgressProps> = ({
  propertyId,
  bountyAmount,
  totalRequired
}) => {
  const [buyers, setBuyers] = useState<BuyerProgress[]>([]);
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRewardProgress();
  }, [propertyId]);

  const fetchRewardProgress = async () => {
    try {
      // This is a placeholder - the actual implementation would depend on your reward system
      const mockBuyers: BuyerProgress[] = [
        { id: "1", name: "Alice Johnson", progress: 80 },
        { id: "2", name: "Bob Smith", progress: 65 },
        { id: "3", name: "Carol Davis", progress: 45 }
      ];
      setBuyers(mockBuyers);
    } catch (error) {
      console.error("Error fetching reward progress:", error);
    }
  };

  const handleClaimReward = async () => {
    if (!propertyId) return;
    
    setLoading(true);
    try {
      // Convert to a JSON-compatible format
      const statusDetails = {
        buyers: buyers.map(buyer => ({
          id: buyer.id,
          name: buyer.name,
          progress: buyer.progress
        })),
        claimed: true
      };

      const { error } = await supabase
        .from('bounty_progress')
        .insert({
          property_id: propertyId,
          user_id: 'current-user-id', // This should come from auth context
          status: 'claimed',
          status_details: statusDetails as any
        });

      if (error) {
        console.error("Error claiming reward:", error);
        toast.error("Failed to claim reward");
        return;
      }

      setClaimed(true);
      toast.success("Reward claimed successfully!");
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast.error("Failed to claim reward");
    } finally {
      setLoading(false);
    }
  };

  const handleShareProgress = async () => {
    if (!propertyId) return;
    
    try {
      // Convert to a JSON-compatible format
      const statusDetails = {
        buyers: buyers.map(buyer => ({
          id: buyer.id,
          name: buyer.name,
          progress: buyer.progress
        })),
        claimed: false
      };

      const { error } = await supabase
        .from('bounty_progress')
        .insert({
          property_id: propertyId,
          user_id: 'current-user-id', // This should come from auth context
          status: 'shared',
          status_details: statusDetails as any
        });

      if (error) {
        console.error("Error sharing progress:", error);
        toast.error("Failed to share progress");
        return;
      }

      toast.success("Progress shared successfully!");
    } catch (error) {
      console.error("Error sharing progress:", error);
      toast.error("Failed to share progress");
    }
  };

  const currentProgress = buyers.length > 0 ? Math.max(...buyers.map(b => b.progress)) : 0;
  const isEligible = currentProgress >= totalRequired;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Star className="text-yellow-500" size={20} />
        <h3 className="text-lg font-polysans text-[#01204b]">Reward Progress</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-polysans-semibold text-gray-600">
            Current Progress: {currentProgress}%
          </span>
          <span className="text-sm font-polysans text-[#01204b]">
            Target: {totalRequired}%
          </span>
        </div>
        
        <Progress value={currentProgress} className="h-2" />
        
        <div className="text-center">
          <span className="text-2xl font-polysans text-[#01204b]">
            ${bountyAmount.toLocaleString()}
          </span>
          <p className="text-sm text-gray-500 font-polysans-semibold">Bounty Reward</p>
        </div>
      </div>

      {buyers.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-sm font-polysans-semibold text-gray-600">Top Contributors</span>
          </div>
          {buyers.slice(0, 3).map(buyer => (
            <div key={buyer.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm font-polysans text-[#01204b]">{buyer.name}</span>
              <span className="text-sm font-polysans-semibold text-gray-600">{buyer.progress}%</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        {isEligible && !claimed ? (
          <Button 
            onClick={handleClaimReward}
            disabled={loading}
            className="flex-1 bg-[#01204b] text-white font-polysans hover:bg-[#01204b]/90"
          >
            <TrendingUp size={16} className="mr-2" />
            {loading ? "Claiming..." : "Claim Reward"}
          </Button>
        ) : claimed ? (
          <div className="flex-1 text-center p-2 bg-green-100 text-green-800 rounded font-polysans">
            Reward Claimed!
          </div>
        ) : (
          <Button 
            onClick={handleShareProgress}
            variant="outline"
            className="flex-1 font-polysans text-[#01204b] border-gray-200 hover:border-[#0892D0]"
          >
            Share Progress
          </Button>
        )}
      </div>
    </div>
  );
};

export default RewardProgress;

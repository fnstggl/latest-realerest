
import React from 'react';

interface RewardBadgeProps {
  reward: number | null;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ reward }) => {
  // If reward is null or exactly 0, don't show the badge
  if (reward === null || reward === 0) {
    return null;
  }

  return (
    <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-0.5 rounded-full text-sm font-medium">
      ${reward.toLocaleString()} Reward
    </div>
  );
};

export default RewardBadge;

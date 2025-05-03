
import React from 'react';
import { Badge } from '@/components/ui/badge';

export type UserRole = 'seller' | 'buyer' | 'wholesaler';

interface UserTagProps {
  role: UserRole;
}

const UserTag: React.FC<UserTagProps> = ({ role }) => {
  // Default to buyer if role isn't one of our expected types
  const safeRole: UserRole = ['seller', 'buyer', 'wholesaler'].includes(role) 
    ? role as UserRole 
    : 'buyer';
  
  // Updated color mapping with more distinct colors
  const colorMap = {
    seller: {
      bg: '#FDE1D3', // Light red
      text: '#ea384c', // Dark red
    },
    wholesaler: {
      bg: '#FEF7CD', // Light yellow
      text: '#F97316', // Dark yellow/orange
    },
    buyer: {
      bg: '#F2FCE2', // Light green
      text: '#4CA154', // Dark green
    }
  };
  
  return (
    <Badge 
      className="ml-2 font-medium text-xs py-0.5 px-2 capitalize"
      style={{ 
        backgroundColor: colorMap[safeRole].bg, 
        color: colorMap[safeRole].text 
      }}
    >
      {safeRole}
    </Badge>
  );
};

export default UserTag;

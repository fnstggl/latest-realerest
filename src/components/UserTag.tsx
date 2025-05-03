
import React from 'react';
import { Badge } from '@/components/ui/badge';

export type UserRole = 'seller' | 'buyer' | 'wholesaler';

interface UserTagProps {
  role: UserRole;
}

const UserTag: React.FC<UserTagProps> = ({ role }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (role) {
    case 'seller':
      bgColor = '#FDE1D3'; // Light red
      textColor = '#ea384c'; // Dark red
      break;
    case 'wholesaler':
      bgColor = '#FEF7CD'; // Light yellow
      textColor = '#F97316'; // Dark yellow
      break;
    case 'buyer':
      bgColor = '#F2FCE2'; // Light green - keeping current green
      textColor = '#4CA154'; // Dark green - keeping current dark green
      break;
    default:
      bgColor = '#F5F5F5'; // Light gray
      textColor = '#6B7280'; // Dark gray
  }
  
  return (
    <Badge 
      className="ml-2 font-medium text-xs py-0.5 px-2 capitalize"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {role}
    </Badge>
  );
};

export default UserTag;

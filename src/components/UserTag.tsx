
import React from 'react';
import { Badge } from '@/components/ui/badge';

export type UserRole = 'seller' | 'buyer' | 'wholesaler';

interface UserTagProps {
  role: UserRole;
}

export const UserTag: React.FC<UserTagProps> = ({
  role
}) => {
  let bgColor = '';
  let textColor = '';
  
  switch (role) {
    case 'seller':
      bgColor = '#F9E0E0'; // Light red
      textColor = '#ea384c'; // Dark red
      break;
    case 'wholesaler':
      bgColor = '#FEF0E6'; // Light orange
      textColor = '#F97316'; // Dark orange
      break;
    case 'buyer':
      bgColor = '#F2FCE2'; // Light green
      textColor = '#4CA154'; // Dark green
      break;
    default:
      bgColor = '#F5F5F5'; // Light gray
      textColor = '#6B7280'; // Dark gray
  }
  
  return (
    <Badge 
      className="ml-2 font-medium text-sm" 
      style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        border: 'none' 
      }}
    >
      {role}
    </Badge>
  );
};

export default UserTag;

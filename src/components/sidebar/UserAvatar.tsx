import React from 'react';
import { Circle } from 'lucide-react';
import { User } from '@/types/user';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md';
  showStatus?: boolean;
}

const UserAvatar = ({ user, size = 'md', showStatus = true }: UserAvatarProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'busy': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-xs'
  };

  const statusSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3 h-3'
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} bg-gray-600 rounded-full flex items-center justify-center text-white tracking-tight font-medium`}>
        {user.avatar}
      </div>
      {showStatus && (
        <Circle className={`${statusSizeClasses[size]} absolute -bottom-0.5 -right-0.5 ${getStatusColor(user.status)} fill-current`} />
      )}
    </div>
  );
};

export default UserAvatar;

import { Avatar, Button } from '@nextui-org/react';
import { UserPlus, UserCheck, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserCard = ({ 
  user, 
  showFollowButton = true,
  isFollowing = false,
  onFollow, 
  onUnfollow,
  currentUserId 
}) => {
  const isCurrentUser = user.id === currentUserId;
  
  const getButtonConfig = () => {
    if (isCurrentUser) return null;

    if (isFollowing) {
      return {
        text: 'Following',
        icon: <UserCheck size={16} />,
        color: 'default',
        action: onUnfollow,
        variant: 'flat'
      };
    } else {
      return {
        text: showFollowButton ? 'Follow Back' : 'Follow',
        icon: <UserPlus size={16} />,
        color: 'primary',
        action: onFollow,
        variant: 'solid'
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/30 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Link to={`/profile/${user.username}`} className="flex-shrink-0">
          <Avatar 
            src={user.image || '/default-avatar.png'} 
            name={user.username}
            size="md"
            className="w-10 h-10"
            isBordered
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link to={`/profile/${user.username}`} className="block hover:underline">
            <h3 className="font-medium text-white truncate">
              {user.username || 'Unknown'}
            </h3>
            {user.name && (
              <p className="text-sm text-gray-300 truncate">
                {user.name}
              </p>
            )}
          </Link>
        </div>
      </div>
      
      {buttonConfig && (
        <div className="flex-shrink-0 ml-2">
          <Button
            size="sm"
            radius="full"
            color={buttonConfig.color}
            variant={buttonConfig.variant}
            startContent={buttonConfig.icon}
            onClick={buttonConfig.action}
            className="min-w-[100px]"
          >
            {buttonConfig.text}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
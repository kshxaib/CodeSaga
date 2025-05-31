import { useState, useEffect } from "react";
import { Tabs, Tab, Spinner, Avatar, Button } from "@nextui-org/react";
import { Users, UserCheck, Bell, UserPlus, UserX } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import useNotificationStore from "../store/useNotificationStore";
import { Link } from "react-router-dom";

const UserCard = ({ 
  user, 
  showFollowButton = true,
  isFollowing = false,
  onFollow, 
  onUnfollow,
  currentUserId 
}) => {
  const isCurrentUser = user?.id === currentUserId;
  
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
        <Link to={`/profile/${user?.username}`} className="flex-shrink-0">
          <Avatar 
            src={user?.image || '/default-avatar.png'} 
            name={user?.username || 'User'}
            size="md"
            className="w-10 h-10"
            isBordered
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link to={`/profile/${user?.username}`} className="block hover:underline">
            <h3 className="font-medium text-white truncate">
              {user?.username || 'Unknown User'}
            </h3>
            {user?.name && (
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

const SocialPage = () => {
  const [activeTab, setActiveTab] = useState("followers");
  const {
    followers,
    following,
    fetchFollowers,
    fetchFollowing,
    isLoading,
    followUser,
    unfollowUser,
    user,
  } = useUserStore();

  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
  } = useNotificationStore();

  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
    fetchNotifications();
  }, []);

  const handleFollowAction = async (userId, action) => {
    try {
      if (action === "follow") {
        await followUser(userId);
      } else {
        await unfollowUser(userId);
      }
      fetchFollowers();
      fetchFollowing();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  const isNotFollowingBack = (followerId) => {
    return !following.some(user => user.id === followerId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Social Connections</h1>

        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          aria-label="Social tabs"
          className="mb-6"
          color="secondary"
          variant="underlined"
        >
          <Tab
            key="followers"
            title={
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Followers ({followers.length})</span>
              </div>
            }
          />
          <Tab
            key="following"
            title={
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>Following ({following.length})</span>
              </div>
            }
          />
          <Tab
            key="notifications"
            title={
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            }
          />
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {activeTab === "followers" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {followers.length > 0 ? (
                  followers.map((follower) => (
                    <UserCard
                      key={follower.id}
                      user={follower}
                      currentUserId={user?.id}
                      showFollowButton={isNotFollowingBack(follower.id)}
                      isFollowing={!isNotFollowingBack(follower.id)}
                      onFollow={() => handleFollowAction(follower.id, "follow")}
                      onUnfollow={() => handleFollowAction(follower.id, "unfollow")}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12 text-gray-400">
                    You don't have any followers yet
                  </div>
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {following.length > 0 ? (
                  following.map((followedUser) => (
                    <UserCard
                      key={followedUser.id}
                      user={followedUser}
                      currentUserId={user?.id}
                      showFollowButton={false}
                      isFollowing={true}
                      onUnfollow={() => handleFollowAction(followedUser.id, "unfollow")}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12 text-gray-400">
                    You're not following anyone yet
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <h2 className="text-lg md:text-xl font-semibold">Your Notifications</h2>
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {notifications.length > 0 ? (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 md:p-4 rounded-lg border transition-colors ${
                          notification.isRead
                            ? "border-gray-700 bg-gray-800/50"
                            : "border-purple-500/30 bg-purple-500/10"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="font-medium">
                              {notification.content}
                            </p>
                            <p className="text-xs md:text-sm text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded transition-colors"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    No notifications yet
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SocialPage;
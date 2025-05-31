import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { UserPlus, UserCheck, Users, Bookmark, Code, Clock, Award, BarChart2 } from 'lucide-react';

const ProfilePage = () => {
  const { username } = useParams();
  const { 
    user: currentUser,
    viewedProfile: profileUser, 
    getUserByUsername, 
    followUser, 
    unfollowUser,
    isLoading 
  } = useUserStore();
  const [activeTab, setActiveTab] = useState('activity');
  const isCurrentUser = profileUser?.id === currentUser?.id;

  useEffect(() => {
    if (username) {
      getUserByUsername(username);
    }
  }, [username, getUserByUsername]);

  const handleFollow = async () => {
      await followUser(profileUser.id);
  };

  const handleUnfollow = async () => {
      await unfollowUser(profileUser.id);
  };

  if (isLoading || !profileUser) {
    return (
      <div className="min-w-screen min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Profile Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={profileUser.image || 'https://placehold.co/150x150?text=User'}
                alt={profileUser.username}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-purple-500/50 object-cover"
              />
              {profileUser.role === 'ADMIN' && (
                <span className="absolute -bottom-1 -right-1 bg-purple-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  ADMIN
                </span>
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">{profileUser.name}</h1>
                  <p className="text-gray-400">@{profileUser.username}</p>
                </div>
                
                {!isCurrentUser && (
                  <div className="flex gap-3">
                    {profileUser.isFollowing ? (
                      <button
                        onClick={handleUnfollow}
                        className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        className="flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {profileUser.bio && (
                <p className="text-gray-300 text-sm md:text-base max-w-2xl">{profileUser.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center text-gray-300">
                  <Users className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span className="font-medium text-white">{profileUser.followerCount}</span>
                  <span className="ml-1 text-gray-400">Followers</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <UserCheck className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span className="font-medium text-white">{profileUser.followingCount}</span>
                  <span className="ml-1 text-gray-400">Following</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Award className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span className="font-medium text-white">1.2k</span>
                  <span className="ml-1 text-gray-400">Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-6 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('activity')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'activity' 
                  ? 'border-purple-500 text-purple-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Activity
            </button>
            
            <button
              onClick={() => setActiveTab('problems')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'problems' 
                  ? 'border-purple-500 text-purple-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Code className="w-4 h-4 mr-2" />
              Problems
            </button>
            
            <button
              onClick={() => setActiveTab('solutions')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'solutions' 
                  ? 'border-purple-500 text-purple-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Solutions
            </button>
            
            <button
              onClick={() => setActiveTab('stats')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'stats' 
                  ? 'border-purple-500 text-purple-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Stats
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'activity' && (
            <div className="bg-gray-800/30 rounded-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Recent Activity</h3>
              <div className="text-gray-400 text-center py-8">
                {isCurrentUser ? (
                  <p>Your activity will appear here</p>
                ) : (
                  <p>{profileUser.username}'s activity will appear here</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'problems' && (
            <div className="bg-gray-800/30 rounded-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Solved Problems</h3>
              <div className="text-gray-400 text-center py-8">
                {isCurrentUser ? (
                  <p>Problems you've solved will appear here</p>
                ) : (
                  <p>Problems solved by {profileUser.username} will appear here</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'solutions' && (
            <div className="bg-gray-800/30 rounded-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Solutions</h3>
              <div className="text-gray-400 text-center py-8">
                {isCurrentUser ? (
                  <p>Your solutions will appear here</p>
                ) : (
                  <p>{profileUser.username}'s solutions will appear here</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="bg-gray-800/30 rounded-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Statistics</h3>
              <div className="text-gray-400 text-center py-8">
                {isCurrentUser ? (
                  <p>Your statistics will appear here</p>
                ) : (
                  <p>{profileUser.username}'s statistics will appear here</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
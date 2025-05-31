import { useState, useEffect } from 'react';
import { X, Search, User, Send } from 'lucide-react';
import useInvitationStore from '../store/useInvitationStore';
import {useUserStore} from '../store/useUserStore';

const InviteModal = ({ problemId, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { followers, fetchFollowers } = useUserStore();
  const { sendInvitation, isLoading, error, success } = useInvitationStore();

  useEffect(() => {
    if (isOpen) {
      fetchFollowers();
    }
  }, [isOpen, fetchFollowers]);

  const filteredFollowers = followers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await sendInvitation(problemId, selectedUser.id, message);
      setMessage('');
      setSelectedUser(null);
      setTimeout(onClose, 1000); 
    } catch (err) {
      console.error('Failed to send invitation:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center bg-opacity-50 px-4 z-50">
      <div className="bg-gray-850 rounded-lg shadow-xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Invite to Collaborate</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {success && (
            <div className="mb-4 p-3 bg-green-900/20 rounded-lg border border-green-600/50 text-green-400">
              Invitation sent successfully!
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 rounded-lg border border-red-600/50 text-red-400">
              {error}
            </div>
          )}

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search followers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mb-4 max-h-60 overflow-y-auto">
            {filteredFollowers.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No followers found</p>
            ) : (
              <ul className="space-y-2">
                {filteredFollowers.map((user) => (
                  <li
                    key={user.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer ${
                      selectedUser?.id === user.id
                        ? 'bg-indigo-900/30 border border-indigo-700'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <img
                      src={user.image || 'https://placehold.co/600x400'}
                      alt={user.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-gray-400 text-sm">{user.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedUser && (
            <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={selectedUser.image || 'https://placehold.co/600x400'}
                    alt={selectedUser.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-white">{selectedUser.username}</span>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message (optional)
              </label>
              <textarea
                id="message"
                rows="3"
                className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Hey, I'd love your help solving this problem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={!selectedUser || isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 rounded-lg font-medium ${
                !selectedUser || isLoading
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
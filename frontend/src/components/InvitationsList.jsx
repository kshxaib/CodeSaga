import { useState, useEffect } from 'react';
import { Clock, Check, X, Loader } from 'lucide-react';
import useInvitationStore from '../store/useInvitationStore';

const InvitationsList = () => {
  const { invitations, fetchInvitations, updateInvitationStatus, isLoading } = useInvitationStore();
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const filteredInvitations = invitations.filter((inv) => {
    if (activeTab === 'pending') return inv.status === 'PENDING';
    if (activeTab === 'accepted') return inv.status === 'ACCEPTED';
    if (activeTab === 'declined') return inv.status === 'DECLINED';
    return true;
  });

  const handleRespond = async (invitationId, status) => {
    await updateInvitationStatus(invitationId, status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-400';
      case 'ACCEPTED': return 'bg-green-500/10 text-green-400';
      case 'DECLINED': return 'bg-red-500/10 text-red-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="bg-gray-850 rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'pending' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'accepted' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'declined' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('declined')}
        >
          Declined
        </button>
      </div>

      <div className="divide-y divide-gray-700 max-h-[calc(100vh-200px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="animate-spin text-indigo-500" />
          </div>
        ) : filteredInvitations.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No {activeTab} invitations found
          </div>
        ) : (
          filteredInvitations.map((invitation) => (
            <div key={invitation.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <img
                    src={invitation.sender.image || 'https://placehold.co/600x400'}
                    alt={invitation.sender.username}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="text-white font-medium">{invitation.sender.username}</h4>
                    <p className="text-sm text-gray-400">{invitation.problem.title}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invitation.status)}`}>
                  {invitation.status}
                </span>
              </div>

              {invitation.message && (
                <div className="mt-2 p-3 bg-gray-800 rounded-lg text-gray-300">
                  {invitation.message}
                </div>
              )}

              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(invitation.createdAt).toLocaleString()}
                </div>

                {invitation.status === 'PENDING' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRespond(invitation.id, 'ACCEPTED')}
                      className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(invitation.id, 'DECLINED')}
                      className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InvitationsList;
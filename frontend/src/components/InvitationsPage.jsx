import { useEffect } from 'react';
import { Mail, Clock, Check, X } from 'lucide-react';
import InvitationsList from '../components/InvitationsList';
import useInvitationStore from "../store/useInvitationStore"
const InvitationsPage = () => {
  const { fetchInvitations } = useInvitationStore();

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Mail className="w-8 h-8 mr-3 text-indigo-400" />
          <h1 className="text-2xl font-bold">Your Invitations</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InvitationsList />
          </div>
          
          <div className="bg-gray-850 rounded-lg border border-gray-700 p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-400" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">You accepted an invitation</span>
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">You declined an invitation</span>
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationsPage;
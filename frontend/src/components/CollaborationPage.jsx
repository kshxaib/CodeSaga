import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Code, Users, MessageSquare, Video, Mic, Loader } from 'lucide-react';
import useCollaborationStore from '../store/useCollaborationStore';

const CollaborationPage = () => {
  const { collaborationId } = useParams();
  const [activeTab, setActiveTab] = useState('code');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const { collaboration, fetchCollaboration, updateCode } = useCollaborationStore();

  useEffect(() => {
    if (collaborationId) {
      fetchCollaboration(collaborationId);
    }
  }, [collaborationId, fetchCollaboration]);

  useEffect(() => {
    if (collaboration) {
      setCode(collaboration.currentCode);
      setLanguage(collaboration.language);
    }
  }, [collaboration]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    updateCode(collaborationId, newCode, language);
  };

  if (!collaboration) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Collaborating on: {collaboration.problem.title}
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {collaboration.participants.length} participant(s)
            </span>
          </div>
        </div>

        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`flex items-center px-4 py-2 ${activeTab === 'code' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('code')}
          >
            <Code className="w-5 h-5 mr-2" />
            Code
          </button>
          <button
            className={`flex items-center px-4 py-2 ${activeTab === 'participants' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('participants')}
          >
            <Users className="w-5 h-5 mr-2" />
            Participants
          </button>
          <button
            className={`flex items-center px-4 py-2 ${activeTab === 'chat' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Chat
          </button>
        </div>

        {activeTab === 'code' && (
          <div className="bg-gray-850 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="p-4">
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-96 bg-gray-800 text-white font-mono p-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                spellCheck="false"
              />
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="bg-gray-850 rounded-lg border border-gray-700 overflow-hidden">
            <ul className="divide-y divide-gray-700">
              {collaboration.participants.map((participant) => (
                <li key={participant.id} className="p-4 flex items-center">
                  <img
                    src={participant.image || 'https://placehold.co/600x400'}
                    alt={participant.username}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="text-white font-medium">{participant.username}</h3>
                    <p className="text-sm text-gray-400">{participant.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-gray-850 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold">Collaboration Chat</h3>
            </div>
            <div className="p-4 h-96 overflow-y-auto">
              <div className="text-center text-gray-500 py-8">
                Chat feature coming soon!
              </div>
            </div>
            <div className="p-4 border-t border-gray-700">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationPage;
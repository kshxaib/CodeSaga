import { create } from 'zustand';
import io from 'socket.io-client';
import { axiosInstance } from '../libs/axios';

const socket = io(import.meta.env.VITE_API_URL);

const useCollaborationStore = create((set) => ({
  collaboration: null,
  isLoading: false,
  error: null,
  activeParticipants: [],

   fetchCollaboration: async (collaborationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/collaboration/${collaborationId}`);
      set({ collaboration: response.data.data });
      
      // Join collaboration room
      socket.emit('joinCollaboration', { 
        collaborationId,
        userId: response.data.data.participants[0].id // Or get from auth
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateCode: async (collaborationId, code, language) => {
    try {
      await axiosInstance.put(`/collaboration/${collaborationId}`, { code, language });
      socket.emit('updateCollaborationCode', { collaborationId, code, language });
    } catch (error) {
      console.error('Failed to update code:', error);
    }
  },
}));


socket.on('codeUpdate', ({ code, language }) => {
  useCollaborationStore.setState((state) => ({
    collaboration: {
      ...state.collaboration,
      currentCode: code,
      language,
    },
  }));
});

socket.on('activeParticipants', ({ participants }) => {
  useCollaborationStore.setState({ activeParticipants: participants });
});

socket.on('participantJoined', (participant) => {
  useCollaborationStore.setState((state) => ({
    activeParticipants: [...state.activeParticipants, participant],
  }));
});

socket.on('participantLeft', (participant) => {
  useCollaborationStore.setState((state) => ({
    activeParticipants: state.activeParticipants.filter(p => p.userId !== participant.userId),
  }));
});

export default useCollaborationStore;
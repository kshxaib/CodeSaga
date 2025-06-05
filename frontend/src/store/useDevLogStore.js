import { create } from 'zustand'
import { axiosInstance } from "../libs/axios";

export const useDevLogStore = create((set, get) => ({
  devLogs: [],
  myDevLogs: [],
  loading: false,
  isAdding: false,
  error: null,
  suggestions: [],
  isGenerating: false,

  fetchDevLogs: async (filter = 'newest') => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/dev-log?filter=${filter}`);
      set({ 
        devLogs: response.data.devLogs || [],
        loading: false 
      });
    } catch (error) {
      set({ 
        loading: false,
        error: error.response?.data?.message || "Failed to fetch dev logs"
      });
    }
  },

  fetchMyDevLogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/dev-log/my');
      set({ 
        myDevLogs: response.data.devLogs || [],
        loading: false 
      });
    } catch (error) {
      set({ 
        loading: false,
        error: error.response?.data?.message || "Failed to fetch your dev logs"
      });
    }
  },

  addDevLog: async (data) => {
    set({ isAdding: true, error: null });
    try {
      const response = await axiosInstance.post('/dev-log', data);
      set((state) => ({ 
        myDevLogs: [response.data.devLog, ...state.myDevLogs],
        devLogs: [response.data.devLog, ...state.devLogs],
        isAdding: false 
      }));
      return response.data.devLog;
    } catch (error) {
      set({ 
        isAdding: false,
        error: error.response?.data?.message || "Failed to create dev log"
      });
      throw error;
    }
  },

  reactToDevLog: async (devLogId, type) => {
    try {
      await axiosInstance.post(`/dev-log/${devLogId}/react`, { type });
      
      set((state) => ({
        devLogs: state.devLogs.map(log => {
          if (log.id === devLogId) {
            const hasReacted = log.reactions?.some(r => 
              r.userId === get().currentUser?.id && r.type === type
            );
            
            const updatedReactions = hasReacted
              ? log.reactions.filter(r => 
                  !(r.userId === get().currentUser?.id && r.type === type)
                )
              : [...(log.reactions || []), { 
                  userId: get().currentUser?.id, 
                  type 
                }];
            
            return {
              ...log,
              reactions: updatedReactions
            };
          }
          return log;
        })
      }));
      
      set((state) => ({
        myDevLogs: state.myDevLogs.map(log => {
          if (log.id === devLogId) {
            const hasReacted = log.reactions?.some(r => 
              r.userId === get().currentUser?.id && r.type === type
            );
            
            const updatedReactions = hasReacted
              ? log.reactions.filter(r => 
                  !(r.userId === get().currentUser?.id && r.type === type)
                )
              : [...(log.reactions || []), { 
                  userId: get().currentUser?.id, 
                  type 
                }];
            
            return {
              ...log,
              reactions: updatedReactions
            };
          }
          return log;
        })
      }));
      
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to react to dev log"
      });
      throw error;
    }
  },

  generateDescription: async (title, tags) => {
    set({ isGenerating: true, error: null });
    try {
      const response = await axiosInstance.post('/dev-log/generate-description', {
        title,
        tags
      });
      set({ 
        suggestions: response.data.suggestions || [],
        isGenerating: false 
      });
      return response.data.suggestions;
    } catch (error) {
      set({ 
        isGenerating: false,
        error: error.response?.data?.message || "Failed to generate suggestions"
      });
      throw error;
    }
  },

  clearSuggestions: () => set({ suggestions: [] })
}));


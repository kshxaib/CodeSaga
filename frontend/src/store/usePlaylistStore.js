import {create} from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";


export const usePlaylistStore = create((set, get) => ({
    playlists: [],
    currentPlaylist: null,
    isLoading: false,
    error: null,


    createPlaylist: async (playlistData) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post('/playlist/create-playlist', playlistData);
            set((state) => ({
                playlists: [...state.playlists, res.data.playlist]
            }));
            showToast(res)
            return res.data.playlist;
        } catch (error) {
            console.error(error);
            showToast(error)
        } finally {
            set({ isLoading: false });
        }
    },

    getAllPlaylists: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get('/playlist');
            set({ playlists: res.data.playlists});
        } catch (error) {
            console.error(error);   
            showToast(error)
        } finally {
            set({ isLoading: false });
        }
    },

    getPlaylistDetails: async (playlistId) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/playlist/${playlistId}`);
            set({ currentPlaylist: res.data.playlist });
        } catch (error) {
            console.error(error);
            showToast(error)
        } finally {
            set({ isLoading: false });
        }
    },

    addProblemToPlaylist: async (playlistId, problemIds) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post(`/playlist/${playlistId}/add-problem`, { problemIds });
            showToast(res);

            if(get().currentPlaylist?.id === playlistId){
                await get().getPlaylistDetails(playlistId);
            }
        } catch (error) {
            console.error(error);
            showToast(error);
        } finally {
            set({ isLoading: false });
        }
    },

    removeProblemFromPlaylist: async (playlistId, problemIds) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.delete(`/playlist/${playlistId}/remove-problem`, {  problemIds  });
            showToast(res);

            if(get().currentPlaylist?.id === playlistId){
                await get().getPlaylistDetails(playlistId);
            }
        } catch (error) {
            console.error(error);   
            showToast(error);
        } finally {
            set({ isLoading: false });
        }
    },

    deletePlaylist: async (playlistId) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.delete(`/playlist/${playlistId}`);
            showToast(res);

            set((state) => ({
                playlists: state.playlists.filter(playlist => playlist.id !== playlistId)
            }));
        } catch (error) {
            console.error(error);
            showToast(error);
        } finally {
            set({ isLoading: false });
        }
    }
}))
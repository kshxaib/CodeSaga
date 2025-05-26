import {create} from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";


export const usePlaylistStore = create((set, get) => ({
    playlists: [],
    currentPlaylist: null,
    isLoading: false,
    error: null,
    isPurchasing: false,
    purchasedPlaylists: [],
    unpurchasedPlaylists: [],
    isStoreLoading: false,


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

    getAllPlaylistsOfUser: async () => {
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

    getPlaylistDetails: async (playlistId) => {   //not used abhi tk
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

   removeProblemFromPlaylist: async (playlistId, problemId) => {
    try {
        set({ isLoading: true });
        const res = await axiosInstance.delete(
            `/playlist/${playlistId}/remove-problem`,
            { data: { problemIds: [problemId] } }  
        );
        showToast(res);

        if (get().currentPlaylist?.id === playlistId) {
            await get().getPlaylistDetails(playlistId);
        }
        
        await get().getAllPlaylistsOfUser();
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
    },

    getUnpurchasedPaidPlaylists: async () => {
        try {
            set({ isStoreLoading: true });
            const res = await axiosInstance.get('/playlist/unpurchased-paid-playlists');
            set({ unpurchasedPlaylists: res.data.playlists });
        } catch (error) {
            console.error(error);
            showToast(error);
        } finally {
            set({ isStoreLoading: false });
        }
    },

    purchasePlaylist: async (playlistId) => {
        try {
            set({ isPurchasing: true });
            const res = await axiosInstance.post(`/playlist/purchase/${playlistId}`);
            set((state) => ({
                purchasedPlaylists: [...state.purchasedPlaylists, res.data.playlist],
                unpurchasedPlaylists: state.unpurchasedPlaylists.filter(p => p.id !== playlistId)
            }));
        } catch (error) {
            console.error(error);
            showToast(error);
        } finally {
            set({ isPurchasing: false });
        }
    }
}))
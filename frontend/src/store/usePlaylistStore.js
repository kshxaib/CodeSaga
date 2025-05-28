import {create} from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";
import { toast } from "sonner";



export const usePlaylistStore = create((set, get) => ({
    playlists: [],
    currentPlaylist: null,
    isLoading: false,
    error: null,
    isPurchasing: false,
    purchasedPlaylists: [],
    unpurchasedPlaylists: [],
    isUnpurchasedPlaylistsLoading: false,


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
        console.log("request sended");
        try {
            set({ isUnpurchasedPlaylistsLoading: true });
            const res = await axiosInstance.get('/playlist/unpurchased-paid-playlists');
            console.log(res.data);
            set({ unpurchasedPlaylists: res.data.playlists });
        } catch (error) {
            console.error(error);
            showToast(error);
        } finally {
            set({ isUnpurchasedPlaylistsLoading: false });
        }
    },

      initiatePlaylistPurchase: async (playlistId) => {
    try {
      set({ isPurchasing: true });
      const res = await axiosInstance.post(`/playlist/purchase/initiate/${playlistId}`);
      return res.data;
    } catch (error) {
      console.error("Initiate purchase error:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
      throw error;
    } finally {
      set({ isPurchasing: false });
    }
  },


  verifyPlaylistPurchase: async (paymentData) => {
    try {
      set({ isPurchasing: true });
      const res = await axiosInstance.post('/playlist/purchase/verify', paymentData);
      return res.data;
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.response?.data?.message || "Payment verification failed");
      throw error;
    } finally {
      set({ isPurchasing: false });
    }
  },

  getPurchaseHistory: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get('/playlist/purchase/history');
            
            const userRole = get().authUser?.role;
            const userId = get().authUser?.id;
            
            let purchases = res.data.purchases;
            
            if (userRole !== 'ADMIN') {
                purchases = purchases.filter(purchase => purchase.userId === userId);
            }
            
            set({ 
                purchasedPlaylists: purchases,
                allPlaylists: res.data.playlists || []
            });
            
            return purchases;
        } catch (error) {
            console.error("Error fetching purchase history:", error);
            toast.error(error.response?.data?.message || "Failed to fetch purchase history");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}))